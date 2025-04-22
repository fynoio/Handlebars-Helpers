const handlebars = require('handlebars')
const moment = require('moment')
const cloneDeep = require('lodash.clonedeep')
const crypt = require("crypto")
const unidecode = require("unidecode");

const timezones = {
  '+00:00': 'Greenwich',
  '+01:00': 'Africa/Algiers',
  '+02:00': 'Africa/Johannesburg',
  '+03:00': 'Asia/Baghdad',
  '+03:30': 'Asia/Tehran',
  '+04:00': 'Europe/Saratov',
  '+04:30': 'Asia/Kabul',
  '+05:00': 'Asia/Karachi',
  '+05:30': 'Asia/Calcutta',
  '+05:45': 'Asia/Kathmandu',
  '+06:00': 'Asia/Dhaka',
  '+06:30': 'Asia/Yangon',
  '+07:00': 'Asia/Bangkok',
  '+08:00': 'Asia/Hong_Kong',
  '+08:45': 'Australia/Eucla',
  '+09:00': 'Asia/Tokyo',
  '+09:30': 'Australia/Adelaide',
  '+10:00': 'Australia/Melbourne',
  '+10:30': 'Australia/LHI',
  '+11:00': 'Antarctica/Casey',
  '+12:00': 'Pacific/Auckland',
  '+12:45': 'Pacific/Chatham',
  '+13:00': 'Pacific/Apia',
  '+14:00': 'Pacific/Kiritimati',
  '-01:00': 'Atlantic/Cape_Verde',
  '-02:00': 'America/Godthab',
  '-02:30': 'America/St_Johns',
  '-03:00': 'Canada/Atlantic',
  '-04:00': 'America/Anguilla',
  '-05:00': 'America/Chicago',
  '-06:00': 'America/Denver',
  '-07:00': 'US/Pacific',
  '-08:00': 'US/Alaska',
  '-09:00': 'America/Adak',
  '-09:30': 'Pacific/Marquesas',
  '-10:00': 'US/Hawaii',
  '-11:00': 'Pacific/Midway',
  '-12:00': 'Etc/GMT+12'
}

handlebars.registerHelper('isArray', function (context) {
  return Array.isArray(context)
})

handlebars.registerHelper('formatDate', function (date, format, locale = 'en-us', timeZone) {
  const parsedDate = new Date(date)

  if (timeZone in timezones) {
    timeZone = timezones[timeZone]
  } else {
    timeZone = 'UTC'
  }

  // Define a dictionary of supported date formats
  const dateFormatMap = {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone
    },
    custom: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone
    }

    // Add more date formats as needed
  }

  if (dateFormatMap[format]) {
    return parsedDate.toLocaleDateString(locale, dateFormatMap[format])
  } else {
    // Default to a custom format if the provided format is not recognized
    return parsedDate.toLocaleDateString(locale, dateFormatMap['custom'])
  }
})

handlebars.registerHelper('formatDateTime', function (date, format, locale = 'en-us', timeZone) {
  const parsedDate = new Date(date)

  if (timeZone in timezones) {
    timeZone = timezones[timeZone]
  } else {
    timeZone = 'UTC'
  }

  // Define a dictionary of supported date formats
  const dateFormatMap = {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone
    },
    custom: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone
    }

    // Add more date formats as needed
  }

  if (dateFormatMap[format]) {
    return parsedDate.toLocaleTimeString(locale, dateFormatMap[format])
  } else {
    // Default to a custom format if the provided format is not recognized
    return parsedDate.toLocaleTimeString(locale, dateFormatMap['custom'])
  }
})

handlebars.registerHelper('remove', function (inputString, stringsToReplace) {
  if (typeof inputString === 'object' || !inputString) {
    return
  }

  if (typeof stringsToReplace === 'object') {
    return inputString
  }

  const pattern = new RegExp(stringsToReplace, 'g')
  const replacedString = inputString.replace(pattern, '')

  return replacedString
})

handlebars.registerHelper('isJSON', function (context) {
  if (typeof context === 'object') {
    return true
  } else {
    return false
  }
})

handlebars.registerHelper('replace', function (input, findRegex, replaceStr) {
  if (!input) return ''

  if (typeof input === 'object') {
    return
  }
  const regex = new RegExp(findRegex, 'g')

  return input.replace(regex, replaceStr)
})

handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this)
})

handlebars.registerHelper('stringify', function (context) {
  return JSON.stringify(context)
})

