var http = require('https');
var cheerio = require('cheerio');
var host = 'invoice.etax.nat.gov.tw';

function parse ($, dom) {
  var title = dom.find('h2').last().text().trim();

  return dom.find('tr').map(function (index, element) {
    element = $(element);
    var el = {
      name: element.find('.title'),
      number: element.find('.t18Red')
    };

    var name = el.name.text().trim();
    var number = el.number.text().trim();

    el.name.remove();
    el.number.remove();
    var description = element.text().trim();

    return {
      name: name,
      description: description,
      numbers: number === '' ? [] : number.split('、')
    };
  })
  .get()
  .reduce(function (prize, item, index) {
    var key = null;
    switch (index) {
      case 1: key = 'super';    break;
      case 2: key = 'special';  break;
      case 3: key = 'first';    break;
      case 4: key = 'second';   break;
      case 5: key = 'thrid';    break;
      case 6: key = 'fourth';   break;
      case 7: key = 'fifth';    break;
      case 8: key = 'sixth';    break;
      case 9: key = 'addition'; break;
      default:
        return prize;
    }

    prize[key] = item;
    return prize;
  }, {
    title: title
  });
}

/**
 * Query Receipt Lottery Information
 *
 * @param   {Function}  callback(err: Error, invoiceInfo: Object)
 * @param   {Number!}   timeout  default is 10000ms
 */
exports.query = function (callback, timeout) {
  var cb = typeof callback === 'function' ? callback : function () {};
  timeout = timeout || 10 * 1000;

  var options = {
    hostname: host,
    path: '/',
    method: 'GET'
  };

  var req = http.request(options, function (res) {
    if (res.statusCode !== 200) {
      return cb(new Error('request to ' + options.hostname + ' failed, status code = ' + res.statusCode + ' (' + res.statusMessage + ')'));
    }

    var buffer = [];
    res.on('data', function (chunk) {
      buffer.push(chunk.toString());
    });
    res.on('end', function() {
      var html = buffer.join();
      var $ = cheerio.load(html);
      return cb(null, {
        new: parse($, $('#area1')),
        old: parse($, $('#area2'))
      });
    });
    res.on('error', function (err) {
      return cb(err, null);
    });
  });

  req.setTimeout(timeout, function () {
    req.abort();
    return cb(new Error('request to ' + options.hostname + ' timeout'), null);
  });

  req.on('error', function(err) {
    return cb(err, null);
  });

  req.end();
};
