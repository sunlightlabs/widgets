// JSONP library for Sunlight Congress API, requires jQuery

var Sunlight = {
  api_key: null,
  base_url: "http://services.sunlightlabs.com/api/",
  

  allForLatLong: function(latitude, longitude, callback) {
    return Sunlight.getJSON("legislators.allForLatLong", {
      data: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(data) {
        if (data && data.response && data.response.legislators && data.response.legislators.length > 0)
          callback(data.response.legislators);
        else
          callback(null);
      }
    });
  },

  getJSON: function(path, options) {
    return $.ajax($.extend(true, options, {
      url: Sunlight.base_url + path,
      data: {apikey: Sunlight.api_key},
      dataType: "jsonp",
      jsonp: "jsonp"
    }));
  }
  
};