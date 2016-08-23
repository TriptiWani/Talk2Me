
// var typing_timeout = undefined;
var geoLocation = function(){
  function initMap() {
        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          scrollwheel: false,
          zoom: 16
        });

        // Create a marker and set its position.
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          title: 'addres'
        });
      }

};
function initMap() {
      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 16
      });

      // Create a marker and set its position.
      var marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        title: 'addres'
      });
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
// to take video
var shootVideo = function(){
  gifshot.createGIF({
    keepCameraOn: false
  },
  function(obj) {
    // console.log(obj.image);
    if(!obj.error) {
        var image = obj.image;
        //gifshot.stopVideoStreaming();
        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        $.ajax({
              url: '/add_image_as_message',
              method: 'POST',
              data: {content: image,
                category: 'gif' ,
              group_id : window.location.pathname.split('/').pop()},
              dataType: "json"
            })
            .done(function(data){
              console.log('success',data);
            })
            .fail(function(data){
              console.log('fail',data);
            });
      }
    });
  };

var clickImage = function(){
  gifshot.takeSnapShot(function(obj) {
    // console.log(obj.image);
    if(!obj.error) {
        var image = obj.image;

        //gifshot.stopVideoStreaming();

        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        $.ajax({
              url: '/add_image_as_message',
              method: 'POST',
              data: {content: image,
                category: 'image' ,
              group_id : window.location.pathname.split('/').pop()},
              dataType: "json"
            })
            .done(function(data){
              console.log('success',data);
            })
            .fail(function(data){
              console.log('fail',data);
            });
      }
    });

};
$(document).ready(function(){
  $('.messagesendbutton').on('click',function(){
    emptyMessageField();
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
    geoLocation();
  });

});