handlebars.registerHelper('parse', function (context) {
  return JSON.parse(context)
})

handlebars.registerHelper('ifMatches', function (arg1, arg2, options) {
  return arg1.match(new RegExp(arg2)) ? options.fn(this) : options.inverse(this)
})

handlebars.registerHelper('raw-helper', function (options) {
  return options.fn()
})

handlebars.registerHelper('isEmail', function (options) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  return regex.test(options)
})

handlebars.registerHelper('getNumberFromText', function (context) {
  const regex = /\d{4,10}/gm
  const num = context.fn(this).match(regex)

  return num[0]
})

handlebars.registerHelper('default', function (key, defaultvalue) {
  return key ? key : defaultvalue
})

handlebars.registerHelper('ifStartsWith', function (arg1, arg2, options) {
  return arg1?.startsWith(arg2) ? options?.fn(this) : options?.inverse(this)
})

handlebars.registerHelper('isExpo', function (str) {
  if (/expo_token:/s.test(str)) return str.split(/expo_token:(.*)/s)[1]
  else return str
})

handlebars.registerHelper('isFCM', function (str) {
  if (/fcm_token:/s.test(str)) return str.split(/fcm_token:(.*)/s)[1]
  else return str
})

handlebars.registerHelper('isOnesignal', function (str, options) {
  const regex = new RegExp('onesignal_(?:(player_id)|(external_id)):')
  if (regex.test(str)) {
    options.data.root['onesignal_selector'] = str.split(/(onesignal_(?:(player_id)|(external_id)):)(.*)/s)[1]
    options.data.root['onesignal_token'] = str.split(/(onesignal_(?:(player_id)|(external_id)):)(.*)/s)[4]
  } else {
    options.data.root['onesignal_selector'] = 'onesignal_external_id:'
    options.data.root['onesignal_token'] = str
  }
})

handlebars.registerHelper('isEmpty', function (obj) {
  return Object.keys(obj || {}).length
})

handlebars.registerHelper('setVariable', function (varName, varValue, options) {
  options.data.root[varName] = varValue
})

handlebars.registerHelper('pushCallback', function (options) {
  options.data.root.content.extras.data['callback'] =
    options.data.root.fyno.callback.url + '?' + options.data.root.fyno.callback.params
  options.data.root.content.extras.data['message_id'] = options.data.root.fyno.callback.m
})

handlebars.registerHelper('generateNotifyId', function (key) {
  return !key || key == ''
    ? Math.ceil(Math.random() * 100000)
    : Math.abs(key.split('').reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0))
})

handlebars.registerHelper('dateDiff', function (arg1, arg2, options) {
  //arg1, arg2 must have RFC-3339, ISO_8601 date format
  //otherwise, it will return NaN
  if (arg2.toUpperCase() == 'NOW') {
    var arg2 = moment()
  }

  if (arg1.toUpperCase() == 'NOW') {
    var arg1 = moment()
  }

  if (!moment(arg2, moment.ISO_8601).isValid() || !moment(arg1, moment.ISO_8601).isValid()) {
    return NaN
  }

  var diff = moment(arg2).diff(moment(arg1), options)

  return diff
})

handlebars.registerHelper('compare', function (v1, operator, v2, options) {
  var operators = {
    eq: v1 == v2 ? true : false,
    eqq: v1 === v2 ? true : false,
    ne: v1 != v2 ? true : false,
    nee: v1 !== v2 ? true : false,
    gt: v1 > v2 ? true : false,
    ge: v1 >= v2 ? true : false,
    lt: v1 < v2 ? true : false,
    le: v1 <= v2 ? true : false,
    or: v1 || v2 ? true : false,
    and: v1 && v2 ? true : false
  }
  if (operators.hasOwnProperty(operator)) {
    if (operators[operator]) {
      return options.fn(this)
    }

    return options.inverse(this)
  }
})

handlebars.registerHelper({
  eq: (v1, v2) => v1 === v2,
  ne: (v1, v2) => v1 !== v2,
  lt: (v1, v2) => v1 < v2,
  gt: (v1, v2) => v1 > v2,
  lte: (v1, v2) => v1 <= v2,
  gte: (v1, v2) => v1 >= v2,
  and() {
    return Array.prototype.every.call(arguments, Boolean)
  },
  or() {
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean)
  }
})

