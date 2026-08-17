const handlebars = require('handlebars')
const moment = require('moment')
const cloneDeep = require('lodash.clonedeep')
const unidecode = require("unidecode");

const crypto = require("crypto");
const forge = require("node-forge");
const fs = require("fs");
require("moment-timezone");

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
  return arg1 && arg1.match(new RegExp(arg2)) ? options.fn(this) : options.inverse(this)
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

handlebars.registerHelper("isAPNS", function (str) {
  if (/apns_token:/s.test(str)) return str.split(/apns_token:(.*)/s)[1];
  else return str;
});

handlebars.registerHelper("isXiaomi", function (str) {
  if (/mi_token:/s.test(str)) return str.split(/mi_token:(.*)/s)[1];
  else return str;
});

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

handlebars.registerHelper("jwt_decode", function (input) {
  if (!input) return "";
  const decoded = jwt.decode(input, {
      complete: true
  });
  return decoded.payload;
});

handlebars.registerHelper("toString", function (input) {
  if (!input) return "";

  if (typeof input === "object") {
      return;
  }
  return input.toString();
});

handlebars.registerHelper(
  "setXiaomiPayload",
  function (varName, varKey, varValue, options) {
      options.data.root[varName] = {};
      options.data.root[varName][varKey] = varValue;
  }
);

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

handlebars.registerHelper("decodehtmlentities", function (str) {
  var map = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#039;": "'"
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (m) {
      return map[m];
  });
});

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

handlebars.registerHelper("unescape", function (value) {
  try {
      return unescape(value);
  } catch (e) {
      return value;
  }
});

handlebars.registerHelper("Component", (name, options) => {
  return options?.["data"]?.["root"]?.["$components"]?.[name] || "";
});

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

handlebars.registerHelper("getQueryParams", function (url, key) {
  try {
      const query = url?.split(/\?(.*)/)?.[1];
      const params = new URLSearchParams(query || "");
      return params.get(key) || "";
  } catch (e) {
      return "";
  }
});

