var isClearing = false;

//undo function (calls above undo function)
function undo(){
    if (listyforpoints.length > 0){
        historyforpts.undo();
    }
}

//redo function (calls above redo function)
function redo(){
    if (redolistyforpoints.length > 0){
        historyforpts.redo();
    }
}

//clear function
function cleary(){
    clearRenameObjectForm();
    isClearing = true;
    cvsStk.deleteAllLayers();
    document.getElementById("user_text_input").value = "";
    document.getElementById("recognizedword").innerHTML = "";
    document.getElementById("words").innerHTML = "";
    document.getElementById("a_left").innerHTML = "";
    clearGrid();
    cvsStk = undefined;
    document.getElementById("changelayer").innerHTML = "";
    number_of_objects = 0;
    historyforpts.clearly();
    color_fade_canvas = document.createElement("canvas");
    color_fade_canvas.width = cw;
    color_fade_canvas.height = ch;
    color_fade_canvas_ctx = color_fade_canvas.getContext('2d');
    $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('clear'+currentModelNumber),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
}

//Creates functions for clearing, saving, undoing, redoing
var historyforpts = {
    counter: 1,
    saveState: function() {
        if(undobool == false){
            var dataURL = document.getElementById("defaultCanvas0").toDataURL();
            listyforpoints.push(dataURL);
            paths.push(path);
            redolistyforpoints = [];
            redolistyforcolors = [];
            redopaths = [];
            path = [];
            //console.log(paths);
        }
        undobool = false;
      },
    undo: function(){
        redolistyforpoints.push(listyforpoints.pop());
        redolistyforcolors.push(listyforcolors.pop());
        redopaths.push(paths.pop());
        undobool = true;
        setup();

        var bottom_canvas = document.getElementById("defaultCanvas0");
        var bottom_canvas_ctx = bottom_canvas.getContext("2d");
        bottom_canvas_ctx.clearRect(0, 0, cw, ch);
        var current_canvas = document.getElementById(current_layer_ID);
        var current_canvas_ctx = current_canvas.getContext("2d");
        current_canvas_ctx.clearRect(0, 0, cw, ch);

        if (listyforpoints.length > 0){
            var undo_image = new Image();
            undo_image.onload=function(){
                bottom_canvas_ctx.drawImage(undo_image, 0, 0, cw, ch);
                current_canvas_ctx.drawImage(undo_image, 0, 0, cw, ch);
            };
            undo_image.src = listyforpoints[(listyforpoints.length)-1];
        }

        var drawing_canvas = document.getElementById(drawing_layer_ID);
        var drawing_canvas_ctx = drawing_canvas.getContext("2d");
        drawing_canvas_ctx.clearRect(0, 0, cw, ch);
        if (listyforcolors.length > 0){
            var undo_color_image = new Image();
            undo_color_image.onload=function(){
                drawing_canvas_ctx.drawImage(undo_color_image, 0, 0, cw, ch);
            };
            undo_color_image.src = listyforcolors[(listyforcolors.length)-1];
        } else {
            var undo_color_image = new Image();
            undo_color_image.onload=function(){
                drawing_canvas_ctx.drawImage(undo_color_image, 0, 0, cw, ch);
            };
            undo_color_image.src = "/static/images/transparent.png";
        }
        if (listyforcolors.length > 0){
            var fade_color_image = new Image();
            fade_color_image.onload=function(){
                color_fade_canvas.getContext('2d').clearRect(0, 0, cw, ch);
                color_fade_canvas.getContext('2d').drawImage(fade_color_image, 0, 0, cw, ch);
            };
            fade_color_image.src = listyforcolors[(listyforcolors.length)-1];
        } else {
            var fade_color_image = new Image();
            fade_color_image.onload=function(){
                color_fade_canvas.getContext('2d').clearRect(0, 0, cw, ch);
                color_fade_canvas.getContext('2d').drawImage(fade_color_image, 0, 0, cw, ch);
            };
            fade_color_image.src = "/static/images/transparent.png";
        }
        undobool = false;
        path = [];
    },
    redo: function(){
        undobool = true;
        setup();

        var bottom_canvas = document.getElementById("defaultCanvas0");
        var bottom_canvas_ctx = bottom_canvas.getContext("2d");
        bottom_canvas_ctx.clearRect(0, 0, cw, ch);
        var current_canvas = document.getElementById(current_layer_ID);
        var current_canvas_ctx = current_canvas.getContext("2d");
        current_canvas_ctx.clearRect(0, 0, cw, ch);
        if (redolistyforpoints.length > 0){
            var redo_image = new Image();
            redo_image.onload=function(){
                bottom_canvas_ctx.drawImage(redo_image, 0, 0, cw, ch);
                current_canvas_ctx.drawImage(redo_image, 0, 0, cw, ch);
            };
            redo_image.src = redolistyforpoints[(redolistyforpoints.length)-1];
        }

        var drawing_canvas = document.getElementById(drawing_layer_ID);
        var drawing_canvas_ctx = drawing_canvas.getContext("2d");
        drawing_canvas_ctx.clearRect(0, 0, cw, ch);
        if (redolistyforcolors.length > 0){
            var redo_color_image = new Image();
            redo_color_image.onload=function(){
                drawing_canvas_ctx.drawImage(redo_color_image, 0, 0, cw, ch);
            };
            redo_color_image.src = redolistyforcolors[(redolistyforcolors.length)-1];
        }
        listyforpoints.push(redolistyforpoints.pop());
        listyforcolors.push(redolistyforcolors.pop());
        paths.push(redopaths.pop());
        undobool = false;
        path = [];
    },
     clearly: function(){
        setup();
        listyforpoints = [];
        listyforcolors = [];
        redolistyforpoints = [];
        redolistyforcolors = [];
        path = [];
        paths = [];
        isClearing = false;
     },
     savepath: function(){
        var dataURL = document.getElementById("defaultCanvas0").toDataURL();
        var content = "";
        var pathsJoin = '';
          paths.forEach(function(row, index){
            pathsJoin += "[" + row.toString()  + "],";
          });
          pathsJoin = pathsJoin.slice(0,-1);
          pathsJoin = "[[" + pathsJoin + "]]";
          content = pathsJoin + "\n" + dataURL;
        currentCanv  = document.getElementById("defaultCanvas0").toDataURL();
     },
     startover: function(){
        paths = [];
     },
};