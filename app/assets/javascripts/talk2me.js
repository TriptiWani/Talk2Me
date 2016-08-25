
var last_image;
var displayLocation = function(coord,id) {
  var myLatLng= JSON.parse(coord);
  var map = new google.maps.Map(document.getElementById('map-'+id), {
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
};
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


function initMap() {
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
    last_image = myLatLng;
    console.log('location from iinside',last_image);
    $('#message_content').val('NLOC'+JSON.stringify(last_image));
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

}

var emptyMessageField = function(){
  setTimeout(function(){
    $('#message_content').val('');
    $('#message_content_display').val('');
  },10);
};

var userTyping = function(){
  // $typing = $('<p> </p>');
  // $typing.html('User is typing');
  // $typing.appendTo('#typing');
  var typingTimer;
  var doneTypingInterval = 10;
  var finaldoneTypingInterval = 500;

  var oldData = $("p.typing").html();
  $('#message_content_display').keydown(function() {
    console.log('In keydown');
    clearTimeout(typingTimer);
    if ($('#message_content_display').val) {
      typingTimer = setTimeout(function() {
        $("p.typing").html('User is typing');
        console.log('Someone typing');
      }, doneTypingInterval);
    }
  });

  $('#message_content_display').keyup(function() {
    console.log('In keyup');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function() {
      $("p.typing").html(oldData);
      console.log('Someone stopped typing');
    }, finaldoneTypingInterval);
    console.log('User stopped typing');
    $("p.typing").html('');
  });

};

var ajaxRequest = function(req_content){
  if(req_content.lat !== undefined){
    message_content = JSON.stringify(req_content);
  } else {
    message_content = req_content;
  }
  $.ajax({
        url: '/add_image_as_message',
        method: 'POST',
        data: {
          content: message_content,
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
    if(!obj.error) {
      var image = obj.image;
      last_image = image;
        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        showPreview($animatedImage);
        $('#message_content_display').addClass('hidden');
        $('#message_content').val('NTEXT'+last_image);
      }
    });
  };


var clickImage = function(){
  console.log('option image');
  gifshot.takeSnapShot(function(obj) {
    if(!obj.error) {
        var image = obj.image;
        last_image = image;
        console.log('length of images',image.length);

        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        showPreview($animatedImage);
        $('#message_content_display').addClass('hidden');
        $('#message_content').val('NTEXT'+image);
      }
    });

};
$(document).ready(function(){

  $('.messagesendbutton').on('click',function(){
    // emptyMessageField();
    // clearPreview();
  });
  $('.messagediscardbutton').on('click',function(){
    emptyMessageField();
    clearPreview();
  });

  // $('.say_yes').on('click',function(){
  //   console.log('yes');
  //   //calling ajax request to save the message after preview
  //   // ajaxRequest(last_image);
  //
  // });
  //
  // $('.say_no').on('click',function(){
  //   console.log('no');
  //   //calling ajax request to save the message after preview
  //   // console.log('Discarded');
  //   clearPreview();
  // });

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

  $('#message_content_display').on('keypress',function(){
      // userTyping();

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
    initMap();
    $('.preview').removeClass('hidden');
    $('#message_content_display').addClass('hidden');
  });
  $('#new_message')
  .on("ajax:before",function(e,elements){
    var msg_content = $('#message_content_display').val();
    if (msg_content !== ''){
      $('#message_content').val(msg_content);
    }
  })
  .on("ajax:beforeSend",function(e,xhr,elements,settings){

  })
  .on("ajax:beforeSend",function(e,xhr,settings){

  }).on("ajax:complete",function(e,status,xhr){
    console.log('inside ajax complete');
    emptyMessageField();
    clearPreview();
    $('#message_content_display').removeClass('hidden');
  });

  // $('#new_message').on("ajax:success", (e, data, status, xhr){
  //
  // } ->
  //   $("#new_article").append xhr.responseText
  // );

});

// var createMap = function(id, location){
//   console.log('raw',location);
//   console.log('parsed',
//   JSON.parse(location.replace(/&quot;/g,'"')));
//   // return;
//   // var $el = $('#' + id);
//   var user_position = JSON.parse(location.replace(/&quot;/g,'"'));
//   // console.log('element',$el);
//   console.log('location from rails',user_position);
//   var map = new google.maps.Map(document.getElementById(id), {
//     center: user_position,
//     scrollwheel: false,
//     zoom: 16
//   });
//
//   // Create a marker and set its position.
//   var marker = new google.maps.Marker({
//     map: map,
//     position: user_position,
//     title: 'address'
//   });
// };