handlebars.registerHelper('split', function (string, delimiter = ',', index) {
  if (typeof string === 'object') {
    return
  }

  if (!string) {
    return
  }

  if (!isNaN(index)) {
    if (index < 0) {
      index = string.split(delimiter).length + index
    }

    return string.split(delimiter)[index] || null
  } else {
    return string.split(delimiter)
  }
})

handlebars.registerHelper('math', function (lvalue, operator, rvalue) {
  lvalue = parseFloat(lvalue)
  rvalue = parseFloat(rvalue)

  // return {
  //   '+': lvalue + rvalue,
  //   '-': lvalue - rvalue,
  //   '*': lvalue * rvalue,
  //   '/': lvalue / rvalue,
  //   '%': lvalue % rvalue,
  //   round: lvalue.toFixed(rvalue)
  // }[operator]

  switch (operator) {
    case '+':
      return lvalue + rvalue
    case '-':
      return lvalue - rvalue
    case '*':
      return lvalue * rvalue
    case '/':
      return lvalue / rvalue
    case '%':
      return lvalue % rvalue
    case 'round':
      return lvalue.toFixed(rvalue)
  }
})

handlebars.registerHelper('relativeDay', function (given_date) {
  let todaysDate = new Date()
  let givenDate = new Date(given_date)
  if (givenDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return 'today'
  } else if (givenDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) + 86400000) {
    return 'tomorrow'
  } else if (givenDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) - 86400000) {
    return 'yesterday'
  } else if (givenDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
    return 'before'
  } else if (givenDate.setHours(0, 0, 0, 0) > todaysDate.setHours(0, 0, 0, 0)) {
    return 'later'
  } else {
    return given_date
  }
})

handlebars.registerHelper('trim', function (string, length, delim) {
  if (typeof string === 'object') {
    return
  }

  if (!string) {
    return
  }

  string = string.trim()
  var return_string

  if (string.length > length) {
    if (delim) {
      return_string = string.substr(0, length).substr(0, string.substr(0, length).lastIndexOf(delim))
    } else {
      return_string = string.substr(0, length)
    }

    if (return_string) {
      return return_string
    } else {
      return string.substr(0, length)
    }
  }

  return string
})

handlebars.registerHelper('formatNumber', function (number, locale = 'en-US', options = '') {
  try {
    let op = options.split(',')
    let split = '='
    let json = {}
    op.map(k => {
      json[k.split(split)[0]?.trim()] = k.split(split)[1]?.trim()
    })
    options = json
  } catch (e) {
    options = {}
  }
  if (isNaN(number)) {
    return number
  }
  return new Intl.NumberFormat(locale, options).format(number)
})

handlebars.registerHelper('sumAll', (obj, key) => {
  function deepFlattenObject(obj, parentKey = '') {
    return Object.keys(obj).reduce((acc, key) => {
      const prefixedKey = parentKey ? `${parentKey}.${key}` : key
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            const nestedKey = `${prefixedKey}[${index}]`
            if (typeof item === 'object' && item !== null) {
              Object.assign(acc, deepFlattenObject(item, nestedKey))
            } else {
              acc[nestedKey] = item
            }
          })
        } else {
          Object.assign(acc, deepFlattenObject(obj[key], prefixedKey))
        }
      } else {
        acc[prefixedKey] = obj[key]
      }
      return acc
    }, {})
  }

  const flattenedObj = deepFlattenObject(obj)

  let sum = 0
  Object.keys(flattenedObj).map(k => {
    if (k.replaceAll(/\[\d+\]/g, '') === key) {
      sum += parseFloat(flattenedObj[k].toString().replace(/,/g, ''))
    }
  })
  return sum
})

handlebars.registerHelper('formatDay', function (date, format, locale = 'en-us', timeZone) {
  const parsedDate = new Date(date)

  if (timeZone in timezones) {
    timeZone = timezones[timeZone]
  } else {
    timeZone = 'UTC'
  }

  // Define a dictionary of supported date formats
  const dateFormatMap = {
    short: {
      weekday: 'short',
      timeZone
    },
    medium: {
      weekday: 'short',
      timeZone
    },
    long: {
      weekday: 'long',
      timeZone
    },
    custom: {
      weekday: 'long',
      timeZone
    }
    // Add more date formats as needed
  }

  if (dateFormatMap[format]) {
    return parsedDate.toLocaleDateString(locale, dateFormatMap[format])
  } else {
    // Default to a custom format if the provided format is not recognized
    return parsedDate.toLocaleDateString(locale, dateFormatMap['custom'])
  }
})

