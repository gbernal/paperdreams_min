var colorButtonState = true; //whether the button is on or off by default
if (colorButtonState === true){
	document.getElementById("colorimage").classList.add("selected_button");
}

//allows the color button to toggle on / off for constant coloring
function colorButtonStateChange(){
    if (colorButtonState == false){
        colorButtonState = true;
        document.getElementById("colorimage").classList.add("selected_button");
        //document.getElementById("cont").classList.add("rainbow");
    } else {
        colorButtonState = false;
        document.getElementById("colorimage").classList.remove("selected_button");
        //document.getElementById("cont").classList.remove("rainbow");
    }
}