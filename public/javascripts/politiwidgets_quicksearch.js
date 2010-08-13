var last_search;
    
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

function legislatorName(legislator) {
  var first_name = legislator.nickname ? legislator.nickname : legislator.firstname;
  var suffix = legislator.name_suffix ? " " + legislator.name_suffix : "";
  return legislator.title + ". " + first_name + " " + legislator.lastname + suffix;
}