handlebars.registerHelper("hash", function (...args) {
  let str = "";
  for (let i in args) {
      if (typeof args[i] == "object") continue;
      str += args[i];
  }

  return crypto.createHash("md5").update(str).digest("hex");
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

handlebars.registerHelper("extract_regex", function (input, pattern, flags = "g") {
  if (typeof input !== "string" || typeof pattern !== "string") {
      return "";
  }

  try {
      const regex = new RegExp(pattern, flags);
      const matches = regex.exec(input);
      return matches ? matches.join(",") : "";
  } catch (err) {
      return "";
  }
});

handlebars.registerHelper("uniqArray", function (arr) {
	return [...new Set(arr)];
});

handlebars.registerHelper("uriEncodeWithReplace", function (str) {
  try {
      const replaced_str =
          encodeURIComponent(str)?.replace(
              /['()*]/g,
              (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
          ) || str;
      return replaced_str;
  } catch (error) {
      return str;
  }
});

handlebars.registerHelper("uriEncode", function (str) {
  return encodeURIComponent(str);
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

handlebars.registerHelper("filterArray", function (array, key, regexPattern, options) {
  try {
      if (!Array.isArray(array)) return "";
      const regex = new RegExp(regexPattern, "i");
      let filteredArray = array.filter((item) => regex.test(item[key]));

      return filteredArray
          .map((item, index) => {
              return options.fn(item, {
                  data: {
                      index,
                      first: index === 0,
                      last: index === filteredArray.length - 1
                  }
              });
          })
          .join("");
  } catch (e) {
      return array;
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

handlebars.registerHelper("concat", function (...args) {
  try {
      if (args.length === 0) {
          return "";
      }
      let str = "";
      for (let i in args) {
          if (typeof args[i] == "string" || typeof args[i] === "number")
              str += args[i].toString();
      }
      return str;
  } catch (e) {
      return "";
  }
});

handlebars.registerHelper("base64", function (value, type = "") {
  try {
      if (type == "encode") {
          return Buffer.from(value).toString("base64");
      } else if (type == "decode") {
          return Buffer.from(value, "base64").toString("utf-8");
      } else {
          return value;
      }
  } catch (e) {
      return value;
  }
});

handlebars.registerHelper("decodeURIComponent", function (value) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch (e) {
    return value;
  }
});

handlebars.registerHelper("random", function (length, type) {
    try {
        const characters = {
            alphanumeric:
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            numeric: "0123456789"
        };

        const chars = characters[type] || characters.alphanumeric;
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    } catch (e) {
        return "";
    }
});

// ********** Encryption Helpers Start **********

const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;
const PBES2_OID = "1.2.840.113549.1.5.13";

const CIPHER_INFO = {
    "2.16.840.1.101.3.4.1.2": { name: "aes-128-cbc", keyLen: 16 },
    "2.16.840.1.101.3.4.1.22": { name: "aes-192-cbc", keyLen: 24 },
    "2.16.840.1.101.3.4.1.42": { name: "aes-256-cbc", keyLen: 32 }
};

const PRF_HASH = {
    "1.2.840.113549.2.7": "sha1",
    "1.2.840.113549.2.9": "sha256",
    "1.2.840.113549.2.10": "sha384",
    "1.2.840.113549.2.11": "sha512"
};

function loadKeyFromPkcs12(p12Input, storePassword, keyAlias, keyPassword) {
    let der;
    if (p12Input.startsWith("MI")) {
        der = Buffer.from(p12Input, "base64").toString("binary");
    } else {
        der = fs.readFileSync(p12Input, "binary");
    }

    const root = forge.asn1.fromDer(der);

    // Recursively find EncryptedPrivateKeyInfo (identified by PBES2 OID)
    const found = [];
    _findPBES2(root, found, 0);

    if (found.length === 0) {
        throw new Error("No PBES2-encrypted key found in PKCS12");
    }

    const password = keyPassword || storePassword;
    for (const node of found) {
        try {
            const params = _parsePBES2Params(node);
            const decrypted = _decryptPBES2(params, password);
            return _extractKeyFromDecrypted(decrypted);
        } catch (e) {
            continue;
        }
    }
    throw new Error("Failed to decrypt key from PKCS12. Wrong password?");
}

function _findPBES2(node, results, depth) {
    if (!node || depth > 30) return;

    if (_isPBES2Node(node)) {
        results.push(node);
        return;
    }

    _recurseIntoChildren(node, results, depth);
}

function _isPBES2Node(node) {
    if (
        node.tagClass === forge.asn1.Class.UNIVERSAL &&
        node.type === forge.asn1.Type.SEQUENCE &&
        Array.isArray(node.value) &&
        node.value.length === 2
    ) {
        const [algo, data] = node.value;
        if (
            algo.type === forge.asn1.Type.SEQUENCE &&
            Array.isArray(algo.value) &&
            algo.value[0] &&
            algo.value[0].type === forge.asn1.Type.OID &&
            data.type === forge.asn1.Type.OCTETSTRING
        ) {
            try {
                return forge.asn1.derToOid(algo.value[0].value) === PBES2_OID;
            } catch (e) {
                return false;
            }
        }
    }
    return false;
}

function _recurseIntoChildren(node, results, depth) {
    if (Array.isArray(node.value)) {
        for (const child of node.value) {
            _findPBES2(child, results, depth + 1);
        }
    }

    if (
        typeof node.value === "string" &&
        node.value.length > 20 &&
        (node.type === forge.asn1.Type.OCTETSTRING ||
            node.tagClass === forge.asn1.Class.CONTEXT_SPECIFIC)
    ) {
        try {
            const inner = forge.asn1.fromDer(node.value);
            _findPBES2(inner, results, depth + 1);
        } catch (e) {
            /* not valid DER */
        }
    }
}

function _parsePBES2Params(encInfo) {
    const algoSeq = encInfo.value[0];
    const encData = encInfo.value[1];
    const pbes2Params = algoSeq.value[1];
    const kdfSeq = pbes2Params.value[0];
    const encSchemeSeq = pbes2Params.value[1];

    // PBKDF2 params: SEQUENCE { salt, iterations, [keyLength], [prf] }
    const kdfParams = kdfSeq.value[1];
    const salt = kdfParams.value[0].value;
    const iterations = parseInt(
        forge.util.bytesToHex(kdfParams.value[1].value),
        16
    );

    let keyLength = null;
    let prfHash = "sha1";
    for (let i = 2; i < kdfParams.value.length; i++) {
        const v = kdfParams.value[i];
        if (v.type === forge.asn1.Type.INTEGER) {
            keyLength = parseInt(forge.util.bytesToHex(v.value), 16);
        } else if (
            v.type === forge.asn1.Type.SEQUENCE &&
            Array.isArray(v.value)
        ) {
            const prfOid = forge.asn1.derToOid(v.value[0].value);
            prfHash = PRF_HASH[prfOid] || "sha1";
        }
    }

    const cipherOid = forge.asn1.derToOid(encSchemeSeq.value[0].value);
    const iv = encSchemeSeq.value[1].value;
    const cipher = CIPHER_INFO[cipherOid];
    if (!cipher) throw new Error("Unsupported cipher: " + cipherOid);
    if (!keyLength) keyLength = cipher.keyLen;

    return {
        salt: Buffer.from(salt, "binary"),
        iterations,
        keyLength,
        prfHash,
        cipherName: cipher.name,
        iv: Buffer.from(iv, "binary"),
        encryptedData: Buffer.from(encData.value, "binary")
    };
}

function _decryptPBES2(params, password) {
    const derivedKey = crypto.pbkdf2Sync(
        password,
        params.salt,
        params.iterations,
        params.keyLength,
        params.prfHash
    );
    const decipher = crypto.createDecipheriv(
        params.cipherName,
        derivedKey,
        params.iv
    );
    return Buffer.concat([
        decipher.update(params.encryptedData),
        decipher.final()
    ]);
}

function _extractKeyFromDecrypted(decryptedBuf) {
    try {
        const asn1 = forge.asn1.fromDer(decryptedBuf.toString("binary"));
        // PKCS#8-like: SEQUENCE { INTEGER, SEQUENCE { OID }, OCTET STRING (key) }
        if (
            asn1.type === forge.asn1.Type.SEQUENCE &&
            Array.isArray(asn1.value)
        ) {
            for (const child of asn1.value) {
                if (
                    child.type === forge.asn1.Type.OCTETSTRING &&
                    typeof child.value === "string"
                ) {
                    return Buffer.from(child.value, "binary");
                }
            }
        }
        if (
            asn1.type === forge.asn1.Type.OCTETSTRING &&
            typeof asn1.value === "string"
        ) {
            return Buffer.from(asn1.value, "binary");
        }
    } catch (e) {
        /* not valid ASN.1 */
    }
    return decryptedBuf;
}

function encryptAESGCMP12(keyBuffer, payload) {
    const iv = crypto.randomBytes(GCM_IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);
    const enc = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
    return Buffer.concat([iv, enc, cipher.getAuthTag()]).toString("base64");
}

function decryptAESGCMP12(keyBuffer, encryptedPayload) {
    const decoded = Buffer.from(encryptedPayload, "base64");
    const iv = decoded.subarray(0, GCM_IV_LENGTH);
    const tag = decoded.subarray(decoded.length - GCM_TAG_LENGTH);
    const cipherText = decoded.subarray(
        GCM_IV_LENGTH,
        decoded.length - GCM_TAG_LENGTH
    );
    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([
        decipher.update(cipherText),
        decipher.final()
    ]).toString("utf8");
}

function encryptAESGCM(msg, key, saltKey) {
    try {
        const keyByte = Buffer.from(key, "ascii");
        const ivByte = Buffer.from(saltKey, "ascii");

        if (![16, 24, 32].includes(keyByte.length)) {
            throw new Error("Invalid AES key length: " + keyByte.length);
        }

        const algo = `aes-${keyByte.length * 8}-gcm`;
        const cipher = crypto.createCipheriv(algo, keyByte, ivByte);

        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(msg, "utf8")),
            cipher.final()
        ]);
        const authTag = cipher.getAuthTag();

        return Buffer.concat([encrypted, authTag]).toString("base64");
    } catch (ex) {
        return "";
    }
}

function decryptAESGCM(encryptedMsg, key, saltKey) {
    try {
        const keyByte = Buffer.from(key, "ascii");
        const ivByte = Buffer.from(saltKey, "ascii");

        if (![16, 24, 32].includes(keyByte.length)) {
            throw new Error("Invalid AES key length: " + keyByte.length);
        }

        const input = Buffer.from(encryptedMsg, "base64");
        if (input.length < 16) {
            throw new Error("Invalid encrypted payload");
        }

        const authTag = input.subarray(input.length - 16);
        const ciphertext = input.subarray(0, input.length - 16);

        const algo = `aes-${keyByte.length * 8}-gcm`;
        const decipher = crypto.createDecipheriv(algo, keyByte, ivByte);
        decipher.setAuthTag(authTag);

        return Buffer.concat([
            decipher.update(ciphertext),
            decipher.final()
        ]).toString("utf8");
    } catch (ex) {
        return "";
    }
}

function encryptRSAPCKS1(dataToEncrypt, publicKeyPem) {
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKeyPem,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(dataToEncrypt, "utf8")
    );
    return encrypted.toString("base64");
}

function decryptRSAPCKS1(dataToDecrypt, privateKeyPem) {
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKeyPem,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(dataToDecrypt, "base64")
    );
    return decrypted.toString("utf8");
}

// AU Mobiware UPI Checksum generation
function generateChecksum(payloadJson, secret) {
    const sorted = getSorted(payloadJson);
    return getHashedText(sorted, secret);
}

function getSorted(json) {
    const values = [];
    try {
        const node = JSON.parse(json);
        addKeys("", node, values);
        values.sort();
    } catch (err) {
    }
    return "[" + values.join(", ") + "]";
}

function addKeys(currentPath, jsonNode, vals) {
    if (
        jsonNode !== null &&
        typeof jsonNode === "object" &&
        !Array.isArray(jsonNode)
    ) {
        const pathPrefix = currentPath.length === 0 ? "" : currentPath + ".";
        for (const [key, value] of Object.entries(jsonNode)) {
            vals.push(key);
            addKeys(pathPrefix + key, value, vals);
        }
    } else if (Array.isArray(jsonNode)) {
        for (let i = 0; i < jsonNode.length; i++) {
            addKeys(currentPath + "[" + i + "]", jsonNode[i], vals);
        }
    } else {
        const text = jsonNode == null ? "null" : String(jsonNode);
        if (text.trim().length > 0) {
            vals.push(text);
        }
    }
}

function getHashedText(textToHash, salt) {
    try {
        return crypto
            .createHash("sha512")
            .update(Buffer.from(salt, "utf8"))
            .update(Buffer.from(textToHash, "utf8"))
            .digest("hex");
    } catch (err) {
        return textToHash;
    }
}

// AU Mobiware encryption/decryption
function generateKey(pKey, saltString) {
    const PBKDF2_DIGEST = "sha256";
    const PBKDF2_ITERATIONS = 65536;
    const KEY_LENGTH_BYTES = 32;
    return crypto.pbkdf2Sync(
        Buffer.from(pKey, "utf8"),
        Buffer.from(saltString, "utf8"),
        PBKDF2_ITERATIONS,
        KEY_LENGTH_BYTES,
        PBKDF2_DIGEST
    );
}

function encryptAES256(plainText, pKey, ivString, saltString) {
    const ALGORITHM = "aes-256-cbc";
    try {
        const key = generateKey(pKey, saltString);
        const iv = Buffer.from(ivString, "utf8");
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(plainText, "utf8")),
            cipher.final()
        ]);
        return encrypted.toString("base64");
    } catch (err) {
        return null;
    }
}

