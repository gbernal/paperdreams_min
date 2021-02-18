$(document).keydown(function(event){
   //console.log(event);
   //add the value into some variable
   var user_text  = document.getElementById('user_text_input').value;
});
$(document).ready(function() {

    console.log(isCanvasBlank(document.getElementById('defaultCanvas0')));

});
function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');
  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
  return !pixelBuffer.some(color => color !== 0);
}

 $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('userText' + user_text),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
