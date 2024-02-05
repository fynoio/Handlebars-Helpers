const handlebars = require('handlebars')
const moment = require('moment')

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

handlebars.registerHelper("replace", function (input, findRegex, replaceStr) {
    if (!input) return "";

    if (typeof input === "object") {
        return;
    }
    const regex = new RegExp(findRegex, 'g');

    return input.replace(regex, replaceStr);
});

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

handlebars.registerHelper('formatNumber', function (number, locale = 'en-US') {
    if (isNaN(number)) {
        return number
    }

    return new Intl.NumberFormat(locale).format(number)
})

module.exports = handlebars