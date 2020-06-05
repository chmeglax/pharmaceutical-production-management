function durationCal(s, e) {
  var timeStart = new Date("01/01/2007 " + s);
  var timeEnd = new Date("01/01/2007 " + e);
  var difference = timeEnd - timeStart;

  difference = difference = difference / 60 / 1000;
  if (difference < 0) difference = 24 * 60 + difference;
  return difference;
}
console.log(durationCal("7:30 AM", "8:00 AM"));
