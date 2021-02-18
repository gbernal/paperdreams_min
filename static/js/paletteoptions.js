var brush_color;
var thickness;

//allows a pen color to be selected if palette is enabled to be shown
function selectColor(el){
    for(var i=0;i<document.getElementsByClassName("palette").length;i++){
        document.getElementsByClassName("palette")[i].style.borderColor = "#777";
        document.getElementsByClassName("palette")[i].style.borderStyle = "solid";
    }
    el.style.borderColor = "#D2691E";
    el.style.borderStyle = "solid";
    brush_color = window.getComputedStyle(el).backgroundColor;
}
