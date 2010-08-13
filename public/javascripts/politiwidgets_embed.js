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