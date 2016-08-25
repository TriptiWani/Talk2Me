App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    $("#messages").removeClass('hidden');
    return $('#messages').append(this.renderMessage(data));
  },

  renderMessage: function(data) {
    console.log(data.message);
    if ((parseInt(window.location.pathname.split('/').pop()) === parseInt(data.group_id))){
      var date = new Date();
      var time = date.getDate() + "-"+(date.getMonth()+1) + "-" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();

      if ((data.message.split('.').pop() === 'gif')|| (data.message.split('.').pop() === 'png')) {
        if (data.id === app.current_user ){
          return '<p class="current_user time">' + time + '</p><p class="current_user"> <img class="message_images" src="' + data.message +'"> :<b class="message"> '+ data.user + '</b></p>';
        } else {
          return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <img src="' + data.message +'"></p>';
        }

      } else if  (data.message.match( /^\{.*\}$/ )){
        console.log('messages',data);
        if (data.id === app.current_user ){
          return ("<div class='current_user message_location'><p class='time'>"+ time +"</p><div id='map-" + data.message_id + "' class='message_images display_map message_maps time'></div><p class='display_map'><strong>:" + data.user + "</strong></p></div>");
        } else {
          return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <img src="' + data.message +'"></p>';
        }

        console.log('map','map-'+data.message_id  );
        console.log($('#map-'+data.message_id));
        displayLocation(data.message,data.message_id);
        // var content = (data.message).replace(/&quot;/g,'"');


      } else if ((data.message.slice(0,4) === 'http')) {
        if (data.id === app.current_user ){
          return '<p class="current_user time">' + time + '</p><p class="current_user"> <a href="' + data.message +'">' + data.message + '</a> :<b class="message"> '+ data.user + '</b></p>';
        } else {
          return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <a href="' + data.message +'">' + data.message + '</a></p>';
        }
    } else {
      if (data.id === app.current_user ){
        console.log('last',data.message);
        return '<p class="current_user time">' + time + '</p><p class="current_user">'+ data.message + ':<b class="message"> '+ data.user + '</b></p>';
      } else {
        return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> '+ data.message + '</p>';
      }

      }
    }


  }
});
