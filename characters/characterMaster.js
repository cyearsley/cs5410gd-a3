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
			image: createImage('static/images/start-text.png'),
			imageAlt: createImage('static/images/start-text-selected.png')
		},
		'highscores': {
			image: createImage('static/images/highscores-text.png'),
			imageAlt: createImage('static/images/highscores-text-selected.png')
		},
		'options': {
			image: createImage('static/images/options-text.png'),
			imageAlt: createImage('static/images/options-text-selected.png')
		},
		'brick-yellow': {
			image: createImage('static/images/brick-yellow.png')
		},
		'brick-orange': {
			image: createImage('static/images/brick-orange.png')
		},
		'brick-blue': {
			image: createImage('static/images/brick-blue.png')
		},
		'brick-green': {
			image: createImage('static/images/brick-green.png')
		}
	};

	var CharacterObj = {
		//============================================================// B A L L
		ball: function (data) {
			this.type = data.type;
		},

		//============================================================// B R I C K
		brick: function (data) {
			var _data = {
				brickType: data.brickType,
				isActive_p: true,
				position: {
					x: data.x,
					y: data.y
				}
			};
			var dimensions = {
				loaded_p: false,
				brickHeight: (data.canvasWidth/14)*.3,
				brickWidth: data.canvasWidth/15,
				ytop: undefined,
				ybottom: undefined,
				xleft: undefined,
				xright: undefined
			};

			this.getBrickType = function () {
				return _data.brickType;
			};
			this.getActiveState = function () {
				return _data.isActive_p;
			};

			this.update = function (ballData) {

			};

			this.render = function (context, canvasWidth, columnIndex, rowIndex) {
				if (characterImages['brick-' + _data.brickType].image.isReady_p) {
					context.save();

					if (!dimensions.loaded_p) {
						dimensions.loaded_p = true;
						dimensions.ytop = _data.position.y;
						dimensions.ybottom = _data.position.y + dimensions.brickHeight;
						dimensions.xleft = _data.position.x;
						dimensions.xright = _data.position.x + dimensions.brickWidth;
					}

					context.drawImage(characterImages['brick-' + _data.brickType].image, _data.position.x, _data.position.y, dimensions.brickWidth, dimensions.brickHeight);

					context.restore();
				}
			};
		},

		//============================================================// P A D D L E
		paddle: function (data) {
			this.type = data.type;
		},

		//============================================================// T E X T
		text: function (_data) {
			var validButtonNames = ['start', 'exit', 'credits', 'highscores', 'options', 'resume', 'btb'];
			var mousePosition = {
				x: undefined,
				y: undefined
			};

			var dimensions = {
				loaded_p: false
			};

			var position = {
				x: _data.x,
				y: _data.y
			};

			var isHover_p = false;

			this.imageText = _data.imageText;

			this.update = function (x, y) {
				mousePosition.x = x;
				mousePosition.y = y;
			};

			this.handleClick = function () {
				if (isHover_p) {
					return _data.imageText;
				}
				return false;
			};

			this.render = function (context) {
				if (characterImages[_data.imageText].image.isReady_p) {
					context.save();

					if (!dimensions.loaded_p) {
						dimensions.loaded_p = true;
						dimensions.ytop = position.y;
						dimensions.ybottom = position.y + characterImages[_data.imageText].image.height;
						dimensions.xleft = position.x - characterImages[_data.imageText].image.width/2;
						dimensions.xright = position.x + characterImages[_data.imageText].image.width/2;
					}

					if (mousePosition.x >= dimensions.xleft && 
						mousePosition.x <= dimensions.xright && 
						mousePosition.y >= dimensions.ytop && 
						mousePosition.y <= dimensions.ybottom &&
						_data.textType === 'button' &&
						characterImages[_data.imageText].imageAlt.isReady_p) {
						if (!isHover_p) {
							SOUNDBOARD.playSound({type: 'menuSelect', volume: 0.1, loop: false});
						}
						isHover_p = true;
						context.drawImage(characterImages[_data.imageText].imageAlt, position.x - characterImages[_data.imageText].image.width/2, position.y);
						// context.drawImage(characterImages[_data.imageText].imageAlt, position.x-(characterImages[_data.imageText].image.width*(function () {if(_data.alignCenter) return 0.5; return 0;}())), position.y);
					}
					else {
						isHover_p = false;
						context.drawImage(characterImages[_data.imageText].image, position.x-(characterImages[_data.imageText].image.width*(function () {if(_data.alignCenter) return 0.5; return 0;}())), position.y);
					}
					context.restore();
				}
			};
		}
	};

	this.createCharacter = function (data) {
		if (!data.type) {
			console.error("You need to specify a type/name for the newly created character" + (()=>{if(data.name) return ' named: ' + data.name; else return '!';}))
			return;
		}
		return new CharacterObj[data.type](data);
	};
};
