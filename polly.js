var fs = require(‘fs’);
var AWS = require(‘aws-sdk’);
require(‘ auth-config-polly.js’);

function PollyImplemetation(req, callback) {
var msg = req.text;
var id = req.id
var polly = new AWS.Polly();
var descParams = {
LanguageCode: ‘en-US’
};

polly.describeVoices(descParams, function (err, data) {
if (err) {
console.log(err);
callback(null)
} else {
var thevoiceId = data.Voices[0].Id;
// synthesizeSpeech
var textMsg = msg;
var speechParams = {
“OutputFormat”: ‘mp3’,
“VoiceId”: thevoiceId,
“Text”: textMsg,
“SampleRate”: ‘22050’,
“TextType”: ‘text’
};
polly.synthesizeSpeech(speechParams, function (err, data) {
if (err) {
console.log(err);
callback(null)
} else {
fs.writeFile(‘./public/ ‘ + id + ‘.mp3’, data.AudioStream, function (err) {
console.log(‘file writing in local ‘);
if (err) {

console.log(err);
callback(null)
} else {
//uploading to S3 bucket process
var fileStream = fs.createReadStream(‘./public/’ + id + “” + ‘.mp3’);
fileStream.on(‘error’, function (err) {
if (err) {
console.log(err);
callback(null)
}
});
fileStream.on(‘open’, function () {
var s3 = new AWS.S3();
s3.putObject({
Bucket: ‘mp3bucketname’,
Key: ‘mp3/’ + id + ‘.mp3’,
ACL: ‘public-read’,
Body: fileStream
}, function (err) {
if (err) {
console.log(err);
callback(null)
} else {
callback(id + ‘.mp3’)
}
});
});

}
});
}
});
}

});
}

 

 
