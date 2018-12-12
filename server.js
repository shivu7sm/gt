//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var express = require("express");
var app = express();
app.set("view engine", "ejs");
var bodyParser = require("body-parser");
//var req = require('request');
app.use(bodyParser.json());

// Your Google Cloud Platform project ID
const projectId = 'gtranslate-1544502802958';
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Translate } = require('@google-cloud/translate');
// Creates a client
const client = new speech.SpeechClient();
const clientT = new textToSpeech.TextToSpeechClient();

//Config Items

app.post('/translate/:sLang/:tLang', function(req, res) {
  const targetLang = req.params.tLang;
  const targetLangCode = 'en-US';
  const sourceLang = req.params.sLang;
  const audio = {
    content: req.body.audioData,
  };
  const config = {
    encoding: 'AMR',
    sampleRateHertz: 8000,
    languageCode: sourceLang,
  };

  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
     // res.send(transcription);
      const text = "Hello";
      // Translates some text to other language
      translate
        .translate(text, targetLang)
        .then(results => {
          const translation = results[0];
          const request = {
            input: { text: translation },
            // Select the language and SSML Voice Gender (optional)
            voice: { languageCode: targetLangCode, ssmlGender: 'FEMALE' },
            // Select the type of audio encoding
            audioConfig: { audioEncoding: 'OGG_OPUS' },
          };

          clientT.synthesizeSpeech(request, (err, response) => {
            if (err) {
              console.error('ERROR:', err);
              return;
            }
            res.send(response.audioContent.toString("base64"));

          });
          console.log(`Translation: ${translation}`);

        })
        .catch(err => {
          console.error('ERROR:', err);
        });

    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  // Instantiates a client
  const translate = new Translate({
    projectId: projectId,
  });
  //res.send("Audio");
});








// The text to translate


app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Server Started: Dashboard started");

});

/*server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Translation Running", addr.address + ":" + addr.port);
});*/
