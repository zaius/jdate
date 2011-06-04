test("All formatting outputs", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57, 123);

  equals('Thu', jdate.strftime(d, '%a'), "a: Abbreviated weekday name");
  equals('Thursday', jdate.strftime(d, '%A'), "A: Full weekday name");
  equals('Apr', jdate.strftime(d, '%b'), "b: Abbreviated month name");
  equals('April', jdate.strftime(d, '%B'), "B: Full month name");
  equals('20', jdate.strftime(d, '%C'), "C: Century");
  equals('21', jdate.strftime(d, '%d'), "d: Day of the month, zero padded");
  equals('21', jdate.strftime(d, '%e'), "e: Day of the month, blank padded");

  var first = new Date(2011, 0, 1);
  equals('01', jdate.strftime(first, '%d'), "d: Day of the month: Expect leading zero");
  equals(' 1', jdate.strftime(first, '%e'), "e: Day of the month: Expect leading space");

  equals('Apr', jdate.strftime(d, '%h'), "h: Abbreviated month name");
  equals('01', jdate.strftime(d, '%H'), "H: Hour in 24-hour, zero padded");
  equals('01', jdate.strftime(d, '%I'), "I: Hour in 12-hour, zero padded");
  equals(' 1', jdate.strftime(d, '%k'), "k: Hour in 24-hour, blank padded");
  equals(' 1', jdate.strftime(d, '%l'), "l: Two digit hour in 12-hour, blank padded");

  var evening = new Date(2011, 3, 1, 21, 2, 3, 1);
  equals('21', jdate.strftime(evening, '%H'), "H: Hour in PM in 24-hour");
  equals('09', jdate.strftime(evening, '%I'), "I: Hour in PM in 12-hour");
  equals('21', jdate.strftime(evening, '%k'), "k: Hour in PM in 24-hour");
  equals(' 9', jdate.strftime(evening, '%l'), "l: Hour in PM in 12-hour");

  var noon = new Date(2011, 3, 1, 12, 0, 0);
  equals('12', jdate.strftime(noon, '%I'), "I: Noon in 12-hour");
  equals('12', jdate.strftime(noon, '%l'), "l: Noon in 12-hour");

  var midnight = new Date(2011, 3, 1, 0, 0, 0);
  equals('12', jdate.strftime(midnight, '%I'), "I: Midnight in 12-hour");
  equals('12', jdate.strftime(midnight, '%l'), "l: Midnight in 12-hour");

  equals('111', jdate.strftime(d, '%j'), "j: Day of the year");
  equals('001', jdate.strftime(first, '%j'), "j: Expect leading zeros");
  var leap = new Date(2012, 3, 21);
  equals('112', jdate.strftime(leap, '%j'), "j: Handle leap years");

  equals('123', jdate.strftime(d, '%L'), "L: Millisecond of the second");
  equals('001', jdate.strftime(evening, '%L'), "L: Millisecond, zero padded");
  equals('04', jdate.strftime(d, '%m'), "m: Month of the year, zero padded");
  equals('42', jdate.strftime(d, '%M'), "M: Minute of the hour, zero padded");

  equals('AM', jdate.strftime(d, '%p'), "P: Upper case am/pm");
  equals('am', jdate.strftime(d, '%P'), "p: Lower case am/pm");
  equals('st', jdate.strftime(d, '%q'), "q: Date suffix");

  equals('1303375377', jdate.strftime(d, '%s'), "s: Seconds since epoch");
  equals('57', jdate.strftime(d, '%S'), "S: Second of the minute");
  equals('4', jdate.strftime(d, '%u'), "u: Day of the week, 1-7, Monday is 1");
  equals('16', jdate.strftime(d, '%U'), "U: Week number, with Sunday as first day");
  equals('4', jdate.strftime(d, '%w'), "w: Day of the week, 0-6, Sunday is 0");

  var sunday = new Date(2011, 3, 3);
  equals('7', jdate.strftime(sunday, '%u'), "u: ISO numeric day of the week: Sunday is 7");
  equals('0', jdate.strftime(sunday, '%w'), "w: Numeric day of the week: Sunday is 0");

  // TODO: test the boundary between monday and sunday, i.e. %U and %W
  equals('16', jdate.strftime(d, '%W'), "W: Week number, with Monday as first day");
  equals('11', jdate.strftime(d, '%y'), "y: Two digit year");
  equals('2011', jdate.strftime(d, '%Y'), "Y: Four digit year");

  // TODO: how can I make this work everywhere?
  equals('-0700', jdate.strftime(d, '%z'), "z: Time zone as UTC offset");
  equals('%', jdate.strftime(d, '%%'), "%: Literal %");
});

test("Tricky format strings", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57);
  equals('%%', jdate.strftime(d, '%%%%'), "Multiple literal %");
  equals('%21', jdate.strftime(d, '%%%d'), "Adjacent % signs");
  equals('21%%', jdate.strftime(d, '%d%%%'), "Uneven percentages");
  equals('% %$', jdate.strftime(d, '% %$'), "Unknown codes");
});


