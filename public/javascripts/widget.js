/**
 * The main widget loading function. Makes use of several global variables set (by necessity) in
 * app/views/widgets/embed.html.  If a snapshot_id is set, it'll use that, otherwise, it'll use the
 * given Drumbone parameters to pull from the live site.
 */
 
function loadWidget(method, sections, options, callback) {
  var augmented = function(data) {
    // if you wanted to check the data for an "error" key, here is where you would do it
    if (data.error)
      setError("Error loading widget.<br/><br/>Error message: " + data.error.code + " - " + data.error.message);
    else
      callback(data);
    
    $("div#sources a").toggle(
      function(){
        $(this).addClass("active");
        $("div#sourceArea").slideDown("slow");
        $(".highcharts-container").hide();
        return false;
      },
      function() {
        $(this).removeClass("active");
        $("div#sourceArea").slideUp("slow", function() {
          $(".highcharts-container").show();        
        });
        
        return false;
      } 
    );
  
    $("body").show();
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


// helper functions (that do not make use of global variables)

function setAlert(message) {
  $("#pageMain").hide();
  $("#widgetAlert p").html(message);
  $("#widgetAlert").show();
  $("body").show();
}

function setError(message) {
  $("#widgetAlert").addClass("error");
  setAlert(message);
}

function profileImage(bioguide, size) {
  if (!size) size = "100x125";
  return "http://assets.sunlightfoundation.com/moc/" + size + "/" + bioguide + ".jpg";
}

// automatically slides the session up based on the year
function currentSession() {
  return Math.floor(((new Date().getYear() + 1900 + 1) / 2) - 894)
}

function currentCycle() {
  var year = new Date().getYear() + 1900;
  return (year % 2 == 0 ? year : year + 1);
}

// returns a string suitable for feeding into JQuery's $.getJSON function (using a ? for the JSONP callback)
function drumboneUrl(endpoint, method) {
  return endpoint + method + ".json";
}

function snapshotUrl(endpoint, id) {
  return endpoint + id + ".json";
}

function updateSource(date, text) {
  $("#last_updated").html(formatDate(new Date(date)));
  $("#sourceContent").html(text);
}

function formatDate(date) {
  return (zeroPrefix(date.getMonth() + 1)) + "/" + zeroPrefix(date.getDate()) + "/" + (zeroPrefix(date.getYear() + 1900));
}

function zeroPrefix(n) {
  return ((n < 10) ? "0" : "") + n;
}

function shortTitle(legislator) {
  var titles = {
    Sen: "Sen.",
    Rep: "Rep.",
    Del: "Del.",
    def: "Hon."
  }
  return titles[legislator.title] || titles.def;
}

function longTitle(legislator) {
  var titles = {
    Sen: "Senator",
    Rep: "Representative",
    Del: "Delegate",
    def: "Honorable"
  }
  return titles[legislator.title] || titles.def;
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