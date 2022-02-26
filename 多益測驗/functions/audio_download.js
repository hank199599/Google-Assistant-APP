const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const urlParse = require('url').parse;
const googleTTS = require('google-tts-api'); // CommonJS
var accent_list = ["en-US", "en-UK", "en-IN", "en-AU"]; //可選取的口音清單

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const info = urlParse(url);
        const httpClient = info.protocol === 'https:' ? https : http;
        const options = {
            host: info.host,
            path: info.path,
            headers: {
                'user-agent': 'WHAT_EVER',
            },
        };

        httpClient
            .get(options, (res) => {
                // check status code
                if (res.statusCode !== 200) {
                    const msg = `request to ${url} failed, status code = ${res.statusCode} (${res.statusMessage})`;
                    reject(new Error(msg));
                    return;
                }
                console.log(dest)
                const file = fs.createWriteStream(dest);
                file.on('finish', function() {
                    // close() is async, call resolve after close completes.
                    file.close(resolve);
                });
                file.on('error', function(err) {
                    // Delete the file async. (But we don't check the result)
                    fs.unlink(dest);
                    reject(err);
                });

                res.pipe(file);
            })
            .on('error', reject)
            .end();
    }).catch(function(error) {

        console.log(error)

    });
}

// start
var word_list = Object.keys(require('./dict.json'));
var accent = accent_list[3]; 

console.log(word_list.length)

k = 2

for (var i = k*1000; i < (k+1)*1000+1; i++) {
// for (var i = k*1000; i < 4360; i++) {
    
        const url = googleTTS.getAudioUrl(word_list[i], {
            lang: accent,
            slow: false,
            host: 'https://translate.google.com',
    });;
    console.log(url); // https://translate.google.com/translate_tts?...

    var dirname = "D:/程式設計/自己的網頁/Github備份位址/多益測驗/audio/"+accent.replace("en","EN")+"/";

    const dest = path.resolve(dirname, word_list[i]+'.mp3'); // file destination
    
    console.log(i);
    downloadFile(url, dest);
    console.log('Download success');
    if (i+1 === word_list.keys().length) {break}
}