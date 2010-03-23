$(document).ready(function() {
      var chart1 = new Highcharts.Chart({
         chart: {
            renderTo: 'chart-container-1',
            defaultSeriesType: 'bar',
            /*width: 425,//lg size
            height: 150,//lg size
            margin: [0, 20, 20, 85]*/
            
			width: 307,//med size
            height: 124,//med size
            margin: [10, 20, 10, 85]
            
            /*width: 160,//sm size
            height: 100,//sm size
            margin: [10, 20, 15, 20]*/
         },
         title: {
            text: "sdfsaf",
            style: {
              display: 'none',
              position: 'absolute',
              left: '0',
              top: '0'
            }
         },
         xAxis: {
            categories: ['Introduced', 'Passed House', 'Passed Senate', 'Enacted'] //med and lg size
            /*categories: ['1', '2', '3', '4']*/ //sm size
         },
         yAxis: {
            title: null,
            gridLineWidth: 0,
            labels: {
            	enabled: false
            }
         },

		colors: [
                '#0C6A6F',
                '#0AA6AE'
             ],
             
		 credits: { enabled: false },
         
         plotOptions: {
		    bar: {
		       /*groupPadding: .05,*/ //med and lg sizes
         	   groupPadding: -.02, // sm size
         	   pointPadding: .2,
		       dataLabels: {
		          enabled: true,
		          color: 'auto',
		          y: 1
		       }
		    }
		 },
		 
		 tooltip: {
	     formatter: function() {
	        return '<b>'+ this.x +'</b><br/>'+
	            this.series.name +': '+ this.y +'';
	     	}
         }, 
             
         legend: { enabled: false },

		  series: [{
		  name: 'Lawmaker',
			  data: [5, 4, 2, 1]
			}, {
			  name: 'House',
			  data: [10, 8, 6, 4]
		}]
	});
});