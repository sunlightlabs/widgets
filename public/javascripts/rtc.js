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
      data: $.extend(true, options.data || {}, {apikey: RTC.api_key}),
      dataType: "jsonp"
    }));
  },
  // get the first result for an id. returns object or null
  get : function(klass, query, options, callback){
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    options = {
      data: $.extend({}, options, query),
      success: function(data) {
        if (data && data[klass] && data[klass].length){
          callback(data[klass][0]);
        }else
          callback(null);
      },
      failure: function() {callback(null);}
    };
    return RTC.getJSON(klass + '.json', options);
  },
  // get a collection for an id. returns array or null
  all: function(klass, query, options, callback){
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    options = {
      data: $.extend({}, options, query),
      success: function(data) {
        if (data && data[klass] && data[klass].length){
          callback(data[klass]);
        }else
          callback(null);
      },
      failure: function() {callback(null);}
    };
    return RTC.getJSON(klass + '.json', options);
  },
  // search on a query. returns array or null
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

  init: function() {
    this.defaults = {
      order: 'voted_at',
      sort: 'desc',
      sections: 'bill,vote_breakdown,voter_ids'
    };
    return this;
  },

  get: function(id, options, callback) {
    // this block gets repeated whenever there are defaults... womp womp.
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    return RTC.get('votes', {roll_id: id}, $.extend({}, RTC.Votes.defaults, options), callback);
  },

  search: function(q, options, callback) {
    return RTC.search('votes', q, $.extend({}, RTC.Votes.defaults, options), callback);
  },

  get_for_bill: function(id, options, callback) {
    // this block gets repeated whenever there are defaults...
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    return RTC.get('votes', {bill_id: id}, $.extend({}, RTC.Votes.defaults, options), callback);
  },

  all_for_bill: function(id, options, callback) {
    var options=options, callback=callback;
    if (typeof options == 'function') {
      callback = options;
      options = {};
    }
    return RTC.all('votes', {bill_id: id}, $.extend({}, RTC.Votes.defaults, options), callback);
  }

}.init();

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