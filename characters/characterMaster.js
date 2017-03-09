var CharacterMaster = function () {

	function createImage (path) {
		var img = new Image();
		img.src = path;
		img.onload = function () {
			img.isReady_p = true;
		};
		return img;
	}

	var characterImages = {
		'btb': {
			image: createImage('static/images/btb-text.png')
		},
		'start': {
			image: createImage('static/images/start-text.png')
		},
		'highscores': {
			image: createImage('static/images/highscores-text.png')
		},
		'options': {
			image: createImage('static/images/options-text.png')
		}
	};

	var CharacterObj = {
		ball: function (data) {
			this.type = data.type;
		},
		brick: function (data) {
			this.type = data.type;
		},
		paddle: function (data) {
			this.type = data.type;
		},
		text: function (_data) {
			var validButtonNames = ['start', 'exit', 'credits', 'highscores', 'options', 'resume', 'btb'];

			this.dimension = {
				center: {
					x: Math.floor(characterImages[_data.imageText].width/2),
					y: Math.floor(characterImages[_data.imageText].height/2)
				},
				width: characterImages[_data.imageText].width,
				height: characterImages[_data.imageText].height
			};
			this.position = {
				x: _data.x,
				y: _data.y
			};

			this.update = function () {
				
			};

			this.render = function (context) {
				if (characterImages[_data.imageText].image.isReady_p) {
					context.save();
					context.drawImage(characterImages[_data.imageText].image, this.position.x-(characterImages[_data.imageText].image.width*(function () {if(_data.alignCenter) return 0.5; return 0;}())), this.position.y);
					context.restore();
				}
			};
		}
	};

	this.createCharacter = function (data) {
		if (!data.type || !data.name) {
			console.error("You need to specify a type/name for the newly created character" + (()=>{if(data.name) return ' named: ' + data.name; else return '!';}))
			return;
		}
		return new CharacterObj[data.type](data);
	};
};
