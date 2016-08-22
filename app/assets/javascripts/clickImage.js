$(document).ready(function(){
  $('button#clickMe').on('click',function(){
    console.log('clicked');
    take_snapshot();
  });
function take_snapshot() {
  Webcam.set({
      width: 320,
      height: 240,
      image_format: 'jpeg',
      jpeg_quality: 90,
      force_flash: false,
      fps: 45
  });
  Webcam.attach( '#my_camera' );
    Webcam.snap( function(data_uri) {
        // document.getElementById('message_content').innerHTML = '<img src="'+data_uri+'"/>';
        console.log('<img src="'+data_uri+'"/>');
        console.log($('message_content'));
        $('message_content').text('<img src="'+data_uri+'"/>');



        Webcam.upload( data_uri, 'myscript.php', function(code, text) {
            // Upload complete!
            // 'code' will be the HTTP response code from the server, e.g. 200
            // 'text' will be the raw response content
        } );

    } );
}
});
