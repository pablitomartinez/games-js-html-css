//este bloque de código permite obtener el elemento <canvas> del documento HTML, obtener su contexto de renderizado 2D y establecer las dimensiones del lienzo. Estas dimensiones definirán el tamaño del área de dibujo donde se representará el juego de Pong.
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 500;

//levar la cuenta de los puntajes de los jugadores 1 y 2 respectivamente.
var score1 = 0;
var score2 = 0;

var keys = {}; //almacenar las teclas que se están presionando durante el juego.
//controlar el estado del juego. Los valores posibles son:
var gameState = 0; // 0: initial, 1: running, 2: idle, 3: win, 4:over
/*
    0: Estado inicial.
    1: Juego en ejecución.
    2: Inactivo.
    3: Victoria.
    4: Fin del juego.
*/

//? keydown - PULSAR TECLA 
//"event listener" al documento que escucha los eventos de teclado cuando se presionan las teclas. En este caso, se detecta el evento 'keydown' (tecla presionada) y se ejecuta la función anónima proporcionada.
document.addEventListener('keydown', function (e) {
    if(gameState == 0){
        if(32 == e.keyCode)
            gameState = 1;
    }
    
    if(gameState == 3 || gameState == 4){
        if(32 == e.keyCode){
            init();
            gameState = 1;
        }
    }
	
    keys[e.keyCode] = true;
    e.preventDefault();
});

//? keyup - SOLTAR TECLA
// "event listener" que escucha los eventos de teclado cuando se sueltan las teclas. En este caso, se detecta el evento 'keyup' (tecla liberada) y se ejecuta la función anónima proporcionada.

document.addEventListener('keyup', function (e) {
    delete keys[e.keyCode];
});

function input() {
    
    if (38 in keys) { //If the up arrow key is pressed
        if (player1.y - player1.gravity > 0) {
            player1.y -= player1.gravity;
        }
    } else if (40 in keys) { //If the down arrow key is pressed
        if (player1.y + player1.height + player2.gravity < canvas.height) {
            player1.y += player1.gravity;
        }
    }

}

//manejar la entrada del jugador controlado por teclado. Si la tecla de flecha hacia arriba (código 38) está presente en el objeto keys, se verifica si el jugador 1 puede moverse hacia arriba sin salir del límite superior del lienzo. De lo contrario, si la tecla de flecha hacia abajo (código 40) está presente en keys, se verifica si el jugador 1 puede moverse hacia abajo sin salir del límite inferior del lienzo. Estas acciones permiten al jugador controlar la posición del paddle en el juego de ping-pong

function input() {
    
    if (38 in keys) { //If the up arrow key is pressed
        if (player1.y - player1.gravity > 0) {
            player1.y -= player1.gravity;
        }
    } else if (40 in keys) { //If the down arrow key is pressed
        if (player1.y + player1.height + player2.gravity < canvas.height) {
            player1.y += player1.gravity;
        }
    }

}

// mover el jugador 2 de forma automática en respuesta al movimiento de la pelota. Si la posición de la pelota es más arriba que la posición del jugador 2, se verifica si el jugador 2 puede moverse hacia arriba sin salir del límite superior del lienzo. De lo contrario, si la posición de la pelota es más abajo que la posición del jugador 2, se verifica si el jugador 2 puede moverse hacia abajo sin salir del límite inferior del lienzo. Esto permite que el jugador 2 siga la posición de la pelota y se mueva automáticamente para tratar de interceptarla.

function movePlayer2(){
    
    if(theBall.y < player2.y){
        if (player2.y - player2.gravity > 0) {
            player2.y -= player2.gravity;
        }
    }
    else{
        if (player2.y + player2.height + player2.gravity < canvas.height) {
            player2.y += player2.gravity;
        }
    }
}

// constructor de objetos que representa una caja en el juego. Recibe un objeto options como parámetro, el cual puede contener las siguientes propiedades:

    // x: La posición horizontal de la caja.
    // y: La posición vertical de la caja.
    // width: El ancho de la caja.
    // height: La altura de la caja.
    // color: El color de la caja.
    // speed: La velocidad de la caja (opcional).
    // gravity: La gravedad de la caja (opcional).
function Box(options){ /*Constructor of Box object*/
    this.x = options.x || 10;
    this.y = options.y || 10;
    this.width = options.width || 40;
    this.height = options.height || 50;
    this.color = options.color || '#FFFFFF';
    this.speed = options.speed || 3;
    this.gravity = options.gravity || 3;

}

