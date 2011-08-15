// JSONP library for Politiwidgets API, requires jQuery

var Politiwidgets = Politiwidgets || {
  api_key: null,
  // default to production API
  base_url: "http://localhost:8000/api/v1/",
  jsonpCallback: null,
  getJSON: function(path, options) {

    if (Politiwidgets.jsonpCallback && !options.jsonpCallback)
      options.jsonpCallback = Politiwidgets.jsonpCallback;

    return $.ajax($.extend(true, options, {
      url: Politiwidgets.base_url + path,
      data: {
        format: 'jsonp',
        apikey: Politiwidgets.api_key
      },
      dataType: "jsonp"
    }));
  }

}
Politiwidgets.People = Politiwidgets.People || {

  get: function(id, sections, callback) {
    return Politiwidgets.getJSON("people/", {
      data: {
        q: id,
        sections: typeof sections == 'string' ? sections : sections.join(',')
      },
      success: function(data) {
        if (data && data.objects && data.objects.length)
          callback(data.objects[0]);
        else
          callback(null);
      },
      failure: function() {callback(null);}
    });
  }

};