function decryptAES256(cipherTextBase64, pKey, ivString, saltString) {
    const ALGORITHM = "aes-256-cbc";
    try {
        const key = generateKey(pKey, saltString);
        const iv = Buffer.from(ivString, "utf8");
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(cipherTextBase64, "base64")),
            decipher.final()
        ]);
        return decrypted.toString("utf8");
    } catch (err) {
        return null;
    }
}

function cipherEncryptMessage(message, key, algorithm = "aes-128-ecb") {
    try {
        if (typeof key === "string") {
            key = Buffer.from(key);
        }

        const cipher = crypto.createCipheriv(algorithm, key, null);
        const encrypted = Buffer.concat([
            cipher.update(message, "utf8"),
            cipher.final()
        ]);
        const encode = encrypted.toString("base64");

        return encode;
    } catch (e) {
        return message;
    }
}

handlebars.registerHelper("PCKS12Crypto", function (action, payload, options) {
    try {
        const { pkcs12Path, pkcs12Password, keyAlias, keyPassword, rawKey } =
            options.hash;
        if (!pkcs12Path && !rawKey) {
            throw new Error(
                "Missing required parameters: either pkcs12Path or rawKey must be provided"
            );
        }
        const keyBuffer = rawKey
            ? Buffer.from(rawKey, "base64")
            : loadKeyFromPkcs12(
                  pkcs12Path,
                  pkcs12Password,
                  keyAlias,
                  keyPassword || pkcs12Password
              );
        if (action === "encrypt")
            return encryptAESGCMP12(keyBuffer, String(payload));
        if (action === "decrypt")
            return decryptAESGCMP12(keyBuffer, String(payload));
        return payload;
    } catch (e) {
        return payload;
    }
});

