var $ = require('jquery'),
	toastr = require('toastr'),
	_ = require('underscore');

function AudioPlayer(audioContext, destination) {
	console.log('Initializing audio');
	toastr.info('Initializing audio');
	this.ctx = audioContext;
	this.destination = destination;
}

_.extend(AudioPlayer.prototype, {
	loadFile: function (file) {
        var self = this;
        var reader = new FileReader();

        toastr.info('loading file');
        reader.onload = (function(loadedFile) {
            return function(e) {
                self.ctx.decodeAudioData(e.target.result, function(buffer) {
                    self.buffer = buffer;
                    self.playBuffer();
                });
            };
        })(file);

        // Read the file
        reader.readAsArrayBuffer(file);
	},
	playBuffer: function () {
		toastr.info('Play it');
		var src = this.ctx.createBufferSource();
        console.log('!!! buffer: ' + JSON.stringify(this.buffer));
		src.buffer = this.buffer;
		src.playbackRate = 1.0;
		src.connect(this.destination);
		src.start(0);
		toastr.info('Complete!!!');
	}
});


module.exports = AudioPlayer;