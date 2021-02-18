var toggledrawBool = "front";

function toggledrawplacement(){
    changelayer();
    if (toggledrawBool == "front"){
        toggledrawBool = "back";
        var tempFlattenCanvas = document.createElement("canvas");
        tempFlattenCanvas.width = cw;
        tempFlattenCanvas.height = ch;

        var flattenCanvas = document.getElementById(flatten_layer_ID);
        var flattenCanvasCtx = flattenCanvas.getContext("2d");
        var drawingCanvas = document.getElementById(drawing_layer_ID);
        var drawingCanvasCtx = drawingCanvas.getContext("2d");
        var currentCanvas = document.getElementById(current_layer_ID);
        var currentCanvasCtx = currentCanvas.getContext("2d");

        tempFlattenCanvas.getContext("2d").drawImage(flattenCanvas, 0, 0);

        flattenCanvasCtx.clearRect(0, 0, cw, ch);
        flattenCanvasCtx.drawImage(drawingCanvas, 0, 0);
        drawingCanvasCtx.clearRect(0, 0, cw, ch);
        drawingCanvasCtx.drawImage(currentCanvas, 0, 0);
        currentCanvasCtx.clearRect(0, 0, cw, ch);
        currentCanvasCtx.drawImage(tempFlattenCanvas, 0, 0);

        var temp_layer_ID = flatten_layer_ID;
        flatten_layer_ID = current_layer_ID;
        current_layer_ID = drawing_layer_ID;
        drawing_layer_ID = temp_layer_ID;

    } else {
        toggledrawBool = "front";

        var tempFlattenCanvas = document.createElement("canvas");
        tempFlattenCanvas.width = cw;
        tempFlattenCanvas.height = ch;

        var flattenCanvas = document.getElementById(flatten_layer_ID);
        var flattenCanvasCtx = flattenCanvas.getContext("2d");
        var drawingCanvas = document.getElementById(drawing_layer_ID);
        var drawingCanvasCtx = drawingCanvas.getContext("2d");
        var currentCanvas = document.getElementById(current_layer_ID);
        var currentCanvasCtx = currentCanvas.getContext("2d");

        tempFlattenCanvas.getContext("2d").drawImage(flattenCanvas, 0, 0);

        flattenCanvasCtx.clearRect(0, 0, cw, ch);
        flattenCanvasCtx.drawImage(currentCanvas, 0, 0);
        currentCanvasCtx.clearRect(0, 0, cw, ch);
        currentCanvasCtx.drawImage(drawingCanvas, 0, 0);
        drawingCanvasCtx.clearRect(0, 0, cw, ch);
        drawingCanvasCtx.drawImage(tempFlattenCanvas, 0, 0);
        
        var temp_layer_ID = flatten_layer_ID;
        flatten_layer_ID = drawing_layer_ID;
        drawing_layer_ID = current_layer_ID;
        current_layer_ID = temp_layer_ID;
    }
}

function toggledrawButton(){
    document.getElementById("toggledraw").classList.add("selected_button");
    setTimeout(function(){document.getElementById("toggledraw").classList.remove("selected_button");}, 500);
    if (toggledrawBool == "front"){
        document.getElementById("toggledraw").style.backgroundImage = "url(static/images/toggledrawback.png)";
    } else {
        document.getElementById("toggledraw").style.backgroundImage = "url(static/images/toggledrawfront.png)";
    }
    toggledrawplacement();
}

var strokecolor = "black";
function togglecolor(){
   var defaultCanvasctx = document.getElementById("defaultCanvas0").getContext("2d");
   if (strokecolor == "black"){
       defaultCanvasctx.strokeStyle = "#e5e5e5";
       strokecolor = "white";
   } else {
       defaultCanvasctx.strokeStyle = "black";
       strokecolor = "black";
   }
}

