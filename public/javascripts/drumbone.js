// JSONP library for Drumbone API, requires jQuery

var Drumbone = {
  api_key: null,
  // default to production API
  base_url: "http://drumbone.services.sunlightlabs.com/v1/api/",
  jsonpCallback: null,

  // takes a CRP ID, gets an entity id
  // takes in a callback which will get passed a 
  getLegislator: function(bioguide_id, sections, callback) { 
    return Drumbone.getJSON("legislator.json", sections, {
      data: {bioguide_id: bioguide_id},
      success: function(data) {
        if (data && data.legislator)
          callback(data.legislator);
        else
          callback(null);
      },
      failure: function() {callback(null);}
    });
  },
  
  getBill: function(bill_id, sections, callback) { 
    return Drumbone.getJSON("bill.json", sections, {
      data: {bill_id: bill_id},
      success: function(data) {
        if (data && data.bill)
          callback(data.bill);
        else
          callback(null);
      },
      failure: function() {callback(null);}
    });
  },

  getJSON: function(path, sections, options) {
    if (typeof(sections) == "object")
      sections = sections.join(",");
    
    if (Drumbone.jsonpCallback && !options.jsonpCallback)
      options.jsonpCallback = Drumbone.jsonpCallback;
    
    return $.ajax($.extend(true, options, {
      url: Drumbone.base_url + path,
      data: {
        sections: sections,
        apikey: Drumbone.api_key
      },
      dataType: "jsonp"
    }));
  }
  
};