//clears the SVG grid of images
function clearGrid() {
    document.getElementById("svg_grid").innerHTML = "";
}

//var svg_image_paths = ['static/images/exampleSVGs/bird_aoitori_bluebird-1c.svg', 'static/images/exampleSVGs/bird_aoitori_bluebird-2c.svg', 'static/images/exampleSVGs/bird_aoitori_bluebird-3c.svg', 'static/images/exampleSVGs/bird_aoitori_bluebird-4c.svg',  'static/images/exampleSVGs/bird_aoitori_bluebird-5c.svg', 'static/images/exampleSVGs/bird_aoitori_bluebird-6c.svg'];
var svg_img_src;
var svg_image_paths;
var object_path_list;

var last_object_called = "airplane";
function getPathsFromObject(object) {
    last_object_called = object;
    var rawFile = new XMLHttpRequest();
      rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
          if (rawFile.status === 200) {
            var allText = rawFile.responseText;
            var split = allText.split('\n');
            var index, value, result;
            object_path_list = [];
            for (index = 0; index < split.length; ++index) {
                value = split[index];
                if (value.includes("/"+ object +"/")) {
                    if (!(value.includes(".txt"))) {
                        object_path_list.push(value);
                    }
                }
            }
            shuffleArray(object_path_list);
            svg_image_paths = object_path_list.slice(0,6);
            populateGrid(svg_image_paths);
          }
        }
      };
      rawFile.open("GET", "/static/images/SVGfilelist.txt", false);
      rawFile.send(null);
}

function shuffleArray(array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

var entering_infinite_loop = 0;
var selectedNode = null;
//takes in six image SVGs (possibly more, but optimized for 6)
function populateGrid(svg_image_paths) {
    clearGrid();
    var svg_grid_div = document.getElementById("svg_grid");
    for (path_num in svg_image_paths){
        var svg_img = document.createElement("img");
        svg_img.draggable = "false";
        svg_img.src = "/static/images/SVGdatabase" + svg_image_paths[path_num];
        svg_img.onerror = function (){
            entering_infinite_loop += 1;
            console.log('INVALID URL');
            if (entering_infinite_loop < 10){
                getPathsFromObject(last_object_called);
            }
        };
        svg_img.onload = function(){
            entering_infinite_loop = 0;
        };
        svg_img.classList.add("svg_image");
        svg_img.addEventListener("mousedown", function() {
            if (canDraw){
                if (event.target.isSameNode(selectedNode)){
                    selectedNode = null;
                    var svgNodes = svg_grid_div.childNodes;
                    svgNodes.forEach(function (currentNode){
                        currentNode.classList.remove("selected_svg_image");
                    });
                    document.getElementById('defaultCanvas0').getContext('2d').strokeStyle = 'black';
                    isSelecting = false;
                } else {
                    selectedNode = event.target;
                    changelayer();
                    var svgNodes = svg_grid_div.childNodes;
                    svgNodes.forEach(function (currentNode){
                        currentNode.classList.remove("selected_svg_image");
                    });
                    event.target.classList.add("selected_svg_image");
                    svg_img_src = event.target.src.replace(location.origin,"");
                    var src_split = svg_img_src.split("/");
                    changeModel(src_split[src_split.length - 2]);
                    document.getElementById('defaultCanvas0').getContext('2d').strokeStyle = 'red';
                    isSelecting = true;
                }
            } 
        });
        svg_grid_div.appendChild(svg_img);
    }
}