test("Combined date formatting", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57, 123);
  // ISO8601LongPattern
  equals(jdate.strftime(d, "%Y-%m-%dT%H:%M:%S%z"), "2011-04-21T01:42:57-0700");
  // ISO8601ShortPattern
  equals(jdate.strftime(d, "%Y-%m-%d"), "2011-04-21");
  // Full date and time
  // TODO: Blank padding means two spaces. What about people who don't want
  // that extra space?
  equals(jdate.strftime(d, "%A, %B %d, %Y %l:%M:%S %p"), "Thursday, April 21, 2011  1:42:57 AM");
});

test("Standard date parsing", function() {
  // TODO: work out a better way to compare than valueOf
  // or work out a way to print the full dates to the test output
  var d = new Date(2011, 3, 21, 1, 42, 57);
  var parsed;

  parsed = jdate.strptime("1:42:57am 21st April 2011", "%I:%M:%S%P %d%q %B %C%y")
  equals(parsed.valueOf(), d.valueOf(), "Parsing long formats");

  var arvo = new Date(2011, 3, 21, 13, 42, 57, 123);
  parsed = jdate.strptime("21st Apr 11 1:42:57.123 pm", "%d%q %b %y %I:%M:%S.%L %P")
  equals(parsed.valueOf(), arvo.valueOf(), "Parsing short formats");

  parsed = jdate.strptime("111, 2011, 1:42:57", "%j, %Y, %H:%M:%S");
  equals(parsed.valueOf(), d.valueOf(), "Parsing day number");

  var leap = new Date(2012, 3, 21, 1, 42, 57);
  parsed = jdate.strptime("112, 2012, 1:42:57", "%j, %Y, %H:%M:%S");
  equals(parsed.valueOf(), leap.valueOf(), "Parsing day number in leap year");

  var early = new Date(1922, 3, 21);
  parsed = jdate.strptime("21st Apr 1922", "%d%q %b %Y")
  equals(parsed.valueOf(), early.valueOf(), "Pre-epoch parsing");

  parsed = jdate.strptime("fake", "%i")
  equals(parsed, null, "Don't crash on invalid parse code");
});

test("Parse bugs", function() {
  var d = new Date(2000, 0, 1);
  var parsed = jdate.strptime("2000-01-01", "%Y-%m-%d");
  equals(parsed.valueOf(), d.valueOf(), "Check zero year / month aren't skipped");
});

// TODO: make this not assume -0700
test("Timezones", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57);
  var format = "%Y-%m-%dT%H:%M:%S%z"
  var parsed;

  parsed = jdate.strptime("2011-04-21T08:42:57+0000", format)
  equals(d.valueOf(), parsed.valueOf(), "Zero GMT offset");

  parsed = jdate.strptime("2011-04-21T14:42:57+0600", format)
  equals(d.valueOf(), parsed.valueOf(), "Positive GMT offset");

  parsed = jdate.strptime("2011-04-20T20:42:57-1200", format)
  equals(d.valueOf(), parsed.valueOf(), "Negative GMT offset");

  parsed = jdate.strptime("2011-04-21T03:42:57-05:00", format)
  equals(d.valueOf(), parsed.valueOf(), "Alternate timezone format");

  parsed = jdate.strptime("2011-04-21T08:42:57Z", format)
  equals(d.valueOf(), parsed.valueOf(), "Z for timezone");
});

test("2 digit year parsing", function() {
  var d, parsed;

  d = new Date(1988, 3, 21, 1, 42, 57);
  parsed = jdate.strptime("1:42:57am 21st April 88", "%I:%M:%S%P %d%q %B %y")
  equals(parsed.valueOf(), d.valueOf(), "2 digit year in the past");

  d = new Date(2008, 3, 21, 1, 42, 57);
  parsed = jdate.strptime("1:42:57am 21st April 08", "%I:%M:%S%P %d%q %B %y")
  equals(parsed.valueOf(), d.valueOf(), "2 digit year with leading zero");

  d = new Date(2028, 3, 21, 1, 42, 57);
  parsed = jdate.strptime("1:42:57am 21st April 28", "%I:%M:%S%P %d%q %B %y")
  equals(parsed.valueOf(), d.valueOf(), "2 digit year in the future");

  d = new Date(2000, 0, 1, 1, 42, 57);
  parsed = jdate.strptime("1:42:57am 1st January 00", "%I:%M:%S%P %d%q %B %y")
  equals(parsed.valueOf(), d.valueOf(), "2 digit year for 2000");
});

test("Extension to base classes", function() {
  jdate.extend_date();

  var s = "2011-04-21T01:42:57"
  var format = "%Y-%m-%dT%H:%M:%S"
  var d = new Date(2011, 3, 21, 1, 42, 57);

  equals("function", typeof Date.strptime, "Date.strptime exists");

  var parsed = Date.strptime(s, format);
  equals(d.valueOf(), parsed.valueOf(), "Parsing from Date class");

  equals("function", typeof d.strftime, "Date#format exists");

  equals(s, d.strftime(format), "Formatting from a Date instance");
});
