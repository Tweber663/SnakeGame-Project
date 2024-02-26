//Define HTML elements 

class snakeGame {
    constructor() {
        const thisElement = this;
        //Grabing grid 
        thisElement.board = document.getElementById('game-board');
        //Instruction text
        thisElement.instructionText = document.getElementById('instruction-text');
        //Logo 
        thisElement.logo = document.getElementById('logo');
        //Score
        thisElement.score = document.getElementById('score');
        //High score
        thisElement.highScore = document.getElementById('highScore');
       
        //Tracking food locations
        thisElement.foodTrack = [];
        // Starting position of a snake
        thisElement.snake = [{x: 10, y: 10}]; 
        //Grid size
        thisElement.gridSize = 20;
        //Request to generate food
        thisElement.food = thisElement.generateFood(); //& sending callback request ->🟣
        //Starting snake postion
        thisElement.direction = 'right';

        thisElement.counter = 0;

        thisElement.gameInterval;
        //Game speed
        thisElement.gameSpeedDelay = 300;
        console.log(thisElement.gameSpeedDelay)
        //game on / off
        thisElement.gameStarted = false;

        thisElement.eatAnimation();

        //~ Listens for keypreses and sends the data to the fuinction -> 
        document.addEventListener('keydown', document.addEventListener('keydown', (event) => thisElement.handleKeypress(event)));
    
    }

    // Drawing game map, snake + food
    draw() {
     const thisElement = this;
     thisElement.board.innerHTML = '';
     this.drawFood();
     this.drawSnake();
    }

    //Key press listener event


    
    startGame() {
        const thisElement = this;

        thisElement.gameStarted = true; // Keep track of a running game
        console.log(thisElement.gameStarted);
        thisElement.instructionText.style.display = 'none';  //Removes the instruction text
        thisElement.logo.style.display = 'none';  //Removes the logo

        thisElement.gameInterval = setInterval(() => {
            thisElement.move();
            thisElement.draw();
            thisElement.updateScore();
            thisElement.checkCollision();
        }, thisElement.gameSpeedDelay)
    }

    //Our event listener 🖱
    handleKeypress(event) {   //~ <- reciving infomration back from an event listner 
        const thisElement = this;
        //Pressing spacebar starts the game! 
        //double if was required to check spacebar is detected by all the browsers
        if((!thisElement.gameStarted && event.code === 'Space') || (!thisElement.gameStarted && event.key === '')) {
            thisElement.startGame(); 
        } else { 
            switch (event.key) { 
                case 'ArrowUp':
                thisElement.direction = 'up';
                break;
                case 'ArrowDown':
                thisElement.direction = 'down';
                break;
                case 'ArrowLeft':
                thisElement.direction = 'left';
                break; 
                case 'ArrowRight':
                thisElement.direction = 'right';
                break;
            }
        }
    }

    // [Draw Snake] 🐍 
    drawSnake() {
        const thisElement = this;
        thisElement.snake.forEach((segment) => {
            const snakeElement = thisElement.createGameElement('div', 'snake'); //* Callback creating snake 🔵
            //⬇
            //passsed from callback '<div class="snake"></div>', '{x: 10, y: 10}'
            this.setPosition(snakeElement, segment) 

            //Uploading the snake div to the grid board
            thisElement.board.appendChild(snakeElement);
        });
    }

    
    //Creating a HTML element 
    createGameElement(tag, className) {   //**-> returning callback snake🔵 
          //Creating a new HTML from function argument //?-> returning callback food🟢
        const element = document.createElement(tag);
        //Adding a class to the created element 
        element.className = className;
        // returning back our element throught callback. 
        return element;  
    }

    //Defining position of snake + food 🐍🍖
    setPosition(element, position) {
        element.style.gridColumn = position.x; //Horizontal x <->
        element.style.gridRow = position.y;    //Vertical y ↕
    }

