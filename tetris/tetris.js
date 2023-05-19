// Esta línea obtiene el elemento del DOM con el ID "tetris" y lo asigna a la variable canvas. Se utiliza para acceder al elemento del lienzo en el HTML.

const canvas = document.getElementById('tetris');

// obtiene el contexto de dibujo en 2D del lienzo. Proporciona métodos y propiedades para dibujar en el lienzo, como fillRect, strokeRect, etc

const context = canvas.getContext('2d');

// se establece la escala del contexto de dibujo en 2D. En este caso, se escala en un factor de 20 tanto en el eje X como en el eje Y. Esto se hace para que los elementos dibujados en el lienzo tengan un tamaño adecuad

context.scale(20, 20);

// ? barrido de arena (se elimina fila)
// ? detecta si se ha completado alguna fila. Si se completa una fila, se elimina y se desplaza el resto de las filas hacia abajo. Además, incrementa la puntuación del jugador

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

// ? collide - chocar
// ? verifica si hay alguna colisión entre la pieza actual (player) y la arena de juego. Comprueba si las celdas ocupadas por la pieza chocan con celdas ocupadas en la arena. Retorna true si hay una colisión, de lo contrario, retorna false.

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// ? Esta función crea una matriz bidimensional de tamaño wxh y la llena con ceros. La matriz se utiliza para representar tanto la arena del juego como las piezas.

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    console.log("matrix",matrix);
    return matrix;
}

// ? create piece - CREAR PIEZA
// ? Esta función crea una matriz que representa una pieza en base a su tipo. Cada tipo de pieza tiene una estructura específica de ceros y valores no nulos que definen su forma.

function createPiece(type)
{
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 3],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 5],
            [5, 0, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [6, 6, 0, 0],
            [0, 6, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0, 0],
            [0, 7, 0, 0],
            [0, 7, 7, 0],
            [0, 7, 0, 0],
        ];
    }
}

// ? dibuja una matriz en el lienzo. Recorre la matriz y, para cada celda no nula, dibuja un rectángulo en la posición correspondiente en el lienzo, utilizando el color definido en el array colors.

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];

                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
                context.strokeStyle = "black";
                context.lineWidth   = 0.1;
                context.strokeRect(x + offset.x,y + offset.y, 1,1);
            }
        });
    });
}


// ? dibuja el estado actual del juego en el lienzo. Limpia el lienzo, dibuja la arena y la pieza actual llamando a la función drawMatrix(). También establece algunos estilos de dibujo, como el color de fondo y el grosor de las líneas

function draw() {
    //context.globalCompositeOperation = 'hard-light';
    context.fillStyle = 'rgba(20,20,20,.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

// ? fusiona la matriz que representa la pieza actual (player.matrix) con la matriz que representa la arena de juego (arena). Copia los valores no nulos de la pieza en las celdas correspondientes de la arena.

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// ? rota una matriz 2D en el sentido de las agujas del reloj o en sentido contrario, dependiendo del valor de dir. Utiliza el algoritmo de rotación de matriz para intercambiar los elementos de la matriz según la diagonal

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// ?  mueve la pieza actual una posición hacia abajo en la arena. Si la pieza colisiona con la arena, se fusiona con ella, se reinicia la pieza y se realiza una comprobación de eliminación de filas completas en la arena.

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

// ?  mueve la pieza actual horizontalmente en la arena, según el valor de offset. Primero, actualiza la posición horizontal (pos.x) de la pieza y luego verifica si hay colisión con la arena. Si hay una colisión, se revierte el movimiento.

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

// ? reinicia la pieza actual y la posiciona en la parte superior central de la arena. Si hay colisión inmediata al reiniciar la pieza, se vacía la arena y se restablece la puntuación del jugador.

function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

// ? rotar la pieza actual en la dirección especificada por dir. Utiliza la función rotate() para cambiar la orientación de la matriz de la pieza. Si la rotación resulta en una colisión con la arena, se realiza un ajuste para evitar la colisión

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0; //  registro del tiempo transcurrido desde la última caída de la pieza.
let dropInterval = 1000; // intervalo de tiempo entre las caídas automáticas de la pieza en milisegundos. Inicialmente se establece en 1000 ms (1 segundo).
let incSpeed = 0;  // controla el incremento de velocidad de la caída de la pieza basado en la puntuación del jugador.

let lastTime = 0; // almacena el tiempo del último fotograma de la animación del juego


// ! bucle principal del juego
// ? Actualiza el estado del juego, como la posición de la pieza, el tiempo transcurrido, la animación y el dibujo en el lienzo
// ? Utiliza la función requestAnimationFrame() para llamar recursivamente a la función update() y lograr una animación fluida.
function update(time = 0) {
    const deltaTime = time - lastTime;
    if((player.score*2)<800) {
        incSpeed = player.score;
    }
    else{
        incSpeed = 800;
    }
    dropCounter += deltaTime;
    if ((dropCounter+incSpeed) > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

// ? actualiza el marcador de puntuación en el HTML con la puntuación actual del jugador.

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

// * EVENT
// ? agrega un evento de escucha al documento para detectar las pulsaciones de teclas. Según la tecla presionada, se invocan las funciones correspondientes para mover la pieza hacia la izquierda, hacia la derecha, hacia abajo o para rotarla.

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 32) {
        playerRotate(-1);
    } 
});

// Este array define los colores utilizados para dibujar las diferentes piezas del juego. Cada color se asocia a un valor no nulo en la matriz que representa una pieza

const colors = [
    null,
    '#FF4747',
    '#FF47DE',
    '#DEB800',
    '#0047DE',
    '#FFB847',
    '#47DEDE',
    '#47B800',
];

// Esta variable crea la matriz de la arena del juego con un tamaño de 12 columnas y 20 filas. La matriz se inicializa con ceros

const arena = createMatrix(12, 20);

// define el objeto player que contiene información sobre la pieza actual en el juego, como su posición, matriz y puntuación.

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

// 

playerReset(); //inicializar la pieza del jugador y establecer su posición inicial.
updateScore(); //actualizar el marcador de puntuación en el HTML al inicio del juego.
update(); // inicia el bucle principal del juego llamando a la función update() sin ningún argumento, lo que comienza la animación del juego.