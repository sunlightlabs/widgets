/* custom, frontend_hostname, widget_id, and bioguide_id all should be initialized before this file is included. */

// if the custom form decides that the widget is not creatable, it can trigger this to disable the embed fields
var disabledEmbed = false;

// if the custom form will do a network request, trigger this to avoid a race condition between that network request and the document.ready callback below
// make sure to call setupWidget at the end of that network request though

$(function() {
  setEventHandlers();
  updateFrame();
});


function setEventHandlers() {
  // widget size switcher
  $("li.switcherbtn a").click(function() {
    var new_size = $(this).attr('id');
    if (new_size != widget_size) {
      widget_size = new_size;
      updateFrame();
    }
    $("li.switcherbtn a").removeClass("active");
    $(this).addClass("active");
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
  
  $("#freezeExplainShow").toggle(function() {
    $("#freezeExplain").show(); 
    $("#freezeExplainShow").html("hide");
    return false;
  }, function() {
    $("#freezeExplain").hide(); 
    $("#freezeExplainShow").html("more");
    return false;
  });
  
  // embed code field
  $("#grabCode").click(function() {$(this).select()});
  
  
  // legislator switcher
  var originalSwitcher = "Enter lawmaker's last name";
  $("#changeLawmaker").val(originalSwitcher);
  $("#changeLawmaker").focus(function() {
    if ($(this).val() == originalSwitcher)
      $(this).val("");
  }).blur(function() {
    if ($(this).val() == "")
      $(this).val(originalSwitcher);
  });
  
  var baseUrl = window.location.href.replace(window.location.search, "");
  $("div.changeResults li").live("click", function() {
    window.location = baseUrl + "?bioguide_id=" + this.id;
  });
}

function disableEmbed() {
  $("#grabCode").val("");
  $("#freeze").attr("disabled", "disabled");
}

function updateFrame() {
  var iframe_url = "http://" + frontend_hostname + "/widgets/" + widget_id + "/embed?bioguide_id=" + bioguide_id + "&size=" + widget_size + "&" + queryString(custom);
  
  if (snapshot_id)
    iframe_url += "&snapshot_id=" + snapshot_id;
  
  if (geolocate)
    iframe_url += "&geolocate=" + geolocate;
  
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