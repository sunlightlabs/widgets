$(function() {
  var original = "Search a lawmaker or state";
  $('#searchField').focus(function() {
    if ($(this).val() == original)
      $(this).val('');
  });
});