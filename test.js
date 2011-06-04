test("All formatting outputs", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57, 123);

  equals(jdate.strftime(d, '%a'), 'Thu', "a: Abbreviated weekday name");
  equals(jdate.strftime(d, '%A'), 'Thursday', "A: Full weekday name");
  equals(jdate.strftime(d, '%b'), 'Apr', "b: Abbreviated month name");
  equals(jdate.strftime(d, '%B'), 'April', "B: Full month name");
  equals(jdate.strftime(d, '%C'), '20', "C: Century");
  equals(jdate.strftime(d, '%d'), '21', "d: Day of the month, zero padded");
  equals(jdate.strftime(d, '%e'), '21', "e: Day of the month, blank padded");

  var first = new Date(2011, 0, 1);
  equals(jdate.strftime(first, '%d'), '01', "d: Day of the month: Expect leading zero");
  equals(jdate.strftime(first, '%e'), ' 1', "e: Day of the month: Expect leading space");

  equals(jdate.strftime(d, '%h'), 'Apr', "h: Abbreviated month name");
  equals(jdate.strftime(d, '%H'), '01', "H: Hour in 24-hour, zero padded");
  equals(jdate.strftime(d, '%I'), '01', "I: Hour in 12-hour, zero padded");
  equals(jdate.strftime(d, '%k'), ' 1', "k: Hour in 24-hour, blank padded");
  equals(jdate.strftime(d, '%l'), ' 1', "l: Two digit hour in 12-hour, blank padded");

  var evening = new Date(2011, 3, 1, 21, 2, 3, 1);
  equals(jdate.strftime(evening, '%H'), '21', "H: Hour in PM in 24-hour");
  equals(jdate.strftime(evening, '%I'), '09', "I: Hour in PM in 12-hour");
  equals(jdate.strftime(evening, '%k'), '21', "k: Hour in PM in 24-hour");
  equals(jdate.strftime(evening, '%l'), ' 9', "l: Hour in PM in 12-hour");

  var noon = new Date(2011, 3, 1, 12, 0, 0);
  equals(jdate.strftime(noon, '%I'), '12', "I: Noon in 12-hour");
  equals(jdate.strftime(noon, '%l'), '12', "l: Noon in 12-hour");

  var midnight = new Date(2011, 3, 1, 0, 0, 0);
  equals(jdate.strftime(midnight, '%I'), '12', "I: Midnight in 12-hour");
  equals(jdate.strftime(midnight, '%l'), '12', "l: Midnight in 12-hour");

  equals(jdate.strftime(d, '%j'), '111', "j: Day of the year");
  equals(jdate.strftime(first, '%j'), '001', "j: Expect leading zeros");
  var leap = new Date(2012, 3, 21);
  equals(jdate.strftime(leap, '%j'), '112', "j: Handle leap years");

  equals(jdate.strftime(d, '%L'), '123', "L: Millisecond of the second");
  equals(jdate.strftime(evening, '%L'), '001', "L: Millisecond, zero padded");
  equals(jdate.strftime(d, '%m'), '04', "m: Month of the year, zero padded");
  equals(jdate.strftime(d, '%M'), '42', "M: Minute of the hour, zero padded");

  equals(jdate.strftime(d, '%p'), 'AM', "P: Upper case am/pm");
  equals(jdate.strftime(d, '%P'), 'am', "p: Lower case am/pm");
  equals(jdate.strftime(d, '%q'), 'st', "q: Date suffix");

  equals(jdate.strftime(d, '%s'), '1303375377', "s: Seconds since epoch");
  equals(jdate.strftime(d, '%S'), '57', "S: Second of the minute");
  equals(jdate.strftime(d, '%u'), '4', "u: Day of the week, 1-7, Monday is 1");
  equals(jdate.strftime(d, '%U'), '16', "U: Week number, with Sunday as first day");
  equals(jdate.strftime(d, '%w'), '4', "w: Day of the week, 0-6, Sunday is 0");

  var sunday = new Date(2011, 3, 3);
  equals(jdate.strftime(sunday, '%u'), '7', "u: ISO numeric day of the week: Sunday is 7");
  equals(jdate.strftime(sunday, '%w'), '0', "w: Numeric day of the week: Sunday is 0");

  // TODO: test the boundary between monday and sunday, i.e. %U and %W
  equals(jdate.strftime(d, '%W'), '16', "W: Week number, with Monday as first day");
  equals(jdate.strftime(d, '%y'), '11', "y: Two digit year");
  equals(jdate.strftime(d, '%Y'), '2011', "Y: Four digit year");

  // TODO: how can I make this work everywhere?
  equals(jdate.strftime(d, '%z'), '-0700', "z: Time zone as UTC offset");
  equals(jdate.strftime(d, '%%'), '%', "%: Literal %");
});

test("Tricky format strings", function() {
  var d = new Date(2011, 3, 21, 1, 42, 57);
  equals(jdate.strftime(d, '%%%%'), '%%', "Multiple literal %");
  equals(jdate.strftime(d, '%%%d'), '%21', "Adjacent % signs");
  equals(jdate.strftime(d, '%d%%%'), '21%%', "Uneven percentages");
  equals(jdate.strftime(d, '% %$'), '% %$', "Unknown codes");
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
  equals(parsed.valueOf(), d.valueOf(), "Zero GMT offset");

  parsed = jdate.strptime("2011-04-21T14:42:57+0600", format)
  equals(parsed.valueOf(), d.valueOf(), "Positive GMT offset");

  parsed = jdate.strptime("2011-04-20T20:42:57-1200", format)
  equals(parsed.valueOf(), d.valueOf(), "Negative GMT offset");

  parsed = jdate.strptime("2011-04-21T03:42:57-05:00", format)
  equals(parsed.valueOf(), d.valueOf(), "Alternate timezone format");

  parsed = jdate.strptime("2011-04-21T08:42:57Z", format)
  equals(parsed.valueOf(), d.valueOf(), "Z for timezone");
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

  equals(typeof Date.strptime, "function", "Date.strptime exists");

  var parsed = Date.strptime(s, format);
  equals(parsed.valueOf(), d.valueOf(), "Parsing from Date class");

  equals(typeof d.strftime, "function", "Date#format exists");

  equals(d.strftime(format), s, "Formatting from a Date instance");
});
