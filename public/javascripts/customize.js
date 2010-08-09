/* custom, frontend_hostname, widget_id, and bioguide_id all should be initialized before this file is included. */

var last_search;

// if the custom form decides that the widget is not creatable, it can trigger this to disable the embed fields
var disabledEmbed = false;

// if the custom form will do a network request, trigger this to avoid a race condition between that network request and the document.ready callback below
// make sure to call setupWidget at the end of that network request though
var manualUpdate = false;

$(function() {
  setEventHandlers();
  
  if (!manualUpdate)
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
  
  $("#changeLawmaker").keyup(function() {
    var search = $(this).val();
    if (this.zid) 
      clearTimeout(this.zid);
    
    if (last_search != search && search.length > 1) {
      this.zid = setTimeout(function() {
      
        searchLawmakers(search, function(legislators) {
          var html = "<div class=\"changeResults\">";
          
          if (legislators == null || legislators.length == 0)
            html += "<p>No legislators found by that last name.</p>";
          else {
            html += "<ul>";
            for (var i=0; i<legislators.length; i++)
              html += lawmakerResultHtml(legislators[i]);
            html += "</ul>";
          }
          
          html += "</div>";
          
          $("div#changeResults_wrapper").html(html).show();
        });
        
      }, 500);
        
      last_search = search;
    }
    
    else if (search == "") {
      last_search = "";
      $("div.changeResults").html("").hide();
    }
  });
}

function disableEmbed() {
  $("#grabCode").val("");
  $("#freeze").attr("disabled", "disabled");
}

function searchLawmakers(name, callback) {  
  $.ajax({
    url: "http://services.sunlightlabs.com/api/legislators.getList.json",
    data: {apikey: sunlight_api_key, lastname__istartswith: name},
    dataType: "jsonp",
    jsonp: "jsonp",
    success: function(data) {
      if (data.response && data.response.legislators)
        callback(data.response.legislators);
      else
        callback(null);
    }
  });
}

function lawmakerResultHtml(legislator) {
  legislator = legislator.legislator;
  var html = "<li class=\"lawmakerResult clear\" id=\"" + legislator.bioguide_id + "\">";
  html += "<img src=\"" + profileImage(legislator.bioguide_id, "40x50") + "\"/>";
  html += "<span>" + legislatorName(legislator) + "</span>";
  html += "</li>";
  return html;
}

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
    query += k + "=" + v + "&";
  });
  return query;
}

// automatically slides the session up based on the year
function currentSession() {
  return Math.floor(((standardYear(new Date()) + 1) / 2) - 894)
}

// takes a date object and gets the year from it in a way that's okay with IE and the rest
// IE gives the full 4-digit year
// the rest give the number of years since 1900
function standardYear(date) {
  var year = date.getYear();
  if (year < 1000) year += 1900; // this code will stop working in the year 2900
  return year;
}

function profileImage(bioguide, size) {
  if (!size) size = "100x125";
  return "http://assets.sunlightfoundation.com/moc/" + size + "/" + bioguide + ".jpg";
}

function legislatorName(legislator) {
  var first_name = legislator.nickname ? legislator.nickname : legislator.firstname;
  var suffix = legislator.name_suffix ? " " + legislator.name_suffix : "";
  return legislator.title + ". " + first_name + " " + legislator.lastname + suffix;
}

// returns a string suitable for feeding into JQuery's $.getJSON function (using a ? for the JSONP callback)
function drumboneUrl(endpoint, api_key, method, sections, options) {
  return endpoint + method + ".json?apikey=" + api_key + "&sections=" + sections.join(",") + "&" + queryString(options) + "&callback=?";
}