var player1 = new Box({ /*player paddle*/
    x: 20,
    y: canvas.height/2-40,
    width: 12,
    height: 80,
    color: '#F00',
    gravity: 4
});

var player2 = new Box({ /*player paddle*/
    x: canvas.width-20-12,
    y: canvas.height/2-40,
    width: 12,
    height: 80,
    color: '#0F0',
    gravity: 3
});

var midLine = new Box({ /*The net*/
    x: (canvas.width/2)-2.5,
    y: 20,
    width: 5,
    height: canvas.height-40,
    color: '#FFFFFF'
});

var theBall = new Box({
    x: (canvas.width / 2),
    y: (canvas.height / 2),
    width: 12,
    height: 12,
    color: '#f5ff00',
    speed: 2,
    gravity: 2
});


//reiniciar los valores de la pelota (theBall) 
function createNewBall(){
    
    theBall.x = (canvas.width / 2 - 6);
    theBall.y = (canvas.height / 2);
    theBall.width = 12;
    theBall.height = 12;
    theBall.color = '#f5ff00';
    
    var s = Math.floor((Math.random() * 2) ) * 2;
    var g = Math.floor((Math.random() * 2) ) * 2;
    s = (s == 0 ? -3 : s);
    g = (g == 0 ? -3 : g);
    theBall.speed = s;
    theBall.gravity = g;
    
}

// maneja la lógica de rebote de la pelota. Comprueba las colisiones de la pelota con los límites superior e inferior del canvas y, si ocurren, invierte el valor de la propiedad gravity para que la pelota rebote en la dirección opuesta. Si la pelota choca con las paletas del jugador 1 o jugador 2, invierte la dirección de la pelota cambiando el signo de la propiedad speed. Si la pelota atraviesa la paleta del jugador 1 sin ser golpeada, se incrementa el puntaje del jugador 2 y se cambia el estado del juego a 2 (idle). Si la pelota atraviesa la paleta del jugador 2 sin ser golpeada, se incrementa el puntaje del jugador 1 y se cambia el estado del juego a 2. Si uno de los jugadores alcanza una puntuación de 5, se cambia el estado del juego a 3 (win) o 4 (over) según corresponda. Finalmente, se llama a la función draw para actualizar la visualización del juego.

function ballBounce() {
    
	// platform collision
	if (((theBall.y+theBall.gravity) <= 0) || ((theBall.y+theBall.gravity+theBall.height) >= canvas.height)){
        theBall.gravity = (theBall.gravity) * (-1); /*If it does, change the gravity value to move in the opposite direction*/
        theBall.y += theBall.gravity; // Move theBall
        theBall.x += theBall.speed;
    } else { // If the ball doesn’t hit the top or bottom, then move theBall as normal
        theBall.x += theBall.speed;
        theBall.y += theBall.gravity
    }

    	
	// player1 collision
    
    if (theBall.x <= player1.x + player1.width && theBall.x + theBall.width >= player1.x ) {
        if (theBall.y + theBall.height >= player1.y  && theBall.y <= player1.y + player1.height) {
            theBall.x = (player1.x + theBall.width);
            theBall.speed *= (-1);
        }
        
    }
    
    if (theBall.x + theBall.width >= player2.x && theBall.x + theBall.width <= player2.x + player2.width) {
        if (theBall.y + theBall.height >= player2.y  && theBall.y <= player2.y + player2.height) {
            theBall.x = (player2.x - theBall.width);
            theBall.speed *= (-1);
        }
        
    }
    
    if (theBall.x + theBall.width < player1.x - 5) {
        score2 += 1;
        gameState = 2;
    } else if (theBall.x > player2.x + player2.width + 5) {
        score1 += 1;
        gameState = 2;
    } else {
        theBall.x += theBall.speed;
        theBall.y += theBall.gravity;
    }
    if(gameState==2){
        createNewBall();
    }
    if(score2 >= 5){
        gameState = 3;
    }
    if(score1 >= 5){
        gameState = 4;
    }
    draw();
}

// ! ------- funciones que dibujan elementos en el canvas

//  dibuja una caja en el canvas según las coordenadas y dimensiones proporcionadas. 
function drawBox(box) { /* draw each box*/
    ctx.fillStyle = box.color;
    ctx.fillRect(box.x, box.y, box.width, box.height);
}

// muestran los puntajes de los jugadores en el canvas
function displayScore1() { /* play1 score*/
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(255,0,0)";
    var str1 = score1;
    ctx.fillText(str1, (canvas.width/2) - 50, 30);
}

