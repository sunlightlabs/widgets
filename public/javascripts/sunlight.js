// JSONP library for Sunlight Congress API, requires jQuery

var Sunlight = {
  api_key: null,
  base_url: "http://services.sunlightlabs.com/api/",

  allForState: function(state, callback) {
    return Sunlight.getJSON("legislators.getList", {
      data: {state: state},
      success: function(data) {
        if (data && data.response && data.response.legislators && data.response.legislators.length > 0)
          callback(data.response.legislators);
        else
          callback(null);
      }
    });
  },

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

  getForDistrict: function(state, district, callback){
    return Sunlight.getJSON("legislators.get", {
      data: {
        state: state,
        district: district
      },
      success: function(data) {
        if (data && data.response && data.response.legislator)
          callback(data.response.legislator);
        else
          callback(null);
      }
    });
  },

  getJSON: function(method, options) {
    return $.ajax($.extend(true, options, {
      url: Sunlight.base_url + method,
      data: {apikey: Sunlight.api_key},
      dataType: "jsonp",
      jsonp: "jsonp"
    }));
  }

};