/**
 * Functions used across all widgets
 */

function profileImage(bioguide) {
  return "http://assets.sunlightfoundation.com/moc/100x125/" + bioguide + ".jpg";
}

// returns a string suitable for feeding into JQuery's $.getJSON function (using a ? for the JSONP callback)
function drumboneUrl(method, sections, options) {
  return data_endpoint + "/" + method + ".json?apikey=" + sunlight_api_key + "&sections=" + sections.join(",") + "&" + queryString(options) + "&callback=?";
}

// not currently doing any http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v;
  });
  return query;
}

function loadWidget(url, callback) {
  var augmented = function(data) {
    // if you wanted to check the data for an "error" key, here is where you would do it
    
    callback(data); 
    $("body").css("display", "block");
  };
  
  return $.ajax({
    url: url, 
    dataType: "jsonp",
    success: augmented
  });
}