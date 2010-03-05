$().ready(function() {	

	$('tr.lawMaker').mouseenter(function() {
	   $(this).addClass('hover');
	}).mouseleave(function() {
	   $(this).removeClass('hover');
	}).click(function() {
	   var url = $(this).find('a').attr('href');
	   if (url) {
	       window.location = url;
	   }
	});
	
});