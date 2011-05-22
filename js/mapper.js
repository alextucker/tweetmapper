$(function(){
   
   // Global vars
   var global = {
      tweet_marker: null,
      start_lat: 43.648715,
      start_lng: -79.396391,
      start_zoom: 11,
      search_url: 'http://search.twitter.com/search.json?',
      tweet_q: [],
   }

   // Get starting map div height and width and start initial map 
   $('#map').GoogleMapV3({height:$('#map').height(), width: $('#map').width(), lat: global.start_lat, lng: global.start_lng, zoom: global.start_zoom});

   // If map div size changes, change the map size
   $(window).resize(function(){
      //TODO: Fix this
      //$('#map').GoogleMapV3({height:$('#map').height(), width: $('#map').width(),});
   });

   $('#get_tweets').hide();
   
      
   $('#map').GoogleMapV3('addListener', {action: function(event){
      $('#get_tweets').hide(); 
     if (global.tweet_marker) {
      global.tweet_marker.setMap(null);
     }
     console.log('Map Clicked', event);
     global.tweet_marker = $('#map').GoogleMapV3('addMarker', {lat: event.latLng.Ja, lng: event.latLng.Ka});
     getTweets({lat: event.latLng.Ja, lng: event.latLng.Ka});
     global.start_lat = event.latLng.Ja;
     global.start_lng = event.latLng.Ka;
   }});

   $('#get_tweets').live('click', function() {
      getTweets({lat:global.start_lat, lng: global.start_lng});
      $('#get_tweets').hide();
   });

   function getTweets(options) {
      var defaults = {
	 lat: global.start_lat,
	 lng: global.start_lng,
	 radius: 10,
      }

      var options = $.extend(defaults, options);
      var loc = 'geocode=' + options.lat + ',' + options.lng + ',' + options.radius + 'mi'; 
      
      $.ajax({
	 type: 'GET',
	 dataType: 'jsonp',
	 url: global.search_url + loc + '&callback=?',
	 success: function(result) {
	    if (result.results) {
	       displayTweets(result.results);
	    }
	 },
      });
   }

   function displayTweets(tweets, options) {
      $('#tweet_stream').html('');
      var defOptions = {
	 speed: 5000,
      }
      var options = $.extend(defOptions, options);
      var count = 0;

      $.each(tweets, function(i, tweet) {
	 newTweetBox(tweet.profile_image_url, tweet.from_user, tweet.text);
	 count++;
      });

      showTweet();
   }

   function newTweetBox(picture, from, text) {
      console.log(from);
      
      var next = '<li><div id="picture"><img src="' + picture + '" /><p>'+from+'<p></div><div id="tweet">'+text+'</div></li>';
      $('#tweet_stream').append(next);
   }

   function showTweet() {
      $('#tweet_stream > li:hidden:last').slideDown('slow', function() {
	 setTimeout(showTweet, 3000);
      });
   }

   
   
})();
