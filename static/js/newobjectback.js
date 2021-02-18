//https://www.arc.id.au/CanvasLayers.html
//creates a new object (so two new layers, one for the new black lines and one for the new texturized background to be placed)
//example: (syntax is NOT the same as for layers)
//current layers are: spaceship on {0,1}, dinosaur on {2,3}
//changelayer() would make layers: nothing on {0, 1}, spaceship on {2,3}, dinosaur on {4,5}
//which is ready for the next set of drawings!
function changelayer(){
    color_fade_canvas = document.createElement("canvas");
    color_fade_canvas.width = cw;
    color_fade_canvas.height = ch;
    color_fade_canvas_ctx = color_fade_canvas.getContext('2d');
    color_fade_canvas_ctx.clearRect(0, 0, cw, ch);
    $.ajax({
        type: 'POST',
        url: '/receiver',
        data: JSON.stringify('clear'+currentModelNumber),
        success: function(data) { alert("data: " + data); },
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
    });
    number_of_objects += 1;
    if (cvsStk === undefined){
        cvsStk = new CanvasStack("defaultCanvas0");
    }
    var defaultCanvas0ctx = document.getElementById("defaultCanvas0").getContext("2d");
    defaultCanvas0ctx.clearRect(0, 0, cw, ch);

    var drawing_layer_index = number_of_objects*2 - 2;
    var current_layer_index = number_of_objects*2 - 1;

    drawing_layer_ID = cvsStk.createLayer();
    current_layer_ID = cvsStk.createLayer();

    if (number_of_objects>1){
        var i;
        for (i=1; i<number_of_objects; i++){
            var old_drawing_layer_index = drawing_layer_index - 2;
            var old_drawing_layer_ID = "defaultCanvas0_ovl_" + old_drawing_layer_index;

            var old_current_layer_index = current_layer_index - 2;
            var old_current_layer_ID = "defaultCanvas0_ovl_" + old_current_layer_index;

            //function to put the oldest objects on the top layer (so all new objects will appear to be drawn below previously drawn objects)
            swaplayers(old_drawing_layer_ID, drawing_layer_ID, old_current_layer_ID, current_layer_ID);

            drawing_layer_index = old_drawing_layer_index;
            drawing_layer_ID = "defaultCanvas0_ovl_" + drawing_layer_index;

            current_layer_index = old_current_layer_index;
            current_layer_ID = "defaultCanvas0_ovl_" + current_layer_index;
        }
    }
}

//helper function for changelayers()
function swaplayers(old_drawing_layer_ID, drawing_layer_ID, old_current_layer_ID, current_layer_ID){
    var old_drawing_canvas = document.getElementById(old_drawing_layer_ID);
    var old_drawing_canvas_ctx = old_drawing_canvas.getContext("2d");
    var new_drawing_canvas = document.getElementById(drawing_layer_ID);
    var new_drawing_canvas_ctx = new_drawing_canvas.getContext("2d");
    new_drawing_canvas_ctx.drawImage(old_drawing_canvas, 0, 0);
    old_drawing_canvas_ctx.clearRect(0, 0, cw, ch);

    var old_current_canvas = document.getElementById(old_current_layer_ID);
    var old_current_canvas_ctx = old_current_canvas.getContext("2d");
    var new_current_canvas = document.getElementById(current_layer_ID);
    var new_current_canvas_ctx = new_current_canvas.getContext("2d");
    new_current_canvas_ctx.drawImage(old_current_canvas, 0, 0);
    old_current_canvas_ctx.clearRect(0, 0, cw, ch);
}

function changelayerButton(){
    document.getElementById("changelayer").classList.add("selected_button");
    setTimeout(function(){document.getElementById("changelayer").classList.remove("selected_button");}, 500);
}