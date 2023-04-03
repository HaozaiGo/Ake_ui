/**
 * 时间日期相关操作
 */

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime) {
  return formatWithSeperator(datetime, "/", ":");
}

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成类似 2018/09/23 11:54:16
 * 可以指定日期和时间分隔符
 * @param datetime 国际化日期格式
 */
export function formatWithSeperator(datetime, dateSeprator, timeSeprator) {
  if (datetime != null) {
    const dateMat = new Date(datetime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    const timeFormat =
      year +
      dateSeprator +
      month +
      dateSeprator +
      day +
      " " +
      hh +
      timeSeprator +
      mm +
      timeSeprator +
      ss;
    return timeFormat;
  }
}

export function getNowDate() {
  const dateMat = new Date();
  const year = dateMat.getFullYear();
  let month =
    dateMat.getMonth() + 1 < 10
      ? "0" + (dateMat.getMonth() + 1)
      : dateMat.getMonth() + 1;
  let day =
    dateMat.getDate() < 10 ? "0" + dateMat.getDate() : dateMat.getDate();
  return `${year}/${month}/${day}`;
}

// 获取当前时间 00:00:00
export function getNowDateStartDt() {
  const dateMat = new Date();
  const year = dateMat.getFullYear();
  let month =
    dateMat.getMonth() + 1 < 10
      ? "0" + (dateMat.getMonth() + 1)
      : dateMat.getMonth() + 1;
  let day =
    dateMat.getDate() < 10 ? "0" + dateMat.getDate() : dateMat.getDate();
  const hh =
    dateMat.getHours() < 10 ? "0" + dateMat.getHours() : dateMat.getHours();
  const mm =
    dateMat.getMinutes() < 10
      ? "0" + dateMat.getMinutes()
      : dateMat.getMinutes();
  const ss =
    dateMat.getSeconds() < 10
      ? "0" + dateMat.getSeconds()
      : dateMat.getSeconds();
  return `${year}-${month}-${day} 00:00:00`;
}
// 获取时分秒
export function getTMS() {
  const dateMat = new Date();
  const year = dateMat.getFullYear();
  let month =
    dateMat.getMonth() + 1 < 10
      ? "0" + (dateMat.getMonth() + 1)
      : dateMat.getMonth() + 1;
  let day =
    dateMat.getDate() < 10 ? "0" + dateMat.getDate() : dateMat.getDate();
  const hh =
    dateMat.getHours() < 10 ? "0" + dateMat.getHours() : dateMat.getHours();
  const mm =
    dateMat.getMinutes() < 10
      ? "0" + dateMat.getMinutes()
      : dateMat.getMinutes();
  const ss =
    dateMat.getSeconds() < 10
      ? "0" + dateMat.getSeconds()
      : dateMat.getSeconds();
  return `${hh}:${mm}`;
}
// 获取当前时间
export function getNowDateAll() {
  const dateMat = new Date();
  const year = dateMat.getFullYear();
  let month =
    dateMat.getMonth() + 1 < 10
      ? "0" + (dateMat.getMonth() + 1)
      : dateMat.getMonth() + 1;
  let day =
    dateMat.getDate() < 10 ? "0" + dateMat.getDate() : dateMat.getDate();
  const hh =
    dateMat.getHours() < 10 ? "0" + dateMat.getHours() : dateMat.getHours();
  const mm =
    dateMat.getMinutes() < 10
      ? "0" + dateMat.getMinutes()
      : dateMat.getMinutes();
  const ss =
    dateMat.getSeconds() < 10
      ? "0" + dateMat.getSeconds()
      : dateMat.getSeconds();
  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}

// 获取当前时间 23:59:59
export function getNowDateEndDt() {
  const dateMat = new Date();
  const year = dateMat.getFullYear();
  let month =
    dateMat.getMonth() + 1 < 10
      ? "0" + (dateMat.getMonth() + 1)
      : dateMat.getMonth() + 1;
  let day =
    dateMat.getDate() < 10 ? "0" + dateMat.getDate() : dateMat.getDate();
  const hh =
    dateMat.getHours() < 10 ? "0" + dateMat.getHours() : dateMat.getHours();
  const mm =
    dateMat.getMinutes() < 10
      ? "0" + dateMat.getMinutes()
      : dateMat.getMinutes();
  const ss =
    dateMat.getSeconds() < 10
      ? "0" + dateMat.getSeconds()
      : dateMat.getSeconds();
  return `${year}-${month}-${day} 23:59:59`;
}

// 获取本周第一天
export function showWeekFirstDay() {
  var Nowdate = new Date();
  var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
  let M = Number(WeekFirstDay.getMonth()) + 1;
  if (M < 10) M = "0" + M;
  let D = WeekFirstDay.getDate();
  if (D < 10) D = "0" + D;
  return Nowdate.getFullYear() + "-" + M + "-" + D;
}

// 获取本周最后一天
export function showWeekLastDay() {
  var Nowdate = new Date();
  var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
  var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
  let M = Number(WeekLastDay.getMonth()) + 1;
  if (M < 10) M = "0" + M;
  let D = WeekLastDay.getDate();
  if (D < 10) D = "0" + D;
  return Nowdate.getFullYear() + "-" + M + "-" + D;
}

// 获取本月第一天
export function showMonthFirstDay() {
  var Nowdate = new Date();
  var MonthFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth(), 1);
  let M = Number(MonthFirstDay.getMonth()) + 1;
  if (M < 10) M = "0" + M;
  let D = MonthFirstDay.getDate();
  if (D < 10) D = "0" + D;
  return Nowdate.getFullYear() + "-" + M + "-" + D;
}

// 获取本月最后一天
export function showMonthLastDay() {
  var Nowdate = new Date();
  var MonthNextFirstDay = new Date(
    Nowdate.getYear(),
    Nowdate.getMonth() + 1,
    1
  );
  var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
  let M = Number(MonthLastDay.getMonth()) + 1;
  if (M < 10) M = "0" + M;
  let D = MonthLastDay.getDate();
  if (D < 10) D = "0" + D;
  return Nowdate.getFullYear() + "-" + M + "-" + D;
}
