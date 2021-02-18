//checks for change on input textbox
document.getElementById('user_text_input').addEventListener('keydown', function(){
  lastModified = 'textbox';
});

//speech recognition
var recognizing = false;
if (!('webkitSpeechRecognition' in window)) {
  upgrade();
} else {
  start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    start_img.src = 'static/images/gif/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      start_img.src = 'static/images/gif/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = 'static/images/gif/mic.gif';
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    lastModified = 'textbox';
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    start_img.src = 'static/images/gif/mic.gif';
    if (!final_transcript) {
      return;
    }
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('user_text_input'));
      window.getSelection().addRange(range);
    }
    user_text_input.value = linebreak(final_transcript);
    getinspiration();
    changelayerButton();
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = capitalize(final_transcript);
    if (linebreak(final_transcript)) {
      user_text_input.value = linebreak(final_transcript).concat(linebreak(interim_transcript));
    } else {
      user_text_input.value = linebreak(interim_transcript);
    }
    //console.log("interim: ", linebreak(interim_transcript), !(linebreak(interim_transcript)));
    //console.log("final: ", linebreak(final_transcript), !(linebreak(final_transcript)));
  };
}

function upgrade() {
  start_button.style.visibility = 'hidden';
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = "en-US";
  recognition.start();
  ignore_onend = false;
  user_text_input.value = '';
  start_img.src = 'static/images/gif/mic-slash.gif';
  start_timestamp = event.timeStamp;
}