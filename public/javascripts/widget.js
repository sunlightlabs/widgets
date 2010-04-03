/**
 * The main widget loading function. Makes use of several global variables set (by necessity) in
 * app/views/widgets/embed.html.  If a snapshot_id is set, it'll use that, otherwise, it'll use the
 * given Drumbone parameters to pull from the live site.
 */
 
function loadWidget(method, sections, options, callback) {
  var augmented = function(data) {
    // if you wanted to check the data for an "error" key, here is where you would do it
    callback(data); 
    $("body").css("display", "block");
  };
  
  
  var url;
  var data = {};
  if (snapshot_id)
    url = snapshotUrl(snapshot_directory, snapshot_id);
  else {
    url = drumboneUrl(data_endpoint, method);
    data.apikey = sunlight_api_key;
    data.sections = sections.join(",");
    $.extend(data, options); 
  }
  

  return $.ajax({
    url: url,
    data: data,
    dataType: "jsonp",
    jsonpCallback: "politiwidgetsCallback",
    success: augmented
  });
}


// helper fuctions (that do not make use of global variables)

function profileImage(bioguide) {
  return "http://assets.sunlightfoundation.com/moc/100x125/" + bioguide + ".jpg";
}

// returns a string suitable for feeding into JQuery's $.getJSON function (using a ? for the JSONP callback)
function drumboneUrl(endpoint, method) {
  return endpoint + method + ".json";
}

function snapshotUrl(endpoint, id) {
  return endpoint + id + ".json";
}

function decimal_format(num, places) {
  if (Math.floor(num) == num) {
    return num;
  } else {
    return Highcharts.numberFormat(num, places);
  }
}

// not currently doing any http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v;
  });
  return query;
}