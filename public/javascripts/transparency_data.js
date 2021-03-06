// JSONP library for TransparencyData.com, requires jQuery

var TransparencyData = {
  api_key: null,
  base_url: "http://transparencydata.com/api/1.0",
  
  // needs to be kept up to date by hand
  currentCycle: 2010,

  // takes a CRP ID, gets an entity id
  // takes in a callback which will get passed a 
  getEntityId: function(bioguide_id, callback) { 
    return TransparencyData.getJSON("/entities/id_lookup.json", {
      data: {bioguide_id: bioguide_id},
      success: function(data) {
        if (data && data.length > 0 && data[0].id)
          callback(data[0].id);
        else
          callback(null);
      }
    });
  },

  // takes an entity id, gets top contributors
  topContributors: function(entity_id, cycle, callback) {
    return TransparencyData.getJSON("/aggregates/pol/" + entity_id + "/contributors.json", {
      data: {cycle: cycle},
      success: function(data) {
        if (data)
          callback(data);
        else
          callback(null);
      }
    });
  },
  
  pairwiseContributionInfo: function(recipient_id, contributor_id, cycle, callback) {
    return TransparencyData.getJSON("/aggregates/recipient/" + recipient_id + "/contributor/" + contributor_id + "/amount.json", {
      data: {cycle: cycle},
      success: function(data) {
        if (data && data.contributor_entity && data.recipient_entity)
          callback(data);
        else
          callback(null);
      }
    });
  },
  
  entitySearch: function(name, cycle, callback) {
    return TransparencyData.getJSON("/entities.json", {
      data: {
          cycle: cycle, 
          search: name
      },
      success: function(data) {
        if (data)
          callback(data);
        else
          callback(null);
      }
    });  
  },
  
  getJSON: function(path, options) {
    return $.ajax($.extend(true, options, {
      url: TransparencyData.base_url + path,
      data: {
        apikey: TransparencyData.api_key
      },
      dataType: "jsonp"
    }));
  }
  
};