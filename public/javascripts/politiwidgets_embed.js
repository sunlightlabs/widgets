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
  if (snapshot_id)
    url = snapshotUrl(snapshot_directory, snapshot_id);
  else {
    url = drumboneUrl(data_endpoint, method, $.extend(options, {
      apikey: sunlight_api_key,
      sections: sections.join(",")
    }));
  }
  

  return $.ajax({
    url: url,
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

function updateSource(date, text) {
  $("#last_updated").html(formatSourceDate(new Date(date)));
  $("#sourceContent").html(text);
}

function formatSourceDate(date) {
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

// stub to be overridden
function doneLoadingMap() {}