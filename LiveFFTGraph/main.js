var $ = require('jquery');
var smoothie = require('smoothie');
var AudioPlayer = require('./lib/AudioPlayer.js');

var lines = [];
var numLines = 5;
for (var i = 0; i < numLines; i++) {
	lines.push(new smoothie.TimeSeries());
}

function createTimeline() {
	var chart = new smoothie.SmoothieChart();
	for (var i = 0; i < numLines; i++) {
		chart.addTimeSeries(lines[i], { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
	}
	chart.streamTo(document.getElementById("chart"), 500);
}

$(function() {
	var ctx = new AudioContext();

	var mainVol = ctx.createGain();
	mainVol.gain.value = 0.95;

	var analyser = ctx.createAnalyser();
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);


	analyser.connect(mainVol);
	mainVol.connect(ctx.destination);


	var audioPlayer = new AudioPlayer('btnPlay', ctx, analyser);

	setInterval(function() {
		analyser.getByteTimeDomainData(dataArray);

		for (var i = 0; i < numLines; i++) {
			lines[i].append(new Date().getTime(), 100*i + dataArray[i*100]);
		}
	}, 500);


	createTimeline();
});


