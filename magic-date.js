"use strict";
/**
 * @author Peter Ukonu
 * @email [pukonu@gmail.com]
 * @create date 2018-07-06 02:51:23
 * @modify date 2018-07-06 02:53:23
 * @revision date 2020-05-20 03:00:00 - v2
 * @desc A date utility class to handle all sort of manipulation on a date
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var TimeFormat;
(function (TimeFormat) {
    TimeFormat[TimeFormat["ISO8601"] = 0] = "ISO8601";
})(TimeFormat || (TimeFormat = {}));
/**
 * Interface class to guide date construction
 */
var SimpleDateInterface = /** @class */ (function () {
    function SimpleDateInterface() {
        this.hour = 12;
        this.min = 0;
        this.sec = 0;
        this.microSecond = 0;
        this.timezoneOffset = 0; // should be in multiples of 60
    }
    return SimpleDateInterface;
}());
/**
 * A class to perform some magic function on Javascript date
 * e.g.
 * 1. For 3 weeks ahead of today its simple MagicDate().next("3 weeks")
 * 2. For 2 days backwars MagicDate().next("-2 days")
 * 3. For the first date of the current week MagicDate().getWeekFirstDate()
 * 4. Last date of the current month MagicDate().getMonthLastDate()
 * 5. Date factory MagicDate.makeDate({year: 2018, month: 3, day: 18})
 * 6. Cast MagicDate object to a format <dateObject>.setCast("%Y-%m").toString()
 * 7. Check if current year is a leap year MagicDate().isLeapYear()
 * 8. Return an array of dates between one and another MagicDate.getDateFromTo(start: MagicDate, end: MagicDate)
 *
 */
