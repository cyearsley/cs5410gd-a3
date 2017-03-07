var SoundPool = function () {

	var soundCache = {
		GameMusic: new Audio('static/sounds/music/song18.mp3')
	};

	// Load the sounds
	for (key in soundCache) {
		soundCache[key].load();
	}

	this.playSound = function (data) {
		console.log(window.location.pathname)
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
