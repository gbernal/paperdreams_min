//Calculates the position of the user-drawn circled area, and size
//Calls the function to draw the SVG, passing in the position and size data
function insertSVG(svg_src) {
    var defaultCanvas0ctx = document.getElementById("defaultCanvas0").getContext("2d");
    var defaultCanvas0imagedata = defaultCanvas0ctx.getImageData(0, 0, 2*cw, 2*ch);
    defaultCanvas0ctx.clearRect(0,0,cw,ch); //clears circle before drawing SVG
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
    var list_nonzero_x = [];
    var list_nonzero_y = [];
    for (var i=0;i<imagedataarray1D.length;i+=4){ //WILL BREAK WITH COLOR
        if (imagedataarray1D[i] == 255 & imagedataarray1D[i+3] == 255){
            list_nonzero_x.push((i*0.25)%defaultCanvas0imagedata.width);
            list_nonzero_y.push(Math.floor((i*0.25)/defaultCanvas0imagedata.width));
        }
    }
    min_x = Math.min.apply(Math,list_nonzero_x);
    max_x = Math.max.apply(Math,list_nonzero_x);
    min_y = Math.min.apply(Math,list_nonzero_y);
    max_y = Math.max.apply(Math,list_nonzero_y);
    range_x = max_x - min_x;
    range_y = max_y - min_y;
    ratio_x = range_x / SIZE;
    ratio_y = range_y / SIZE;

    scale_ratio = Math.max(ratio_x, ratio_y);
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
    var svg_grid_div = document.getElementById("svg_grid");
    var svgNodes = svg_grid_div.childNodes;
    svgNodes.forEach(function (currentNode){
        currentNode.classList.remove("selected_svg_image");
    });
    getSvgPaths(svg_src, crop_left, crop_top, scale_ratio);
}

//Given an SVG path, requests internal content data via XMLHttpRequest
function getSvgPaths(svg_src, svg_start_x, svg_start_y, svg_scale){
    xhr = new XMLHttpRequest();
    xhr.open("GET",svg_src,false);
    xhr.overrideMimeType("image/svg+xml");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getPathsFromXml(this, svg_start_x, svg_start_y, svg_scale);
        }
    };
    xhr.send("");
}

//Given XML internal data, grabs the path objects
function getPathsFromXml(xml, svg_start_x, svg_start_y, svg_scale) {
    var list_of_SVG_paths = [];
    var xmlDoc = xml.responseXML;
    var svg_path_elements = xmlDoc.getElementsByTagName('path');
    //console.log(svg_path_elements);
    for (let elem of svg_path_elements) {
        list_of_SVG_paths.push(elem);
    }
    drawSVG(list_of_SVG_paths, svg_start_x, svg_start_y, svg_scale);
}

var SVGpath = [];
//Given path data, draws the paths onto the canvas
function drawSVG(fullpaths, svg_start_x, svg_start_y, svg_scale) {
    var svg_canvas = document.getElementById("defaultCanvas0");
    var svg_canvas_ctx = svg_canvas.getContext('2d');

    var svg_top_canvas = document.getElementById(current_layer_ID);
    var svg_top_canvas_ctx = svg_top_canvas.getContext('2d');

    var svg_buffer_canvas = document.createElement("canvas");
    svg_buffer_canvas.width = cw;
    svg_buffer_canvas.height = ch;
    svg_buffer_canvas_ctx = svg_buffer_canvas.getContext('2d');

    var distancePerPoint = 10;
    var drawFPS          = 20*(fullpaths.length);
    var orig, points, timer;
    var path_counter = 0;

    orig = fullpaths[0];
    startDrawingPath();

    function startDrawingPath(){
        points = [];
        clearInterval(timer);
        timer = setInterval(buildPath,1000/drawFPS);
    }

    function buildPath(){
        canDraw = false;
        document.getElementById("loading_box").style.display = "initial";
        var nextPoint = points.length * distancePerPoint;
        var pathLength = orig.getTotalLength();
        if (pathLength < 100){
            drawFPS = 200;
            distancePerPoint = 5;     
        } else {
            drawFPS = fullpaths.length*20;
            distancePerPoint = 10;
        }
        if (nextPoint <= pathLength){
            points.push(orig.getPointAtLength(nextPoint));
            redrawCanvas(path_counter);
            //console.log(pathLength - nextPoint);
        }
        if (nextPoint >= pathLength){
            clearInterval(timer);
            path = SVGpath;
            var colorCounter = Math.ceil(fullpaths.length/6);
            if (path_counter % colorCounter === 0){
                downloadAndColor();
            } else {
                historyforpts.saveState();
                listyforcolors.push(listyforcolors.slice(-1)[0]);
            }
            path_counter += 1;
            if (path_counter < fullpaths.length){
                (function(index){
                    setTimeout(function(){
                        orig = fullpaths[path_counter];
                        startDrawingPath();
                    }, path_counter*10);
                })(path_counter);
            }else{
                downloadAndColor();
                canDraw = true;
                document.getElementById("loading_box").style.display = "none";
            }
        }
    }

    function redrawCanvas(path_counter){
        clearCanvas();
        svg_canvas_ctx.drawImage(svg_buffer_canvas, 0, 0);
        svg_top_canvas_ctx.drawImage(svg_buffer_canvas, 0, 0);
        SVGpath = [];

        svg_canvas_ctx.beginPath();
        svg_canvas_ctx.moveTo(points[0].x*svg_scale+svg_start_x,points[0].y*svg_scale+svg_start_y);
        SVGpath.push([points[0].x*svg_scale+svg_start_x,points[0].y*svg_scale+svg_start_y]);
        for (var i=1;i<points.length;i++){
            SVGpath.push([points[i].x*svg_scale+svg_start_x,points[i].y*svg_scale+svg_start_y]);
            svg_canvas_ctx.lineTo(points[i].x*svg_scale+svg_start_x,points[i].y*svg_scale+svg_start_y);
        }
        svg_canvas_ctx.stroke();

        svg_top_canvas_ctx.beginPath();
        svg_top_canvas_ctx.moveTo(points[0].x*svg_scale+svg_start_x,points[0].y*svg_scale+svg_start_y);
        for (var i=1;i<points.length;i++) svg_top_canvas_ctx.lineTo(points[i].x*svg_scale+svg_start_x,points[i].y*svg_scale+svg_start_y);
        svg_top_canvas_ctx.stroke();

        svg_buffer_canvas_ctx.beginPath();
        svg_buffer_canvas_ctx.moveTo(points[0].x*svg_scale+svg_start_x,points[0].y*svg_scale+svg_start_y);
        for (var i=1;i<points.length;i++) svg_buffer_canvas_ctx.lineTo(points[i].x*svg_scale+svg_start_x,points[i].y*svg_scale+svg_start_y);
        svg_buffer_canvas_ctx.stroke();
    }

    function clearCanvas(){
        svg_canvas_ctx.clearRect(0,0,svg_canvas_ctx.canvas.width,svg_canvas_ctx.canvas.height);
        svg_top_canvas_ctx.clearRect(0,0,svg_canvas_ctx.canvas.width,svg_canvas_ctx.canvas.height);
    }
}