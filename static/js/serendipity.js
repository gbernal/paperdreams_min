//Determines whether computer is a mac or not
var mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

var canvas;
var cvsStk;
var ptouchIsDown;
var pmouseIsPressed;
var number_of_objects = 0;
var path = [];
var paths = [];
var redopaths = [];
var currentCanv;

//history variables for paths, colors for undo and redo functions
var listyforpoints = [];
var listyforcolors = [];
var redolistyforpoints = [];
var redolistyforcolors = [];

var relatedObj;
var modeluse;
var undobool = false;
var center_x;
var center_y;
var object_history = [];

//size of the input or output images (512 vs 256)
//changes the size of the downloaded images (and a large number of other scaling issues)
var SIZE = 512;
var drawingContext;

var current_layer_ID = "defaultCanvas0"; //the current layer the paths are copied to
var drawing_layer_ID = "defaultCanvas0"; //the layer that the colored image is drawn to
var layer_history = [];

//calculates the size of the canvas based on layout
//buggy because it calculates before the page resizes itself
var cw = $("#a_left").width();
var ch = $("#a_left").height();

//EVENT LISTENERS
//prevent page from moving while drawing on touchscreen
document.addEventListener("touchmove", preventBehavior, {passive: false});
function preventBehavior(e) {
    var origin = document.getElementById(current_layer_ID);
    var target = e.target;
    if (target === origin){
        e.preventDefault();
    }
}
//downloads image on either mouseup or touchup
document.getElementById("a_left").addEventListener("mouseup", downloadAndColor, {passive: false});
document.getElementById("a_left").addEventListener("touchend", downloadAndColor, {passive: false});

//resizes canvas to fit
window.onload = function() {
    cw = $("#a_left").width();
    ch = $("#a_left").height();
    resizeCanvas(cw, ch);
    cleary();
};

function startNewSession(){
    $.ajax({
        type: 'POST',
        url: '/receiver',
        data: JSON.stringify('startNewSession'),
        success: function(data) { alert("data: " + data); },
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
    });
}

startNewSession();

//setup is called on page load
//helps set up the page by clearing canvases, and clearing image and texturized image data
function setup(){
    canvas = createCanvas(cw, ch);
    canvas.parent("a_left");
    strokeWeight(1).strokeCap(ROUND);
    stroke(0);
    ptouchIsDown = touchIsDown;
    pmouseIsPressed = mouseIsPressed;
    $.ajax({
        type: 'POST',
        url: '/receiver',
        data: JSON.stringify('clear'+currentModelNumber),
        success: function(data) { alert("data: " + data); },
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
    });
}

var canDraw = true;
//function for drawing on canvas with mouse or touch
var draw = function() {
if (cvsStk === undefined){
    changelayer();
}
if (canDraw) {
  if (ptouchIsDown && touchIsDown){
    thickness = document.getElementById("thickness").value;
    drawingContext.strokeStyle = brush_color;
    if (!isSelecting){
        if (mouseX <= cw && mouseY <= ch){
            path.push([mouseX, mouseY]);
        }
    }
    strokeWeight(thickness).strokeCap(ROUND);
    line(touchX, touchY, ptouchX, ptouchY);
    var drawingCanvas = document.getElementById("defaultCanvas0");
    if (!isSelecting){
        document.getElementById(current_layer_ID).getContext('2d').drawImage(drawingCanvas, 0, 0);
    }
  }
  if (pmouseIsPressed && mouseIsPressed){
    thickness = document.getElementById("thickness").value;
    drawingContext.strokeStyle = brush_color;
    if (!isSelecting){
        if (mouseX <= cw && mouseY <= ch){
            path.push([mouseX, mouseY]);
        }
    }
    strokeWeight(thickness).strokeCap(ROUND);
    line(mouseX, mouseY, pmouseX, pmouseY);
    var drawingCanvas = document.getElementById("defaultCanvas0");
    if (!isSelecting){
        document.getElementById(current_layer_ID).getContext('2d').drawImage(drawingCanvas, 0, 0);
    }
  }
  ptouchIsDown = touchIsDown;
  pmouseIsPressed = mouseIsPressed;
}
};

var isSelecting = false;

//function to both download the image and color it, to be called on mouseup or touchup
function downloadAndColor() {
    lastModified = "canvas";
    if (isSelecting){ //whether the user is selecting an area for an SVG to be drawn
        isSelecting = false;
        document.getElementById('defaultCanvas0').getContext('2d').strokeStyle = 'black';
        setTimeout(function(){insertSVG(svg_img_src);}, 10);
    } else {
        historyforpts.saveState();
        downloadimage(); //AUTODOWNLOAD ON END OF STROKE
    }
}
