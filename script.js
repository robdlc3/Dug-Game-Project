window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200; // edited canvas h
    canvas.height = 720; // edited canvas h
    let squirrels = [];
    let score = 0;
    let gameOn = false;

    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }


    // Player/Dug Stuff 
    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 200;
            this.height = 200;
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 10000 / this.fps;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
        }
        draw(context) {
            // context.fillStyle = 'white';
            // context.fillRect(this.x, this.y, this.width, this.height);
            //task 1 5P
            // context.strokeStyle = 'white';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.beginPath();
            // context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.beginPath();
            // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            // context.stroke();
            // task 1 5P
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        update(input, deltaTime, squirrels) {
            //collision detection
            squirrels.forEach(squirrel => {
                const dx = (squirrel.x + squirrel.width / 2) - (this.x + this.width / 2);
                const dy = (squirrel.y + squirrel.width / 2) - (this.y + this.width / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < squirrel.width / 2 + this.width / 2) {
                    gameOn = true;
                }
            })
            // //sprite animation
            // if (this.frameTimer > this.frameInterval) {
            //     if (this.frameX >= this.maxFrame) this.frameX = 0;
            //     else this.frameX++;
            //     this.frameTimer = 0;
            // } else {
            //     this.frameTimer += deltaTime;
            // }

            // controls
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5;
            } else if (input.keys.indexOf('ArrowUp') > -1 && this.onGround()) {
                this.vy -= 32;
            } else {
                this.speed = 0;
            }
            // horizontal movement
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
            //vertical movement
            this.y += this.vy;
            if (!this.onGround()) {
                this.vy += this.weight;
                this.maxFrame = 5;
                this.frameY = 1;
            } else { // you are on the ground
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }
    // Scrolling background is good to go //
    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById('backgroundImage');
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 720;
            this.speed = 5;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height);
        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0;
        }
    }

    class Squirrel {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById('squirrelImage');
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 10000 / this.fps;
            this.speed = 8;
            this.markedForDeletion = false;
        }
        draw(context) {
            //collision stuff >
            // context.strokeStyle = 'white';
            // context.strokeRect(this.x, this.y, this.width, this.height);
            // context.beginPath();
            // context.arc(this.x + this.width / 2, this.y + 2 + this.height / 2, this.width / 2, 0, Math.PI * 2);
            // context.stroke();
            // context.strokeStyle = 'blue';
            // context.beginPath();
            // context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            // context.stroke();
            //collision stuff ^
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height,
                this.x, this.y, this.width, this.height);
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    // handleSquirrels will be how we add new squirrels to the game
    function handleSquirrels(deltaTime) {
        if (squirrelTimer > squirrelInterval + randomSquirrelInterval) {
            squirrels.push(new Squirrel(canvas.width, canvas.height));
            console.log(squirrels);
            randomSquirrelInterval = Math.random() * 1000 + 500;
            squirrelTimer = 0;
        } else {
            squirrelTimer += deltaTime;
        }
        squirrels.forEach(squirrel => {
            squirrel.draw(ctx);
            squirrel.update(deltaTime);
        });
        squirrels = squirrels.filter(squirrel => !squirrel.markedForDeletion);
    }

    // stuff for score display //
    function displayStatusText(context) {
        context.font = '40px Helvetica';
        context.fillStyle = 'black';
        context.fillText(`Score: ` + score, 20, 50);
        context.font = '40px Helvetica';
        context.fillStyle = 'white';
        context.fillText(`Score: ` + score, 22, 52);
        if (gameOn) {
            context.Align = 'left';
            context.fillStyle = 'black';
            context.fillText(`GAME OVER, sorry bud!`, canvas.width / 2, 200);
            context.fillStyle = 'white';
            context.fillText(`GAME OVER, sorry bud!`, canvas.width / 2 + 2, 202);
        }
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);


    let lastTime = 0;
    let squirrelTimer = 0;
    let squirrelInterval = 1000;
    let randomSquirrelInterval = Math.random() * 1000 + 500;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input, deltaTime, squirrels);
        handleSquirrels(deltaTime);
        displayStatusText(ctx);
        if (!gameOn) requestAnimationFrame(animate);
    }
    animate(0);
});
