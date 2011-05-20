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

   $('#tweet_stream').hide();
   $('#get_tweets').hide();
   
      
   $('#map').GoogleMapV3('addListener', {action: function(event){
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
      var defOptions = {
	 speed: 5000,
      }
      var options = $.extend(defOptions, options);
      var count = 0;

      $.each(tweets, function(i, tweet) {
	 global.tweet_q.push(setTimeout(function(){
	    newTweetBox(tweet.profile_image_url, tweet.from_user, tweet.text);
	 }, 1000+(count*5000)));
	 count++;
      });
      setTimeout(function(){
	 $('#get_tweets').fadeIn('slow');
      }, 1000+(count*5000));
   }

   function newTweetBox(picture, from, text) {
      console.log(from);
      $('#tweet_stream').slideUp();
      setTimeout(function() {
	 global.tweet_q.pop();
	 $('#picture img').attr('src', picture);
	 $('#picture p').html(from);
	 $('#tweet').html(text);
      }, 400);
      $('#tweet_stream').slideDown();
   }

   function clearQ() {
      for (var t in global.tweet_q) {
	 console.log(t);
	 clearTimeout(t);
      }
      global.tweet_q = [];
   }

   $('#cancel').click(function(){
      clearQ();   
   });



})();
