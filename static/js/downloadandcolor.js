//variables to place the colored images back on correctly
//calculated dynamically each time an object is downloaded
var original_x = 0;
var original_y = 0;
var new_x = 0;
var new_y = 0;
var original_width = SIZE;
var original_height = SIZE;
var new_width = SIZE;
var new_height = SIZE;
var scale_ratio = 1;

var inputCanvas = document.createElement("canvas");
inputCanvas.width = SIZE;
inputCanvas.height = SIZE;

var colorURL = "/static/images/transparent.png";
var canvasColorURL = "/static/images/transparent.png";

var makingNewColor = false;
var color_fade_canvas; //for the fade function
var color_fade_canvas_ctx; //for the fade function

//downloads the image, calculates the coordinates, and then grabs the colored image and places it back on
function downloadimage(){
    var defaultCanvas0ctx = document.getElementById("defaultCanvas0").getContext("2d");
    var defaultCanvas0imagedata = defaultCanvas0ctx.getImageData(0, 0, 2*cw, 2*ch);

    var current_canvas = document.getElementById(current_layer_ID);
    var current_canvas_ctx = current_canvas.getContext("2d");

    //Remove section and replace with last line for TOUCHSCREEN
    if (mac) {
        var half_canvas = document.createElement("canvas");
        half_canvas.width = 2*cw;
        half_canvas.height = 2*ch;
        var half_canvas_ctx = half_canvas.getContext("2d");
        half_canvas_ctx.drawImage(defaultCanvas0, 0, 0, cw, ch);
        var half_canvas_image_data = half_canvas_ctx.getImageData(0, 0, 2*cw, 2*ch);
        current_canvas_ctx.putImageData(white2transparentImageData(half_canvas_image_data), 0, 0);
    } else {
        var current_filter_image_data = white2transparentImageData(defaultCanvas0imagedata); //TO REPLACE
        current_canvas_ctx.putImageData(current_filter_image_data, 0, 0, 0, 0, 1250, 750); //TO REPLACE
    }

    //Find the center of userdrawn image
    var imagedataarray1D = defaultCanvas0imagedata.data;
    var imagedataarray2D = [];

    if (object_history.length == 0){
        object_history.push(defaultCanvas0imagedata.data);
    } else {
        object_history.push(defaultCanvas0imagedata.data);
        lastimagedataarray1D = object_history[object_history.length - 1];
    }

    var list_nonzero_x = [];
    var list_nonzero_y = [];
    for (var i=0;i<imagedataarray1D.length;i+=4){ //WILL BREAK WITH COLOR
        if (imagedataarray1D[i+3] > 0){
            list_nonzero_x.push((i*0.25)%defaultCanvas0imagedata.width);
            list_nonzero_y.push(Math.floor((i*0.25)/defaultCanvas0imagedata.width));
        }
    }

    var min_x = Math.min.apply(Math,list_nonzero_x);
    var max_x = Math.max.apply(Math,list_nonzero_x);
    var min_y = Math.min.apply(Math,list_nonzero_y);
    var max_y = Math.max.apply(Math,list_nonzero_y);
    var range_x = max_x - min_x;
    var range_y = max_y - min_y;
    var ratio_x = range_x / SIZE;
    var ratio_y = range_y / SIZE;

    scale_ratio = Math.max(ratio_x, ratio_y) * 1.2;
    center_x = 0.5*(max_x + min_x);
    center_y = 0.5*(max_y + min_y);

    //Checks that crop is within range
    var crop_top = Math.floor(center_y) - Math.ceil((0.5*SIZE)*scale_ratio);
    if (crop_top < 0){
        crop_top = 0;
    } else if (crop_top > (2*ch - (0.5*SIZE)*scale_ratio)){
        crop_top = 2*ch-(0.5*SIZE)*scale_ratio;
    }
    var crop_left = Math.floor(center_x) - Math.ceil((0.5*SIZE)*scale_ratio);
    if (crop_left < 0){
        crop_left = 0;
    } else if (crop_left > (2*cw - (0.5*SIZE)*scale_ratio)){
        crop_left = 2*cw-(0.5*SIZE)*scale_ratio;
    }

    //Makes the cropped canvas
    var crop_canvas = document.createElement("canvas");
    crop_canvas.width = SIZE;
    crop_canvas.height = SIZE;

    //Redraws image to the cropped SIZExSIZE canvas
    var crop_ctx = crop_canvas.getContext("2d");
    crop_ctx.fillStyle = 'white';
    crop_ctx.fillRect(0, 0, SIZE, SIZE);

    inputCanvas = crop_canvas;

    var pixel_canvas = document.createElement("canvas");
    pixel_canvas.width = SIZE;
    pixel_canvas.height = SIZE;
    var pixel_canvas_ctx = pixel_canvas.getContext('2d');
    pixel_canvas_ctx.fillStyle = "white";
    pixel_canvas_ctx.fillRect(0, 0, SIZE, SIZE);
    pixel_canvas_ctx.strokeStyle = "black";
    pixel_canvas_ctx.lineCap = "round";
    pixel_canvas_ctx.lineWidth = 6;
    for (var sp = 0; sp < paths.length; sp++){
        var subpath = paths[sp];
        if (subpath.length > 1){
            pixel_canvas_ctx.beginPath();
            pixel_canvas_ctx.moveTo((subpath[0][0]-crop_left)/scale_ratio, (subpath[0][1]-crop_top)/scale_ratio);
            for (var p = 1; p < subpath.length - 1; p++){
                pixel_canvas_ctx.lineTo((subpath[p][0]-crop_left)/scale_ratio, (subpath[p][1]-crop_top)/scale_ratio);
            }
            pixel_canvas_ctx.stroke();
        }
    }
    pixel_canvas_data = pixel_canvas.toDataURL();

    var defaultimageobject = new Image();
    defaultimageobject.onload = function(){
        original_x = crop_left;
        original_y = crop_top;
        new_x = 0;
        new_y = 0;

        //Resolve border issue on the top and left
        if (crop_left <= 0){ //WILL CAUSE MINOR ISSUES WITH RESCALE BACK TO ORIGINAL IMAGE
            original_x = 0;
        }
        if (crop_top <= 0){ //WILL CAUSE MINOR ISSUES WITH RESCALE BACK TO ORIGINAL IMAGE
            original_y = 0;
        }

        original_width = Math.ceil(SIZE*scale_ratio);
        original_height = Math.ceil(SIZE*scale_ratio);

        new_width = SIZE;
        new_height = SIZE;

        //Hopefully resolves border issue on the bottom and right
        if (crop_left + original_width > 2*cw){
            new_width = (2*cw - crop_left - 4)/original_width * SIZE;
            original_width = 2*cw - crop_left - 4;
        }
        if (crop_top + original_height > 2*ch){
            new_height = (2*ch - crop_top - 4)/original_height * SIZE;
            original_height = 2*ch - crop_top - 4;
        }

        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify(pixel_canvas_data),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        if (colorButtonState){
            (function(original_x, original_y, scale_ratio){
                setTimeout(function(){colorimage(original_x, original_y, scale_ratio);},300); //note the delay for read/writing issues
            })(original_x, original_y, scale_ratio);
        }

    };
    defaultimageobject.src = pixel_canvas_data;
}

