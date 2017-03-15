var MasterScene = function () {

    // ======================================================= //
    //
    // C A N V A S - S P E C I F I C S
    //
    // ======================================================= //
    var canvas = $('#canvas-main')[0];
    var context = canvas.getContext('2d');
    var backgroundImage = new Image();
    backgroundImage.src = 'static/images/moon-background.png';
    backgroundImage.onload = function () {
        backgroundImage.ready_p = true;
        backgroundImage.width = canvas.width;
        backgroundImage.height = canvas.height;
    };
    context.globalAlpha = 0;
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
                            SOUNDBOARD.playSound({type: 'startPlay', volume: 0.25, loop: false});
                        }
                        else {
                            SOUNDBOARD.playSound({type: 'selectOption', volume: 0.25, loop: false});
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
        var characters = [];
        // create the characters
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {};
        this.handleInputScene = function () {};
    };

    // ======================================================= //
    //
    // P L A Y - S C E N E
    //
    // ======================================================= //
    var scenePlay = function (initialTimestamp) {
        var characters = [];
        characters.paddle = CM.createCharacter({type: 'paddle', x: canvas.width/2, y: 650, canvasWidth: canvas.width})
        var timeElapsed = 0;
        var totalTimeElapsed = 0;
        var isPlaying_p = false;
        var resetScene_p = false;
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
                else if (event.key === 'Escape') {
                    resetScene_p = true;
                    SOUNDBOARD.playSound({type: 'selectOption', volume: 0.5, loop: false});
                    scenes.currentScene = 'pause';
                }
            }
            else if (event.key === 'Escape' && scenes.currentScene === 'pause') {
                scenes.currentScene = 'play';
                SOUNDBOARD.playSound({type: 'goBack', volume: 0.5, loop: false});
            }
        });

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
        }

        this.resetScene = function (newTimeStamp) {
            initialTimestamp = newTimeStamp;
            timeElapsed = 0;
            isPlaying_p = false;
            resetScene_p = false;
            controlsData.ArrowRight.pressed = false;
            controlsData.ArrowLeft.pressed = false;
        };

        this.renderScene = function () {
            // render the bricks
            for (let ii = 0; ii < characters.length; ii += 1) {
                for (let jj = 0; jj < characters[0].length; jj += 1) {
                    characters[ii][jj].render(context, canvas.width);
                }
            }

            // render the paddle
            characters.paddle.render(context, canvas.width);

            // render the countdown
            if (!isPlaying_p) {
                if (timeElapsed > 1000 && timeElapsed < 2000) {
                    countDownTimer.three.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 3000) {
                    countDownTimer.two.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 4000) {
                    countDownTimer.one.render(context);
                }
                else if (timeElapsed > 1000 && timeElapsed < 5000) {
                    countDownTimer.go.render(context);
                }
                else if (timeElapsed > 1000) {
                    isPlaying_p = true;
                }
            }
        };
        this.updateScene = function (newTimeStamp) {
            if (resetScene_p) {
                this.resetScene(newTimeStamp);
            }
            timeElapsed = newTimeStamp - initialTimestamp;
            totalTimeElapsed = newTimeStamp - totalTimeElapsed;
            if (isPlaying_p) {
                characters.paddle.update({canvasWidth: canvas.width, left: controlsData.ArrowLeft.pressed, right: controlsData.ArrowRight.pressed})
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
    var sceneHighscores = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {console.log("updating highscores")};
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
        play: 'empty',
        hiscores: 'empty',
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
