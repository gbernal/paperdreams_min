//https://www.arc.id.au/CanvasLayers.html
//flattens everything onto the flatten layer
//clears current and draw canvases

var flatten_layer_ID;

function changelayer(){
    if (list_of_color_timeouts.length == 0 && canDraw){
        color_fade_canvas = document.createElement("canvas");
        color_fade_canvas.width = cw;
        color_fade_canvas.height = ch;
        color_fade_canvas_ctx = color_fade_canvas.getContext('2d');
        color_fade_canvas_ctx.clearRect(0, 0, cw, ch);
        listyforpoints = [];
        listyforcolors = [];
        redolistyforpoints = [];
        redolistyforcolors = [];
        paths = [];
        path = [];
        // $.ajax({
        //     type: 'POST',
        //     url: '/receiver',
        //     data: JSON.stringify('clear'+currentModelNumber),
        //     success: function(data) { alert("data: " + data); },
        //     contentType: "application/json; charset=UTF-8",
        //     dataType: "json"
        // });
        if (cvsStk == undefined){
            cvsStk = new CanvasStack("defaultCanvas0");
            flatten_layer_ID = cvsStk.createLayer();
            drawing_layer_ID = cvsStk.createLayer();
            current_layer_ID = cvsStk.createLayer();

            document.getElementById(flatten_layer_ID).getContext("2d").lineWidth = 2;
            document.getElementById(drawing_layer_ID).getContext("2d").lineWidth = 2;
            document.getElementById(current_layer_ID).getContext("2d").lineWidth = 2;
        } else {
            var flattenCanvas = document.getElementById(flatten_layer_ID);
            var flattenCanvasCtx = flattenCanvas.getContext("2d");
            var drawingCanvas = document.getElementById(drawing_layer_ID);
            var drawingCanvasCtx = drawingCanvas.getContext("2d");
            var currentCanvas = document.getElementById(current_layer_ID);
            var currentCanvasCtx = currentCanvas.getContext("2d");
            if (toggledrawBool == "front"){
                flattenCanvasCtx.drawImage(drawingCanvas, 0, 0);
                flattenCanvasCtx.drawImage(currentCanvas, 0, 0);
                drawingCanvasCtx.clearRect(0, 0, cw, ch);
                currentCanvasCtx.clearRect(0, 0, cw, ch);
            } else {
                var tempFlattenCanvas = document.createElement("canvas");
                tempFlattenCanvas.width = cw;
                tempFlattenCanvas.height = ch;
                tempFlattenCanvas.getContext("2d").drawImage(flattenCanvas, 0, 0);

                flattenCanvasCtx.drawImage(drawingCanvas, 0, 0);
                flattenCanvasCtx.drawImage(currentCanvas, 0, 0);
                flattenCanvasCtx.drawImage(tempFlattenCanvas, 0, 0);

                drawingCanvasCtx.clearRect(0, 0, cw, ch);
                currentCanvasCtx.clearRect(0, 0, cw, ch);
            }

        }
        var defaultCanvas0ctx = document.getElementById("defaultCanvas0").getContext("2d");
        defaultCanvas0ctx.clearRect(0, 0, cw, ch);
    }

}

function changelayerButton(){
    $.ajax({
        type: 'POST',
        url: '/receiver',
        data: JSON.stringify('changedLayer'),
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
    });
    if (list_of_color_timeouts.length == 0){
        document.getElementById("changelayer").classList.add("selected_button");
        setTimeout(function(){document.getElementById("changelayer").classList.remove("selected_button");}, 500);
    }
    changelayer();
}