    move() {
        const thisElement = this;
        //We had to use spread operator to make a 'copy' of the array and not just create a refrence.
        const head = {...thisElement.snake[0]}
        switch (thisElement.direction) {  //Our target 
            case 'right':   // if target = 'right', activate the code below etc..
            head.x++
                break;       

            case 'left': 
            head.x--
                break;    
            
            case 'up':  
            head.y--
            break;

            case 'down':
            head.y++
            break;
        }
        thisElement.snake.unshift(head); // -> Adds new coordiantes to the 'snake' object (at the begging)          

        // Check for snake and food colision
        // Check newly created 'head' coordinates & 'food' cooridnates
        if (head.x === thisElement.food.x && head.y === thisElement.food.y) {  
                thisElement.counter = 0;     //restarting food counter
                thisElement.generateFood();  // if head + food collides generate food in new location
                /*Updating game speeing when head colides with food */
                thisElement.InsreaseSpeed();                    // Update game speed
                clearInterval(thisElement.gameInterval);        // Clearing existing game loop interval in 'startGame' function
                thisElement.gameInterval = setInterval(() => {  //Starting new loop with updated game speed
                    thisElement.move();                        
                    thisElement.draw()
                    thisElement.checkCollision();
                    thisElement.updateScore();
                    thisElement.eatAnimation();  //Eat Animation get's activated
                    thisElement.counter++ ;      //counts num of moves after eating food. 
                }, thisElement.gameSpeedDelay);
        } else {
            this.snake.pop();  // Removes last coordiantes  from 'snake' object
        }
    }

    eatAnimation() {
        const thisElement = this;
        // 1st IF checks if foodtrack is present to prevent error 
        // 2nd IF checks if counter is lesser than snake lenght. 
        if (thisElement.foodTrack[1] && thisElement.counter < thisElement.snake.length) {
            let foodLocation = thisElement.foodTrack[1];
            let element = document.createElement('div');
            element.classList.add('snakeEat');
            element.style.gridColumn = foodLocation.x; //Horizontal x <->
            element.style.gridRow = foodLocation.y;    //Vertical y ↕
            thisElement.board.appendChild(element);
          }

        }


    //Insreasing game speed
    InsreaseSpeed() {
        const thisElement =  this; 
          //Increasing game speed by 5ms every time food is eaten up to 150ms
        if (thisElement.gameSpeedDelay >= 150) {
            thisElement.gameSpeedDelay -= 5;
            console.log(thisElement.gameSpeedDelay)
            //Once game speed drops below 150 we start decreasing game speed only by 2ms
        } else if (thisElement.gameSpeedDelay >= 100 ) {
            thisElement.gameSpeedDelay -= 2;
            console.log(thisElement.gameSpeedDelay)
        }
    }

    //Checking for colision
    checkCollision() {
        const thisElement = this;
        const head = thisElement.snake[0];
        
        //Checking wall collison
        if (head.x < 1 || head.x > thisElement.gridSize || head.y < 1 || head.y > thisElement.gridSize) {
            console.log('wall colision');
            thisElement.resetGame();
        } 

        //Checking snake collison expect for the first head position
        for (let i = 1; i < thisElement.snake.length; i++) {
            if (head.x === thisElement.snake[i].x && head.y === thisElement.snake[i].y) {
                console.log('snake colision');
                thisElement.resetGame();  
            }
        }
    }

    resetGame() { 
        const thisElement = this;
        thisElement.gameStarted = false;     // game running no longer true
        thisElement.snake = [{x: 10, y:10}]; //reset positon
        thisElement.direction = 'right';     //reset inital snake direction
        thisElement.gameSpeedDelay = 300     //reset game speed
        clearInterval(thisElement.gameInterval); //Clearing the game interval 
        thisElement.stopGame()

        Array.from(thisElement.board.children).forEach((child) => { //Removes all the elements from the board
            child.remove();
         });  
    }

    stopGame() {
        const thisElement = this;
        thisElement.instructionText.style.display = 'block'; // Game text visible
        thisElement.logo.style.display = 'block';           //Logo visible   
    }


    updateScore() {
        const thisElement = this;
        thisElement.currentScore = thisElement.snake.length - 1;
        thisElement.score.innerHTML = thisElement.currentScore.toString().padStart(3, 0);
        thisElement.updateHighScore();
    }

    updateHighScore() {
        const thisElement = this; 
        if (thisElement.currentScore >= 1) {
            thisElement.highScore.style.display = 'block';
            thisElement.highScore.innerHTML = thisElement.currentScore.toString().padStart(3, 0);
        }
    }


    //[Draw food] 🍖
    drawFood() {
        const thisElement = this;
     
        const foodElement = thisElement.createGameElement('div', 'food'); //?-> Callback reating food 🟢
        this.setPosition(foodElement, thisElement.food);
        thisElement.board.appendChild(foodElement);
    }

    //Food generation postion  🍖
    generateFood() {  //& -> retuning a callback function 🟣
        console.log('generating food')
        const thisElement = this;
        //generats random food postion
        let x = Math.floor(Math.random() * thisElement.gridSize) + 1;
        let y = Math.floor(Math.random() * thisElement.gridSize) + 1;
        thisElement.food = {x, y} 
        thisElement.foodTrack.unshift(thisElement.food);
        return {x, y}
    } 
}

const newGame = new snakeGame();

