//SERENDIPITY WHEEL CODE
//boolean to turn wheel on (true) and off (false)
var serendipity = true;
//http://wheelnavjs.softwaretailoring.net/index.html
if (serendipity){
var wheel = new wheelnav("wheelDiv");
//wheel.currentPercent = 0; //wheel starts off closed
wheel.wheelRadius = 120; //wheel's open radius
wheel.spreaderRadius = 28; //wheel's closed radius
wheel.spreaderEnable = true; //can be opened and closed
wheel.spreaderPathInAttr = { fill: '#FFF', 'stroke-width': 1, stroke: '#d8d8d8' }; //formatting for button closed
wheel.spreaderPathOutAttr = { fill: '#d8d8d8', 'stroke-width': 1, stroke: '#FFF' }; //formatting for button open
wheel.spreaderTitleInAttr = { fill: '#555' }; //color of plus sign
wheel.spreaderTitleOutAttr = { fill: '#555' }; //color of minus sign
wheel.navAngle = 180; //starting position of wheel
//wheel.markerEnable = true;
//wheel.markerPathFunction = markerPath().DropMarker;
//wheel.markerAttr = {fill: "#FFd800", stroke: "none"};
wheel.colors = ["#c5c6d0", "#a6aace", "#9197ce", "#353535"]; //color of wheel
//place to grab icons names that can be written as icon.name: http://dmitrybaranovskiy.github.io/raphael/icons/#thunder
wheel.initWheel(["imgsrc:static/images/emojis/noun2-new.svg", "imgsrc:static/images/emojis/noun1-new.svg", "imgsrc:static/images/emojis/noun4.svg"]);
wheel.navItems[0].navigateFunction = function () { change0(); }; //calls change0() if first section of wheel is clicked
wheel.navItems[1].navigateFunction = function () { change1(); }; //calls change1() if second section of wheel is clicked
wheel.navItems[2].navigateFunction = function () { change2(); }; //calls change2() if third section of wheel is clicked
wheel.createWheel(); //creates the wheel
//wheel.spreadWheel();
}

var objectDict = {};
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/conceptnet-lily.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var line = [];
            for (var j=0; j<headers.length; j++) {
                line.push(data[j]);
            }
            if (line[0] in objectDict) {
                if (line[0] == line[2]) {
                    //in the case of ['alarm', '10', 'alarm'], for instance
                    //ignores if the first item and last item in a row are the same
                } else if (line[1] in objectDict[line[0]]){
                    objectDict[line[0]][line[1]].push(line[2]);
                } else {
                    objectDict[line[0]][line[1]] = [line[2]];
                }
            } else {
                objectDict[line[0]] = {};
                objectDict[line[0]][line[1]] = [line[2]];
            }
        }
    }
}


objects = ['airplane', 'alarm', 'apple', 'balloon', 'banana', 'bear', 'bee', 'bell', 'bench', 'bicycle', 'bird', 'blimp', 'book', 'bus', 'butterfly', 'cabin', 'camel', 'camera', 'car', 'castle', 'cat', 'chair', 'church', 'couch', 'cow', 'crab', 'crocodile', 'cup', 'dinosaur', 'dog', 'dolphin', 'door', 'duck', 'elephant', 'fish', 'flower', 'frog', 'giraffe', 'guitar', 'hamburger', 'hammer', 'hat', 'hedgehog', 'helicopter', 'horse', 'hotdog', 'hourglass', 'hydrant', 'kangaroo', 'laptop', 'lion', 'lobster', 'microphone', 'microscope', 'monitor', 'monkey', 'moon', 'motorcycle', 'mouse', 'mushroom', 'octopus', 'owl', 'palm', 'panda', 'parachute', 'parrot', 'penguin', 'people', 'pickup', 'pig', 'pinapple', 'pizza', 'rabbit', 'rooster', 'sailboat', 'satellite', 'saucer', 'saxophone', 'scorpion', 'sea', 'seagull', 'shark', 'sheep', 'shoe', 'shuttle', 'sitting', 'skyscraper', 'snail', 'snake', 'spider', 'spoon', 'squirrel', 'strawberry', 'swan', 'table', 'tank', 'teapot', 'teddy', 'tiger', 'tomato', 'tree', 'trumpet', 'turtle', 'umbrella', 'violin', 'walking', 'windmill', 'zebra'];

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

//This function returns a list of 9 words given the selected word - "object" and wheel option - "wheelNum"
function genInsp (object, wheelNum) {
    //How many objects to choose from
    //i.e. closest 25, furthest 25, etc
    var grab_width = 20;

    //Dictionary that shows concept net data for current object
    var currentDict = objectDict[object];

    //list of rating values arranged in order of increasing value
    var keys = Object.keys(currentDict);
    keys = keys.sort(function(a){return parseInt(a)});

    //creates list of objects by increasing key value
    var ordered_objects = [];
    for (var k = 0; k < keys.length; k++){
        ordered_objects = ordered_objects.concat(currentDict[keys[k]]);
    }

    //generates appropriate range of objects, given grab_width
    var options = [];
    if (wheelNum == 0){
        options = ordered_objects.slice(ordered_objects.length - grab_width, ordered_objects.length);
    } else if (wheelNum == 1) {
        options = ordered_objects.slice(Math.floor(ordered_objects.length/2 - Math.floor(grab_width/2)), Math.floor(ordered_objects.length/2) + Math.ceil(grab_width/2));
    } else if (wheelNum == 2) {
        options = ordered_objects.slice(0, grab_width);
    } else {
        throw new RangeError("More than 3 wheel options- genInsp needs to be updated");
    }

    //grabs 9 random items from the range
    var result = getRandom(options, 9);
    return result;
}

