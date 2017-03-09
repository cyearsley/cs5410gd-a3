var SoundPool = function () {

	var soundCache = {
		GameMusic: new Audio('static/sounds/music/song18.mp3'),
		menuSelect: new Audio('static/sounds/SFX/menu-select.wav'),
		menuChoose: new Audio('static/sounds/SFX/complete.ogg')
	};

	// Load the sounds
	for (key in soundCache) {
		soundCache[key].load();
	}

	this.playSound = function (data) {
		data = $.extend({
			volume: .5,
			loop: false
		}, data);
		var newSound = soundCache[data.type];
		newSound.volume = data.volume;
		newSound.loop = data.loop;
		newSound.play();
	};
};
