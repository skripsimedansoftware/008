$(document).on('click', '#fetch_data', (function(e) {
	e.preventDefault();
	$.get('/fetch').then(() => window.location.reload());
}));