var timeoutList = [];
    clearWheelTimeouts(timeoutList);
    wheel.spreadWheel();

    recogdiv = document.getElementById("recognizedword");
    var h1 = document.createElement("H2");
//Function for if first section of wheel is clicked
function change0(){
    clearGrid();
    // var t1 = document.createTextNode(recogSketch2);
    // h1.appendChild(t1);
    // h1.addEventListener("click", function(){
    //      clearGrid();
    //      getPathsFromObject(event.target.innerHTML);
    // });
    // recogdiv.appendChild(h1);
    // if (recogdiv.childNodes.length > 3){
    //      recogdiv.removeChild(recogdiv.childNodes[0]);
    // }

    inspirationdiv = document.getElementById("words");
    inspirationdiv.innerHTML = ''; //clears current words
    wordList = genInsp(recogSketch2, 0);  /// I'm assuming this is the least similar?

    //puts in new words
    for (let i = 0; i<wordList.length; ++i){
        (function(index){
            var timeout = setTimeout(function(){
                var h1 = document.createElement("H4");
                var t1 = document.createTextNode(wordList[i]);
                h1.appendChild(t1);
                h1.addEventListener("click", function(){
                    clearGrid();
                    recogSketch2 = event.target.innerHTML;
                    getPathsFromObject(event.target.innerHTML);
                });
                inspirationdiv.appendChild(h1);
            }, 200*i);
            timeoutList.push(timeout);
        })(i);
    }
}

//Function for if second section of wheel is clicked
function change1(){
    clearGrid();
    clearWheelTimeouts(timeoutList);
    wheel.spreadWheel();

    // recogdiv = document.getElementById("recognizedword");
    // var h1 = document.createElement("H2");
    // var t1 = document.createTextNode(recogSketch2);
    // h1.appendChild(t1);
    // h1.addEventListener("click", function(){
    //      clearGrid();
    //      getPathsFromObject(event.target.innerHTML);
    // });
    // recogdiv.appendChild(h1);
    // if (recogdiv.childNodes.length > 3){

    if (recogdiv.childNodes.length > 3){ $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('userText' + user_text),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
         recogdiv.removeChild(recogdiv.childNodes[0]);
    }

    inspirationdiv = document.getElementById("words");
    inspirationdiv.innerHTML = ''; //clears current words
    wordList = genInsp(recogSketch2, 1);

    //puts in new words
    for (let i = 0; i<wordList.length; ++i){
        (function(index){
            var timeout = setTimeout(function(){
                var h1 = document.createElement("H4");
                var t1 = document.createTextNode(wordList[i]);
                h1.appendChild(t1);
                h1.addEventListener("click", function(){
                    clearGrid();
                    recogSketch2 = event.target.innerHTML;
                    getPathsFromObject(event.target.innerHTML);
                });
                inspirationdiv.appendChild(h1);
            }, 200*i);
            timeoutList.push(timeout);
        })(i);
    }
}

//Function for if third section of wheel is clicked
function change2(){
    clearGrid();
    clearWheelTimeouts(timeoutList);
    wheel.spreadWheel();
    // recogdiv = document.getElementById("recognizedword");
    // var h1 = document.createElement("H2");
    // var t1 = document.createTextNode(recogSketch2);
    // h1.appendChild(t1);
    // h1.addEventListener("click", function(){
    //      clearGrid();
    //      getPathsFromObject(event.target.innerHTML);
    // });
    // recogdiv.appendChild(h1);
    // if (recogdiv.childNodes.length > 3){
    //      recogdiv.removeChild(recogdiv.childNodes[0]);
    // }

    inspirationdiv = document.getElementById("words");
    inspirationdiv.innerHTML = ''; //clears current words
    wordList = genInsp(recogSketch2, 2);

    //puts in new words
    for (let i = 0; i<wordList.length; ++i){
        (function(index){
            var timeout = setTimeout(function(){
                var h1 = document.createElement("H4");
                var t1 = document.createTextNode(wordList[i]);
                h1.appendChild(t1);
                h1.addEventListener("click", function(){
                    clearGrid();
                    recogSketch2 = event.target.innerHTML;
                    getPathsFromObject(event.target.innerHTML);
                });
                inspirationdiv.appendChild(h1);
            }, 200*i);
            timeoutList.push(timeout);
        })(i);
    }
}

function clearWheelTimeouts(timeoutList){
    for (let tc = 0; tc<timeoutList.length; ++tc){
        clearTimeout(timeoutList[tc]);
    }
    timeoutList = [];
}