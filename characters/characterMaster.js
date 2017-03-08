var CharacterMaster = function () {

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
		textButton: function (_data) {
			var validButtonNames = ['start', 'exit', 'credits', 'highscores', 'options', 'resume'];
			var buttonDimensions = {
				'start': {
					width: 300,
					height: 75
				},
				'exit': {
					width: 685,
					height: 75
				},
				'credits': {
					width: 400,
					height: 75
				},
				'highscores': {
					width: 660,
					height: 75
				},
				'options': {
					width: 550,
					height: 75
				},
				'resume': {
					width: 385,
					height: 75				
				}
			};
			this.dimension = {
				center: {
					x: Math.floor(buttonDimensions[_data.buttonType].width/2),
					y: Math.floor(buttonDimensions[_data.buttonType].height/2)
				},
				width: buttonDimensions[_data.buttonType].width,
				height: buttonDimensions[_data.buttonType].height
			};
			this.position = $.extend({
				x: 0,
				y: 0
			}, {x:_data.x, y:_data.y});
			var _defaultImage = new Image();
			var _selectedImage = new Image();

			_data = $.extend({
				defaultImage: 'static/images/' + (() => {if(validButtonNames.indexOf(_data.buttonType) >= 0) return _data.buttonType + '-text.png'}),
				selectedImage: 'static/images/' + (() => {if(validButtonNames.indexOf(_data.buttonType) >= 0) return _data.buttonType + '-text-selected.png'}),
				type: _data.type
			}, _data);

			this.update = function () {
				
			};

			this.render = function (context) {
				
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
