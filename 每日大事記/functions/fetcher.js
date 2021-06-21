var http = require('https');
var cheerio = require('cheerio');
const { Console } = require('console');

function parse($, dom) {
    var locates = [];
    var state = [];
    var output = {};

    $('li').each(function(i, elem) {
        if ($(this).text().indexOf("年：") !== -1) {
            var temp = $(this).text().replace(/[\[|\（]+.+[\]|\）]/gm, "");
            temp = temp.replace("。。", "。");
            temp = temp.split('年：');
            var year = temp[0];
            var content = temp[1];

            if (content.indexOf('\n') !== -1) {
                var contents = content.split('\n');
                console.log(contents)
                for (var j = 0; j < contents.length; j++) {
                    if (contents[j].length !== 0) {
                        output[Object.keys(output).length] = [year, contents[j]]
                    }
                }

            } else {
                output[Object.keys(output).length] = [year, content]
            }
        }
    });

    console.log(output)

    return output
}

/**
 * Query Receipt Lottery Information
 *
 * @param   {Function}  callback(err: Error, invoiceInfo: Object)
 * @param   {Number!}   timeout  default is 10000ms
 */
exports.query = function(callback, timeout) {
    var cb = typeof callback === 'function' ? callback : function() {};
    timeout = timeout || 10 * 1000;

    var options = {
        hostname: 'zh.wikipedia.org',
        path: '/zh-tw/' + encodeURI("4月1日"), //每日路徑
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        if (res.statusCode !== 200) {
            return cb(new Error('request to ' + options.hostname + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
        }

        var buffer = [];
        res.on('data', function(chunk) {
            buffer.push(chunk.toString());
        });
        res.on('end', function() {
            var html = buffer.join();
            var $ = cheerio.load(html);
            return cb(null, parse($, $('')));
        });
        res.on('error', function(err) {
            return cb(err, null);
        });
    });

    req.setTimeout(timeout, function() {
        req.abort();
        return cb(new Error('request to ' + options.hostname + ' timeout'), null);
    });

    req.on('error', function(err) {
        return cb(err, null);
    });

    req.end();
};