handlebars.registerHelper("AESGCMCrypto", function (action, payload, options) {
    try {
        const { key, saltKey } = options.hash;
        if (!key || !saltKey) {
            throw new Error(
                "Missing required parameters: key and saltKey must be provided"
            );
        }
        if (action === "encrypt")
            return encryptAESGCM(String(payload), key, saltKey);
        if (action === "decrypt")
            return decryptAESGCM(String(payload), key, saltKey);
        return payload;
    } catch (e) {
        return payload;
    }
});

handlebars.registerHelper("PCKS1Crypto", function (action, payload, options) {
    try {
        const { publicKey, privateKey } = options.hash;
        if (action === "encrypt") {
            if (!publicKey) {
                throw new Error("Missing required parameter: publicKey");
            }
            return encryptRSAPCKS1(String(payload), publicKey);
        }
        if (action === "decrypt") {
            if (!privateKey) {
                throw new Error("Missing required parameter: privateKey");
            }
            return decryptRSAPCKS1(String(payload), privateKey);
        }
        return payload;
    } catch (e) {
        return payload;
    }
});

handlebars.registerHelper("generateChecksum", function (payload, secret) {
    try {
        return generateChecksum(String(payload), String(secret));
    } catch (e) {
        return payload;
    }
});

handlebars.registerHelper("AES256Crypto", function (action, payload, options) {
    try {
        const { pKey, ivString, saltString } = options.hash;
        if (!pKey || !ivString || !saltString) {
            throw new Error(
                "Missing required parameters: pKey, ivString, and saltString must be provided"
            );
        }
        if (action === "encrypt")
            return encryptAES256(String(payload), pKey, ivString, saltString);
        if (action === "decrypt")
            return decryptAES256(String(payload), pKey, ivString, saltString);
        return payload;
    } catch (e) {
        return payload;
    }
});

