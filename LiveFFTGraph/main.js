var $ = require('jquery');
var smoothie = require('smoothie');
var AudioPlayer = require('./lib/AudioPlayer.js');

var lines = [];
var numLines = 5;
for (var i = 0; i < numLines; i++) {
	lines.push(new smoothie.TimeSeries());
}

setInterval(function() {
	for (var i = 0; i < numLines; i++) {
		lines[i].append(new Date().getTime(), 1000*i + (Math.random() * 1000));
	}
}, 500);

function createTimeline() {
	var chart = new smoothie.SmoothieChart();
	for (var i = 0; i < numLines; i++) {
		chart.addTimeSeries(lines[i], { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
	}
	chart.streamTo(document.getElementById("chart"), 500);
}

$(function() {
	var audioPlayer = new AudioPlayer('btnPlay');
	createTimeline();
});


