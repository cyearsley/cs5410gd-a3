var characterMaster = function () {

	var characterObj = {
		ball: function (cData) {
			this.type = cData.type;
		},
		brick: function (cData) {
			this.type = cData.type;
		},
		paddle: function (cData) {
			this.type = cData.type;
		}
	};

	this.createCharacter = function (cData) {
		return new characterObj[type](cData);
	};
};
