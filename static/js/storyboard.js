window.onload = function(){
var captions = [];
var slideIndex = 0;

//converts captions.txt into a captions list
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "/static/images/storyboard/captions.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

//helper function for converting captions.txt
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i];
        captions.push(data);
    }
    grabCanvasPics();
    showSlides(slideIndex);
}

//Grabs images from canvas folder
var getMorePics = true;
var storyboardPicPath = "/static/images/storyboard/canvas";
var canvasCounter = 0;
function grabCanvasPics(){
	while (getMorePics){
		var image_url = storyboardPicPath.concat(String(canvasCounter)).concat('.png');
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function() {
		    if (xhr.readyState === 4){   //if complete
		    	if (xhr.status === 404){ //tries to check for 404
		    		getMorePics = false;
		    		//https://bugs.chromium.org/p/chromium/issues/detail?id=124534
		    		console.log('This 404 error is fine and unfixable for now because of a larger Google Chrome bug.');
		    		console.log('See https://bugs.chromium.org/p/chromium/issues/detail?id=124534 for more details.');
		    	}
		        else if (xhr.status === 200){  //check if "OK" (200)
		        	//for populating cont
			        var newItemDiv = document.createElement('div');
					newItemDiv.className = "column";

		        	var newImg = document.createElement("IMG");
					newImg.src = image_url;
					newImg.setAttribute("style", "width:100%");
					newImg.className = "hover-shadow cursor";
					newImg.addEventListener("click", function(){
                        openModal();
                        let canvasURL = event.target.src.replace(location.origin,"");
                        let canvasID  = canvasURL.replace(storyboardPicPath,"").replace(".png","");
                        currentSlide(parseInt(canvasID)+1);      
                    });
                    
                    newItemDiv.appendChild(newImg);
					document.getElementById("cont").appendChild(newItemDiv);
					

					//for populating pre-slides-cont
					var preSlidesImg = document.createElement("IMG");
					preSlidesImg.src = image_url;
					preSlidesImg.setAttribute("style", "width:100%");
			        
			        var preSlidesDiv = document.createElement('div');
					preSlidesDiv.className = "mySlides";
					
					preSlidesDiv.appendChild(preSlidesImg);
					document.getElementById("pre-slides-cont").appendChild(preSlidesDiv);


					//for populating post-slides-cont
					var postSlidesImg = document.createElement("IMG");
					postSlidesImg.src = image_url;
					postSlidesImg.setAttribute("style", "width:100%");
					postSlidesImg.className = "demo cursor";
					postSlidesImg.alt = captions[canvasCounter];
					postSlidesImg.addEventListener("click", function(){
                        let canvasURL = event.target.src.replace(location.origin,"");
                        let canvasID  = canvasURL.replace(storyboardPicPath,"").replace(".png","");
                        currentSlide(parseInt(canvasID)+1);      
                    });
			        
			        var postSlidesDiv = document.createElement('div');
					postSlidesDiv.className = "column";
					
					postSlidesDiv.appendChild(postSlidesImg);
					document.getElementById("post-slides-cont").appendChild(postSlidesDiv);
					
					canvasCounter += 1;
		        } else {
		            console.log(xhr.status);
		        }
			}
		};
		xhr.open('GET', image_url, false);		
		xhr.send();
	}
}
};

//JS for lightbox gallery scrolling
function openModal() {
  document.getElementById('myModal').style.display = "block";
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
}

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

//adds code to check for right/left arrow keydowns
$(document).keydown(function(event){
	if (event.keyCode == '37'){
		plusSlides(-1);
	} else if (event.keyCode == '39'){
		plusSlides(1);
	}
});

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}