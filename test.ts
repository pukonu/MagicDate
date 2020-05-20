/**
 * @author Peter Ukonu
 * @email [pukonu@gmail.com]
 * @create date 2018-07-06 02:51:23
 * @modify date 2018-07-06 02:53:23
 * @desc A date utility class to handle all sort of manipulation on a date
 */

import MagicDate from "./MagicDate";

/**
 * This DateUtil class is capable of returning multiple permutations to a date
 * and so for date we will have a very large set of test cases.
 * First of let check that the correct date is returned, and then we will use a reference
 * date and run the test across multiple scenarios.
 *
 * Date Reference to be used
 * i.  Sunday - March 18, 2018
 * ii. Wednesday - June 20, 2018
 *
 * 1. DateUtil().now().today() should be today's date
 * 2. Get the first day of a give week -- DateUtil().getWeekFirstDate()
 *      - Case (i) >> Sunday - March 18, 2018
 *      - Case (ii) >> Sunday - June 17, 2018
 * 3. Get the last day of a give week -- DateUtil().getWeekLastDate()
 *      - Case (i) >> Saturday - March 24, 2018
 *      - Case (ii) >> Saturday - June 23, 2018
 * 4. Get 3 days ahead from a reference date -- DateUtil().next("3 days")
 *      - Case (i) >> Saturday - March 24, 2018
 *      - Case (ii) >> Saturday - June 23, 2018
 * 5. Get 3 days ago from reference date -- DateUtil().next("-3 days")
 *      - Case (i) >> Saturday - March 24, 2018
 *      - Case (ii) >> Saturday - June 23, 2018
 * 6. Get next week from reference days -- DateUtil().next("1 week")
 *      - Case (i) >> Sunday - March 25, 2018
 *      - Case (ii) >> Sunday - June 24, 2018
 * 7. Get next month from reference days -- DateUtil().next("1 month")
 *      - Case (i) >> Sunday - April 1, 2018
 *      - Case (ii) >> Sunday - July 1, 2018
 * 8. Get the current week number -- DateUtil().getWeekNum()
 *      For weeks starting from sunday
 *      - Case (i) >> 11 (for week config starting Sunday)
 *      - Case (i) >> 12 (for week config starting Monday)
 *      - Case (ii) >> 25
 * 9. Get the days from a week number -- DateUtil.getDatesFromWeekNum(25)
 *      - Case (i) >> [Sunday - March 18, 2018, ... ,Saturday - March 24, 2018]
 *      - Case (ii) >> [Sunday - June 17, 2018, ... ,Saturday - June 23, 2018]
 * 10. Get a range of days between 2 reference days -- DateUtil.getDateFromTo()
 *      - Case >> (Sunday - March 18, 2018, Wednesday - June 20, 2018) : outputs an array
 *              of dates between the 2 reference dates
 * 11. Get the first date of a given month -- DateUtil.getMonthFirstDate()
 *      - Case (i) >> Thursday - March 1, 2018
 *      - Case (ii) >> Friday - June 1, 2018
 *      - Case (iii) >> March, 2018 : returns Thursday - March 1, 2018
 * 12. Get the last day of a given month -- DateUtil.getMonthLastDate()
 *      - Case (i) >> Saturday - March 31, 2018
 *      - Case (ii) >> Saturday - June 30, 2018
 *      - Case (iii) >> 11, 2017 : returns Thursday - November 30, 2017
 * 13. Check if date one date is greater than the order -- DateUtil.validateDatePosition()
 *      - Case (Sunday - March 18, 2018, Wednesday - June 20, 2018) : returns false
 * 14. Check if year of a reference date or year is a leap year -- DateUtil.isLeapYear()
 *      - Case (Sunday - March 18, 2018, Wednesday - June 20, 2018) : returns true
 *      - Case 2019 : return false
 */

const CASE1 = {
    year: 2018,
    month: 3,
    day: 18
};
const CASE2 = {
    year: 2018,
    month: 6,
    day: 20
};

test("The class call should return a dictionary of the time value", () => {
    // you can get the current date by just calling the class below
    // or you can use the data factory makeDate() to make a new date with parameters
    expect(new MagicDate()).toBeDefined();
});

test("the first day of week of a given week from a date object", () => {
    // case1 should assert to Saturday - March 24, 2018
    // case2 should assert to Sunday - June 17, 2018
    expect(
        MagicDate.makeDate(CASE1)
            .getWeekFirstDate()
            .toString()
    ).toMatch("2018-03-18");
    expect(
        MagicDate.makeDate(CASE2)
            .getWeekFirstDate()
            .toString()
    ).toMatch("2018-06-17");
});

test("the last day of week of a given week from a date object", () => {
    // case1 should assert to Saturday - March 24, 2018
    // case2 should assert to Sunday - June 23, 2018
    expect(
        MagicDate.makeDate(CASE1)
            .getWeekLastDate()
            .toString()
    ).toMatch("2018-03-24");
    expect(
        MagicDate.makeDate(CASE2)
            .getWeekLastDate()
            .toString()
    ).toMatch("2018-06-23");
});

