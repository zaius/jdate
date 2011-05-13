# jdate - javascript date / time formatting and parsing #

## Intro ##
Date parsing and formatting is a bit of a pain in javascript. I find myself
regularly splitting and parsing strings by hand. The easiest way to deal with
this is to use a language's strftime / strptime functions, which conveniently
don't exist in current browser javascript implementations. There are a bunch of
libraries to deal with this problem (see below), however most of them modify
the Date base class. In order to write plugin or widget code that is compatible
as possible, it's not a good idea to modify base classes.


## Other date implementations ##
There are a plethora of people solving this same problem. If you don't have the
same restrictions as me, I definitely recommend checking out some of these
first. They're probably much better written.

* Date.js: http://code.google.com/p/datejs/source/browse/trunk/src/parser.js
Pros: Makes readable code. Natural language date parsing
Cons: Modifies base classes. Hard to separate out language processing from format parsing.

* Baron: https://github.com/flavorjones/flexible-js-formatting
Pros: Fast.
Cons: Uses exec. Modifies base classes.

* Matt Kruse: http://www.xaprb.com/articles/date-formatting-benchmarks/date.js
Pros: Doesn't modify Date.
Cons: Non standard / few parsing codes. Slow. Hard to read code.

* ExtJS: https://github.com/probonogeek/extjs/raw/master/src/util/Date.js

* Anytime: http://www.ama3.com/anytime/AnyTime/anytime.js

* Svend: http://www.svendtofte.com/javascript/javascript-date-string-formatting/
Cons: Only for printing, not for parsing


## Usage ##

    var s = "2011-04-21T01:42:57+1200"
    var format = "%Y-%m-%dT%H:%M:%S%z"
    var parsed = date.strptime(s, format);

    console.log(date.strftime(parsed, format));


## Base classes ##
So, you're running this locally, and you don't care about clobbering base
classes? Lucky you! Here's how you can extend the base Date class for a nicer
syntax:

    <script src="jdate.js"></script>
    <script>
      jdate.extend_date();

      // Parsing is now a class method on Date
      Date.strptime("2011-04-21T01:42:57+1200", "%Y-%m-%dT%H:%M:%S%z");

      // Formatting is now an instance method on Date
      var out = new Date().strftime("%Y-%m-%dT%H:%M:%S%z");
      console.log("Current time in ISO8601 format", out);
    </script>


## Formats ##
I've tried to make my parsing and formatting methods as compatible as possible
with ruby's strftime and strptime. Docs available here:
http://www.ruby-doc.org/core/classes/Time.html

Because of javascript's lacklustre support for timezones, and my desire to keep
this library small, not all formatters and parsers are supported. Explanation
for unimplemented formats are below.

    ✓ - Implemented
    x - Not implemented
    ? - work in progress

    Formatter, Parser, Shortcut - Description (Example)
    ✓, ✓  %a - The abbreviated weekday name (Sun)
    ✓, ✓  %A - The  full  weekday  name (Sunday)
    ✓, ✓  %b - The abbreviated month name (Jan)
    ✓, ✓  %B - The  full  month  name (January)
    ✓, x  %c - The preferred local date and time representation
    ✓, ✓  %C - Century (20 in 2009)
    ✓, ✓  %d - Day of the month (01..31)
    ✓, x  %D - Date (%m/%d/%y)
    ✓, ✓  %e - Day of the month, blank-padded ( 1..31)
    ✓, x  %F - Equivalent to %Y-%m-%d (the ISO 8601 date format)
    ✓, ✓  %h - Equivalent to %b
    ✓, ✓  %H - Hour of the day, 24-hour clock (00..23)
    ✓, ✓  %I - Hour of the day, 12-hour clock (01..12)
    ✓, ✓  %j - Day of the year (001..366)
    ✓, ✓  %k - hour, 24-hour clock, blank-padded ( 0..23)
    ✓, ✓  %l - hour, 12-hour clock, blank-padded ( 0..12)
    ✓, ✓  %L - Millisecond of the second (000..999)
    ✓, ✓  %m - Month of the year (01..12)
    ✓, ✓  %M - Minute of the hour (00..59)
    x, x  %n - Newline (\n)
    x, x  %N - Fractional seconds digits, default is 9 digits (nanosecond)
    ✓, ✓  %p - Meridian indicator (AM / PM)
    ✓, ✓  %P - Meridian indicator (am / pm)
    ✓, ✓  %q - (NONSTANDARD) Suffix for day of the month (st for 1, nd for 2, etc.)
    ✓, ?  %r - time, 12-hour (same as %I:%M:%S %p)
    ✓, ?  %R - time, 24-hour (%H:%M)
    ✓, x  %s - Number of seconds since 1970-01-01 00:00:00 UTC.
    ✓, ✓  %S - Second of the minute (00..60)
    x, x  %t - Tab character (\t)
    ✓, x  %T - time, 24-hour (%H:%M:%S)
    ✓, ?  %u - Day of the week as a decimal, Monday being 1. (1..7)
    ✓, ?  %U - Week  number of the current year, starting with the first Sunday as the first day of the first week (00..53)
    ✓, x  %v - VMS date (%e-%b-%Y)
    x, x  %V - Week number of year according to ISO 8601 (01..53)
    ✓, ?  %w - Day of the week (Sunday is 0, 0..6)
    ✓, ?  %W - Week number  of the current year, starting with the first Monday as the first day of the first week (00..53)
    ✓, x  %x - Preferred representation for the date alone, no time
    ✓, x  %X - Preferred representation for the time alone, no date
    ✓, ✓  %y - Year without a century (00..99)
    ✓, ✓  %Y - Year with century
    ✓, ✓  %z - Time zone as  hour offset from UTC (e.g. +0900)
    x, x  %Z - Time zone name
    ✓, ✓  %% - Literal % character


### Omissions ###
%n, %t - You can just use the \n and \t literals.

%N - Javascript's Date doesn't have resolution below millisecond, so this is
 pointless. Supporting it just for milliseconds would add extra complexity to
 the format parsing regex.

%c, %x, %X - printing of preferred representations are handled through the
  operating system, and there is no inbuilt methods to parse. It may be
  possible to print a known format and determine the parsing for it, but that
  is a bit out of the scope of a v1.

%v - ISO8601 weeks are a bit of a pain to calculate, and I'm lazy. I'd accept a
  patch if anyone actually uses them.

%Z - Javascript timezone suck. Only the UTC offset is available. Because of
  daylight saving, even the offset isn't consistent throughout the year. If you
  need timezone names, you'll have to link in with the Olson timezone database.
  There are a bunch of implementations around:
  https://bitbucket.org/pellepim/jstimezonedetect/wiki/Home
  https://github.com/mde/timezone-js

## Caveats ##
* It currently requires jQuery. That shouldn't be too hard to deal with though.
* It doesn't deal with localization.
* It doesn't deal with timezones very well. But neither does javascript.