var list_of_color_timeouts = [];
//helper function for coloring the image
function colorimage(color_original_x, color_original_y, color_scale_ratio){
    clearColorTimeouts(list_of_color_timeouts);
    var colorimageobject = new Image(SIZE, SIZE);
    colorimageobject.onerror = function(){
       setTimeout(function(){colorimage(color_original_x, color_original_y, color_scale_ratio)}, 1000);
    };

    var defaultcanvasforctx = document.getElementById(drawing_layer_ID);
    var defaultctx = defaultcanvasforctx.getContext("2d");
    defaultctx.globalAlpha = 0;

    colorimageobject.onload = function(){
        var filterImageData = image2imageData(colorimageobject);
        var transparentImageData = white2transparentImageData(filterImageData);
        var transparentDataURL = imageData2dataURL(transparentImageData);
        var transparentimageobject = new Image(SIZE, SIZE);
        transparentimageobject.onload = function(){
            var defaultcanvasforctx = document.getElementById(drawing_layer_ID);
            var defaultctx = defaultcanvasforctx.getContext("2d");
            defaultctx.clearRect(0, 0, document.getElementById(drawing_layer_ID).width, document.getElementById(drawing_layer_ID).height);
            if (mac) {
                var alphaIncrement = 0.05;
                var timeIncrement = 30;
                for (let alphaCurrent = 0; alphaCurrent <= 1; alphaCurrent += alphaIncrement){
                    if (alphaCurrent > (1.0 - 1.5*alphaIncrement)){
                        alphaCurrent = 1;
                        var timeout = setTimeout(function(){
                            defaultctx.globalAlpha = alphaCurrent;
                            defaultctx.clearRect(0, 0, cw, ch);
                            defaultctx.drawImage(transparentimageobject, color_original_x/2, color_original_y/2, Math.ceil(color_scale_ratio*SIZE/2), Math.ceil(color_scale_ratio*SIZE/2));
                            canvasColorURL = defaultcanvasforctx.toDataURL();
                            list_of_color_timeouts = [];
                            listyforcolors.push(canvasColorURL);
                            color_fade_canvas_ctx.clearRect(0, 0, cw, ch);
                            color_fade_canvas_ctx.drawImage(transparentimageobject, color_original_x/2, color_original_y/2, Math.ceil(color_scale_ratio*SIZE/2), Math.ceil(color_scale_ratio*SIZE/2));
                        }, (alphaCurrent/alphaIncrement*timeIncrement));
                        list_of_color_timeouts.push(timeout);
                        break;
                    }else{
                        var timeout = setTimeout(function(){
                            defaultctx.globalAlpha = Math.min(1 - alphaCurrent + 0.35, 1);
                            defaultctx.clearRect(0, 0, cw, ch);
                            defaultctx.drawImage(color_fade_canvas, 0, 0);
                            defaultctx.globalAlpha = alphaCurrent;
                            defaultctx.drawImage(transparentimageobject, color_original_x/2, color_original_y/2, Math.ceil(color_scale_ratio*SIZE/2), Math.ceil(color_scale_ratio*SIZE/2));
                        }, (alphaCurrent/alphaIncrement*timeIncrement));
                        list_of_color_timeouts.push(timeout);
                    }
                }
            }else{
                var alphaIncrement = 0.05;
                var timeIncrement = 30;
                for (let alphaCurrent = 0; alphaCurrent <= 1; alphaCurrent += alphaIncrement){
                    if (alphaCurrent > (1.0 - 1.5*alphaIncrement)){
                        alphaCurrent = 1;
                        var timeout = setTimeout(function(){
                            defaultctx.globalAlpha = alphaCurrent;
                            defaultctx.clearRect(0, 0, cw, ch);
                            defaultctx.drawImage(transparentimageobject, color_original_x, color_original_y, Math.ceil(color_scale_ratio*SIZE), Math.ceil(color_scale_ratio*SIZE));
                            canvasColorURL = defaultcanvasforctx.toDataURL();
                            list_of_color_timeouts = [];
                            listyforcolors.push(canvasColorURL);
                            color_fade_canvas_ctx.clearRect(0, 0, cw, ch);
                            color_fade_canvas_ctx.drawImage(transparentimageobject, color_original_x, color_original_y, Math.ceil(color_scale_ratio*SIZE), Math.ceil(color_scale_ratio*SIZE));
                        }, (alphaCurrent/alphaIncrement*timeIncrement));
                        list_of_color_timeouts.push(timeout);
                        break;
                    }else{
                        var timeout = setTimeout(function(){
                            defaultctx.globalAlpha = Math.min(1 - alphaCurrent + 0.35, 1);
                            defaultctx.clearRect(0, 0, cw, ch);
                            defaultctx.drawImage(color_fade_canvas, 0, 0);
                            defaultctx.globalAlpha = alphaCurrent;
                            defaultctx.drawImage(transparentimageobject, color_original_x, color_original_y, Math.ceil(color_scale_ratio*SIZE), Math.ceil(color_scale_ratio*SIZE));
                        }, (alphaCurrent/alphaIncrement*timeIncrement));
                        list_of_color_timeouts.push(timeout);
                    }
                }
            }
        };
        transparentimageobject.src = transparentDataURL;
    };

    if (isClearing === true){
        colorimageobject.src = "/static/images/transparent.png";
        isClearing = false;
        canvasColorURL = "/static/images/transparent.png";
    } else {
        //colorimageobject.src = "static/pix/color2.png"
        colorimageobject.src = "/static/models/" + currentModel+ "/test_latest/images/color_output_image.jpg?"+Math.random();
    }
}

function clearColorTimeouts(list_of_color_timeouts){
    for (let tc = 0; tc<list_of_color_timeouts.length; ++tc){
        clearTimeout(list_of_color_timeouts[tc]);
    }
    list_of_color_timeouts = [];
}