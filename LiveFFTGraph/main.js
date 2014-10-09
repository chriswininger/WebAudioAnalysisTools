var $ = require('jquery');
var smoothie = require('smoothie');
var AudioPlayer = require('./lib/AudioPlayer.js');

var lines = [];

var FREQ_DISPLAY_INTERVAL = 100,
    LINE_OFFSET = 0,
    numLines = Math.floor(1024/FREQ_DISPLAY_INTERVAL);

var colors = ["0, 255, 0", ];

for (var i = 0; i < numLines; i++) {
    colors.push(
        Math.floor(Math.random() * 256) + ',' +
        Math.floor(Math.random() * 256) + ',' +
        Math.floor(Math.random() * 256)
    );
}

for (var i = 0; i < numLines; i++) {
	lines.push(new smoothie.TimeSeries());
}

function createTimeline() {
	var chart = new smoothie.SmoothieChart();
	for (var i = 0; i < numLines; i++) {
		chart.addTimeSeries(lines[i], { strokeStyle: 'rgba(' + colors[i] + ', 1)', fillStyle: 'rgba(' + colors[i] + ', 0.0)', lineWidth: 2 });
	}
	chart.streamTo(document.getElementById("chart"), 500);
}

var ctx,
    audioPlayer;

$(function() {
	ctx = new AudioContext();

	var mainVol = ctx.createGain();
	mainVol.gain.value = 0.95;

	var analyser = ctx.createAnalyser();
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	analyser.getByteTimeDomainData(dataArray);


	analyser.connect(mainVol);
	mainVol.connect(ctx.destination);


	audioPlayer = new AudioPlayer(ctx, analyser);

	setInterval(function() {
		analyser.getByteTimeDomainData(dataArray);

		for (var i = 0; i < numLines; i++) {
			lines[i].append(new Date().getTime(), LINE_OFFSET*i + dataArray[i*FREQ_DISPLAY_INTERVAL]);
		}
	}, 500);


	createTimeline();

    $('#inputFile').change(onChangeFile);
});


function onChangeFile () {
    audioPlayer.loadFile(this.files[0]);
}

