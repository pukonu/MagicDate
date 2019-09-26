/**
 * @author Peter Ukonu
 * @email [pukonu@gmail.com]
 * @create date 2018-07-06 02:51:23
 * @modify date 2018-07-06 02:53:23
 * @desc A date utility class to handle all sort of manipulation on a date
 */
/**
 * Interface class to guide date construction
 */
class SimpleDateInterface {
    constructor() {
        this.hour = 12;
        this.min = 0;
        this.sec = 0;
    }
}
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
class MagicDate {
    constructor(options = {
        weekStart: MagicDate.DEFAULT_WEEK_START
    }) {
        this.year = null;
        this.month = null;
        this.day = null;
        this.hour = null;
        this.minute = null;
        this.second = null;
        this.microSecond = null;
        this.timezone = null;
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
        this.dtTime = null;
        this.dtObj = null;
        this._castMask = '%Y-%m-%d %H:%i:%s:%u';
        return this.now();
    }
    /**
     * A public static method in MagicDate which represent a Factory for making dateObjects
     * @param dateFactoryConfig
     */
    static makeDate(dateFactoryConfig = new SimpleDateInterface()) {
        const dateObject = new MagicDate();
        try {
            if (dateFactoryConfig.dt) {
                dateObject.dtObj = new Date(dateFactoryConfig.dt);
            } else {
                for (let value of["year",
                    "month",
                    "day",
                    "hour",
                    "min",
                    "sec"]) {}
                const __dateObject = new SimpleDateInterface();
                [
                    "year",
                    "month",
                    "day",
                    "hour",
                    "min",
                    "sec"
                ].map((v) => {
                    const validityError = MagicDate.validateDateConfig(parseInt(eval(dateFactoryConfig[v])), v);
                    if (validityError) {
                        throw new Error(validityError);
                    }
                    __dateObject[v] = dateFactoryConfig[v] || __dateObject[v];
                });
                dateObject.dtObj = new Date(__dateObject.year, __dateObject.month - 1, __dateObject.day, __dateObject.hour, __dateObject.min, __dateObject.sec);
            }
        } catch (e) {
            console.error("To make a new date, you must pass in the year month and day into the makeDate fu" +
                    "nction arguments");
        }
        dateObject
            ._toNumber()
            ._analyseDateTime();
        return dateObject;
    }
    /**
     * A function to generate an Array of MagicDate objects from a reference start date to an end date
     * @param $start
     * @param $end
     * @param $abstraction
     * @param $weekStart
     * @param $includeEndDate
     */
    static getDateFromTo($start, $end, $abstraction = "day", $weekStart = null, $includeEndDate = true) {
        const startNumeric = $start.dtTime;
        const endNumeric = $end.dtTime;
        $weekStart = $weekStart || MagicDate.DEFAULT_WEEK_START;
        const dateArray = [];
        // check if date is in correct order and throw exception if not
        if (!MagicDate.validateDatePosition($start, $end)) 
            throw new Error(MagicDate.EXCEPTIONS.dateRangeOrderException);
        
        // a caveat to include end date when return a dates between 2 dates
        const endDatePadding = $includeEndDate
            ? MagicDate.timeMult($abstraction)
            : 0;
        let i = startNumeric;
        while (i <= endNumeric + endDatePadding) {
            const __dateObject = new SimpleDateInterface();
            __dateObject.dt = i;
            dateArray.push(MagicDate.makeDate(__dateObject));
            i += MagicDate.timeMult($abstraction);
        }
        return dateArray;
    }
    /**
     * A function to get first date of a given week number
     * @param $weekNum
     * @param $year
     */
    static getDateFromWeekNum($weekNum, $year) {
        const __dateObject = new SimpleDateInterface();
        __dateObject.year = $year || new Date().getFullYear();
        __dateObject.month = 1;
        __dateObject.day = 1;
        const dateObject = MagicDate.makeDate(__dateObject);
        return dateObject
            .next(`${$weekNum - 1} weeks`)
            .getWeekFirstDate();
    }
    /**
     * A function to get an array of dates of a given week number
     * @param $weekNum
     * @param $year
     * @param $abstraction
     * @param $weekStart
     * @param $includeEndDate
     */
    static getDatesFromWeekNum($weekNum, $year = null, $abstraction = "day", $weekStart = null, $includeEndDate = false) {
        const $start = MagicDate.getDateFromWeekNum($weekNum, $year);
        const $end = MagicDate
            .getDateFromWeekNum($weekNum, $year)
            .getWeekLastDate();
        return MagicDate.getDateFromTo($start, $end, $abstraction, $weekStart, $includeEndDate);
    }
    /**
     * Will return an array of weeks
     * @param param0
     */
    static getWeeks({
        $range = 1,
        $start,
        $startYear
    }) {
        const dateObject = new MagicDate();
        $start = $start || dateObject.weeknum;
        const weekArray = [];
        let year = $startYear || dateObject.year;
        let weekNum = $start;
        let i = 0;
        while (i < $range) {
            if (weekNum === 52) {
                year++;
                weekNum = 1;
            }
            weekArray.push({year, weekNum});
            weekNum++;
            i++;
        }
        return weekArray;
    }
    /**
     * A function to get the first date of a given month
     * @param dateObject
     * @param month
     * @param year
     */
    static getMonthFirstDate(dateObject, month, year) {
        if (dateObject || (month && year)) {
            if (dateObject) {
                month = dateObject.month;
                year = dateObject.year;
            }
            const __simpleDate = {
                year: year,
                month: month,
                day: 1
            };
            return MagicDate.makeDate(__simpleDate);
        } else {
            throw new Error(MagicDate.EXCEPTIONS.valueException);
        }
    }
    /**
     * A function to get the last date of a given month
     * @param dateObject
     * @param month
     * @param year
     */
    static getMonthLastDate(dateObject, month, year) {
        if (dateObject || (month && year)) {
            if (dateObject) {
                month = dateObject.month;
                year = dateObject.year;
            }
            const __simpleDate = {
                year: year,
                month: month,
                day: MagicDate.getMonthLength(year, month)
            };
            return MagicDate.makeDate(__simpleDate);
        } else {
            throw new Error(MagicDate.EXCEPTIONS.valueException);
        }
    }
    /**
     * A function to return the length of any given month and year
     * @param year
     * @param month
     */
    static getMonthLength(year, month) {
        const __monthLabel = MagicDate.MONTHS[month - 1];
        return MagicDate.isLeapYear(year)
            ? __monthLabel.length + 1
            : __monthLabel.length;
    }
    /**
     * A boolean function to check the positions of 2 dates,
     * will return false if (a, b) a date is greater than b date
     * @param a
     * @param b
     */
    static validateDatePosition(a, b) {
        const __dateObjectA = new SimpleDateInterface();
        __dateObjectA.dt = a;
        const __dateObjectB = new SimpleDateInterface();
        __dateObjectB.dt = b;
        return MagicDate
            .makeDate(__dateObjectA)
            .dtTime <= MagicDate
            .makeDate(__dateObjectB)
            .dtTime;
    }
    static validateDateConfig(value, type) {
        const __dateObject = new SimpleDateInterface();
        value = value || __dateObject[value];
        if (value < MagicDate.CONFIG_BOUNDARIES[`${type}_boundary`][0] || value > MagicDate.CONFIG_BOUNDARIES[`${type}_boundary`][1]) {
            return `The argument entered for ${type}: ${value} is out of the MagicDate scope`;
        }
        return null;
    }
    /**
     * Check if current year is a leap
     * @param year
     */
    static isLeapYear(year) {
        return year % 4 === 0;
    }
    static timeMult(type) {
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
    }
    static padding(value, len, paddingStr) {
        len = len - value.length + 1;
        return len > 0
            ? new Array(len).join(paddingStr) + value
            : value;
    }
    /**
     * Generate current time
     */
    now() {
        this.dtObj = new Date();
        this
            ._toNumber()
            ._analyseDateTime();
        return this;
    }
    /**
     * Get todays date
     */
    today() {
        this
            .dtObj
            .getDate();
        return this;
    }
    /**
     * Get the first date of the week
     */
    getWeekFirstDate() {
        this.next(`-${this.weekdayNumeric} days`);
        return this;
    }
    /**
     * Last date of a week
     */
    getWeekLastDate() {
        this.next(`${ (6 - this.weekdayNumeric)} days`);
        return this;
    }
    /**
     * The first date in the month
     */
    getMonthFirstDate() {
        return MagicDate.getMonthFirstDate(this);
    }
    /**
     * The last date of the month
     */
    getMonthLastDate() {
        return MagicDate.getMonthLastDate(this);
    }
    /**
     * Get the current week number
     */
    getWeekNum() {
        const januaryFirst = new Date(this.year, 0, 1);
        const v = (this.dtTime / MagicDate.timeMult(MagicDate.LABELS.day)) - (januaryFirst.getTime() / MagicDate.timeMult(MagicDate.LABELS.day)) + januaryFirst.getDay() - (this.weekStart.name === MagicDate.DEFAULT_WEEK_START.name
            ? 1
            : 0);
        return Math.floor(v / 7) + 1;
    }
    /**
     * Set when the week starts
     * @param weekStartInt i.e. 0>>Sunday, 1>>Monday
     */
    setWeekStart(weekStartInt) {
        this.weekStart = MagicDate.WEEKDAYS[weekStartInt] || MagicDate.DEFAULT_WEEK_START;
        return this;
    }
    /**
     * A generic command to increment dates, months and yeara
     * e.g.
     * 1. <MagicDate>.next("1 month")
     * 2. <MagicDate>.next("-1 days") (will substract from the current date)
     * @param command
     */
    next(command) {
        let [value,
            abstraction] = command.split(" ");
        let valueInt = parseInt(value);
        const polarity = valueInt >= 0
            ? 1
            : -1;
        // 3 years, 4 months,  2 weeks, 7 days, 1 month, 5 weeks, 1 hour, 4 minutes, 32
        // seconds
        abstraction = (abstraction.substr(-1, 1) === "s")
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
        if (["year", "month"].indexOf(abstraction) > -1) {
            let yearDelta = 0,
                monthDelta = 0;
            valueInt = Math.abs(valueInt);
            if (abstraction === "month") {
                yearDelta = Math.floor(valueInt / 12) * polarity;
                monthDelta = (valueInt % 12) * polarity;
            }
            if (abstraction === "year") {
                yearDelta = valueInt * polarity;
            }
            const __simpleDate = {
                year: this.year + yearDelta,
                month: this.month + monthDelta,
                day: this.day
            };
            const monthLength = MagicDate.getMonthLength(__simpleDate.year, __simpleDate.month);
            // correct date based on month length - e.g. if 31 appears on a November, will
            // be changed to 30
            if (monthLength < this.day) {
                __simpleDate.day = monthLength;
            }
            return MagicDate.makeDate(__simpleDate);
        } else {
            this.dtTime = this.dtTime + (valueInt * MagicDate.timeMult(abstraction));
        }
        this
            ._formatFromNumericTime()
            ._analyseDateTime();
        return this;
    }
    /**
     * Cast potential final outcome via a template e.g. "%Y-%m-%d"
     * @param mask
     */
    setCast(mask) {
        this._castMask = mask;
        return this;
    }
    /**
     * Render the values of this class
     */
    toString() {
        this._formatWithLeadingZeroes();
        const {
            yearStr,
            monthStr,
            dayStr,
            hourStr,
            minuteStr,
            secondStr,
            microSecondStr
        } = this;
        if (this._castMask) {
            let __ret = this._castMask;
            // const keywords = __ret.match(/(?<=%)[A-Za-z]/g);
            // keywords.map(k => __ret = __ret.replace(`%${k}`, eval(`${MagicDate.MASK_DICTIONARY[k]}Str`)));
            return __ret;
        }
        return `${yearStr}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}:${secondStr}.${microSecondStr}`;
    }
    /**
     * Boiler plater rendered, renders a date string
     */
    toDateString() {
        this._castMask = "%Y-%m-%d";
        return this.toString();
    }
    /**
     * Boiler plater rendered, renders a time string
     */
    toTimeString() {
        this._castMask = "%H:%i:%s";
        return this.toString();
    }
    /**
     * Check if current year is a leap year
     */
    isLeapYear() {
        return MagicDate.isLeapYear(this.year);
    }
    _toNumber() {
        const _dt = this
            .dtObj
            .getTime() + (-1 * new Date().getTimezoneOffset() * MagicDate.timeMult("min")) - (1000 * 60 * 30);
        this.dtObj = new Date(_dt);
        this.dtTime = this
            .dtObj
            .getTime();
        return this;
    }
    _formatFromNumericTime() {
        this.dtObj = new Date(this.dtTime);
        return this;
    }
    _formatWithLeadingZeroes() {
        const {
            year,
            month,
            day,
            hour,
            minute,
            second,
            microSecond
        } = this;
        this.yearStr = year.toString();
        this.monthStr = MagicDate.padding(month.toString(), 2, "0");
        this.dayStr = MagicDate.padding(day.toString(), 2, "0");
        this.hourStr = MagicDate.padding(hour.toString(), 2, "0");
        this.minuteStr = MagicDate.padding(minute.toString(), 2, "0");
        this.secondStr = MagicDate.padding(second.toString(), 2, "0");
        this.microSecondStr = MagicDate.padding(microSecond.toString(), 3, "0");
        return this;
    }
    _analyseDateTime() {
        try {
            const isoDate = this
                .dtObj
                .toISOString();
            this.weekdayNumeric = this
                .dtObj
                .getDay();
            this.weekday = MagicDate.WEEKDAYS[this.weekdayNumeric];
            this.year = parseInt(isoDate.substring(0, 4));
            this.month = parseInt(isoDate.substring(5, 7));
            this.day = parseInt(isoDate.substring(8, 10));
            this.hour = parseInt(isoDate.substring(11, 13));
            this.minute = parseInt(isoDate.substring(14, 16));
            this.second = parseInt(isoDate.substring(17, 19));
            this.microSecond = parseInt(isoDate.substring(20, 23));
            this.weeknum = this.getWeekNum();
            this.leapYear = this.year % 4 === 0;
            return this;
        } catch (e) {
            console.error(e);
            return this;
        }
    }
}
/**
 * Dictionary of month definitions
 */
