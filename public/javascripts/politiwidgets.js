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
    if (month != date.getMonth() + 1)
      date.setTime(NaN);
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

function drumboneUrl(endpoint, method, options) {
  return endpoint + method + ".json" + (options ? "?" + queryString(options) : "");
}

function snapshotUrl(endpoint, id) {
  return endpoint + id + ".json";
}

// not currently doing any http encoding
function queryString(object) {
  var query = "";
  $.each(object, function(k, v) {
    query += k + "=" + v + "&";
  });
  return query;
}