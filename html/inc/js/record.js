//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var recorder; 						//WebAudioRecorder object
var input; 							//MediaStreamAudioSourceNode  we'll be recording
var encodingType; 					//holds selected encoding for resulting audio (file)
var encodeAfterRecord = true;       // when to encode

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //new audio context to help us record

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var s1 = document.getElementById("s1");
var s2 = document.getElementById("s2");
var r1 = document.getElementById("r1");
var r2 = document.getElementById("r2");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);


function startRecording() {
	console.log("startRecording() called");

	sendAuthNum();

	/*
		Simple constraints object, for more advanced features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

    /*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//assign to gumStream for later use
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		//get the encoding 
		encodingType = 'mp3';
		
		//disable the encoding selector
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "/inc/js/", // must end with slash
		  encoding: encodingType,
		  numChannels:2, //2 is the default, mp3 encoding supports only 2
		  onEncoderLoading: function(recorder, encoding) {
		    // show "loading encoder..." display
		    __log("Loading "+encoding+" encoder...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    // hide "loading encoder..." display
		    __log(encoding+" encoder loaded");
		  }
		});

		recorder.onComplete = function(recorder, blob) { 
			__log("Encoding complete");
			createDownloadLink(blob,recorder.encoding);
			encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
			timeLimit:310,
			encodeAfterRecord:encodeAfterRecord,
	    	ogg: {quality: 0.5},
	    	mp3: {bitRate: 160}
	    });

		//start the recording process
		recorder.startRecording();

		 __log("Recording started");

		s1.style.display = 'none';
		s2.style.display = '';
		r1.style.display = 'none';
		r2.style.display = '';

	}).catch(function(err) {
		stopTimer();
		s1.style.display = '';
		s2.style.display = 'none';
		r1.style.display = '';
		r2.style.display = 'none';
		alert('마이크 연결을 확인해 주세요.');
		return;

	});
}

function stopRecording() {
	console.log("stopRecording() called");
	document.getElementById('upload').innerHTML = '<span>파일생성중...</span>';	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	s1.style.display = '';
	s2.style.display = 'none';
	r1.style.display = '';
	r2.style.display = 'none';
	
	//tell the recorder to finish the recording (stop recording + encode the recorded audio)
	recorder.finishRecording();

	__log('Recording stopped');
	stopTimer();
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//link the a element to the blob
	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	//add the new audio and a elements to the li element
	li.appendChild(au);
	li.appendChild(link);

	var upload = document.getElementById('upload');
	upload.innerHTML = '<span>업로드</span>';
	var lv_upload = '';
	upload.addEventListener("click", function(event){

		$("#loading_area").css({"display":"block"});
		$("#loading_area").delay(500).fadeOut();

		  var r_cateseq4	= document.getElementById('r_cateseq4').value;
		  var cateseq4		= document.getElementById('cateseq4').value;

		  var xhr=new XMLHttpRequest();
		  xhr.onload=function(e) {
		      if(this.readyState === 4) {
				  alert('업로드 완료하였습니다.');
				  //opener.document.location.href = 'https://school.sunshinereadingclub.co.kr/pages/student/index_detail0330.asp?cateseq4='+cateseq4+'&r_cateseq4='+r_cateseq4;
				  document.location.reload();
				  opener.location.reload();
		          console.log("Server returned: ",e.target.responseText);
		      }
		  };

		  if (lv_upload == '1') {
			  alert('파일 업로드중입니다.\n잠시 기다려주세요.');
		  }
		  var fd=new FormData();
		  var mp3Name = encodeURIComponent('audio_recording_' + new Date().getTime() + '.mp3');
		  fd.append("audio_data",blob, mp3Name);
		  fd.append("r_cateseq4",r_cateseq4);
		  fd.append("cateseq4",cateseq4);
		  xhr.open("POST","/record/upload.asp",true);
		  xhr.send(fd);
		  lv_upload = '1';
	})
}


function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",recorder.recording );
	if (recorder.recording){
		//pause
		recorder.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		recorder.record()
		pauseButton.innerHTML="Pause";
	}
}

//helper function
function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}