MagicDate.MONTHS = [
    {
        code: "01",
        shortName: "Jan",
        length: 31,
        name: "January"
    }, {
        code: "02",
        shortName: "Feb",
        length: 28,
        name: "February"
    }, {
        code: "03",
        shortName: "Mar",
        length: 31,
        name: "March"
    }, {
        code: "04",
        shortName: "Apr",
        length: 30,
        name: "April"
    }, {
        code: "05",
        shortName: "May",
        length: 31,
        name: "May"
    }, {
        code: "06",
        shortName: "Jun",
        length: 30,
        name: "June"
    }, {
        code: "07",
        shortName: "Jul",
        length: 31,
        name: "July"
    }, {
        code: "08",
        shortName: "Aug",
        length: 31,
        name: "August"
    }, {
        code: "09",
        shortName: "Sep",
        length: 30,
        name: "September"
    }, {
        code: "10",
        shortName: "Oct",
        length: 31,
        name: "October"
    }, {
        code: "11",
        shortName: "Nov",
        length: 30,
        name: "November"
    }, {
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
    }, {
        code: "02",
        shortName: "Mon",
        name: "Monday"
    }, {
        code: "03",
        shortName: "Tue",
        name: "Tuesday"
    }, {
        code: "04",
        shortName: "Wed",
        name: "Wednesday"
    }, {
        code: "05",
        shortName: "Thu",
        name: "Thursday"
    }, {
        code: "06",
        shortName: "Fri",
        name: "Friday"
    }, {
        code: "07",
        shortName: "Sat",
        name: "Saturday"
    }
];
/**
 * Default start date of the week
 */
MagicDate.DEFAULT_WEEK_START = MagicDate.WEEKDAYS[0];
/**
 * Boundaries for configuration
 */
MagicDate.CONFIG_BOUNDARIES = {
    year_boundary: [
        1900, 2100
    ],
    month_boundary: [
        1, 12
    ],
    day_boundary: [
        1, 31
    ],
    hour_boundary: [
        0, 23
    ],
    min_boundary: [
        0, 59
    ],
    sec_boundary: [0, 59]
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
    Y: 'year',
    m: 'month',
    d: 'day',
    H: 'hour',
    i: 'minute',
    s: 'second',
    u: 'microSecond'
};
/**
 * Expection dictionary
 */
MagicDate.EXCEPTIONS = {
    dateRangeOrderException: "You tried to get an array of dates between 2 dates, but the start date selected " +
            "seems to be ahead of the end date",
    valueException: "Argument parsed failed to process"
};

module.exports = MagicDate;