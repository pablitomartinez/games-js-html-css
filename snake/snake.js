class Game {
    constructor() {
        document.addEventListener("keydown", this.keyEvents.bind(this)); // Activar cuando se presiona una tecla
        this.a_dead = new Audio("https://www.dropbox.com/s/r7o9las1ki6tr0u/fail.wav?dl=1");
        this.a_eat = new Audio("https://www.dropbox.com/s/qukhjmxog6h3we8/crunch.wav?dl=1");
        this.a_start = new Audio("https://www.dropbox.com/s/xff36yvnh2zsxzh/start.wav?dl=1");
    }

    //la función gameWindow() se utiliza para establecer el tamaño de la ventana del juego con una anchura y altura predeterminadas. Luego, se utiliza la función createCanvas() de p5.js para crear un lienzo con las dimensiones establecidas y se inserta como hijo del elemento con el id "gameBox" en el HTML. 
    gameWindow() {
        this.winWidth = 400;
        this.winHeight = 400;
        createCanvas(this.winWidth, this.winHeight).parent("gameBox");
    }
    //se encarga de dibujar los elementos visuales en la pantalla del juego, como el fondo, el borde, la serpiente, la manzana, el marcador de puntuación y la mejor puntuación.
    // (Dibujar en la pantalla)
    draw() {
        background("rgb(73, 95, 105)"); // Color de fondo de la pantalla del juego
        stroke("rgba(255, 255, 255,.5)") // Color del borde de la pantalla del juego
        // (puntos en forma de columna)

        this.snake(); // Dibujar la serpiente
        this.apple(); // Dibujar la manzana
        this.scoreBoard(); // Tablero de puntuación
        this.bestScore(); // Mejor puntuación
    }

    // Actualiza el estado del juego y dibuja en la pantalla
    update() {
        this.frame = false;
        this.draw(); // ekrana çiz (Dibujar en la pantalla)
    }

    // Inicia el juego y establece las configuraciones iniciales
    //la función start() se encarga de establecer todas las configuraciones iniciales del juego, como la posición de la serpiente, la posición de la manzana, el tamaño de la serpiente, la velocidad, el tamaño de la cuadrícula y el puntaje
    start() {
    this.positionX = 15; // Posición inicial X de la serpiente
    this.positionY = 10; // Posición inicial Y de la serpiente
    this.appleX = this.appleY = 10; // Posición inicial de la manzana
    this.trail = []; // Array para almacenar las coordenadas de la serpiente
    this.tailSize = 5; // Tamaño inicial de la serpiente
    this.speedX = this.speedY = 0; // Velocidad inicial de la serpiente
    this.gridSize = this.tileCount = 20; // Número de cuadrículas en la pantalla
    this.fps = 1000/18; // Fotogramas por segundo
    this.timer = setInterval(this.update.bind(this),this.fps);

    this.score = 0;
    }   
    
    // Reinicia el juego después de la muerte del jugador
    reset() {
        clearInterval(this.timer); // Detiene el temporizador
        this.a_dead.play(); // Reproduce el sonido de muerte
        this.start(); // Reinicia el juego desde el principio
    }

    // Controla los eventos del teclado para el movimiento de la serpiente
    
    keyEvents(e) {
        // Mover hacia la izquierda
        if (e.keyCode === 37 && this.speedX !== 1) {
            this.a_start.play(); // Reproduce el sonido de inicio
            this.speedX = -1; // Establece la velocidad en el eje X a -1 para moverse hacia la izquierda
            this.speedY = 0; // Establece la velocidad en el eje Y a 0 para mantenerse en la misma dirección vertical
            this.frame = true; // Establece el indicador de cambio de fotograma a verdadero
        }
        // Mover hacia la derecha
        if (e.keyCode === 39 && this.speedX !== -1) {
            this.a_start.play(); // Reproduce el sonido de inicio
            this.speedX = 1; // Establece la velocidad en el eje X a 1 para moverse hacia la derecha
            this.speedY = 0; // Establece la velocidad en el eje Y a 0 para mantenerse en la misma dirección vertical
            this.frame = true; // Establece el indicador de cambio de fotograma a verdadero
        }
        // Mover hacia abajo
        if (e.keyCode === 40 && this.speedY !== -1) {
            this.a_start.play(); // Reproduce el sonido de inicio
            this.speedX = 0; // Establece la velocidad en el eje X a 0 para mantenerse en la misma dirección horizontal
            this.speedY = 1; // Establece la velocidad en el eje Y a 1 para moverse hacia abajo
            this.frame = true; // Establece el indicador de cambio de fotograma a verdadero
        }
        // Mover hacia arriba
        if (e.keyCode === 38 && this.speedY !== 1) {
            this.a_start.play(); // Reproduce el sonido de inicio
            this.speedX = 0; // Establece la velocidad en el eje X a 0 para mantenerse en la misma dirección horizontal
            this.speedY = -1; // Establece la velocidad en el eje Y a -1 para moverse hacia arriba
            this.frame = true; // Establece el indicador de cambio de fotograma a verdadero
        }
    }

    // Dibuja la serpiente en el juego
    snake() {
        fill("rgba(255,255,255,.75)"); // Establece el color de relleno para la serpiente
        this.trail.forEach(a => {
            rect(a.positionX * 20, a.positionY * 20, this.gridSize - 5, this.gridSize - 5, 20, 20); // Dibuja cada segmento de la serpiente como un rectángulo redondeado
        });
        this.positionX += this.speedX; // Actualiza la posición X de la serpiente según la velocidad
        this.positionY += this.speedY; // Actualiza la posición Y de la serpiente según la velocidad

        // Limita el movimiento de la serpiente dentro de los límites del juego
        if (this.positionX < 0) {
            this.positionX = this.tileCount - 1; // Si la serpiente se sale del límite izquierdo, la mueve al límite derecho
        } else if (this.positionY < 0) {
            this.positionY = this.tileCount - 1; // Si la serpiente se sale del límite superior, la mueve al límite inferior
        } else if (this.positionX > this.tileCount - 1) {
            this.positionX = 0; // Si la serpiente se sale del límite derecho, la mueve al límite izquierdo
        } else if (this.positionY > this.tileCount - 1) {
            this.positionY = 0; // Si la serpiente se sale del límite inferior, la mueve al límite superior
        }
        
        // Comprueba si la serpiente se superpone a sí misma
        this.trail.forEach(t => {
            if (this.positionX === t.positionX && this.positionY === t.positionY) {
            this.reset(); // Si la cabeza de la serpiente se superpone con alguna parte del cuerpo, se reinicia el juego
            }
        })

         // snake position
         //esta línea registra la posición actual de la serpiente en el array trail, lo que permite mantener un seguimiento de las posiciones anteriores de la serpiente y utilizarlas posteriormente, por ejemplo, para dibujar el rastro de la serpiente o verificar colisiones con su propio cuerpo
         this.trail.push({positionX: this.positionX,positionY: this.positionY})


        // Limita el tamaño de la serpiente
        while (this.trail.length > this.tailSize) {
            this.trail.shift(); // Elimina los segmentos más antiguos de la serpiente hasta que su tamaño sea igual al tamaño deseado (this.tailSize)
        }

        while (this.trail.length > this.tailSize) {
            this.trail.shift(); // Se asegura de que no haya segmentos adicionales en la serpiente si por alguna razón el tamaño excede this.tailSize
        }
        //La serpiente se representa como un conjunto de segmentos almacenados en el array this.trail. Si el número de segmentos en this.trail es mayor que el tamaño deseado this.tailSize, se eliminarán los segmentos más antiguos usando shift(), hasta que el tamaño de la serpiente sea igual a this.tailSize.

        //El segundo bucle while asegura que no haya segmentos adicionales en la serpiente si, por alguna razón, el tamaño de la serpiente excede this.tailSize.

    }
    
    apple() {
        // Dibuja la manzana en el juego
        fill("pink"); // Establece el color de relleno para la manzana
        rect(this.appleX * this.tileCount, this.appleY * this.tileCount, this.gridSize - 5, this.gridSize - 5, 5, 5); // Dibuja la manzana como un rectángulo redondeado
    
        // Comprueba si la cabeza de la serpiente alcanza la manzana
        if (this.appleX === this.positionX && this.appleY === this.positionY) {
            this.tailSize++; // Aumenta el tamaño de la serpiente
            this.score++; // Incrementa la puntuación
            this.appleX = Math.floor(Math.random() * this.tileCount); // Genera nuevas coordenadas X para la manzana de forma aleatoria
            this.appleY = Math.floor(Math.random() * this.tileCount); // Genera nuevas coordenadas Y para la manzana de forma aleatoria
    
            // Verifica si la nueva posición de la manzana coincide con alguna parte del cuerpo de la serpiente
            this.trail.forEach(t => {
                if (this.appleX === t.positionX && this.appleY === t.positionY) {
                    this.apple(); // Si la nueva posición de la manzana coincide con alguna parte del cuerpo de la serpiente, se vuelve a generar una nueva posición
                }
            });
    
            this.a_eat.play(); // Reproduce el sonido de comer la manzana
        }


        //Este código dibuja la manzana en el juego y verifica si la cabeza de la serpiente alcanza la posición de la manzana. Si es así, se incrementa el tamaño de la serpiente (this.tailSize), se incrementa la puntuación (this.score), se genera una nueva posición para la manzana de forma aleatoria y se verifica que la nueva posición no coincida con ninguna parte del cuerpo de la serpiente. Si la nueva posición coincide con alguna parte del cuerpo, se vuelve a generar una nueva posición. Finalmente, se reproduce el sonido de comer la manzana (this.a_eat.play()).
    }
    
    scoreBoard() {
        textSize(15); // Establece el tamaño de fuente para el texto
        noStroke(); // No se dibuja el borde del texto
        fill(26); // Establece el color de relleno del texto
        text("SCORE", 10, 20); // Dibuja el texto "SCORE" en la posición (10, 20)
        textSize(20); // Establece un tamaño de fuente mayor para la puntuación
        text(this.score, 32.5, 45); // Dibuja la puntuación actual en la posición (32.5, 45)
        // Esta función se encarga de mostrar la puntuación en el juego. Primero, se configuran las propiedades de fuente, como el tamaño de fuente, el color de relleno y la falta de borde (textSize(), noStroke(), fill()). Luego, se dibuja el texto "SCORE" en la posición (10, 20) usando la función text(). A continuación, se establece un tamaño de fuente mayor para la puntuación y se dibuja la puntuación actual (this.score) en la posición (32.5, 45).
    }
    
    bestScore() {
        textSize(15); // Establece el tamaño de fuente para el texto
        text("BEST", 340, 20); // Dibuja el texto "BEST" en la posición (340, 20)
    
        // Verifica si no hay un valor almacenado en el almacenamiento local para la mejor puntuación
        if (!localStorage.getItem("best")) {
            localStorage.setItem("best", 0); // Si no hay un valor almacenado, se establece el valor inicial de la mejor puntuación como 0 en el almacenamiento local
        }
    
        textSize(20); // Establece el tamaño de fuente para la mejor puntuación
        text(localStorage.getItem("best"), 357, 45); // Muestra el valor de la mejor puntuación almacenado en el almacenamiento local en la posición (357, 45)
    
        // Verifica si la puntuación actual supera la mejor puntuación almacenada
        if (this.score > localStorage.getItem("best")) {
            this.best = this.score; // Actualiza la mejor puntuación con la puntuación actual
            localStorage.setItem("best", this.best); // Actualiza el valor de la mejor puntuación en el almacenamiento local con la nueva mejor puntuación
        }
        /*
        Esta función muestra la mejor puntuación almacenada en el juego. Primero, se establece el tamaño de fuente para el texto "BEST" utilizando textSize(). Luego, se dibuja el texto "BEST" en la posición (340, 20) utilizando text(). A continuación, se verifica si no hay un valor almacenado en el almacenamiento local para la mejor puntuación mediante localStorage.getItem("best"). Si no hay un valor almacenado, se establece el valor inicial de la mejor puntuación como 0 utilizando localStorage.setItem("best", 0). Esto asegura que siempre haya un valor definido para la mejor puntuación en el almacenamiento local.

        Luego, se establece el tamaño de fuente para la mejor puntuación utilizando textSize(). Se muestra el valor de la mejor puntuación almacenado en el almacenamiento local en la posición (357, 45) mediante text(localStorage.getItem("best"), 357, 45).

        Finalmente, se verifica si la puntuación actual es mayor que la mejor puntuación almacenada mediante if (this.score > localStorage.getItem("best")). Si es así, se actualiza la variable this.best con la puntuación actual y se actualiza el valor de la mejor puntuación en el almacenamiento local utilizando localStorage.setItem("best", this.best).

        De esta manera, la función bestScore() se encarga de mostrar la mejor puntuación actualizada y almacenarla en el almacenamiento local si es superada por la puntuación actual del juego.
        */
    }
    
    
    
}
//Se crea una nueva instancia de la clase Game utilizando el operador new y se asigna a la variable game. Esto crea un nuevo objeto Game con todas las propiedades y métodos definidos en la clase.
const game = new Game();
//Se establece el evento window.onload, que se dispara cuando la ventana se ha cargado completamente. Esto asegura que el juego se inicie solo después de que todos los recursos de la ventana, como imágenes y estilos, se hayan cargado.
window.onload = () => game.start();


//Esta función se llama una vez al principio del programa y se utiliza para realizar la configuración inicial del lienzo del juego y otros componentes necesarios. En tu caso, la función setup() llama al método gameWindow() de la instancia de la clase Game (game.gameWindow()) para configurar el tamaño del lienzo del juego.
function setup(){
    game.gameWindow();
}

//Esta función se llama automáticamente en un bucle continuo después de que se haya llamado a la función setup(). Se utiliza para actualizar y dibujar los elementos del juego en cada fotograma. En tu caso, la función draw() llama al método update() de la instancia de la clase Game (game.update()) para actualizar y dibujar los elementos del juego en cada fotograma.

function draw(){
    game.update();
}