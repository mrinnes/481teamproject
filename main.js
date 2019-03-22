/* Function that toggles visibility of sidebar */
function toggleSidebar() {
	$('#sidebar').toggleClass('hide');
}

/* Function that loads html document (in pages folder) given as argument to main content area. */
function loadPage(page) {
	/* use jquery till backend functionality is available */
	$("#main-content-area").empty();
	var $element = $("\<iframe src=\"pages/" + page + "\" frameborder=\"0\" allowfullscreen></iframe>");
	$("#main-content-area").append($element);
}

/* Function that logs user in */
function login() {
	console.log('hi');
	$('.modal-overlay').fadeToggle();
}