var $ = require('jquery'),
	toastr = require('toastr'),
	_ = require('underscore');

function AudioPlayer(playButtonID, audioContext, destination) {
	this.playButtonID = playButtonID;
	console.log('Initializing audio');
	toastr.info('Initializing audio');
	this.ctx = audioContext;
	this.destination = destination;
	this.wireEvents();
}

_.extend(AudioPlayer.prototype, {
	wireEvents: function () {
		var self = this;
		$('#' + this.playButtonID).click(function(){
			console.log('loading');

			try {
				toastr.info('loading file');
				self.loadFile();
			} catch (ex){
				console.error('failed to load ' + ex);
				toastr.error('Load File Error: ' + ex.message);
			}
		});
	},
	loadFile: function () {
		var self = this;
		var req = new XMLHttpRequest();
		req.open("GET", "BumpinTheTeaParty.mp3", true);
		req.responseType = 'arraybuffer';
		req.onload = function() {
			self.ctx.decodeAudioData(req.response, function(buffer){
				toastr.info('decode audio: ' + buffer.length + ', ' + buffer.duration);
				self.buffer = buffer;
				self.playBuffer();
			});
		};
		req.send();
	},
	playBuffer: function () {
		toastr.info('Play it');
		var src = this.ctx.createBufferSource();
		src.buffer = this.buffer;
		src.playbackRate = 1.0;
		src.connect(this.destination);
		src.start(0);
		toastr.info('Complete!!!');
	}
});


module.exports = AudioPlayer;