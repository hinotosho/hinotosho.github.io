console.log('hello!');
$(document).ready(function() {
	$('#feedback').on('submit', function(event) {
		event.preventDefault();
		console.log('hello!');
		var thankMsg = $('#feedback').parent().find('#thank');
		if ($(thankMsg).data('state') === 'hidden') {
			$(thankMsg).data('state', 'show');
			$(thankMsg).animate({'display': 'inline-block'}, 600);
			return;
		}
	});
});