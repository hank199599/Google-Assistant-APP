var text = "戀愛中的人今天的心事很容易被對方看穿，不如開誠布公地告訴對方，反而還能圓滿解決。你會對工作環境產生厭倦感，應摒棄喜新厭舊的情緒才好。理財也不能墨守成規，與時俱進會讓你的財越理越多。"

var translator = require('./translator.js');

translator.input(text).then(function (output) {
  console.log(output)
})
