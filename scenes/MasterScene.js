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
                        scenes.play = new scenePlay();
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
    var scenePlay = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {console.log("updating play")};
        this.handleInputScene = function () {};
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
        pause: 'empty',
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

    this.update = function () {
        if (context.globalAlpha < 1.1) {
            context.globalAlpha += 0.025;
        }
        // Update the scene, and all the characters in it.
        for (key in scenes) {
            if (scenes[key] && key != 'currentScene') {
                if (key === scenes.currentScene) {
                    scenes[key].updateScene();
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
