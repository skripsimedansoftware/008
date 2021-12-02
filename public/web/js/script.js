$(document).on('click', '#fetch_data', (function(e) {
	e.preventDefault();
	$.get('/fetch').then(() => window.location.reload());
}));

var socket = io(window.location.origin);
socket.on('connect', function() {
	$(document).on('click', '#make_train_data', (function(e) {
		e.preventDefault();
		socket.emit('make_train_data');
	}));

	$(document).on('click', '#make_sample_data', (function(e) {
		e.preventDefault();
		socket.emit('make_sample_data');
	}));

	socket.on('make_train_data', () => {
		alert('train data completed');
	});
});