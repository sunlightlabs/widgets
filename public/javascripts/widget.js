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