var MasterScene = function () {

    // ======================================================= //
    //
    // C A N V A S - S P E C I F I C S
    //
    // ======================================================= //
    var canvas = $('#canvas-main')[0];
    var context = canvas.getContext('2d');
    var backgroundImage = new Image();
    var hasPlayed_p = false;
    var resetScene_p = false;
    backgroundImage.src = 'static/images/moon-background.png';
    backgroundImage.onload = function () {
        backgroundImage.ready_p = true;
        backgroundImage.width = canvas.width;
        backgroundImage.height = canvas.height;
    };
    context.globalAlpha = 0;
    context.fillStyle = 'white';
    console.log("canvas width: ", canvas.width);
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    this.init = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    function beginRender () {
        context.clear();
    };

    // ======================================================= //
    //
    // M A I N - S C E N E
    //
    // ======================================================= //
    var sceneMain = function () {
        var characters = [
            CM.createCharacter({type: 'text', name: 'testing', textType: 'button', imageText: 'start', x: canvas.width/2, y: 200, alignCenter: true}),
            CM.createCharacter({type: 'text', name: 'testing2', textType: 'logo', imageText: 'btb', x: canvas.width/2, y: 50, alignCenter: true}),
            CM.createCharacter({type: 'text', name: 'testing2', textType: 'button', imageText: 'highscores', x: canvas.width/2, y: 325, alignCenter: true}),
            CM.createCharacter({type: 'text', name: 'testing2', textType: 'button', imageText: 'options', x: canvas.width/2, y: 450, alignCenter: true})
        ];
        var mousePosition = {
            x: undefined,
            y: undefined
        };
        var clickingObj = {
            hasClicked_p: false,
            x: undefined,
            y: undefined
        };
        var currentTimestamp = undefined;
        canvas.addEventListener('mousemove', function(evt) {
            var rect = canvas.getBoundingClientRect();
            mousePosition.x = evt.clientX - rect.left;
            mousePosition.y = evt.clientY - rect.top;
        }, false);
        canvas.addEventListener('click', function (event) {
            clickingObj.hasClicked_p = true;
            clickingObj.x = event.clientX;
            clickingObj.y = event.clientY;
        }, false);
        this.init = function () {

        };
        this.renderScene = function () {
            for (index in characters) {
                characters[index].render(context);
            }
        };
        this.updateScene = function (timestamp) {
            currentTimestamp = timestamp;
            for (index in characters) {
                characters[index].update(mousePosition.x, mousePosition.y);
            }
        };
        this.handleInputScene = function () {
            for (index in characters) {
                if (clickingObj.hasClicked_p) {
                    var response = characters[index].handleClick();
                    if (response) {
                        if (characters[index].imageText === 'start') {
                            SOUNDBOARD.playSound({type: 'startPlay', volume: 1, loop: false, cut_p: false});
                        }
                        else {
                            SOUNDBOARD.playSound({type: 'selectOption', volume: 1, loop: false, cut_p: false});
                        }
                        context.globalAlpha = 0;
                    }
                    if (response == 'start') {
                        scenes.play = new scenePlay(currentTimestamp);
                        scenes.currentScene = 'play';
                    }
                    else if (response == 'highscores') {
                        scenes.highscores = new sceneHighscores();
                        scenes.currentScene = 'highscores';
                    }
                    else if (response == 'options') {
                        scenes.currentScene = 'options';
                    }
                }
            }
            clickingObj.hasClicked_p = false;
        };
    };

    // ======================================================= //
    //
    // P A U S E - S C E N E
    //
    // ======================================================= //
    var scenePause = function () {
        var characters = [
            CM.createCharacter({type: 'text', textType: 'logo', imageText: 'paused', x: canvas.width/2, y: 50, alignCenter: true}),
            CM.createCharacter({type: 'text', textType: 'button', imageText: 'resume', x: canvas.width/2, y: 250, alignCenter: true}),
            CM.createCharacter({type: 'text', textType: 'button', imageText: 'exit', x: canvas.width/2, y: 450, alignCenter: true})
        ];
        var mousePosition = {
            x: undefined,
            y: undefined
        };
        var clickingObj = {
            hasClicked_p: false,
            x: undefined,
            y: undefined
        };
        var currentTimestamp = undefined;
        canvas.addEventListener('mousemove', function(evt) {
            var rect = canvas.getBoundingClientRect();
            mousePosition.x = evt.clientX - rect.left;
            mousePosition.y = evt.clientY - rect.top;
        }, false);
        canvas.addEventListener('click', function (event) {
            clickingObj.hasClicked_p = true;
            clickingObj.x = event.clientX;
            clickingObj.y = event.clientY;
        }, false);
        // create the characters
        this.init = function () {

        };
        this.renderScene = function () {
            for (let ii = 0; ii < characters.length; ii += 1) {
                characters[ii].render(context);
            }
        };
        this.updateScene = function (timestamp) {
            currentTimestamp = timestamp;
            for (index in characters) {
                characters[index].update(mousePosition.x, mousePosition.y);
            }
        };
        this.handleInputScene = function () {
            for (index in characters) {
                if (clickingObj.hasClicked_p) {
                    var response = characters[index].handleClick();
                    if (response) {
                        if (characters[index].imageText === 'resume') {
                            SOUNDBOARD.playSound({type: 'startPlay', volume: 1, loop: false, cut_p: false});
                        }
                        else {
                            SOUNDBOARD.playSound({type: 'selectOption', volume: 1, loop: false, cut_p: false});
                        }
                        context.globalAlpha = 0;
                    }
                    if (response == 'resume') {
                        scenes.currentScene = 'play';
                    }
                    else if (response == 'exit') {
                        scenes.main = new sceneMain();
                        scenes.currentScene = 'main';
                    }
                }
            }
            clickingObj.hasClicked_p = false;
        };
    };

    // ======================================================= //
    //
    // P L A Y - S C E N E
    //
    // ======================================================= //
    var scenePlay = function (initialTimestamp) {
        console.log("initialTimestamp", initialTimestamp);
        var playerLives = 3;
        var sessionScore = 0;
        var consecutiveBrickHit = 0;
        var totalBrickHit = 0;
        var characters = [];
        var particles = [];
        var possibleCollisionList = [];
        characters.paddle = CM.createCharacter({type: 'paddle', x: canvas.width/2, y: 650, canvasWidth: canvas.width});
        characters.ball = CM.createCharacter({type: 'ball', x: canvas.width/2, y: 550, canvasWidth: canvas.width});
        characters.paddleLives = CM.createCharacter({type: 'paddleLife'});
        var timeElapsed = 0;
        var totalTimeElapsed = 0;
        var isPlaying_p = false;
        var countDownTimer = {
            'go': CM.createCharacter({type: 'text', textType: 'label', imageText: 'go', x: canvas.width/2, y: 180, alignCenter: true}),
            'three': CM.createCharacter({type: 'text', textType: 'label', imageText: 'three', x: canvas.width/2, y: 200, alignCenter: true}),
            'two': CM.createCharacter({type: 'text', textType: 'label', imageText: 'two', x: canvas.width/2, y: 200, alignCenter: true}),
            'one': CM.createCharacter({type: 'text', textType: 'label', imageText: 'one', x: canvas.width/2, y: 200, alignCenter: true})
        };
        var controlsData = {
            'ArrowLeft': {
                pressed: false
            },
            'ArrowRight': {
                pressed: false
            }
        };

        function generateCollisionList() {
            possibleCollisionList = [];
            for (let ii = 0; ii < characters.length; ii += 1) {
                for (let jj = 0; jj < characters[ii].length; jj += 1) {
                    // if (typeof characters[ii-1] === 'undefined') {
                    //     possibleCollisionList.push({ii: ii, jj: jj});
                    // }
                    // else if (!characters[ii-1][jj].activeState() || (typeof characters[ii+1] !== 'undefined' && !characters[ii+1][jj].activeState())) {
                    //     possibleCollisionList.push({ii: ii, jj: jj});
                    // }
                    // else if ((typeof characters[ii][jj-1] !== 'undefined' && !characters[ii][jj-1].activeState()) || (typeof characters[ii][jj+1] !== 'undefined' && !characters[ii][jj+1].activeState())) {
                    //     possibleCollisionList.push({ii: ii, jj: jj});
                    // }
                    possibleCollisionList.push({ii: ii, jj: jj});
                }
            }
        }

        window.addEventListener('keydown', function (event) {
            if (scenes.currentScene === 'play') {
                if (isPlaying_p && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                    if (controlsData[event.key] && controlsData[event.key].pressed == false) {
                        controlsData[event.key].pressed = true;
                    }
                }
            }
        });

        window.addEventListener('keyup', function (event) {
            if (scenes.currentScene === 'play') {
                if (isPlaying_p && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                    if (controlsData[event.key] && controlsData[event.key].pressed == true) {
                        controlsData[event.key].pressed = false;
                    }
                }
            }
        })

        function handleThisInput(event) {
            if (scenes.currentScene === 'play') {
                if (isPlaying_p && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                    if (controlsData[event.key] && controlsData[event.key].pressed == true) {
                        controlsData[event.key].pressed = false;
                    }
                }
                else if (event.key === 'Escape') {
                    console.log("PRESSING ESC - ", resetScene_p);
                    resetScene_p = true;
                    SOUNDBOARD.playSound({type: 'selectOption', volume: 1, loop: false, cut_p: false});
                    scenes.pause = new scenePause();
                    scenes.currentScene = 'pause';
                }
            }
            // else if (event.key === 'Escape' && scenes.currentScene === 'pause') {
            //     scenes.currentScene = 'play';
            //     resetScene_p = true;
            //     SOUNDBOARD.playSound({type: 'goBack', volume: 0.5, loop: false, cut_p: false});
            // }
        }

        if (!hasPlayed_p) {
            window.addEventListener('keyup', handleThisInput);
            hasPlayed_p = true;
        }

        for (let ii = 0; ii < 8; ii += 1) {
            characters.push([]);
            for (let jj = 0; jj < 14; jj += 1) {
                let xPos = (canvas.width/14)*jj+3;
                let rowMult;
                if (ii == 0 || ii%2 == 0) {
                    rowMult = 0;
                }
                else {
                    rowMult = (canvas.width/14)*.37;
                }
                if (ii >= 6) {
                    characters[ii].push(CM.createCharacter({type: 'brick', brickType: 'green', x: xPos, y: 10*.8+rowMult, canvasWidth: canvas.width}));
                }
                else if (ii >= 4) {
                    characters[ii].push(CM.createCharacter({type: 'brick', brickType: 'blue', x: xPos, y: 60*.8+rowMult+(canvas.width/14)*.3, canvasWidth: canvas.width}));
                }
                else if (ii >= 2) {
                    characters[ii].push(CM.createCharacter({type: 'brick', brickType: 'orange', x: xPos, y: 110*.8+rowMult+(canvas.width/14)*.3*2, canvasWidth: canvas.width}));
                }
                else {
                    characters[ii].push(CM.createCharacter({type: 'brick', brickType: 'yellow', x: xPos, y: 160*.8+rowMult+(canvas.width/14)*.3*3, canvasWidth: canvas.width}));
                }
            }
            if (ii === 7) {
                generateCollisionList();
            }
        }

        this.resetScene = function (newTimeStamp) {
            console.log("RESET SCENE");
            initialTimestamp = newTimeStamp;
            timeElapsed = 0;
            isPlaying_p = false;
            resetScene_p = false;
            controlsData.ArrowRight.pressed = false;
            controlsData.ArrowLeft.pressed = false;
        };

        this.renderScene = function () {
            // render particles
            for (let ii = 0; ii < particles.length; ii += 1) {
                particles[ii].render(context);
            }

            // render the bricks
            for (let ii = 0; ii < characters.length; ii += 1) {
                for (let jj = 0; jj < characters[0].length; jj += 1) {
                    characters[ii][jj].render(context, canvas.width);
                }
            }

            // render the paddle
            characters.paddle.render(context, canvas.width);
            characters.ball.render(context, canvas.width);

            // render the countdown
            if (!isPlaying_p) {
                if (timeElapsed > 1000 && timeElapsed < 2000) {
                    if (timeElapsed < 1200 && timeElapsed > 1000) {SOUNDBOARD.playSound({type: 'tick', volume: 1, loop: false, cut_p: true});}
                    countDownTimer.three.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 3000) {
                    if (timeElapsed > 2000 && timeElapsed < 2100) {SOUNDBOARD.playSound({type: 'tick', volume: 1, loop: false, cut_p: true});}
                    countDownTimer.two.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 4000) {
                    if (timeElapsed > 3000 && timeElapsed < 3100) {SOUNDBOARD.playSound({type: 'tick', volume: 1, loop: false, cut_p: true});}
                    countDownTimer.one.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 5000) {
                    if (timeElapsed > 4000 && timeElapsed < 4100) {SOUNDBOARD.playSound({type: 'tick', volume: 1, loop: false, cut_p: true});}
                    countDownTimer.go.render(context);
                }
                else if (timeElapsed > 1000) {
                    isPlaying_p = true;
                }

                let ballData = characters.ball.getDimensions();
                context.beginPath();
                context.moveTo(ballData.position.x + ballData.dimensions.ballWidth/2, ballData.position.y + ballData.dimensions.ballHeight/2);
                context.lineTo(ballData.position.x + ballData.dimensions.ballWidth/2 + ballData.direction.x*25, ballData.position.y + ballData.dimensions.ballWidth/2 + ballData.direction.y*25);
                context.lineTo(ballData.position.x + ballData.dimensions.ballWidth/2 + ballData.direction.x*20, ballData.position.y + ballData.dimensions.ballWidth/2 + ballData.direction.y*25);
                context.lineWidth = 5;
                context.strokeStyle = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                context.stroke();
            }
            context.font = "30px Verdana";
            var scoreText = 'Current Score: ' + sessionScore;
            context.fillText(scoreText, canvas.width - context.measureText(scoreText).width - 10, canvas.height - 10);
            context.font = "10px Verdana";
            scoreText = 'Brick Multiplier: ' + characters.ball.getBallSpeed() + 'x';
            context.fillText(scoreText, canvas.width - context.measureText(scoreText).width - 10, canvas.height - 50);

            characters.paddleLives.render(context, canvas.height, playerLives);
        };
        this.updateScene = function (newTimeStamp) {
            if (resetScene_p) {
                console.log("RESTTING: ", newTimeStamp)
                this.resetScene(newTimeStamp);
            }
            timeElapsed = newTimeStamp - initialTimestamp;
            totalTimeElapsed = newTimeStamp - totalTimeElapsed;
            if (isPlaying_p) {
                // update particles
                for (let ii = 0; ii < particles.length; ii += 1) {
                    if (particles[ii].getTimeRemaining() < 0) {
                        particles.splice(ii, 1);
                    } else {
                        particles[ii].update();
                    }
                }
                characters.paddle.update({canvasWidth: canvas.width, left: controlsData.ArrowLeft.pressed, right: controlsData.ArrowRight.pressed})
                characters.ball.update({canvasWidth: canvas.width, canvasHeight: canvas.height});

                // check to see if the ball is colliding with any of the bricks.
                for (let ii = 0; ii < possibleCollisionList.length; ii += 1) {
                    var collision_p = characters.ball.checkBrickCollision(characters[possibleCollisionList[ii].ii][possibleCollisionList[ii].jj])
                    if (collision_p) {
                        SOUNDBOARD.playSound({type: 'brickhit', volume: 0.5, loop: false, cut_p: false});
                        for (let pp = 0; pp < 20; pp += 1) {
                            particles.push(CM.createCharacter({type: 'particle', dimensions: characters[possibleCollisionList[ii].ii][possibleCollisionList[ii].jj].getDimensions()}))
                        }
                        if (characters[possibleCollisionList[ii].ii][possibleCollisionList[ii].jj].getBrickType() === 'green') {
                            characters.paddle.halfPaddleWidth();
                        }
                        var multiplier = characters.ball.getBallSpeed();
                        if (collision_p === 'yellow') {
                            sessionScore += 10*multiplier;
                        }
                        else if (collision_p === 'orange') {
                            sessionScore += 20*multiplier;
                        }
                        else if (collision_p === 'blue') {
                            sessionScore += 30*multiplier;
                        }
                        else if (collision_p === 'green') {
                            sessionScore += 40*multiplier;
                        }
                        consecutiveBrickHit += 1;
                        totalBrickHit += 1;
                        if (consecutiveBrickHit === 4) {
                            characters.ball.modifyBallSpeed(0.5);
                        }
                        else if (consecutiveBrickHit === 12) {
                            characters.ball.modifyBallSpeed(0.4);
                        }
                        else if (consecutiveBrickHit === 36) {
                            characters.ball.modifyBallSpeed(0.35);
                        }
                        else if (consecutiveBrickHit === 62) {
                            characters.ball.modifyBallSpeed(0.3);
                        }
                        characters[possibleCollisionList[ii].ii][possibleCollisionList[ii].jj].activeState(false);
                        generateCollisionList();
                        break;
                    }
                }

                // Check if there is a collision with the paddle and the ball
                characters.ball.checkPaddleCollision(characters.paddle);

                // Check if the ball has gone pass the paddle; if so, subtract a life and reset the ball and paddle.
                if (characters.ball.checkIfBallIsDead(canvas.height) || totalBrickHit >= 112) {
                    particles = [];
                    if (totalBrickHit < 112) {
                        consecutiveBrickHit = 0;
                        playerLives -= 1;
                        this.resetScene(newTimeStamp);
                        characters.ball = CM.createCharacter({type: 'ball', x: canvas.width/2, y: 550, canvasWidth: canvas.width});
                        characters.paddle = CM.createCharacter({type: 'paddle', x: canvas.width/2, y: 650, canvasWidth: canvas.width});
                    }
                    if (playerLives < 0 || totalBrickHit >= 112) {
                        scenes.gameOver = new sceneGameOver(sessionScore, playerLives, totalTimeElapsed);
                        scenes.currentScene = 'gameOver';
                        context.globalAlpha = 0;
                    }
                }
            }
        };
        this.handleInputScene = function () {

        };
    };

    // ======================================================= //
    //
    // H I G H S C O R E S - S C E N E
    //
    // ======================================================= //
    var sceneHighscores = function (newHighScoreName) {
        var characters = [CM.createCharacter({type: 'text', textType: 'logo', imageText: 'highscores', x: canvas.width/2, y: 50, alignCenter: true})];
        var topHighScores = sortHighscores(localStorage.cyBTBHSList);
        var initLeft = false;
        var exitText = 'To exit to the main menu, press Escape (ESC)';
        var exitScene_p = false;

        window.addEventListener('keyup', function (event) {
            if (event.key === 'Escape' && scenes.currentScene === 'highscores') {
                scenes.main = new sceneMain();
                scenes.currentScene = 'main';
            }
        });

        this.renderScene = function () {
            for (let ii = 0; ii < characters.length; ii += 1) {
                characters[ii].render(context);
            }
            if (topHighScores) {
                for (let ii = 0; ii < topHighScores.length; ii += 1) {
                    let scoreText = ' ' + topHighScores[ii].name + ' - ' + topHighScores[ii].score;
                    while (scoreText.length < 40) {
                        scoreText = '.' + scoreText;
                    }
                    scoreText = (ii+1) + ') ' + scoreText;
                    context.font = (30 - ii*2) + "px Verdana"; 
                    if (topHighScores[ii].name == newHighScoreName) {
                        context.fillStyle = 'green';
                        context.font = "35px Verdana";
                    }
                    if (!initLeft) {
                        initLeft = canvas.width/2 - context.measureText(scoreText).width/2;
                    }

                    context.fillText(scoreText, initLeft, ii*50+175);
                    context.fillStyle = 'white';
                }
            }
            else {
                context.font = "40px Verdana";
                let noScoresText = "There are no scores, play to be the first to add a score!"
                context.fillText(noScoresText, canvas.width/2 - context.measureText(noScoresText).width/2, canvas.height/2);
            }

            context.fillStyle = 'red';
            context.font = "30px Verdana";
            context.fillText(exitText, canvas.width/2 - context.measureText(exitText).width/2, canvas.height - 35);
            context.fillStyle = 'white';
        };
        this.updateScene = function () {console.log("updating highscores")};
        this.handleInputScene = function () {};
    };
    function sortHighscores (hsStr) {
        var scores = [];
        var finalScores = [];
        if (hsStr !== undefined) {
            scores = localStorage.cyBTBHSList.split('|');
            scores.splice(scores.length-1, 1);
            for (let ii = 0; ii < scores.length; ii += 1) {
                scores[ii] = JSON.parse(scores[ii]);
            }
            while (finalScores.length < 9 && scores.length > 0) {
                let maxScoreIndex = 0;
                for (let ii = 0; ii < scores.length; ii += 1) {
                    if (scores[maxScoreIndex].score < +scores[ii].score) {
                        maxScoreIndex = ii;
                    }
                }
                finalScores.push(scores[maxScoreIndex]);
                scores.splice(maxScoreIndex, 1);
            }
            return finalScores;
        }
        return false;
    }

    // ======================================================= //
    //
    // G A M E O V E R - S C E N E
    //
    // ======================================================= //
    var sceneGameOver = function (score, lives, time) {
        console.log("GAME OVER");
        var characters = [];
        var $highScoreInput = $('#highscore-input');
        var $hsSubmitButton = $('#highscore-submit-button');
        $highScoreInput.css('visibility', 'visible');
        $hsSubmitButton.css('visibility', 'visible');
        $highScoreInput.val('');

        var welcomeText = [];
        if (lives >= 0) {
            welcomeText.push('You Win!');
        }
        else {
            welcomeText.push('You Are Out of Lives!');
        }

        $('#highscore-submit-button').one('click', function (event) {
            console.log("CLICKED!");
            localStorage.cyBTBHSList = localStorage.cyBTBHSList || '';
            if ($highScoreInput.val() !== '') {
                localStorage.cyBTBHSList = localStorage.cyBTBHSList + '{"name": "'+$highScoreInput.val()+'", "score": '+(+score)+', "time": '+(+time)+'}|';
            }
            $highScoreInput.css('visibility', 'hidden');
            $hsSubmitButton.css('visibility', 'hidden');
            scenes.highscores = new sceneHighscores($highScoreInput.val());
            scenes.main = new sceneMain();
            scenes.pause = new scenePause();
            scenes.currentScene = 'highscores';
            context.globalAlpha = 0;
        });

        welcomeText.push('Your Score Is: ' + score);
        welcomeText.push('Please Enter Your Name Below (if no name is given, the score will NOT be saved)')

        console.log("SCORES: ", score);
        console.log("LIVES: ", lives);
        console.log("TIME: ", time);
        this.init = function () {

        };
        this.renderScene = function () {
            for (let ii = 0; ii < welcomeText.length; ii += 1) {
                if (ii !== welcomeText.length - 1) {
                    context.font = "40px Verdana";
                }
                else {
                    context.font = "20px Verdana";   
                }
                context.fillText(welcomeText[ii], canvas.width/2 - context.measureText(welcomeText[ii]).width/2, ii*75+100);
            }
        };
        this.updateScene = function () {console.log("updating gameover")};
        this.handleInputScene = function () {};
    };

    // ======================================================= //
    //
    // O P T I O N S - S C E N E
    //
    // ======================================================= //
    var sceneOptions = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {console.log("updating options")};
        this.handleInputScene = function () {};
    };

    var scenes = {
        main: new sceneMain(),
        pause: new scenePause(),
        gameOver: 'empty',
        play: 'empty',
        highscores: 'empty',
        options: new sceneOptions(),
        currentScene: 'main'
    };

    this.render = function () {
        // Render the scene, and all the characters in it.
        beginRender();
        context.drawImage(backgroundImage,0,0,canvas.width,canvas.height);
        for (key in scenes) {
            if (scenes[key] && key != 'currentScene') {
                if (key === scenes.currentScene) {
                    scenes[key].renderScene();
                }
            }
        }
    };

    this.update = function (timestamp) {
        if (context.globalAlpha < 1.1) {
            context.globalAlpha += 0.025;
        }
        // Update the scene, and all the characters in it.
        for (key in scenes) {
            if (scenes[key] && key != 'currentScene') {
                if (key === scenes.currentScene) {
                    scenes[key].updateScene(timestamp);
                }
            }
        }
    };

    this.handleInput = function () {
        // Handle the input for the scene.
        for (key in scenes) {
            if (scenes[key] && key != 'currentScene') {
                if (key === scenes.currentScene) {
                    scenes[key].handleInputScene();
                }
            }
        }
    };
};
