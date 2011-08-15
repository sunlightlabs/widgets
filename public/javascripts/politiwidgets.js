function idFor(legislator) {
  return legislator.bioguide_id ||
         legislator.votesmart_id ||
         legislator.crp_id ||
         legislator.govtrack_id ||
         legislator.transparencydata_id;
}

function profileImage(legislator_or_bioguide, size) {
  var bioguide, legislator;
  bioguide = (typeof(legislator_or_bioguide) == 'object') ?
    legislator_or_bioguide.bioguide_id :
    legislator_or_bioguide;
  legislator = (typeof(legislator_or_bioguide) == 'object') ?
    legislator_or_bioguide : false;
  if (!size) size = "100x125";
  if (bioguide)
    return "http://assets.sunlightfoundation.com/moc/" + size + "/" + bioguide + ".jpg";
  else if (legislator.bio && legislator.bio.photo)
    return legislator.bio.photo;
  else
    return "http://assets.sunlightfoundation.com/moc/default.png";
}

function influenceExplorerUrl(entity_name, entity_id, cycle) {
  var entity_slug = entity_name.replace(/[^a-zA-Z]/g, "-");
  return "http://influenceexplorer.com/organization/" + entity_slug + "/" + entity_id + "?cycle=" + cycle;
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
  }else{
    // fall back to normal dates; new api uses plain ol javascript date reprs
    date = new Date(dateString);
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

function politiwidgetsUrl(endpoint, method, options) {
  return endpoint + method + "/?format=json&" + (options ? queryString(options) : '');
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

;(function($){
  $(function(){
    $('img.pic\\@src, td>img[alt=headshot]').error(function(){
      $(this).attr('src', '//assets.sunlightfoundation.com/moc/default.png');
    });
  });
})(jQuery);