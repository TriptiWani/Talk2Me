App.messages = App.cable.subscriptions.create('MessagesChannel', {
  received: function(data) {
    $("#messages").removeClass('hidden');
    return $('#messages').append(this.renderMessage(data));
  },

  renderMessage: function(data) {
    var date = new Date();
    console.log(data);
    var time = date.getDate() + "-"+(date.getMonth()+1) + "-" + date.getFullYear() + "  " + date.getHours() + ":" + date.getMinutes();
    // date.getHours() + ':' + date.getMinutes();
    if ((data.message.split('.').pop() === 'gif')|| (data.message.split('.').pop() === 'jpg')) {
      if (data.id === app.current_user ){
        return '<p class="current_user time">' + time + '</p><p class="current_user"> <img src="' + data.message +'"> :<b class="message"> '+ data.user + '</b></p>';
      } else {
        return '<p class="time">' + time + '</p><p><b>'+ data.user + ':</b> <img src="' + data.message +'"></p>';
          // return '<p> <img src="' + data.message +'"> :<b class="message"> '+ data.user + '</b></p>';
      }

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
});
