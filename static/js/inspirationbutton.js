//places the recognized word into the inspiration column
//populates the inspiration column with related words
var recogSketch2 = "apple"; //default value to avoid errors

//grabs the last modified object
//is either "canvas" or "textbox"
var lastModified = "";

function getinspiration(){
    document.getElementById("inspiration").classList.add("selected_button");
    setTimeout(function(){document.getElementById("inspiration").classList.remove("selected_button");}, 500);

    clearGrid();
    if(lastModified === 'textbox'){
        var user_text  = document.getElementById('user_text_input').value;
        //console.log(user_text);
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: "/relationsFromText",
            dataType : 'json',
            data: JSON.stringify({'text': user_text}),
            success: callbackText
        });
        //  $.ajax({
        //     type: 'POST',
        //     url: '/receiver',
        //     data: JSON.stringify('userText' + user_text),
        //     success: function(data) { alert("data: " + data); },
        //     contentType: "application/json; charset=UTF-8",
        //     dataType: "json"
        // });
    } else if (lastModified === 'canvas') {
        ///**** code to trigger sketch recognition script
        $.ajax({
            cache: false,
            type: 'GET',
            url: '/recognition',
            data: JSON.stringify('recognizeSketch'),
            success: function(data) {
                 recogSketch2 = data.replace(" ","");
                 recogSketch2 = recogSketch2.replace(" ","");
                 //console.log(data);
                changeModel(recogSketch2);
                },
            async: false, // <- this turns it into synchronous
            contentType: "application/json; charset=UTF-8",
            dataType: "json"
        });
        /////***************************************
        //console.log(recogSketch2);

        recogdiv = document.getElementById("recognizedword");
        var rename_object_input = document.getElementById('rename_object_form');

        rename_object_input.style.visibility = "visible";
        var h1 = document.createElement("H2");
        var t1 = document.createTextNode(recogSketch2);
         h1.appendChild(t1);
         h1.addEventListener("click", function(){
             clearGrid();
             getPathsFromObject(event.target.innerHTML);
         });
         recogdiv.appendChild(h1);
         if (recogdiv.childNodes.length > 1){
             recogdiv.removeChild(recogdiv.childNodes[0]);
         }

         var example_words = genInsp(recogSketch2, 0);
         inspirationdiv = document.getElementById("words");
         inspirationdiv.innerHTML = '';
         for (let i = 0; i<example_words.length; ++i){
             (function(index){
                 setTimeout(function(){
                     //console.log(i);
                     //console.log(example_words[i]);
                     var h1 = document.createElement("H4");
                     var t1 = document.createTextNode(example_words[i]);
                     h1.appendChild(t1);
                     h1.addEventListener("click", function(){
                         clearGrid();
                         recogSketch2 = event.target.innerHTML;
                         getPathsFromObject(event.target.innerHTML);
                     });
                     inspirationdiv.appendChild(h1);
                 }, 300*(i+1));
             })(i);
         }
    }
}

//convert Enter key into entering the text, rather than refreshing the page
document.getElementById("user_text_form").addEventListener("submit", function(e){
    getinspiration();
    e.preventDefault();
}, false);


function renameObject(){
    var newLabel = document.getElementById('rename_object_input').value;
    console.log("NEWLABEL: " + newLabel);
    clearRenameObjectForm();
    var h1 = document.createElement("H2");
        console.log(recogSketch2);
        var t1 = document.createTextNode(newLabel);
         h1.appendChild(t1);
         h1.addEventListener("click", function(){
             clearGrid();
             getPathsFromObject(event.target.innerHTML);
         });
         recogdiv.appendChild(h1);
         if (recogdiv.childNodes.length > 1){
             recogdiv.removeChild(recogdiv.childNodes[0]);
         }
    $.ajax({
        type: 'POST',
        url: '/receiver',
        data: JSON.stringify('renamedObject:' + newLabel),
        contentType: "application/json; charset=UTF-8",
        dataType: "json"
    });
    return false;

}

//populates inspiration after posting user text to server
function callbackText(response) {
    // do something with the response
    //console.log(response);
    //console.log(JSON.parse(response));
    var recognizedWords = JSON.parse(response);
    recogSketch2 = recognizedWords[0];

    inspirationdiv = document.getElementById("words");
    inspirationdiv.innerHTML = '';
    for (let i = 0; i<recognizedWords.length; ++i) {
        (function (index) {
            setTimeout(function () {
                var h1 = document.createElement("H4");
                var t1 = document.createTextNode(recognizedWords[i]);
                h1.appendChild(t1);
                h1.addEventListener("click", function (){
                    clearGrid();
                    changeModel(event.target.innerHTML);
                    getPathsFromObject(event.target.innerHTML);
                });
                inspirationdiv.appendChild(h1);
            }, 300 * i);
        })(i);
    }
}

function isCanvasBlank(canvas) {
    const context = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    return !pixelBuffer.some(color => color !== 0);
}

function clearRenameObjectForm(){
    var rename_object_input = document.getElementById('rename_object_form');
    rename_object_input.style.visibility = "hidden";
    newLabel =  document.getElementById('rename_object_input').value;
    document.getElementById('rename_object_input').value = "";
}