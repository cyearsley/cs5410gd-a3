var SoundPool = function () {

	var soundCache = {
		GameMusic: new Audio('static/sounds/music/song18.mp3'),
		menuSelect: new Audio('static/sounds/SFX/menu-select.wav'),
		startPlay: new Audio('static/sounds/SFX/complete.ogg'),
		selectOption: new Audio('static/sounds/SFX/button1.ogg'),
		goBack: new Audio('static/sounds/SFX/button2.ogg'),
		tick: new Audio('static/sounds/SFX/on.ogg'),
		brickhit: new Audio('static/sounds/SFX/brickhit.wav')
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
		if (data.cut_p) {
			newSound.play();
		}
		else {
			var clonedSound = newSound.cloneNode();
			clonedSound.volume = data.volume;
			clonedSound.play();
		}
	};
};
