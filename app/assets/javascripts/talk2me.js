
var last_image;

// var typing_timeout = undefined;
var showPreview = function($el){
  console.log('showing');
  $el.appendTo('.preview_left');
  $('.preview').removeClass('hidden');
};
var clearPreview = function(){
  console.log('clearing');
  $('.preview_left').html('');
  $('.preview').addClass('hidden');
};

var geoLocation = function($el){
  console.log('inside geolocation');
  $script = $('<script async defer> </script>');
  $script.attr('src',"https://maps.googleapis.com/maps/api/js?key=AIzaSyDQhiJp0Ee3xKve1KYOLfVY0kF9lHF1xrc&callback=initMap");
  return $script;
  // $script.appendTo($el);

};
function initMap() {
      if ($('#map').length === 0) {
        return;
      }
      $map = $('<div> </div>');
      $map.addClass('map');
      $map.attr('id','map');
      $map.appendTo('.preview_left');
      // Create a map object and specify the DOM element for display.
      var myLatLng;
      var lat;
      var lon;
      navigator.geolocation.getCurrentPosition(function(location) {
        lat = location.coords.latitude;
        lon = location.coords.longitude;
        myLatLng = {
           lat: lat,
           lng: lon
        };
        var map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          scrollwheel: false,
          zoom: 16
        });

        // Create a marker and set its position.
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          title: 'address'
        });
      });

      // console.log(myLatLng);

    }

var emptyMessageField = function(){
  setTimeout(function(){
    $('#message_content').val('');
  },10);
};
var userTyping = function(){
  $typing = $('<p> </p>');
  $typing.html('User is typing');
  $typing.appendTo('#typing');
};
var ajaxRequest = function(req_content){
  console.log('requesting ajax');
  $.ajax({
        url: '/add_image_as_message',
        method: 'POST',
        data: {content: req_content,
          category: 'image' ,
        group_id : window.location.pathname.split('/').pop()},
        dataType: "json"
      })
      .done(function(data){
        console.log('success',data);
        clearPreview();
      })
      .fail(function(data){
        console.log('fail',data);
        clearPreview();
      });
};
// to take video
var shootVideo = function(){
  gifshot.createGIF({
    keepCameraOn: false
  },
  function(obj) {
    // console.log(obj.image);
    if(!obj.error) {
      var image = obj.image;
      last_image = image;
        //gifshot.stopVideoStreaming();
        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        showPreview($animatedImage);
      }
    });
  };


var clickImage = function(){
  gifshot.takeSnapShot(function(obj) {
    // console.log(obj.image);
    if(!obj.error) {
        var image = obj.image;
        last_image = image;
        console.log('length of images',image.length);
        //gifshot.stopVideoStreaming();

        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        showPreview($animatedImage);

      }
    });

};
$(document).ready(function(){

  $('.messagesendbutton').on('click',function(){
    emptyMessageField();
  });

  $('.say_yes').on('click',function(){
    console.log('yes');
    //calling ajax request to save the message after preview
    ajaxRequest(last_image);

  });

  $('.say_no').on('click',function(){
    console.log('no');
    //calling ajax request to save the message after preview
    console.log('Discarded');
    clearPreview();
  });

  $('#search').autocomplete({
    serviceUrl: '/incremental_user_search',
    paramName: 'search_term',
    dataType: 'json',
    minChars: 2,
    onSelect: function(suggestion){
      $.ajax({
            url: '/incremental_user_add',
            method: 'GET',
            data: {search_term: suggestion.data,
            group_id : window.location.pathname.split('/').pop() },
            dataType: "json"
          })
          .done(function(data){
            console.log(data);
            $new_member = $('<li />');

            $new_member_name = $('<a />');
            $new_member_name.addClass('glyphicon glyphicon-pawn');
            $new_member_name.attr('href','/users/'+ data['id'] );
            $new_member_name.html(data['name']);

            $img = $('<img />');
            $img.attr('src', data['image']);
            $img.addClass('user_image');

            $new_member_image = $('<a />');
            $new_member_image.attr('href','/users/'+ data['id']);
            $new_member_image.html($img);

            $new_member_name.appendTo($new_member);
            $new_member_image.appendTo($new_member);

            $new_member.appendTo('.group_members_list');
          })
          .fail(function(data){
            alert('Unable to add user to the group. Try again after sometime');
            console.log('fail',data);
          });
    }
  });
  $('.activate_camera').on('click',function(){
    console.log('camera');
    clickImage();
  });

  $('.activate_video').on('click',function(){
    console.log('video');
    shootVideo();
  });

  // $('#message_content').on('keypress',function(){
  //   // cancelTimeout(typing_timeout);
  //   // typing_timeout = setTimeout(userNotTyping, 5000);
  //   // if(more than 5 seconds) {
  //   //   userTyping();
  //   // }
  //   console.log('Someone typing');
  //
  // });
  $('.glyphicon-map-marker').on('click',function(){
    console.log('location');
    showPreview(geoLocation($(this)));
  });

});
