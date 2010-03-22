var sizes = {sm: [160, 300], med: [300, 250], lg: [400,300]};

var widget_size = 'lg';
var widget_color = '1F83B5';

$(document).ready(function() {

  // widget size switcher
  $("li.switcherbtn a").click(function() {
    var new_size = $(this).attr('id');
    if (new_size != widget_size) {
      widget_size = new_size;
      updateFrame();
    }
    return false;
  });
  
  // color picker
  $("#updateColor").click(function() {
    var picked = $("#primaryColorText").val();
    if (picked && picked.replace)
      widget_color = picked.replace("#", "");
    
    updateFrame();
  });
  $("#primaryColorText").val("#" + widget_color);
  $.farbtastic("#primaryColor", "#primaryColorText").setColor("#" + widget_color);
  
  // embed code field
  $("button#generate").click(updateEmbedCode);
  $("#grabCode").click(function() {$(this).select()});
  
  
  // pre-populate
  updateFrame();
  updateEmbedCode();
});

/* Depends on frontend_hostname, id, and bioguide_id being set before this file is included. */
function updateFrame() {
  var iframe_url = "http://" + frontend_hostname + "/widgets/" + widget_id + "/embed?bioguide_id=" + bioguide_id;
  
  iframe_url += "&size=" + widget_size + "&color=" + widget_color;
  
  $("#widgetConstruct iframe").attr("src", iframe_url)
    .attr("width", sizes[widget_size][0])
    .attr("height", sizes[widget_size][1]);
}

function updateEmbedCode() {
  var embed_url = "http://" + frontend_hostname + "/embed?w=" + widget_id + "&bgd=" + bioguide_id + "&s=" + widget_size + "&color=" + widget_color;
    
  $('input#grabCode').attr('value', "<script type='text\/javascript' src='" + embed_url + "'><\/script>");
}