App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    $("#messages").removeClass('hidden');
    return $('#messages').append(this.renderMessage(data));
  },

  renderMessage: function(data) {
    if ((parseInt(window.location.pathname.split('/').pop()) === parseInt(data.group_id))){
      var date = new Date();
      var time = date.getDate() + "-"+(date.getMonth()+1) + "-" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();

      if ((data.message.split('.').pop() === 'gif')|| (data.message.split('.').pop() === 'png')) {
        if (data.id === app.current_user ){
          return '<p class="current_user time">' + time + '</p><p class="current_user"> <img class="message_images" src="' + data.message +'"> :<b class="message"> '+ data.user + '</b></p>';
        } else {
          return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <img class="message_images" src="' + data.message +'"></p>';
        }

      } else if  (data.message.match( /^\{.*\}$/ )){
        $div_main = $('<div></div>');
        $div_main.addClass('current_user message_location');

        $p_time = $('<p></p>');
        $p_time.addClass('time');
        $p_time.text(time);

        $div_map = $('<div> </div>');
        $div_map.attr('id','map-' + data.message_id);
        $div_map.addClass('message_images display_map message_maps time');

        $p_name = $('<p></p>');
        $p_name.addClass('display_map');

          $strong = $('<strong></strong');

        $strong.appendTo($p_name);
        if (data.id === app.current_user ){
          $strong.text(':'+data.user);
          $div_main.append($p_time);
          $div_main.append($div_map);
          $div_main.append($p_name);

          $('#messages').append($div_main);
          displayLocation(data.message, data.message_id);
        } else {
          $strong.text(data.user+':');
          $div_main.append($p_time);
          $div_main.append($p_name);
          $div_main.append($div_map);
          $div_main.removeClass('current_user');

          $('#messages').append($div_main);
          displayLocation(data.message, data.message_id);
          // return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <img src="' + data.message +'"></p>';
        }

        displayLocation(data.message,data.message_id);



      } else if ((data.message.slice(0,4) === 'http')) {
        if (data.id === app.current_user ){
          return '<p class="current_user time">' + time + '</p><p class="current_user"> <a href="' + data.message +'">' + data.message + '</a> :<b class="message"> '+ data.user + '</b></p>';
        } else {
          return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <a href="' + data.message +'">' + data.message + '</a></p>';
        }
    } else {
      if (data.id === app.current_user ){
        return '<p class="current_user time">' + time + '</p><p class="current_user">'+ data.message + ':<b class="message"> '+ data.user + '</b></p>';
      } else {
        return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> '+ data.message + '</p>';
      }

      }
    }


  }
});