handlebars.registerHelper('slice', function (string, from = 0, to = 0) {
  if (typeof string === 'object') {
    return
  }
  if (!string) {
    return
  }
  return string.slice(from, to)
})

handlebars.registerHelper('select', function (string, count) {
  return string.slice(count)
})

handlebars.registerHelper('moment', function (context, block) {
  if (context && context.hash) {
    block = cloneDeep(context)
    context = undefined
  }
  if (typeof context === 'string' && parseInt(context) != NaN) context = parseInt(context)
  var date = moment(context)

  if (block.hash.timezone) {
    date.tz(block.hash.timezone)
  }

  var hasFormat = false

  for (var i in block.hash) {
    if (i === 'format') {
      hasFormat = true
    } else if (date[i]) {
      date = date[i](block.hash[i])
    } else {
      return date
    }
  }

  if (hasFormat) {
    date = date.format(block.hash.format)
  }
  return date
})

handlebars.registerHelper('removeExtraSpaces', function (inputString, space = 0) {
  if (typeof inputString === 'object' || !inputString) {
    return
  }

  return inputString.replace(/\s+/g, ' ').trim()
})

handlebars.registerHelper('convert_to_sec', function (ttl, duration, max_second, return_type) {
  var value = 0
  if (duration === 'seconds') {
    value = ttl
  } else if (duration === 'minutes') {
    value = ttl * 60
  } else if (duration === 'hours') {
    value = ttl * 60 * 60
  } else if (duration === 'days') {
    value = ttl * 60 * 60 * 24
  }
  if (return_type === 'timestamp') return new Date().getTime() + value
  else if (return_type === 'unix') return moment().unix() + value
  else return Math.min(value, max_second)
})

handlebars.registerHelper('getValuesArray', function (obj) {
  return Object.values(obj)
})

handlebars.registerHelper('isNumber', function (obj) {
  return !isNaN(obj)
})

handlebars.registerHelper('timestamp_from_now', function (time, duration) {
  var value = 0
  if (duration === 'seconds') {
    value = time
  } else if (duration === 'minutes') {
    value = time * 60
  } else if (duration === 'hours') {
    value = time * 60 * 60
  } else if (duration === 'days') {
    value = time * 60 * 60 * 24
  }
  return moment().toDate().getTime() + value
})

handlebars.registerHelper('relativeDate', (day = 0, action) => {
  if (!['day', 'hour', 'month', 'year', 'minutes', 'seconds'].includes(action)) {
    action = 'day'
  }

  if (day == 'yesterday') {
    day = '-1'
  } else if (day == 'today') {
    day = '0'
  } else if (day == 'tomorrow') {
    day = '+1'
  }

  try {
    day.parseInt(day)
  } catch (e) {
    //nothing to return
  }

  let type = '+'

  if (day < 0) {
    type = '-'
  } else {
    type = '+'
  }

  try {
    day = day.replace('+', '')
  } catch (e) {
    //nothing to return
  }

  try {
    day = day.replace('-', '')
  } catch (e) {
    //nothing to return
  }

  if (type == '-') {
    return moment().subtract(day, action).format()
  } else if (type == '+') {
    return moment().add(day, action).format()
  }
})

handlebars.registerHelper('escapeChar', function (value) {
  let result = handlebars.escapeExpression(value)
  return new handlebars.SafeString(result)
})

handlebars.registerHelper('ifCond', function (v1, v2, options) {
  return v1 === v2 ? options.fn(this) : options.inverse(this)
})

handlebars.registerHelper('formatTime', function (date, format) {
  let mmnt = moment(date)
  return mmnt.format(format)
})

handlebars.registerHelper('ifGreater', function (v1, v2, options) {
  return v1 > v2 ? options.fn(this) : options.inverse(this)
})

handlebars.registerHelper('weekYear', function () {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const dayOfYear = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000)) + 1
  const weekNumber = Math.ceil(dayOfYear / 7)
  const year = today.getFullYear()
  return `${weekNumber}${year}`
})

handlebars.registerHelper('addOne', function (value) {
  return parseInt(value) + 1
})

handlebars.registerHelper('ct-formatDate', function (date, y, m, days) {
  let d = new Date(date)
  let year = d.getFullYear()
  let month = d.getMonth()
  let day = d.getDate()
  let fulldate = new Date(year + y, month + m, day + days)
  return fulldate.toISOString().slice(0, 10)
})

