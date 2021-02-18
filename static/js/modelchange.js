//mapping keyboard numbers to model numbers
var modelDict = {'1': "paperdream_dino",
                    '2': "paperdream_family",
                    '3': "paperdream_flower",
                    '4': "paperdream_animals",
                    '5': "paperdream_spaceship",
                    '6': "paperdream_buildings",
                    '7': "paperdream_plants",
                    '8': "paperdream_schoolbus",
                    '9': "paperdream_landscape",
                    '10': "paperdream_robots",
                    '11': "paperdream_transportation",
                    '12': "paperdream_fruit",
                    '13': "paperdream_random",
                    '14': "paperdream_animals_BW",
                    '15': "paperdream_fish",
                    '16': "paperdream_bird"

                };
var currentModelNumber = 1;
var currentModel = modelDict[currentModelNumber];

$.ajax({
    type: 'POST',
    url: '/receiver',
    data: JSON.stringify('update' + String(currentModelNumber)),
    success: function(data) { alert("data: " + data); },
    contentType: "application/json; charset=UTF-8",
    dataType: "json"
});

var modelDictInv = {};
for(var key in modelDict){
    modelDictInv[modelDict[key]] = key;
}

///creates a dictionary for {class : model}
var class2modelDict = {};
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/classes2models.csv",
        dataType: "text",
        success: function(data) {class2modelProcess(data);}
     });
});

function class2modelProcess(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {
            var line = [];
            for (var j=0; j<headers.length; j++) {
                line.push(data[j]);
            }
            class2modelDict[line[0]] = line[1];
        }
    }
}

function changeModel (class_name) {
    //checks if the model and class are available
    tempModel = ("paperdream_").concat(class2modelDict[class_name]);
    console.log(tempModel);
    console.log(class_name);
    if (tempModel in modelDictInv){
        currentModel = tempModel;
        currentModelNumber = modelDictInv[currentModel];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + String(currentModelNumber)),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
    }
}



function changeModel_pallette (class_name) {
    //checks if the model and class are available
    tempModel = ("paperdream_").concat(class_name);
    console.log(tempModel);
    if (tempModel in modelDictInv) {
        currentModel = tempModel;
        currentModelNumber = modelDictInv[currentModel];

        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + String(currentModelNumber)),
            success: function (data) {
                alert("data: " + data);
            },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
    }
}


//Keypresses to change model, via the numbers 1-9
$(document).keypress(function(event){
    if (String.fromCharCode(event.which)==='1'){
        currentModelNumber = 1;
        currentModel = modelDict['1'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '11'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='2') {
        currentModelNumber = 2;
        currentModel = modelDict['2'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '2'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='3') {
        currentModelNumber = 3;
        currentModel = modelDict['3'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '3'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='4') {
        currentModelNumber = 4;
        currentModel = modelDict['4'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '4'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='5') {
        currentModelNumber = 5;
        currentModel = modelDict['5'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '5'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='6') {
        currentModelNumber = 6;
        currentModel = modelDict['6'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '6'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='7') {
        currentModelNumber = 7;
        currentModel = modelDict['7'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '7'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='8') {
        currentModelNumber = 8;
        currentModel = modelDict['8'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '8'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='9') {
        currentModelNumber = 9;
        currentModel = modelDict['9'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '9'),
            success: function(data) { alert("data: " + data); },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    } else if (String.fromCharCode(event.which)==='0') {
        currentModelNumber = 0;
        currentModel = modelDict['0'];
        $.ajax({
            type: 'POST',
            url: '/receiver',
            data: JSON.stringify('update' + '0'),
            success: function (data) {
                alert("data: " + data);
            },
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        changelayer();
    }
});
