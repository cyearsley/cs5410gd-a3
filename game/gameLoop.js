var GameLoop = function () {

    var sceneControl = new MasterScene();
    this.init = function () {
        window.requestAnimationFrame(_gameLoop);
    };

    function _gameLoop (timestamp) {
        _update();
        sceneControl.handleInput();
        _render();

        window.requestAnimationFrame(_gameLoop);
    }

    function _update () {
        sceneControl.update();
    }

    function _render () {
        sceneControl.render();
    };
};
