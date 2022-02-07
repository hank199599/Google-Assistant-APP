var getJSON = require('get-json')
const admin = require('firebase-admin');
let serviceAccount = require("./config/b1a2b-krmfch-firebase-adminsdk-1tgdm-7347f3fed7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://b1a2b-krmfch.firebaseio.com/"
});

const database = admin.database();


function station_report() {

    var output = {};
    var locations = [];

    new Promise(function(resolve, reject) {
        getJSON('https://data.epa.gov.tw/api/v1/aqx_p_432?format=json&limit=100&api_key=e44e7dd6-8d7a-433d-9fe6-8327b8dcfcad').then(function(response) {
            resolve(response.records)
        }).catch(function(error) { reject(new Error('資料獲取失敗')) });
    }).then(function(origin_data) {
        for (var i = 0; i < origin_data.length; i++) {
            output[origin_data[i].SiteName] = {
                Pollutant: origin_data[i].Pollutant,
                AQI: origin_data[i].AQI,
                PM10: origin_data[i]['PM10'],
                PM25: origin_data[i]['PM2.5'],
                O3: origin_data[i].O3,
            }
            locations[i] = {
                lng: parseFloat(origin_data[i].Longitude),
                lat: parseFloat(origin_data[i].Latitude),
                Sitename: origin_data[i].SiteName
            }
        }

        console.log(output)
        
        if (Object.keys(output).length !== 0) {
            database.ref('/TWair').update({ data: output });
        }
        if (locations.length !== 0) {
            database.ref('/TWair').update({ 'locations': locations });
        }

    }).catch(function(error) {
        console.log("air_report_set error : " + error)
    });

}

station_report()