var MasterScene = function () {

    // ======================================================= //
    //
    // C A N V A S - S P E C I F I C S
    //
    // ======================================================= //
    var canvas = $('#canvas-main')[0];
    var context = canvas.getContext('2d');
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    this.init = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    this.beginRender = function () {
        context.clear();
    };
    // ======================================================= //

    var sceneMain = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {};
        this.handleInputScene = function () {console.log("handle input")};
    };

    var scenePause = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {};
        this.handleInputScene = function () {};
    };

    var scenePlay = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {};
        this.handleInputScene = function () {};
    };

    var sceneHiscores = function () {
        var characters = [];
        this.init = function () {

        };
        this.renderScene = function () {};
        this.updateScene = function () {};
        this.handleInputScene = function () {};
    };

    var scenes = {
        main: new sceneMain(),
        pause: 'empty',
        play: 'empty',
        hiscores: 'empty',
        currentScene: 'main'
    };

    this.render = function () {
        // Render the scene, and all the characters in it.
        for (key in scenes) {
            if (scenes[key] && key != 'currentScene') {
                if (key === scenes.currentScene) {
                    scenes[key].renderScene();
                }
            }
        }
    };

    this.update = function () {
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
