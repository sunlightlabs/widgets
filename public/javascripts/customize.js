$(function() {
  updateFrame();

  // widget size switcher
  $("li.switcherbtn a").click(function() {
    var new_size = $(this).attr('id');
    if (new_size != widget_size) {
      widget_size = new_size;
      updateFrame();
    }
    return false;
  });
  
  // embed code field
  $("#grabCode").click(function() {$(this).select()});
  
});

/* Depends on frontend_hostname, id, and bioguide_id being set before this file is included. */
function updateFrame() {
  var iframe_url = "http://" + frontend_hostname + "/widgets/" + widget_id + "/embed?bioguide_id=" + bioguide_id + "&size=" + widget_size + "&" + queryString(custom);
  
  $("#widgetConstruct iframe").attr("src", iframe_url)
    .attr("width", sizes[widget_size][0])
    .attr("height", sizes[widget_size][1]);
  
  updateEmbedCode();
}

function updateEmbedCode() {
  var embed_url = "http://" + frontend_hostname + "/embed?w=" + widget_id + "&bgd=" + bioguide_id + "&s=" + widget_size + "&" + queryString(custom);
  
  $('input#grabCode').attr('value', "<script type='text\/javascript' src='" + embed_url + "'><\/script>");
}

/** 
 * Similar to the loadWidgets function in widget.js, this fetches JSON from Drumbone and 
 * posts it to the app server-side, for storage into S3.
 */
function fetchSnapshot(method, sections, options) {
  data = {};
  data.apikey = sunlight_api_key;
  data.sections = sections.join(",");
  $.extend(data, options); 
}

// drumbone URL
function drumboneUrl(endpoint, method) {
  return endpoint + "/" + method + ".json";
}

// not currently doing any http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v;
  });
  return query;
}