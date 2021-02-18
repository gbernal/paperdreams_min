//equivalent to taking a screenshot of the canvas, combines all the layers onto a single canvas and then downloads that image
function realdownloadimage(){
    if (mac) {
        var current_canvas = document.createElement("canvas");
        current_canvas.width = cw;
        current_canvas.height = ch;
        var current_canvas_ctx = current_canvas.getContext('2d');
        current_canvas_ctx.fillStyle = 'white';
        current_canvas_ctx.fillRect(0, 0, cw, ch);
    } else {
        var current_canvas = document.createElement("canvas");
        current_canvas.width = cw;
        current_canvas.height = ch;
        var current_canvas_ctx = current_canvas.getContext('2d');
        current_canvas_ctx.fillStyle = 'white';
        current_canvas_ctx.fillRect(0, 0, cw, ch);
    }

    var caption = prompt("Please give a caption for your scene:");
    if (!caption){
        caption = "Untitled, pixels on canvas.";
    }
    if (caption){
        for (let i=0; i<3; i++){
            var copy_layer_ID = "defaultCanvas0_ovl_" + i;
            var copy_layer_canvas = document.getElementById(copy_layer_ID);
            current_canvas_ctx.drawImage(copy_layer_canvas, 0, 0);

            if (i === 2){
                $.ajax({
                    type: 'POST',
                    url: '/receiver',
                    data: JSON.stringify("downloadFullCanvas".concat(current_canvas.toDataURL("image/png"))),
                    success: function(data) { alert("data: " + data); },
                    contentType: "application/json; charset=UTF-8",
                    dataType: "json"
                });
                var defaultimageobject = new Image();
                defaultimageobject.onload = function(){
                    var downloadsFolder = false; //if you want to download to downloads folder
                    if (downloadsFolder){
                        var a         = document.createElement('a');
                        a.href        = current_canvas.toDataURL();
                        a.download    =  "canvas.png";
                        a.click();
                    }
                };
                defaultimageobject.src = current_canvas.toDataURL("image/png");
            }
        }
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify("downloadFullCaption:".concat(caption)),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
    }
}
