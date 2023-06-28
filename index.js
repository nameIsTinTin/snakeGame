const gameBoard = document.querySelector("#gameBoard"); 
const context = gameBoard.getContext('2d'); 
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton"); 
const warpingButton = document.querySelector("#enableWarping");
const gameWidth = gameBoard.width; 
const gameHeight = gameBoard.height;
const boardBackground = "pink"; 
const snakeColor = "#F2A2E8", snakeBorder = "black"; 
const enemyColor = "lightblue"; 
const foodColor = "#ff6961"; 
const unitSize = 25; 
let running = false, warping = false;
let xVelocity = unitSize, yVelocity = 0;
let exVelocity = unitSize, eyVelocity = 0, enemyDirection = 999;
let foodX, foodY;  
let score = 0; 
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize * 1, y: 0},
    {x: 0,     y: 0}
];
let enemy = [ 
    {x: unitSize * 4, y: gameHeight - unitSize},
    {x: unitSize * 3, y: gameHeight - unitSize},
    {x: unitSize * 2, y: gameHeight - unitSize},
    {x: unitSize * 1, y: gameHeight - unitSize},
    {x: 0,            y: gameHeight - unitSize}
];

window.addEventListener("keydown", changeDirection); 
resetButton.addEventListener("click", resetGame);
warpingButton.addEventListener("click", warpingSelected);
   

gameStart(); 

function gameStart(){
    running = true; 
    scoreText.textContent = score; 
    createFood(); 
    drawFood();
    nextTick();
    
};

function nextTick(){
    if(running){
        setTimeout(() => {
            clearBoard(); 
            drawFood();
            moveSnake();
            drawSnake();
            if(score >= 3){ 
                moveEnemySnake();
                drawEnemySnake();
                if(score >= 10){
                    changeEnemyDirection();
                }
            }
            checkGameOver(); 
            nextTick();
        }, 75);
        
    }
    else{
        displayGameOver();
    }
}; 

function clearBoard(){
    context.fillStyle = boardBackground; 
    context.fillRect(0, 0, gameWidth, gameHeight); 
}; 

function createFood(){
    function randomFood(min , max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize; 
        return randNum;
    }; 

    foodX = randomFood(0, gameWidth - unitSize); 
    foodY = randomFood(0, gameWidth - unitSize); 
}; 

function drawFood(){
    context.fillStyle = foodColor; 
    
    // context.strokeStyle = snakeBorder;
    context.fillRect(foodX, foodY, unitSize, unitSize);  
    context.strokeRect(foodX, foodY, unitSize, unitSize);

}; 

function moveSnake(){
    const head = {x: snake[0].x + xVelocity, 
                  y: snake[0].y + yVelocity};
    snake.unshift(head); 
    if(snake[0].x == foodX && snake[0].y == foodY){
        score++; 
        scoreText.textContent = score; 
        if(score % 2 != 0 && score >= 3 && score < 8){
            enemy.pop();
        }
        createFood();
        changeEnemyDirection();
    }
    else{
        if(warping){ 
            warpSnake(head); 
        };
        snake.pop();
        if(score >= 3 && score < 8){
            enemy.pop();
        }
    }
}

function warpSnake(head){
    switch(true){
        case(head.x >= gameWidth):
            head.x = 0;
            break; 
        
        case(head.x < 0):
            head.x = gameWidth - unitSize;
            break;
        
        case(head.y >= gameHeight):
            head.y = 0;
            break; 
        
        case(head.y < 0):
            head.y = gameHeight - unitSize;
            break;
        
    }
}

function moveEnemySnake(){
    const head = {x: enemy[0].x + exVelocity, 
                  y: enemy[0].y + eyVelocity};
    enemy.unshift(head); 
    warpSnake(head);
};
    
    
function drawEnemySnake(){
    context.fillStyle = enemyColor; 
    context.strokeStyle = snakeBorder; 
    enemy.forEach(enemySnake => {
        context.fillRect(enemySnake.x, enemySnake.y, unitSize, unitSize);
        context.strokeRect(enemySnake.x, enemySnake.y, unitSize, unitSize);
    });
}; 

function drawSnake(){
    context.fillStyle = snakeColor; 
    context.strokeStyle = snakeBorder; 
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}; 

function changeDirection(event){
    const keyPressed = event.keyCode; 
    const LEFT = 37, UP = 38,RIGHT = 39, DOWN = 40;
    const goingUp = (yVelocity == -unitSize), goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize), goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize; 
            yVelocity = 0; 
            break; 
        case(keyPressed == UP && !goingDown): 
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize; 
            yVelocity = 0; 
            break; 
        case(keyPressed == DOWN && !goingUp): 
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }

};

function changeEnemyDirection(){
    temporary = Math.round(Math.random() * 4); 
    if(temporary == enemyDirection){
        temporary = (temporary + 1) % 4;
    }

    switch(temporary){
        case 0:
            exVelocity = -unitSize; 
            eyVelocity = 0; 
            enemyDirection = temporary;
            break; 
        case 1:
            exVelocity = 0;
            eyVelocity = -unitSize;
            enemyDirection = temporary;
            break;
        case 2:
            exVelocity = unitSize; 
            eyVelocity = 0; 
            enemyDirection = temporary;
            break; 
        case 3:
            exVelocity = 0;
            eyVelocity = unitSize;
            enemyDirection = temporary;
            break;   
    }   
};

function checkGameOver(){
    
    
    switch(true){
        case(snake[0].x < 0 && !warping):
            running = false; 
            break; 
        case(snake[0].x >= gameWidth && !warping):
            running = false; 
            break; 
        case (snake[0].y < 0 && !warping):
            running = false; 
            break; 
        case (snake[0].y >= gameHeight && !warping):
            running = false; 
            break; 
        default: 
            enemy.forEach(enemyPart => {
                if(enemyPart.x == snake[0].x && enemyPart.y == snake[0].y){
                    running = false; 
                }
            }); 
            
            break; 
    }

    for(let i = 1; i < snake.length; i++){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};
function displayGameOver(){
    context.font = "75px 'Silkscreen', sans-serif"; 
    context.fillStyle = "black"; 
    context.textAlign = "center"; 
    context.fillText("GAME OVER!", gameWidth/2, gameHeight/2); 
    running = false; 
};

function warpingSelected(){
    warping = warping ? warping = false : warping = true;
    console.log(warping);
    if(warping){
        warpingButton.style.backgroundColor = "lightblue";
        warpingButton.textContent = "WARPING ENABLED"
    }
    else {
        warpingButton.style.backgroundColor = "pink";
        warpingButton.textContent = "WARPING DISABLED"
    }
};


function resetGame(){
    score = 0; 
    xVelocity = unitSize; 
    yVelocity = 0;
    exVelocity = unitSize, eyVelocity = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize * 1, y: 0},
        {x: 0,     y: 0}
    ];
    enemy = [ 
        {x: unitSize * 4, y: gameHeight - unitSize},
        {x: unitSize * 3, y: gameHeight - unitSize},
        {x: unitSize * 2, y: gameHeight - unitSize},
        {x: unitSize * 1, y: gameHeight - unitSize},
        {x: 0,            y: gameHeight - unitSize}
    ];
    
    gameStart();
};