/**
 * The main widget loading function. Makes use of several global variables set (by necessity) in
 * app/views/widgets/embed.html.  If a snapshot_id is set, it'll use that, otherwise, it'll use the
 * given Drumbone parameters to pull from the live site.
 */
 
function loadWidget(method, sections, options, callback) {
  var augmented = function(data) {
    if (data.error)
      setError("Error loading widget.<br/><br/>Error message: " + data.error.code + " - " + data.error.message);
    else
      callback(data);
    
    $("div#sources a.sourceText").toggle(
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
  return Math.floor(((standardYear(new Date()) + 1) / 2) - 894)
}

function currentCycle() {
  var year = standardYear(new Date());
  return (year % 2 == 0 ? year : year + 1);
}

// parses dates in the form of YYYY-MM-DD, across all browsers
// and ensures it will be midnight UTC, unlike Date's default parsing
function parseShortDate(dateString) {
  var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
      date = new Date(NaN), month,
      parts = isoExp.exec(dateString);

  if (parts) {
    month = +parts[2];
    date.setFullYear(parts[1], month - 1, parts[3]);
    if (month != date.getMonth() + 1) {
      date.setTime(NaN);
    }
  }
  return date;
}

// takes a date object and gets the year from it in a way that's okay with IE and the rest
// IE gives the full 4-digit year
// the rest give the number of years since 1900
function standardYear(date) {
  var year = date.getYear();
  if (year < 1000) year += 1900; // this code will stop working in the year 2900
  return year;
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
  return (zeroPrefix(date.getMonth() + 1)) + "/" + zeroPrefix(date.getDate()) + "/" + (zeroPrefix(standardYear(date)));
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

function partyFor(legislator) {
  var parties = {
    D: "Democrat",
    R: "Republican",
    I: "Independent",
    def: "Unknown"
  }
  return parties[legislator.party] || parties.def  ;
}

function fullName(legislator) {
  return (legislator.nickname || legislator.first_name) + " " + legislator.last_name;
}

function monthShort(number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][number] || "Unk";
}

function decimal_format(num, places) {
  if (Math.floor(num) == num)
    return num;
  else
    return Highcharts.numberFormat(num, places);
}

// turns Drumbone's type codes into GovTrack's
function govtrackType(type) {
  return {
    hr: "h",
    hres: "hr",
    hjres: "hj",
    hcres: "hc",
    s: "s",
    sres: "sr",
    sjres: "sj",
    scres: "sc"
  }[type] || "unknown";
}

function govtrackBillUrl(type, number, session) {
  return "http://www.govtrack.us/congress/bill.xpd?bill=" + govtrackType(type) + session + "-" + number;
}

function govtrackLegislatorUrl(govtrack_id) {
  return "http://www.govtrack.us/congress/person.xpd?id=" + govtrack_id;
}

//TODO: do proper http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v;
  });
  return query;
}

// stub to be overridden
function doneLoadingMap() {}