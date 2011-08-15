// JSONP library for Realtime Congress API, requires jQuery

var RTC = RTC || {
  api_key: null,
  base_url: "http://api.realtimecongress.org/api/v1/",
  jsonpCallback: null,
  getJSON: function(path, options) {

    if (RTC.jsonpCallback && !options.jsonpCallback)
      options.jsonpCallback = RTC.jsonpCallback;

    return $.ajax($.extend({}, options, {
      url: RTC.base_url + path,
      data: $.extend(true, options.data || {}, {api_key: RTC.api_key}),
      dataType: "jsonp"
    }));
  },
  get : function(klass, query, options, callback){
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    options = {
      data: $.extend({}, options, query),
      success: function(data) {
        if (data && data[klass] && data[klass].length) {
          if (data[klass].length == 1)
            callback(data[klass][0]);
          else
            callback(data[klass]);
        } else
          callback(null);
      },
      failure: function() {callback(null);}
    };
    return RTC.getJSON(klass + '.json', options);
  },
  search: function(klass, q, options, callback){
    var id_name, options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    options = {
      data: options,
      success: function(data) {
        if (data && data[klass] && data[klass].length)
          callback(data[klass]);
        else
          callback(null);
      },
      failure: function() {callback(null);}
    }
    return RTC.getJSON(klass + '.json', options);
  }
}

RTC.Bills = RTC.Bills || {

  get: function(id, options, callback) {
    return RTC.get('bills', {bill_id: id}, options, callback);
  },

  search: function(q, options, callback) {
    return RTC.search('bills', q, options, callback);
  }
};

RTC.Votes = RTC.Votes || {

  get: function(id, options, callback) {
    return RTC.get('votes', {bill_id: id}, options, callback);
  },

  search: function(q, options, callback) {
    return RTC.search('votes', q, options, callback);
  }

};

RTC.Amendments = RTC.Amendments || {

  get: function(id, options, callback) {
    return RTC.get('amendments', {amendment_id: id}, options, callback);
  },

  search: function(q, options, callback) {
    return RTC.search('amendments', q, options, callback);
  }

};

RTC.Videos = RTC.Videos || {

  get: function(id, options, callback) {
    return RTC.get('videos', {video_id: id}, options, callback);
  },

  search: function(q, options, callback) {
    return RTC.search('videos', q, options, callback);
  }

};

RTC.FloorUpdates = RTC.FloorUpdates || {

  get_for_day: function(day, options, callback) {
    return RTC.get('floor_updates', {legislative_day: day})
  },

  search: function(q, options, callback) {
    return RTC.search('floor_updates', q, options, callback);
  }

};

RTC.CommitteeHearings = RTC.CommitteeHearings || {

  get_for_day: function(day, options, callback) {
    return RTC.get('committee_hearings', {legislative_day: day})
  },

  search: function(q, options, callback) {
    return RTC.search('committee_hearings', q, options, callback);
  }

};

RTC.Documents = RTC.Documents || {

  get_for_day: function(day, options, callback) {
    return RTC.get('documents', {for_date: day})
  }

};