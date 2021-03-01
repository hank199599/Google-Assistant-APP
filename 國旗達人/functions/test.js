var flag_list = require('./country_detail.json'); //引用外部函數來輸入國旗答案與解釋
var county_list = Object.keys(flag_list);
var Q_Total = county_list.length; //題目總數

var Currect_list = ["A", "B", "C", "D"];
var Q = 0;
var Q_list = [];
var Answer_list = [];

Q = parseInt(Math.random() * Q_Total);
if (Q_list.indexOf(Q) !== -1) { Q = (Q + 1) % (Q_Total + 1); }
if (Q_list.indexOf(Q) !== -1) { Q = (Q + 1) % (Q_Total + 1); }
if (Q_list.indexOf(Q) !== -1) { Q = (Q + 1) % (Q_Total + 1); }
Q_list.push(Q); // 將現在選出的編號存入陣列

var selector = parseInt(Math.random() * 3);

Currect_Answer = county_list[Q]; //取得本題目的正確國名
picture_url = "https://raw.githubusercontent.com/hank199599/Google-Assistant-APP/master/%E5%9C%8B%E6%97%97%E9%81%94%E4%BA%BA/flags/" + Currect_Answer + ".png"; //取得本題目的正確國旗
var Describes = flag_list[Currect_Answer];
var Currect = Currect_list[selector];
Answer_list[selector] = Currect_Answer;
var selected_list = [Q];

for (var i = 0; i < 4; i++) {
    if (Answer_list[i] === undefined) {
        for (var temp = parseInt(Math.random() * 257); selected_list.indexOf(temp) !== -1; temp++) {}
        Answer_list[i] = county_list[temp];
    }
}

console.log(Currect_Answer)
console.log(Currect)
console.log(picture_url)
console.log(Describes)
console.log(Answer_list)