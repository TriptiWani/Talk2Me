
var emptyMessageField = function(){
  setTimeout(function(){
    $('#message_content').val('');
  },10);
};
$(document).ready(function(){
  $('.messagesendbutton').on('click',function(){
    emptyMessageField();
  });
  $('.activate_camera').on('click', function(){
    $('.camera_message').removeClass('hidden');
    console.log('Camera clicked');

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
            $new_member = $('<li />');

            $new_member_name = $('<a />');
            $new_member_name.addClass('glyphicon glyphicon-pawn');
            $new_member_name.attr('href','/users/'+ data['user_id'] );
            $new_member_name.html(data['user']['name']);

            $img = $('<img />');
            $img.attr('src', data['user']['image']);
            $img.addClass('user_image');

            $new_member_image = $('<a />');
            $new_member_image.attr('href','/users/'+ data['user_id']);
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
});