function displayScore2() { /*player2 score*/
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgb(0,255,0)";
    var str2 = score2;
    ctx.fillText(str2, (canvas.width / 2) + 50, 30);
}

//  !  draw es responsable de actualizar la visualización del juego en el canvas

//La función draw es responsable de actualizar la visualización del juego en el canvas. Se encarga de borrar el canvas y dibujar todos los elementos del juego, como las paletas de los jugadores, la pelota, la línea divisoria y los puntajes. Además, según el estado del juego, muestra los menús correspondientes, como el menú de inicio, el menú de fin de juego o el menú de victoria.

    // En primer lugar, la función utiliza ctx.clearRect para borrar todo el contenido anterior del canvas, dejándolo en blanco. Luego, llama a las funciones displayScore1 y displayScore2 para mostrar los puntajes de los jugadores en posiciones específicas del canvas.

    // A continuación, utiliza la función drawBox para dibujar las paletas del jugador 1 y el jugador 2, así como la línea divisoria en el centro del canvas. Estos elementos se dibujan utilizando las propiedades de posición, tamaño y color definidas en los objetos player1, player2 y midLine, respectivamente.

    // Después de dibujar las paletas y la línea divisoria, la función verifica el estado del juego. Si el estado es 0, llama a la función drawStartMenu para mostrar el menú de inicio. Si el estado es 1 o 2, dibuja la pelota llamando a la función drawBox con el objeto theBall. Si el estado es 3, llama a la función drawOverMenu para mostrar el menú de fin de juego. Si el estado es 4, llama a la función drawWinMenu para mostrar el menú de victoria.

    // En resumen, la función draw se encarga de actualizar constantemente la visualización del juego en el canvas, dibujando los elementos necesarios según el estado del juego y mostrando los menús correspondientes. Esto permite que los cambios en el juego, como movimientos de las paletas y la pelota, sean reflejados en la pantalla de forma continua y brinda una experiencia visual interactiva para los jugadores.

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    displayScore1();
    displayScore2();
    drawBox(player1);
    drawBox(player2);
    drawBox(midLine);

    
    if(gameState==0){

        drawStartMenu();
    }
    if(gameState==1 || gameState==2){ // running

        drawBox(theBall);
    }
    if(gameState==3){

        drawOverMenu();
    }
    if(gameState==4){
        drawWinMenu();
    }

}

// dibuja el menú de inicio del juego
function drawStartMenu(){
    ctx.font="25px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.clearRect(canvas.width/2-10,canvas.height/2-40, 20,60);
    ctx.fillText("Press the spacebar to start", canvas.width/2, canvas.height/2);
}


// ! dibujan los menús de juego sobre el canvas cuando el juego ha terminado. Muestran los mensajes "Game Over" o "You Win" respectivamente, junto con instrucciones para reiniciar el juego.

function drawOverMenu(){
    ctx.font="35px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
    ctx.fillText("Press the spacebar to restart", canvas.width/2, canvas.height/2 + 40);

}

function drawWinMenu(){
    ctx.font="25px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("You Win", canvas.width/2, canvas.height/2);
    ctx.fillText("Press the spacebar to restart", canvas.width/2, canvas.height/2 + 40);
}

// crea una pausa en la ejecución del código durante un cierto número de milisegundos. Es utilizada en el estado del juego 2 para agregar un breve retraso antes de reiniciar el juego.

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

// se encargan de restablecer las posiciones de los jugadores y reiniciar el puntaje cuando se inicia un nuevo juego.

  function resetPlayers(){
    player1.x = 20;
    player1.y = canvas.height/2-40;
    player2.x = canvas.width-20-12;
    player2.y = canvas.height/2-40;
}

    function init(){
        score1 = 0;
        score2 = 0;
        resetPlayers();
        createNewBall();
}


// ! bucle principal del juego. Llama a la función draw para actualizar la visualización en cada iteración. Dependiendo del estado del juego, ejecuta las funciones correspondientes, como ballBounce, input y movePlayer2, y realiza la gestión del cambio de estado del juego. Utiliza requestAnimationFrame para solicitar que se llame a la función loop nuevamente en el siguiente ciclo de renderizado, creando así un bucle continuo para el juego.

function loop() { /*The loop function will continuously call the draw function and update our screen*/
    if(gameState == 0){
        init();
    }
    
    draw();
    if(gameState == 1){
        ballBounce(); // collision detection
        input(player1);
        movePlayer2();
        
    }
    else if(gameState == 2){
        sleep(1000);
        gameState = 1;
    }
    
    requestAnimationFrame(loop);
}

loop();