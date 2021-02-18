//draws image onto canvas to get the imageData array (which can be processed pixel by pixel)
function image2imageData(image){
    var c = document.createElement("canvas");
    c.width = image.width;
    c.height = image.height;
    var ctx = c.getContext("2d");
    ctx.drawImage(image, 0, 0);
    return ctx.getImageData(0, 0, image.width, image.height);
}

//converts the imageData array into a dataURL by drawing it onto a canvas, which can be downloaded and saved
function imageData2dataURL(imageData){
    var c = document.createElement('canvas');
    c.width = imageData.width;
    c.height = imageData.height;
    var ctx = c.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return c.toDataURL('image/png');
}

//converts white pixels (or close to white pixels) to transparent pixels; important for layering without weird white spots
function white2transparentImageData(imageData){
    var pixel = imageData.data;
        var r=0, g=1, b=2,a=3;
    for (var p = 0; p<pixel.length; p+=4)
    {
      if ((pixel[p+r] > 245) & (pixel[p+g]) > 245 & (pixel[p+b] > 245)){ // if white then change alpha to 0
        pixel[p+a] = 0;
      }
      if (pixel[p] != 0){
      }
      // if ((pixel[p+r] < 5) & (pixel[p+g]) < 5 & (pixel[p+b] < 5)){ // if white then change alpha to 0
      //   pixel[p+a] = 0;
      // }
    }
    imageData.data = pixel;
    return imageData;
}

