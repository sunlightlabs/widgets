var last_search;
    
$("#changeLawmaker").keyup(function() {
  var search = $(this).val();
  if (this.zid) 
    clearTimeout(this.zid);
  
  if (last_search != search && search.length > 1) {
    this.zid = setTimeout(function() {
    
      searchLawmakers(search, function(legislators) {
        var html = "<div class=\"changeResults\">";
        
        if (legislators == null || legislators.length == 0)
          html += "<p>No legislators found by that last name.</p>";
        else {
          html += "<ul>";
          for (var i=0; i<legislators.length; i++)
            html += lawmakerResultHtml(legislators[i]);
          html += "</ul>";
        }
        
        html += "</div>";
        
        $("div#changeResults_wrapper").html(html).show();
      });
      
    }, 500);
      
    last_search = search;
  }
  
  else if (search == "") {
    last_search = "";
    $("div.changeResults").html("").hide();
  }
});