handlebars.registerHelper(
    "generateIBMBChecksum",
    function (
        payload,
        secret,
        channel = "FYNO",
        blockType = "BOTH",
        timestamp = null
    ) {
        try {
            const currentTime = timestamp
                ? moment(timestamp)
                      .tz("Asia/Calcutta")
                      .format("YYYY-MM-DDTHH:mm:ssZ")
                : moment().tz("Asia/Calcutta").format("YYYY-MM-DDTHH:mm:ssZ");
            const checksumLogic = [
                String(channel),
                String(secret),
                currentTime,
                String(payload),
                String(blockType)
            ].join("|");

            return cipherEncryptMessage(checksumLogic, secret, "aes-128-ecb");
        } catch (e) {
            return payload;
        }
    }
);

handlebars.registerHelper("decryptAES128CBC", function (encryptedPayload, key, iv) {
    try {
        const ALGORITHM = "aes-128-cbc";
        if (!key || !iv) {
            return encryptedPayload;
        }
        if (typeof key === "string") {
            key = Buffer.from(key, "utf8");
        }
        if (typeof iv === "string") {
            iv = Buffer.from(iv, "utf8");
        }
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        return Buffer.concat([
            decipher.update(Buffer.from(encryptedPayload, "base64")),
            decipher.final()
        ]).toString("utf8");
    } catch (e) {
        return encryptedPayload;
    }
});

handlebars.registerHelper("encryptAES128CBC", function (plainText, key, iv) {
    try {
        const ALGORITHM = "aes-128-cbc";
        if (!key || !iv) {
            return plainText;
        }
        if (typeof key === "string") {
            key = Buffer.from(key, "utf8");
        }
        if (typeof iv === "string") {
            iv = Buffer.from(iv, "utf8");
        }
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        return Buffer.concat([
            cipher.update(Buffer.from(plainText, "utf8")),
            cipher.final()
        ]).toString("base64");
    } catch (e) {
        return plainText;
    }
});


// ********** Encryption Helpers End **********

module.exports = handlebars
