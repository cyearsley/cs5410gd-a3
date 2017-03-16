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
		},
		'paddle': {
			image: createImage('static/images/paddle.png')
		},
		'go': {
			image: createImage('static/images/go-text.png')
		},
		'three': {
			image: createImage('static/images/three-text.png')
		},
		'two': {
			image: createImage('static/images/two-text.png')
		},
		'one': {
			image: createImage('static/images/one-text.png')
		},
		'ball': {
			image: createImage('static/images/ball.png')
		}
	};

	var CharacterObj = {
		//============================================================// B A L L
		ball: function (data) {
			var _data = {
				position: {
					x: data.x-25,
					y: data.y
				},
				direction: {
					x: Math.floor(Math.random()*(5-(-5)+1)+(-5)),
					y: -5
				},
				blocksDestroyedCount: 0,
				speed: 2
			};
			var dimensions = {
				loaded_p: false,
				ballHeight: 50,
				ballWidth: 50,
				ytop: undefined,
				ybottom: undefined,
				xleft: undefined,
				xright: undefined
			};

			this.getDimensions = function () {
				return {position: _data.position, direction: _data.direction, dimensions: dimensions};
			};

			this.checkBrickCollision = function (brick) {
				var brickData = brick.getDimensions();
				var brickMid = {x: brickData.position.x + brickData.dimensions.brickWidth/2 ,y: brickData.position.y + brickData.dimensions.brickHeight/1};
				var ballMid = {x: _data.position.x + dimensions.ballWidth/2, y: _data.position.y + dimensions.ballHeight/2};
				var collision_p = false;

				if ((Math.abs(ballMid.x - brickMid.x)-15 <= dimensions.ballWidth/2 + brickData.dimensions.brickWidth/2) &&
					(brickData.position.y <= _data.position.y + dimensions.ballHeight && brickData.position.y + brickData.dimensions.brickHeight >= _data.position.y) &&
					brick.activeState()
				) {
					_data.direction.x = _data.direction.x*-1;
					collision_p = true;
				}
				else if ((Math.abs(ballMid.y - brickMid.y)+5 <= dimensions.ballHeight/2 + brickData.dimensions.brickHeight/2) && 
					(brickData.position.x <= _data.position.x + dimensions.ballWidth && brickData.position.x + brickData.dimensions.brickWidth >= _data.position.x) &&
					brick.activeState()
				) {
					_data.direction.y = _data.direction.y*-1;
					collision_p = true;
				}

				return collision_p;
			};

			this.checkPaddleCollision = function (paddle) {
				var paddleData = paddle.getDimensions();
				if (dimensions.xright >= paddleData.position.x && 
					dimensions.xleft <= paddleData.position.x + paddleData.dimensions.paddleWidth && 
					(dimensions.ybottom >= paddleData.position.y && dimensions.ybottom <= paddleData.position.y + paddleData.dimensions.paddleHeight)
				) {
					_data.direction.y = Math.abs(_data.direction.y)*-1;
					_data.direction.x = (((_data.position.x+dimensions.ballWidth/2)-(paddleData.position.x+paddleData.dimensions.paddleWidth/2))/(paddleData.dimensions.paddleWidth))*10*(_data.speed*0.5);
				} 
			};

			this.render = function (context, canvasWidth) {
				if (characterImages['ball'].image.isReady_p) {
					context.save();

					dimensions.ytop = _data.position.y;
					dimensions.ybottom = _data.position.y + dimensions.ballHeight;
					dimensions.xleft = _data.position.x;
					dimensions.xright = _data.position.x + dimensions.ballWidth;

					context.drawImage(characterImages['ball'].image, _data.position.x, _data.position.y, dimensions.ballWidth, dimensions.ballHeight);

					context.restore();
				}
			};

			this.update = function (ballData) {
				if (_data.position.y + dimensions.ballHeight - 5 >= ballData.canvasHeight || _data.position.y + 5 <= 0) {
					_data.direction.y = _data.direction.y*-1;
				}
				if (_data.position.x + dimensions.ballWidth - 5 >= ballData.canvasWidth || _data.position.x + 5 <= 0) {
					_data.direction.x = _data.direction.x*-1;
				}
				_data.position.x += (_data.direction.x)*_data.speed;
				_data.position.y += (_data.direction.y)*_data.speed;
			};
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

			// this.inCollisionList_p = false;
			this.getDimensions = function () {
				return {dimensions: dimensions, position: _data.position};
			};

			this.getBrickType = function () {
				return _data.brickType;
			};

			this.activeState = function (val) {
				if (typeof val !== 'undefined') {
					_data.isActive_p = val;
				}
				else {
					return _data.isActive_p;
				}
			};

			this.update = function (ballData) {

			};

			this.render = function (context, canvasWidth) {
				if (characterImages['brick-' + _data.brickType].image.isReady_p) {
					context.save();

					if (!dimensions.loaded_p) {
						dimensions.loaded_p = true;
						dimensions.ytop = _data.position.y;
						dimensions.ybottom = _data.position.y + dimensions.brickHeight;
						dimensions.xleft = _data.position.x;
						dimensions.xright = _data.position.x + dimensions.brickWidth;
					}

					if (_data.isActive_p) {
						context.drawImage(characterImages['brick-' + _data.brickType].image, _data.position.x, _data.position.y, dimensions.brickWidth, dimensions.brickHeight);
					}

					context.restore();
				}
			};
		},

		//============================================================// P A D D L E
		paddle: function (data) {
			var dimensions = {
				loaded_p: false,
				paddleHeight: (data.canvasWidth/14)*.3,
				paddleWidth: 175,
				ytop: undefined,
				ybottom: undefined,
				xleft: undefined,
				xright: undefined
			};
			var _data = {
				position: {
					x: data.x - (dimensions.paddleWidth/2),
					y: data.y
				}
			};

			this.getDimensions = function () {
				return {dimensions: dimensions, position: _data.position};
			};

			this.update = function (updateData) {
				if (_data.position.x + dimensions.paddleWidth < updateData.canvasWidth) {
					if (updateData.right) {
						_data.position.x += 20;
					}
				}
				if (_data.position.x > 0) {
					if (updateData.left) {
						_data.position.x -= 20;
					}
				}
			};

			this.render = function (context, canvasWidth) {
				if (characterImages['paddle'].image.isReady_p) {
					context.save();

					if (!dimensions.loaded_p) {
						dimensions.loaded_p = true;
						dimensions.ytop = _data.position.y;
						dimensions.ybottom = _data.position.y + dimensions.brickHeight;
						dimensions.xleft = _data.position.x;
						dimensions.xright = _data.position.x + dimensions.brickWidth;
					}

					context.drawImage(characterImages['paddle'].image, _data.position.x, _data.position.y, dimensions.paddleWidth, dimensions.paddleHeight);

					context.restore();
				}
			};
		},

		//============================================================// T E X T
		text: function (_data) {
			var validButtonNames = ['start', 'exit', 'credits', 'highscores', 'options', 'resume', 'btb', 'go', 'three', 'two', 'one'];
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
