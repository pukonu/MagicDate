# MagicDate
![N|Solid](https://img.shields.io/badge/MagicDate-Version--1.0-blue.svg)
##
A Javascript library for Date manipulation

Without much further ado, I will just jump right into how to use this library. Very pretty straight forward. The library consists of static and instance methods. Depending on what you will like to achieve, so let's jump right into it.

### How Tos

##### Instantiate the Object
Simply instantiate this library, and get instant access to all it properties

```typescript
// instantiate the library
const dateObject = new MagicDate()  // return the current date as a MagicDate object

// to instantiate a specific date, just create a SimpleDate object
// the Interface accepts (year, month, day, hour, min, sec)
const dateObject = MagicDate.makeDate({year: 2018, month: 3, day: 18})

// in the configuration for instantiation you could add when your week starts, 
// by default week starts on Sunday being 0, in the following line we are 
// starting the weel on Monday being 1
const dateObject = MagicDate.makeDate({year: 2018, month: 3, day: 18}).setWeekStart(1)
```

##### Deep Dive Examples
Lets dive deeeper into some other examples
```typescript
// >>> let get the date object a week from the current date
const dateObject = new MagicDate().next("1 week")

// >>> we will like to know what date it was a 36 days ago
// notice the negative sign used to get a date prior to the reference date object
const dataObject = new MagicDate().next("-36 days")

// >>> lets get a date 3 days prior to January 25, 2018
const dateObject = MagicDate.makeDate({year: 2018, month: 1, day: 25}).next("-3 days")

// >>> we could also retrieve the week number from any given date
const dateObject = new MagicDate()
const weekNum = dateObject.weeknum
// next we will attempt to get the first date of the reference week
const firstDateFromWeek = dateObject.getWeekFirstDate()
// next we will attempt to get the last date of the reference week
const lastDateFromWeek = dateObject.getWeekLastDate()
// we will now retrieve the first date of a given month
const monthFirstDate = dateObject.getMonthFirstDate()
// we can get the last date of the given month in a formated string template
const lastMonthDateStr = dateObject.getMonthLastDate().setCast("%Y-%m-%d").toString()

// >>> we can do some common checks
// check if the current date is from a leapYear
const isLeapYearCurrent = new MagicDate().isLeapYear()
// check if a year is a leap year statically
const isLeapYearReference = MagicDate.isLeapYear(2016)

// >>> get dates between a start and an end date, returns an 
// Array of MagicDate objects
// TODO: this should return a generator
const $start = MagicDate.makeDate({year: 2018, month: 3, day: 18})
const $end = MagicDate.makeDate({year: 2018, month: 6, day: 20})
const datesBetween = MagicDate.getDateFromTo({$start, $end})
// lets return the array in a date formated string
const datesBetweenFormatted = datesBetween.map(v => v.toDateString())

// >>> lets check if date positions are correct, something like the end date
// should be less than the previous date
const $start = MagicDate.makeDate({year: 2018, month: 6, day: 20})
const $end = MagicDate.makeDate({year: 2018, month: 3, day: 18})
const isDateGreater = MagicDate.validatePosition($start, $end)  // should be false
```

##### Retrieving Properties
We will now retrieve some properties
```typescript
// A weekday interface has name, shortName and code e.g. Tuesday, Tue, 02
// you can access any of the objects like so
const weekdayName = dateObject.weekday.name // e.g. Tuesday
```

### Properties and Methods of the MagicDate Object
`year: number` `month: number` `day: number` `hour: number` `minute: number` `second: number` `microSecond: number` `timezone: any` `weekday: WeekDayInterface` `weekdayNumeric: number` `weeknum: number` `weekStart: WeekDayInterface` `leapYear: boolean` `yearStr: string` `monthStr: string` `dayStr: string` `hourStr: string` `minuteStr: string` `secondStr: string` `microSecondStr: string` `timezoneOffset: number` `dtTime: number` `dtObj: Date`
