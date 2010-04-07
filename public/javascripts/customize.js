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
  
  $("#freeze").change(function() {
    if (this.checked)
      fetchSnapshot();
    else {
      snapshot_id = null;
      updateEmbedCode();
    }
  });
  
  $("#freezeExplainShow").click(function() {$("#freezeExplain").toggle(); return false;});
  
  // embed code field
  $("#grabCode").click(function() {$(this).select()});
  
});

/* Depends on frontend_hostname, id, and bioguide_id being set before this file is included. */
function updateFrame() {
  var iframe_url = "http://" + frontend_hostname + "/widgets/" + widget_id + "/embed?bioguide_id=" + bioguide_id + "&size=" + widget_size + "&" + queryString(custom);
  
  if (snapshot_id)
    iframe_url += "&snapshot_id=" + snapshot_id;
  
  $("#widgetConstruct iframe").attr("src", iframe_url)
    .attr("width", sizes[widget_size][0])
    .attr("height", sizes[widget_size][1]);
  
  updateEmbedCode();
}

function updateEmbedCode() {
  var embed_url = "http://" + frontend_hostname + "/embed?w=" + widget_id + "&bgd=" + bioguide_id + "&s=" + widget_size + "&" + queryString(custom);
  
  if (snapshot_id)
    embed_url += "&snapshot_id=" + snapshot_id;
  
  $('input#grabCode').attr('value', "<script type='text\/javascript' src='" + embed_url + "'><\/script>");
}

/** 
 * Similar to the loadWidgets function in widget.js, this fetches JSON from Drumbone and 
 * posts it to the app server-side, for storage into S3.
 *
 * Depends on the "snapshot" hash being filled in with method, sections, and options in the 
 * widget-specific form partial.
 */
function fetchSnapshot() {
  var data = {
    method: snapshot.method,
    sections: snapshot.sections.join(","),
    options: snapshot.options
  };
  
  $("#errorBox").html("").hide();
  $("#freezeBox").hide();
  $("#loadingBox").show();
  $("#grabCode").val("");
  
  return $.ajax({
    url: "/snapshot",
    data: data,
    dataType: "text",
    
    success: function(id) {
      $("#loadingBox").hide();
      $("#freezeBox").show();
      
      snapshot_id = id;
      updateEmbedCode();
    },
    
    error: function() {
      $("#freeze")[0].checked = false;
      $("#errorBox").html("Error freezing data. Please try again.").show();
      $("#loadingBox").hide();
      $("#freezeBox").show();
      
      snapshot_id = null;
      updateEmbedCode();
    }
  });
}

// not currently doing any http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v;
  });
  return query;
}