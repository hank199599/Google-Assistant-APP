'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const { dialogflow, SimpleResponse, Image, BasicCard, Button, Table } = require('actions-on-google');
const functions = require('firebase-functions');
var request = require('request');
var getJSON = require('get-json')
const app = dialogflow({ debug: true });


app.intent('預設歡迎語句', (conv) => {

    return new Promise(

        function(resolve, reject) {

            if (conv.user.name.given === undefined) {

                getJSON('https://us-central1-newagent-1-f657d.cloudfunctions.net/data_fetching_backend/tw_power')
                    .then(function(response) {
                        resolve(response);
                    }).catch(function(error) {
                        reject(error);
                    });
            } else {
                reject("Google測試我是否還活著");
            }

        }).then(function(final_data) {

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是台灣電力公司，在${final_data.update_time}發布之電力資訊<break time="0.5s"/>目前的用電量是${final_data.curr[0]}萬千瓦，佔最大供應量約${final_data.curr[1]}%。</s><s>預估尖峰時段在${final_data.time_interval}，用電量將來到${final_data.max}萬千瓦</s><s>整體而言現在${final_data.indicator[1]}</s></p></speak>`,
            text: "這是來自台電的最新電力資訊",
        }));

        conv.close(new Table({
            title: final_data.indicator[0] + " " + final_data.indicator[1],
            subtitle: '更新時間 • ' + final_data.update_time,
            columns: [{ header: '類別', align: 'CENTER', }, { header: '用電量(萬瓩)', align: 'CENTER', }, { header: '使用率', align: 'CENTER', }, ],
            rows: [{
                    cells: ['目前', final_data.curr[0], final_data.curr[1] + "%"],
                    dividerAfter: false,
                },
                {
                    cells: ['尖峰預測', final_data.forecast[0], final_data.forecast[1] + "%"],
                    dividerAfter: false,
                },
                {
                    cells: ['最大供應量', final_data.max, "　"],
                    dividerAfter: false,
                },
                {
                    cells: ['預測尖峰時段', final_data.time_interval, "　"],
                    dividerAfter: false,
                }
            ],
            buttons: new Button({
                title: '查看更多資訊',
                url: 'https://www.taipower.com.tw/tc/page.aspx?mid=206&cid=402&cchk=8c59a5ca-9174-4d2e-93e4-0454b906018d',
            }),
        }));


    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生一點狀況，請稍後再試',
        }));
        console.log(error)

        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/e0ca02/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            display: 'CROPPED',
        }));

    });
});



app.intent('機組發電量統計', (conv) => {

    return new Promise(

        function(resolve, reject) {

            getJSON('https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.txt', function(error, response) {

                if (error) { reject(error) }

                var data = response.aaData;
                var output = [];
                var total = 0;

                for (var i = 0; i < data.length; i++) {
                    var temp = data[i];
                    if (temp.indexOf("小計") !== -1) {

                        var name = temp[0].replace(/\s/gm, "");
                        name = name.replace(/[<]+[/]+[a-zA-Z]+[>]/gm, "");
                        name = name.replace(/[<]+[a-zA-Z]+[>]/gm, "");
                        name = name.replace(/[<]+[\S+]+[>]/gm, "");
                        name = name.replace(/[(]+[\S+]+[)]/gm, "");

                        var percent = temp[3].replace(')', "");
                        percent = percent.split('(');
                        output.push({
                            cells: [name, percent[0], percent[1]],
                            dividerAfter: false,
                        })

                        total = total + parseFloat(percent[0]);

                    }
                }

                resolve([output, parseInt(total)]);

            });


        }).then(function(final_data) {
        var time = new Date();
        var update_time = time.getMinutes() % 10;
        if (update_time === 0) { update_time = "剛剛" } else { update_time = update_time + "分鐘前" }

        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>以下是台灣電力公司，在${update_time}發布之各機組發電量資訊。目前總發電量為${final_data[1]}兆瓦</s></p></speak>`,
            text: "這是來自台電的最新機組發電量資訊資訊",
        }));

        conv.close(new Table({
            title: "總計 " + final_data[1] + " MW",
            subtitle: '更新時間 • ' + update_time,
            columns: [{ header: '類別', align: 'CENTER', }, { header: '淨發電量(MW)', align: 'CENTER', }, { header: '占總量比例', align: 'CENTER', }, ],
            rows: final_data[0],
            buttons: new Button({
                title: '查看更多資訊',
                url: 'https://www.taipower.com.tw/d006/loadGraph/loadGraph/genshx_.html',
            }),
        }));

    }).catch(function(error) {
        conv.ask(new SimpleResponse({
            speech: `<speak><p><s>獲取資料發生錯誤，請稍後再試。</s></p></speak>`,
            text: '獲取資訊發生一點狀況，請稍後再試',
        }));
        console.log(error)

        conv.close(new BasicCard({
            image: new Image({ url: 'https://dummyimage.com/1037x539/e0ca02/ffffff.png&text=錯誤', alt: 'Pictures', }),
            title: "發生錯誤，請稍後再試",
            display: 'CROPPED',
        }));

    });

});



// Set the DialogflowApp object to handle the HTTPS POST request.
exports.tw_power_index = functions.https.onRequest(app);