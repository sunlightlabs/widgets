// JSONP library for Drumbone API, requires jQuery

var Challengers = Challengers || {
  api_key: null,
  // default to production API
  base_url: "http://localhost:8000/api/v1/",
  jsonpCallback: null,

  // takes a CRP ID, gets an entity id
  // takes in a callback which will get passed a
  getChallenger: function(votesmart_id, callback) {
    console.log('got call:', votesmart_id);
    return Challengers.getJSON("people/", {
      data: {votesmart_id: votesmart_id},
      success: function(data) {
        if (data && data.objects && data.objects.length)
          callback(data.objects[0]);
        else
          callback(null);
      },
      failure: function() {callback(null);}
    });
  },

  getJSON: function(path, options) {

    if (Challengers.jsonpCallback && !options.jsonpCallback)
      options.jsonpCallback = Challengers.jsonpCallback;

    return $.ajax($.extend(true, options, {
      url: Challengers.base_url + path,
      data: {
        format: 'jsonp',
        apikey: Challengers.api_key
      },
      dataType: "jsonp"
    }));
  }

};