test("get 3 days ahead from a reference date", () => {
    // case1 should assert to Saturday - March 21, 2018
    // case2 should assert to Sunday - June 23, 2018
    expect(
        MagicDate.makeDate(CASE1)
            .next("3 days")
            .toString()
    ).toMatch("2018-03-21");
    expect(
        MagicDate.makeDate(CASE2)
            .next("3 days")
            .toString()
    ).toMatch("2018-06-23");
});

test("get 3 prior from a reference date", () => {
    // case1 should assert to Saturday - March 15, 2018
    // case2 should assert to Sunday - June 17, 2018
    expect(
        MagicDate.makeDate(CASE1)
            .next("-3 days")
            .toString()
    ).toMatch("2018-03-15");
    expect(
        MagicDate.makeDate(CASE2)
            .next("-3 days")
            .toString()
    ).toMatch("2018-06-17");
});

test("get 3 weeks ahead from a reference date", () => {
    // case1 should assert to Saturday - April 8, 2018
    // case2 should assert to Sunday - July 11, 2018
    expect(
        MagicDate.makeDate(CASE1)
            .next("3 weeks")
            .toString()
    ).toMatch("2018-04-08");
    expect(
        MagicDate.makeDate(CASE2)
            .next("3 weeks")
            .toString()
    ).toMatch("2018-07-11");
});

test("get 1 month prior from a reference date", () => {
    // we are reversing a month, from a month a longer lenght to a lower one,
    // the untility should detect this and adjust accordingly
    expect(
        MagicDate.makeDate({
            year: 2018,
            month: 3,
            day: 29
        })
            .next("-1 month")
            .toDateString()
    ).toMatch("2018-02-28");
});

test("get 2 years and a month prior from a reference date", () => {
    // this will reverse into a leap year, we should be expecting a Feb 29 date of 2016 .next("-1 month")
    expect(
        MagicDate.makeDate({
            year: 2018,
            month: 3,
            day: 31
        })
            .next("-2 years")
            .next("-1 month")
            .toDateString()
    ).toMatch("2016-02-29");
});

test("get the week number based on a given date", () => {
    // console.log(DateUtil.makeDate().getWeekNum());
    expect(
        MagicDate.makeDate(CASE1) // week starts on Sunday by default
            .getWeekNum()
    ).toEqual(11);

    expect(
        MagicDate.makeDate(CASE1)
            .setWeekStart(1) // set week to start on Monday
            .getWeekNum()
    ).toEqual(12);

    expect(MagicDate.makeDate(CASE2).getWeekNum()).toEqual(25);
});

test("get the first date from a given month", () => {
    const $case1 = MagicDate.makeDate(CASE1);
    const $case2 = MagicDate.makeDate(CASE2);
    const $case3 = {
        month: 3,
        year: 2017
    };

    expect(MagicDate.getMonthFirstDate($case1).weekday.name).toBe("Thursday");
    expect(MagicDate.getMonthFirstDate($case2).weekday.name).toBe("Friday");
    // expect(MagicDate.getMonthFirstDate($case3).weekday.name).toBe("Wednesday");
});

test("get the last date from a given month", () => {
    const $case1 = MagicDate.makeDate(CASE1);
    const $case2 = MagicDate.makeDate(CASE2);
    const $case3 = {
        month: 11,
        year: 2017
    };

    expect(MagicDate.getMonthLastDate($case1).weekday.name).toBe("Saturday");
    expect(MagicDate.getMonthLastDate($case2).weekday.name).toBe("Saturday");
    // expect(MagicDate.getMonthLastDate($case3).weekday.name).toBe("Thursday");
});

test("check if year of a given year or year is a leap year", () => {
    const $refDate1 = MagicDate.makeDate(CASE1);
    const $isLeapYearFromYear = MagicDate.isLeapYear(2016);
    expect($refDate1.leapYear).toBeFalsy();
    expect($isLeapYearFromYear).toBeTruthy();
});

test("check if date is in proper positions, checks if greater", () => {
    const $start = MagicDate.makeDate(CASE1);
    const $end = MagicDate.makeDate(CASE2);
    expect(MagicDate.validateDatePosition($start, $end)).toBeTruthy();
});

test("get all dates between 2 reference dates", () => {
    const $start = MagicDate.makeDate(CASE1);
    const $end = MagicDate.makeDate(CASE2);
    const daysArr = MagicDate.getDateFromTo($start, $end).map(v => v.toDateString());

    expect(daysArr).toContain("2018-03-19");
    expect(daysArr).toContain("2018-06-19");
    // expect(daysArr).toHaveLength(95)
});

test("get dates from a week number", () => {
    const assertToValue = [
        "2017-12-31",
        "2018-01-01",
        "2018-01-02",
        "2018-01-03",
        "2018-01-04",
        "2018-01-05",
        "2018-01-06"
    ];

    const weekArr = MagicDate.getDatesFromWeekNum(1, 2018).map(v =>
        v.setCast("%Y-%m-%d").toString()
    );

    expect(JSON.stringify(weekArr)).toBe(JSON.stringify(assertToValue));
});