handlebars.registerHelper('ct-dateDiff', function (date1, options) {
  let dt1 = new Date()
  let dt2 = new Date(date1)
  let date_diff_indays = Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  )

  if (date_diff_indays > 0) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

handlebars.registerHelper('switch', function (value, options) {
  this.switch_value = value
  this.switch_break = false
  return options.fn(this)
})

handlebars.registerHelper('case', function (value, options) {
  if (value == this.switch_value) {
    this.switch_break = true
    return options.fn(this)
  }
})

handlebars.registerHelper('switch-default', function (value) {
  if (!this.switch_break) {
    return value
  }
})

handlebars.registerHelper("proxy", function (url = "", file = "") {
  try {
      var file_name;
      if (file && typeof file !== "object") {
          file_name = file;
      } else {
          file_name = url?.split("/").pop().split("?")[0];
      }
      return (
          "https://fy1.in/proxy/" +
          file_name +
          "?url=" +
          encodeURIComponent(url) +
          "&filename=" +
          file_name
      );
  } catch (e) {
      return url;
  }
});

handlebars.registerHelper("hash", function (...args) {
  let str = "";
  for (let i in args) {
      if (typeof args[i] == "object") continue;
      str += args[i];
  }

  return crypt.createHash("md5").update(str).digest("hex");
});

handlebars.registerHelper("moment", function (context, block) {
  try {
      if (context && context.hash) {
          block = cloneDeep(context);
          context = undefined;
      }
      if (typeof context === 'string' && !isNaN(context))
          context = Number(context);

      // Get input format
      let inputFormat = block.hash.inputFormat;
      let date = inputFormat ? moment(context, inputFormat) : moment(context);

      if (block.hash.timezone) {
          date = date.tz(block.hash.timezone);
      }

      var hasFormat = false;

      for (var i in block.hash) {
          if (i === 'format') {
              hasFormat = true;
          } else if (date[i]) {
              date = date[i](block.hash[i]);
          }
      }

      if (hasFormat) {
          date = date.format(block.hash.format);
      }
      return date;
  } catch (exception) {
      return context;
  }
});



handlebars.registerHelper("uniqArray", function (arr) {
	return [...new Set(arr)];
});

handlebars.registerHelper("changeCase", function (str, op) {
  if (!str) return "";
  switch (op) {
      case "upper":
          return str.toUpperCase();
      case "lower":
          return str.toLowerCase();
      case "title":
          return str.replace(/\b\w/g, function (match) {
              return match.toUpperCase();
          });
      default:
          return str;
  }
});

handlebars.registerHelper("numberToWord", function numberToWords(number) {
  try {
      let num = parseInt(number);
      if (num === 0) return "zero";
      const belowTwenty = [
          "",
          "one",
          "two",
          "three",
          "four",
          "five",
          "six",
          "seven",
          "eight",
          "nine",
          "ten",
          "eleven",
          "twelve",
          "thirteen",
          "fourteen",
          "fifteen",
          "sixteen",
          "seventeen",
          "eighteen",
          "nineteen"
      ];

      const tens = [
          "",
          "",
          "twenty",
          "thirty",
          "forty",
          "fifty",
          "sixty",
          "seventy",
          "eighty",
          "ninety"
      ];

      const thousands = [
          "",
          "thousand",
          "million",
          "billion",
          "trillion",
          "quadrillion"
      ];

      // eslint-disable-next-line no-inner-declarations
      function convertChunk(n) {
          let words = [];
          if (n >= 100) {
              words.push(belowTwenty[Math.floor(n / 100)] + " hundred");
              n %= 100;
          }
          if (n >= 20) {
              words.push(tens[Math.floor(n / 10)]);
              n %= 10;
          }
          if (n > 0) {
              words.push(belowTwenty[n]);
          }
          return words.join(" ");
      }

      let result = [];
      let i = 0;

      while (num > 0) {
          let chunk = num % 1000;
          if (chunk > 0) {
              result.unshift(
                  convertChunk(chunk) +
                      (thousands[i] ? " " + thousands[i] : "")
              );
          }
          num = Math.floor(num / 1000);
          i++;
      }

      return result.join(" ").trim();
  } catch (e) {
      return number;
  }
});

handlebars.registerHelper("unidecode", function (value) {
  try {
      return unidecode(value);
  } catch (e) {
      return value;
  }
});

module.exports = handlebars