var MagicDate = /** @class */ (function () {
    function MagicDate(date, options) {
        if (date === void 0) { date = null; }
        if (options === void 0) { options = {}; }
        this.year = null;
        this.month = null;
        this.day = null;
        this.hour = null;
        this.minute = null;
        this.second = null;
        this.microSecond = null;
        this.timezoneStr = "+00:00";
        this.weekday = null;
        this.weekdayNumeric = null;
        this.weeknum = null;
        this.weekStart = MagicDate.WEEKDAYS[0];
        this.leapYear = false;
        this.yearStr = null;
        this.monthStr = null;
        this.dayStr = null;
        this.hourStr = null;
        this.minuteStr = null;
        this.secondStr = null;
        this.microSecondStr = null;
        this.timezoneOffset = null;
        this.dtTime = 0;
        this.dtObj = null;
        this._castMask = null;
        this.options = __assign({ weekStart: MagicDate.DEFAULT_WEEK_START, microSecondsLength: MagicDate.DEFAULT_MICRO_SECONDS_LENGTH, dateIso: MagicDate.DEFAULT_ISO_FORMAT }, options);
        return this.now(date);
    }
    /**
     * A public static method in MagicDate which represent a Factory for making dateObjects
     * @param dateFactoryConfig
     * @param options
     */
    MagicDate.makeDate = function (dateFactoryConfig, options) {
        if (dateFactoryConfig === void 0) { dateFactoryConfig = new SimpleDateInterface(); }
        if (options === void 0) { options = {}; }
        var dateObject = new MagicDate();
        var __microSecondLength = options.microSecondsLength || MagicDate.DEFAULT_MICRO_SECONDS_LENGTH;
        try {
            if (dateFactoryConfig.dt) {
                dateObject.dtObj = new Date(dateFactoryConfig.dt);
            }
            else {
                var __dateObject_1 = new SimpleDateInterface();
                var __isoDate_1 = {};
                ["year", "month", "day", "hour", "min", "sec", "microSecond"].map(function (v) {
                    var validityError = MagicDate.validateDateConfig(parseInt(dateFactoryConfig[v]), v);
                    if (validityError) {
                        throw new Error(validityError);
                    }
                    __dateObject_1[v] = dateFactoryConfig[v] || __dateObject_1[v];
                    switch (v) {
                        case "year":
                            __isoDate_1[v] = __dateObject_1[v];
                            break;
                        case "microSecond":
                            __isoDate_1[v] = MagicDate.padding(__dateObject_1[v].toString(), __microSecondLength, "0");
                            break;
                        default:
                            __isoDate_1[v] = MagicDate.padding(__dateObject_1[v].toString(), 2, "0");
                    }
                });
                var timezoneStr = MagicDate.makeTimezoneStr(__dateObject_1.timezoneOffset);
                var isoDateStr = __isoDate_1["year"] + "-" + __isoDate_1["month"] + "-" + __isoDate_1["day"] + " " + __isoDate_1["hour"] + ":" + __isoDate_1["min"] + ":" + __isoDate_1["sec"] + "." + __isoDate_1["microSecond"] + timezoneStr;
                return MagicDate.makeDateFromString(isoDateStr, options);
            }
        }
        catch (e) {
            console.error("To make a new date, you must pass in the year month and day into the makeDate " +
                "function arguments", e);
        }
        dateObject._toNumber()._analyseDateTime();
        return dateObject;
    };
    /**
     * Use this function to make a date time from date string in an ISO format
     * Please not that this function is limited to ISO 8601
     * @param date
     * @param option
     */
    MagicDate.makeDateFromString = function (date, option) {
        if (option === void 0) { option = {}; }
        return new MagicDate(new Date(date), option);
    };
    /**
     * A function to generate an Array of MagicDate objects from a reference start date to an end date
     * @param start
     * @param end
     * @param abstraction
     * @param weekStart
     * @param includeEndDate
     */
    MagicDate.getDateFromTo = function (start, end, abstraction, weekStart, includeEndDate) {
        if (abstraction === void 0) { abstraction = "day"; }
        if (weekStart === void 0) { weekStart = null; }
        if (includeEndDate === void 0) { includeEndDate = true; }
        var startNumeric = start.dtTime;
        var endNumeric = end.dtTime;
        // $weekStart = $weekStart || MagicDate.DEFAULT_WEEK_START;
        var dateArray = [];
        // check if date is in correct order and throw exception if not
        if (!MagicDate.validateDatePosition(start, end))
            throw new Error(MagicDate.EXCEPTIONS.dateRangeOrderException);
        // a caveat to include end date when return a dates between 2 dates
        var endDatePadding = includeEndDate ? MagicDate.timeMult(abstraction) : 0;
        var i = startNumeric;
        while (i && endNumeric && i < endNumeric + endDatePadding) {
            var __dateObject = new SimpleDateInterface();
            __dateObject.dt = i;
            dateArray.push(MagicDate.makeDate(__dateObject));
            i += MagicDate.timeMult(abstraction);
        }
        return dateArray;
    };
    /**
     * A function to get first date of a given week number
     * @param weekNum
     * @param year
     */
    MagicDate.getDateFromWeekNum = function (weekNum, year) {
        var __dateObject = new SimpleDateInterface();
        __dateObject.year = year || new Date().getFullYear();
        __dateObject.month = 1;
        __dateObject.day = 1;
        var dateObject = MagicDate.makeDate(__dateObject);
        return dateObject.next(weekNum - 1 + " weeks").getWeekFirstDate();
    };
    /**
     * A function to get an array of dates of a given week number
     * @param weekNum
     * @param year
     * @param abstraction
     * @param weekStart
     * @param includeEndDate
     */
    MagicDate.getDatesFromWeekNum = function (_a) {
        var weekNum = _a.weekNum, _b = _a.year, year = _b === void 0 ? null : _b, _c = _a.abstraction, abstraction = _c === void 0 ? "day" : _c, _d = _a.weekStart, weekStart = _d === void 0 ? MagicDate.DEFAULT_WEEK_START : _d, _e = _a.includeEndDate, includeEndDate = _e === void 0 ? false : _e;
        var start = MagicDate.getDateFromWeekNum(weekNum, year);
        var end = MagicDate.getDateFromWeekNum(weekNum, year).getWeekLastDate();
        return MagicDate.getDateFromTo(start, end, abstraction, weekStart, includeEndDate);
    };
    /**
     * Will return an array of weeks
     * @param $range
     * @param $start
     * @param $startYear
     */
    MagicDate.getWeeks = function ($range, $start, $startYear) {
        if ($range === void 0) { $range = 1; }
        var dateObject = new MagicDate();
        $start = $start || dateObject.weeknum || 0;
        var weekArray = [];
        var year = $startYear || dateObject.year || new Date().getFullYear();
        var weekNum = $start;
        var i = 0;
        while (i < $range) {
            if (weekNum === 52) {
                year++;
                weekNum = 1;
            }
            weekArray.push({ year: year, weekNum: weekNum });
            weekNum++;
            i++;
        }
        return weekArray;
    };
    /**
     * A function to get the first date of a given month
     * @param dateObject
     * @param month
     * @param year
     */
    MagicDate.getMonthFirstDate = function (_a) {
        var dateObject = _a.dateObject, month = _a.month, year = _a.year;
        if (dateObject || (month && year)) {
            if (dateObject) {
                month = dateObject.month;
                year = dateObject.year;
            }
            var __simpleDate = {
                year: year,
                month: month,
                day: 1
            };
            return MagicDate.makeDate(__simpleDate);
        }
        else {
            throw new Error(MagicDate.EXCEPTIONS.valueException);
        }
    };
    /**
     * A function to get the last date of a given month
     * @param dateObject
     * @param month
     * @param year
     */
    MagicDate.getMonthLastDate = function (_a) {
        var dateObject = _a.dateObject, month = _a.month, year = _a.year;
        if (dateObject || (month && year)) {
            if (dateObject) {
                month = dateObject.month;
                year = dateObject.year;
            }
            var __simpleDate = {
                year: year,
                month: month,
                day: MagicDate.getMonthLength(year, month)
            };
            return MagicDate.makeDate(__simpleDate);
        }
        else {
            throw new Error(MagicDate.EXCEPTIONS.valueException);
        }
    };
    /**
     * A function to return the length of any given month and year
     * @param year
     * @param month
     */
    MagicDate.getMonthLength = function (year, month) {
        var __monthLabel = MagicDate.MONTHS[month - 1];
        return MagicDate.isLeapYear(year) ? __monthLabel.length + 1 : __monthLabel.length;
    };
    /**
     * A boolean function to check the positions of 2 dates,
     * will return false if (a, b) a date is greater than b date
     * @param a
     * @param b
     */
    MagicDate.validateDatePosition = function (a, b) {
        var __dateObjectA = new SimpleDateInterface();
        __dateObjectA.dt = a;
        var __dateObjectB = new SimpleDateInterface();
        __dateObjectB.dt = b;
        var ret = MagicDate.makeDate(__dateObjectA).dtTime <= MagicDate.makeDate(__dateObjectB).dtTime;
        return !!ret;
    };
    MagicDate.validateDateConfig = function (value, type) {
        var __dateObject = new SimpleDateInterface();
        value = value || __dateObject[value];
        if (value < MagicDate.CONFIG_BOUNDARIES[type + "_boundary"][0] ||
            value > MagicDate.CONFIG_BOUNDARIES[type + "_boundary"][1]) {
            return "The argument entered for " + type + ": " + value + " is out of the MagicDate scope";
        }
        return null;
    };
    /**
     * Make a timezone iso string
     * @param timezoneOffset
     * @param dtObj
     */
    MagicDate.makeTimezoneStr = function (timezoneOffset, dtObj) {
        if (timezoneOffset === void 0) { timezoneOffset = null; }
        if (dtObj === void 0) { dtObj = null; }
        var _timezoneOffset = timezoneOffset || (dtObj === null || dtObj === void 0 ? void 0 : dtObj.getTimezoneOffset()) || new Date().getTimezoneOffset();
        var minutes = Math.abs(_timezoneOffset / 60);
        var paddedMinutes = MagicDate.padding(minutes.toString(), 2, "0");
        var sign = _timezoneOffset < 0 ? "+" : "-";
        return "" + sign + paddedMinutes + ":00";
    };
    /**
     * Check if current year is a leap
     * @param year
     */
    MagicDate.isLeapYear = function (year) {
        return year % 4 === 0;
    };
    MagicDate.timeMult = function (type) {
        // ms in a week, day, hour, min, sec
        switch (type) {
            case "week":
                return 7 * 24 * 60 * 60 * 1000;
            case "day":
                return 24 * 60 * 60 * 1000;
            case "hour":
                return 60 * 60 * 1000;
            case "min":
                return 60 * 1000;
            case "sec":
                return 1000;
        }
        return 0;
    };
    MagicDate.padding = function (value, len, paddingStr) {
        len = len - value.length + 1;
        return len > 0 ? new Array(len).join(paddingStr) + value : value;
    };
    /**
     * Generate current time
     */
    MagicDate.prototype.now = function (date) {
        if (date === void 0) { date = null; }
        this.dtObj = date || new Date();
        this._toNumber()._analyseDateTime();
        return this;
    };
    /**
     * Get todays date
     */
    MagicDate.prototype.today = function (date) {
        if (date === void 0) { date = null; }
        date.getDate() || (this.dtObj && this.dtObj.getDate());
        return this;
    };
    /**
     * Get the first date of the week
     */
    MagicDate.prototype.getWeekFirstDate = function () {
        this.next("-" + this.weekdayNumeric + " days");
        return this;
    };
    /**
     * Last date of a week
     */
    MagicDate.prototype.getWeekLastDate = function () {
        this.weekdayNumeric !== null && this.next(6 - this.weekdayNumeric + " days");
        return this;
    };
    /**
     * The first date in the month
     */
    MagicDate.prototype.getMonthFirstDate = function () {
        return MagicDate.getMonthFirstDate(this);
    };
    /**
     * The last date of the month
     */
    MagicDate.prototype.getMonthLastDate = function () {
        return MagicDate.getMonthLastDate(this);
    };
    /**
     * Get the current week number
     */
    MagicDate.prototype.getWeekNum = function () {
        this.year = this.year || new Date().getFullYear();
        var januaryFirst = new Date(this.year, 0, 1);
        var v = (this.dtTime || 0) / MagicDate.timeMult(MagicDate.LABELS.day) -
            januaryFirst.getTime() / MagicDate.timeMult(MagicDate.LABELS.day) +
            januaryFirst.getDay() -
            (this.weekStart.name === MagicDate.DEFAULT_WEEK_START.name ? 1 : 0);
        return Math.floor(v / 7) + 1;
    };
    /**
     * Set when the week starts
     * @param weekStartInt i.e. 0>>Sunday, 1>>Monday
     */
    MagicDate.prototype.setWeekStart = function (weekStartInt) {
        this.weekStart = MagicDate.WEEKDAYS[weekStartInt] || MagicDate.DEFAULT_WEEK_START;
        return this;
    };
    /**
     * A generic command to increment dates, months and yeara
     * e.g.
     * 1. <MagicDate>.next("1 month")
     * 2. <MagicDate>.next("-1 days") (will substract from the current date)
     * @param command
     */
    MagicDate.prototype.next = function (command) {
        var _a = command.split(" "), value = _a[0], abstraction = _a[1];
        var valueInt = parseInt(value);
        var polarity = valueInt >= 0 ? 1 : -1;
        // 3 years, 4 months,  2 weeks, 7 days, 1 month, 5 weeks, 1 hour, 4 minutes, 32
        // seconds
        abstraction =
            abstraction.substr(-1, 1) === "s"
                ? abstraction.substring(0, abstraction.length - 1)
                : abstraction;
        // normalize the minute and second entry to conform to out nomenclature
        switch (abstraction) {
            case "minute":
                abstraction = "min";
                break;
            case "second":
                abstraction = "sec";
                break;
        }
        // this have irregular lengths so we will handle differently
        if (["year", "month"].indexOf(abstraction) > -1) {
            var yearDelta = 0, monthDelta = 0;
            valueInt = Math.abs(valueInt);
            switch (abstraction) {
                case "year":
                    yearDelta = valueInt * polarity;
                    break;
                case "month":
                    yearDelta = Math.floor(valueInt / 12) * polarity;
                    monthDelta = (valueInt % 12) * polarity;
                    break;
                default:
            }
            var __simpleDate = new SimpleDateInterface();
            __simpleDate.year = (this.year || new Date().getFullYear()) + yearDelta;
            __simpleDate.month = (this.month || new Date().getMonth() + 1) + monthDelta; // month return a unit before in js
            __simpleDate.day = this.day || new Date().getDay();
            var monthLength = MagicDate.getMonthLength(__simpleDate.year, __simpleDate.month);
            // correct date based on month length - e.g. if 31 appears on a November, will
            // be changed to 30
            if (monthLength < (this.day || new Date().getDay())) {
                __simpleDate.day = monthLength;
            }
            return MagicDate.makeDate(__simpleDate);
        }
        else {
            this.dtTime = this.dtTime && this.dtTime + valueInt * MagicDate.timeMult(abstraction);
        }
        this._formatFromNumericTime()._analyseDateTime();
        return this;
    };
    /**
     * Cast potential final outcome via a template e.g. "%Y-%m-%d"
     * @param mask
     */
    MagicDate.prototype.setCast = function (mask) {
        this._castMask = mask;
        return this;
    };
    /**
     * Render the values of this class
     */
    MagicDate.prototype.toString = function () {
        this._formatWithLeadingZeroes();
        var _a = this, yearStr = _a.yearStr, monthStr = _a.monthStr, dayStr = _a.dayStr, hourStr = _a.hourStr, minuteStr = _a.minuteStr, secondStr = _a.secondStr, microSecondStr = _a.microSecondStr, timezoneStr = _a.timezoneStr;
        if (this._castMask) {
            var __ret_1 = this._castMask;
            var keywords = __ret_1.match(/[A-Za-z]/g);
            keywords &&
                keywords.map(function (k) {
                    return (__ret_1 = __ret_1.replace("%" + k, eval(MagicDate.MASK_DICTIONARY[k] + "Str")));
                });
            return __ret_1;
        }
        return yearStr + "-" + monthStr + "-" + dayStr + " " + hourStr + ":" + minuteStr + ":" + secondStr + "." + microSecondStr + timezoneStr;
    };
    /**
     * Boiler plater rendered, renders a date string
     */
    MagicDate.prototype.toDateString = function () {
        this._castMask = "%Y-%m-%d";
        return this.toString();
    };
    /**
     * Boiler plater rendered, renders a time string
     */
    MagicDate.prototype.toTimeString = function () {
        this._castMask = "%H:%i:%s";
        return this.toString();
    };
    /**
     * Check if current year is a leap year
     */
    MagicDate.prototype.isLeapYear = function () {
        return MagicDate.isLeapYear(this.year || new Date().getFullYear());
    };
    MagicDate.prototype._toNumber = function () {
        var _dt = this.dtObj &&
            this.dtObj.getTime() +
                -1 * new Date().getTimezoneOffset() * MagicDate.timeMult("min") -
                1000 * 60;
        if (_dt) {
            this.dtObj = new Date(_dt);
            this.dtTime = this.dtObj.getTime();
        }
        return this;
    };
    MagicDate.prototype._formatFromNumericTime = function () {
        this.dtObj = new Date(this.dtTime);
        return this;
    };
    MagicDate.prototype._formatWithLeadingZeroes = function () {
        var _a = this, year = _a.year, month = _a.month, day = _a.day, hour = _a.hour, minute = _a.minute, second = _a.second, microSecond = _a.microSecond;
        this.yearStr = year.toString();
        this.monthStr = MagicDate.padding(month.toString(), 2, "0");
        this.dayStr = MagicDate.padding(day.toString(), 2, "0");
        this.hourStr = hour !== null && MagicDate.padding(hour.toString(), 2, "0");
        this.minuteStr = minute !== null && MagicDate.padding(minute.toString(), 2, "0");
        this.secondStr = second !== null && MagicDate.padding(second.toString(), 2, "0");
        this.microSecondStr =
            microSecond !== null &&
                MagicDate.padding(microSecond.toString(), this.options.microSecondsLength, "0");
        return this;
    };
    MagicDate.prototype._analyseDateTime = function () {
        try {
            if (this.dtObj) {
                var isoDate = this.dtObj.toISOString();
                this.weekdayNumeric = this.dtObj.getDay();
                this.weekday = MagicDate.WEEKDAYS[this.weekdayNumeric];
                this.year = parseInt(isoDate.substring(0, 4));
                this.month = parseInt(isoDate.substring(5, 7));
                this.day = parseInt(isoDate.substring(8, 10));
                this.hour = parseInt(isoDate.substring(11, 13));
                this.minute = parseInt(isoDate.substring(14, 16));
                this.second = parseInt(isoDate.substring(17, 19));
                this.microSecond = parseInt(isoDate.substring(20, 23));
                this.timezoneStr = MagicDate.makeTimezoneStr(this.timezoneOffset, this.dtObj);
                this.weeknum = this.getWeekNum();
                this.leapYear = this.year % 4 === 0;
                switch (this.options.dateIso) {
                    case TimeFormat.ISO8601:
                    default:
                        this._castMask = "%Y-%m-%d %H:%i:%s.%u%t";
                }
                this._formatWithLeadingZeroes();
                return this;
            }
        }
        catch (e) {
            console.error(e);
        }
        return this;
    };
    /**
     * Dictionary of month definitions
     */
    MagicDate.MONTHS = [
        {
            code: "01",
            shortName: "Jan",
            length: 31,
            name: "January"
        },
        {
            code: "02",
            shortName: "Feb",
            length: 28,
            name: "February"
        },
        {
            code: "03",
            shortName: "Mar",
            length: 31,
            name: "March"
        },
        {
            code: "04",
            shortName: "Apr",
            length: 30,
            name: "April"
        },
        {
            code: "05",
            shortName: "May",
            length: 31,
            name: "May"
        },
        {
            code: "06",
            shortName: "Jun",
            length: 30,
            name: "June"
        },
        {
            code: "07",
            shortName: "Jul",
            length: 31,
            name: "July"
        },
        {
            code: "08",
            shortName: "Aug",
            length: 31,
            name: "August"
        },
        {
            code: "09",
            shortName: "Sep",
            length: 30,
            name: "September"
        },
        {
            code: "10",
            shortName: "Oct",
            length: 31,
            name: "October"
        },
        {
            code: "11",
            shortName: "Nov",
            length: 30,
            name: "November"
        },
        {
            code: "12",
            shortName: "Dec",
            length: 31,
            name: "December"
        }
    ];
    /**
     * Dictionary of weekday definitions
     */
    MagicDate.WEEKDAYS = [
        {
            code: "01",
            shortName: "Sun",
            name: "Sunday"
        },
        {
            code: "02",
            shortName: "Mon",
            name: "Monday"
        },
        {
            code: "03",
            shortName: "Tue",
            name: "Tuesday"
        },
        {
            code: "04",
            shortName: "Wed",
            name: "Wednesday"
        },
        {
            code: "05",
            shortName: "Thu",
            name: "Thursday"
        },
        {
            code: "06",
            shortName: "Fri",
            name: "Friday"
        },
        {
            code: "07",
            shortName: "Sat",
            name: "Saturday"
        }
    ];
    /**
     * Default start date of the week
     */
    MagicDate.DEFAULT_WEEK_START = MagicDate.WEEKDAYS[0];
    MagicDate.DEFAULT_MICRO_SECONDS_LENGTH = 6;
    MagicDate.DEFAULT_ISO_FORMAT = TimeFormat.ISO8601;
    /**
     * Boundaries for configuration
     */
    MagicDate.CONFIG_BOUNDARIES = {
        year_boundary: [1900, 2100],
        month_boundary: [1, 12],
        day_boundary: [1, 31],
        hour_boundary: [0, 23],
        min_boundary: [0, 59],
        sec_boundary: [0, 59],
        microSecond_boundary: [0, 999999]
    };
    /**
     * Generic labels
     */
    MagicDate.LABELS = {
        day: "day"
    };
    /**
     * Mask dictionary for date variables
     */
    MagicDate.MASK_DICTIONARY = {
        Y: "year",
        m: "month",
        d: "day",
        H: "hour",
        i: "minute",
        s: "second",
        u: "microSecond",
        t: "timezone"
    };
    /**
     * Exception dictionary
     */
    MagicDate.EXCEPTIONS = {
        dateRangeOrderException: "You tried to get an array of dates between 2 dates, but the start date selected " +
            "seems to be ahead of the end date",
        valueException: "Argument parsed failed to process"
    };
    return MagicDate;
}());
exports["default"] = MagicDate;
