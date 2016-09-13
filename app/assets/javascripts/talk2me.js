
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
var showPreview = function($el){
  // debug
  //console.log('showing');
  $el.appendTo('.preview_left');
  $('.preview').removeClass('hidden');
};
var clearPreview = function(){
  // debug
  //console.log('clearing');
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
    // debug
    //console.log('location from iinside',last_image);
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
var checkIfTyping = function(){

};
  var userTyping = function(){
  var typingTimer;
  var doneTypingInterval = 10;
  var finaldoneTypingInterval = 500;

  var oldData = $("p.typing").html();
  $('#message_content_display').keydown(function() {
    // debug
    //console.log('In keydown');
    clearTimeout(typingTimer);
    if ($('#message_content_display').val) {
      typingTimer = setTimeout(function() {
        $("p.typing").html('User is typing');
        // debug
        //console.log('Someone typing');
      }, doneTypingInterval);
    }
  });

  $('#message_content_display').keyup(function() {
    // debug
    //console.log('In keyup');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function() {
      $("p.typing").html(oldData);
      // debug
      //console.log('Someone stopped typing');
    }, finaldoneTypingInterval);
    // debug
    //console.log('User stopped typing');
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
        // debug
        //console.log('success',data);
        clearPreview();
      })
      .fail(function(data){
        // debug
        //console.log('fail',data);
        clearPreview();
      });
};
// to take video
var shootVideo = function(){
  gifshot.createGIF({
    keepCameraOn: false
  },
  function(obj) {
    setTimeout( function(){
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
    },1000);
    });
  };


var clickImage = function(){
  // debug
  //console.log('option image');
  gifshot.takeSnapShot( function(obj){
    setTimeout(function(  ) {
        if(!obj.error) {
        var image = obj.image;
        last_image = image;
        // debug
        //console.log('length of images',image.length);

        $animatedImage = $('<img />');
        $animatedImage.attr('src',image);
        $animatedImage.addClass('message_images');
        showPreview($animatedImage);
        $('#message_content_display').addClass('hidden');
        $('#message_content').val('NTEXT'+image);
      }
    },1000);
  });
};
$(document).ready(function(){

  $('.messagesendbutton').on('click',function(e){
    //to be included in next version
    // emptyMessageField();
    // clearPreview();
    // function scrollToBottom(e) {
//  e.scrollTop = e.scrollHeight - e.getBoundingClientRect().height;
    //  }
  });
  $('.messagediscardbutton').on('click',function(){
    emptyMessageField();
    $('#message_content_display').removeClass('hidden');
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
            $('#search').val('');
            // debug
            //console.log(data.responseText);
            if (data.responseText === 'Contact is already added') {
              alert('Contact already present');
            } else {
              $new_member = $('<li />');

              $new_member_name = $('<a />');
              $new_member_name.addClass('glyphicon glyphicon-pawn');
              $new_member_name.attr('href','/users/'+ data['id'] );
              $new_member_name.html(data['name']);

              $remove_user = $('<a />');
              $remove_user.attr('href','/group/'+ window.location.pathname.split('/').pop() + '/user/'+ data['id'] );
              $remove_span = $('<span></span>');
              $remove_span.addClass("glyphicon glyphicon glyphicon-scissors");
              $remove_span.attr('aria-hidden',"true");
              $remove_span.appendTo($remove_user);


              $img = $('<img />');
              $img.attr('src', data['image']);
              $img.addClass('user_image');

              $new_member_image = $('<a />');
              $new_member_image.attr('href','/users/'+ data['id']);
              $new_member_image.html($img);

              $status = $('<p></p>');
              $status.addClass('user_status');
              $status.html(data['status']);

              $new_member_image.appendTo($new_member);
              $new_member_name.appendTo($new_member);
              $remove_user.appendTo($new_member);
              $status.appendTo($new_member);

              $new_member.appendTo('.group_members_list');
            }
            // debug
            //console.log(data);


          })
          .fail(function(data){
            $('#search').val('');
            // debug
            //console.log(data.responseText);
            if (data.responseText === 'Contact is already added'){
              // debug
              //console.log('FAILLL');
              alert('Contact already present');
            } else if (data.responseText === 'Please request group admin to add this member') {
              alert('Please request group admin to add this member');
            }else{
              alert('Unable to add user to the group. Try again after sometime');
            }
            $('#search').html('');
            // debug
            //console.log('fail',data);
          });
    }
  });
  $('.activate_camera').on('click',function(){
    // debug
    //console.log('camera');
    clickImage();
  });

  $('.activate_video').on('click',function(){
    // debug
    //console.log('video');
    shootVideo();
  });

  $('#message_content_display').on('keypress',function(){
      // userTyping();

  });
  //Tobe included in next version
  // $('#message_content').on('keypress',function(){
  //   // cancelTimeout(typing_timeout);
  //   // typing_timeout = setTimeout(userNotTyping, 5000);
  //   // if(more than 5 seconds) {
  //   //   userTyping();
  //   // }
  //   // debug
  //console.log('Someone typing');
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
    emptyMessageField();
    clearPreview();
    $('#message_content_display').removeClass('hidden');
  });
  $('#enter_to-send').on('click',function(){
    if ($(this).val() === 'no'){
      $(this).val('yes');
    } else {
      $(this).val('no');
    }
  });
  // $('#message_content_display').val()
  $('textarea.form-control').keypress(function(e){
    // console.log(e.which);
    if (($('#enter_to-send').val() === 'yes') && (e.which === 13)){
        e.preventDefault();
        $('.messagesendbutton').click();
    }
  });

  //typing check

  var textarea = $('#message_content_display');
  var typingStatus = $('.typing');
  var lastTypedTime = new Date(0); // it's 01/01/1970
  var typingDelayMillis = 5000; // how long user can "think about his spelling" before we show "No one is typing -blank space." message

  var refreshTypingStatus = function() {
     if (!textarea.is(':focus') || textarea.val() === '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
         typingStatus.html('');
     } else {
         typingStatus.html('Some member is entering text');
     }
  };
  var updateLastTypedTime = function() {
     lastTypedTime = new Date();
  };

  setInterval(refreshTypingStatus, 100);
  textarea.keypress(updateLastTypedTime);
  textarea.blur(refreshTypingStatus);

});
