var jdate = {};

(function(jdate) {
  jdate.monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  jdate.monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];
  jdate.dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  jdate.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  jdate.suffixes = { 1: 'st', 2: 'nd', 3: 'rd', 'default': 'th' };

  jdate.daysInMonth = function(d) {
    var feb = this._date.isLeapYear(d) ? 29 : 28;
    return [31, feb ,31,30,31,30,31,31,30,31,30,31];
  };

  // Apply all the date prototype extensions to allow them to be called on
  // instances of date.
  jdate.extend_date = function() {
    Date.strptime = jdate.strptime;
    Date.prototype.strftime = function(format) {
      return jdate._date.strftime(this, format);
    };
  }


  // prototype extensions
  jdate._date = {
    getTimezone: function(d) {
      return d.toString().replace(
        /^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1"
      ).replace(
        /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3"
      );
    },

    getGMTOffset: function(d) {
      return (d.getTimezoneOffset() > 0 ? "-" : "+") +
        jdate._number.pad(Math.floor(d.getTimezoneOffset() / 60), 2) +
        jdate._number.pad(d.getTimezoneOffset() % 60, 2);
    },

    getDayOfYear: function(d) {
      var num = 0;
      for (var i = 0; i < d.getMonth(); ++i) {
        num += jdate.daysInMonth(d)[i];
      }
      return num + d.getDate();
    },

    // Startday is an integer of which day to start the week measuring from
    // TODO: that comment was retarted. fix it.
    getWeekOfYear: function(d, startDay) {
      // Skip to startDay of this week
      var now = this.getDayOfYear(d) + (startDay - d.getDay());
      // Find the first startDay of the year
      var jan1 = new Date(d.getFullYear(), 0, 1);
      var then = (7 - jan1.getDay() + startDay);
      return jdate._number.pad(Math.floor((now - then) / 7) + 1, 2);
    },

    isLeapYear: function(d) {
      var year = d.getFullYear();
      return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    getFirstDayOfMonth: function(d) {
      var day = (d.getDay() - (d.getDate() - 1)) % 7;
      return (day < 0) ? (day + 7) : day;
    },

    getLastDayOfMonth: function(d) {
      var day = (d.getDay() + (jdate.daysInMonth(d)[d.getMonth()] - d.getDate())) % 7;
      return (day < 0) ? (day + 7) : day;
    },

    getSuffix: function(d) {
      var str = d.getDate().toString();
      var index = parseInt(str.slice(-1));
      return jdate.suffixes[index] || jdate.suffixes['default'];
    },


    applyOffset: function(date, offset_seconds) {
      date.offset = offset_seconds * 1000 ;
      date.setTime(date.valueOf() + date.offset);
      return date;
    },

    century: function(d) {
      return parseInt(d.getFullYear().toString().substring(0, 2));
    }
  };

  jdate._obj = {
    values_of: function(obj) {
      var values = [];
      // map doesn't work with objects
      $.each(obj, function(key, value) { values.push(value); });
      return values;
    }
  };

  jdate._number = {
    pad: function (value, size, ch) {
      if (!ch) ch = '0';
      var result = value.toString();
      var pad = size - result.length;

      while (pad-- > 0) { result = ch + result; }

      return result;
    }
  }

  var format_codes = {
    a: function(d) { return jdate.dayNamesShort[d.getDay()]; },
    A: function(d) { return jdate.dayNames[d.getDay()]; },
    b: function(d) { return jdate.monthNamesShort[d.getMonth()]; },
    B: function(d) { return jdate.monthNames[d.getMonth()]; },
    c: function(d) { return d.toLocaleString(); },
    C: function(d) { return jdate._date.century(d) },
    d: function(d) { return jdate._number.pad(d.getDate(), 2); },
    D: function(d) { return jdate.strftime(d, "%m/%d/%y"); },
    e: function(d) { return jdate._number.pad(d.getDate(), 2, ' '); },
    F: function(d) { return jdate.strftime(d, "%Y-%m-%d"); },
    H: function(d) { return jdate._number.pad(d.getHours(), 2); },
    I: function(d) { return jdate._number.pad(d.getHours() % 12 || 12, 2); },
    j: function(d) { return jdate._number.pad(jdate._date.getDayOfYear(d), 3); },
    k: function(d) { return jdate._number.pad(d.getHours(), 2, ' '); },
    l: function(d) { return jdate._number.pad(d.getHours() % 12 || 12, 2, ' '); },
    L: function(d) { return jdate._number.pad(d.getMilliseconds(), 3); },
    m: function(d) { return jdate._number.pad(d.getMonth() + 1, 2); },
    M: function(d) { return jdate._number.pad(d.getMinutes(), 2); },
    p: function(d) { return (d.getHours() < 12 ? 'AM' : 'PM'); },
    P: function(d) { return (d.getHours() < 12 ? 'am' : 'pm'); },
    q: function(d) { return jdate._date.getSuffix(d); },
    r: function(d) { return jdate.strftime(d, "%I:%M:%S %p"); },
    R: function(d) { return jdate.strftime(d, "%H:%M"); },
    s: function(d) { return Math.round(d.valueOf() / 1000); },
    S: function(d) { return jdate._number.pad(d.getSeconds(), 2); },
    T: function(d) { return jdate.strftime(d, "%H:%M:%S"); },
    u: function(d) { return d.getDay() || 7; },
    U: function(d) { return jdate._date.getWeekOfYear(d, 0); },
    v: function(d) { return jdate.strftime(d, "%e-%b-%Y"); },
    w: function(d) { return d.getDay(); },
    W: function(d) { return jdate._date.getWeekOfYear(d, 1); },
    x: function(d) { return d.toLocaleDateString(); },
    X: function(d) { return d.toLocaleTimeString(); },
    y: function(d) { return d.getFullYear().toString().substring(2, 4); },
    Y: function(d) { return d.getFullYear(); },
    // TODO: guessing the pad function won't work with negative numbers?
    // TODO: getTimezoneOffset returns a positive number for GMT-7. Verify my
    // assumption that it will return negative for GMT+x
    z: function(d) { 
      var tz = d.getTimezoneOffset() / 60 * 100; 
      return (tz > 0 ? '-' : '+') + jdate._number.pad(tz, 4);
    },
    "%": function() { return '%'; }
  };
  format_codes.h = format_codes.b;
  format_codes.N = format_codes.L;


  // TODO: handle invalid parse codes better
  var parse_codes = {
    a: { regex: "(?:" + jdate.dayNamesShort.join("|") + ")" },
    A: { regex: "(?:" + jdate.dayNames.join("|") + ")" },
    b: {
      regex: "(" + jdate.monthNamesShort.join("|") + ")",
      parser: function(data) { this.month = $.inArray(data, jdate.monthNamesShort); }
    },
    B: {
      regex: "(" + jdate.monthNames.join("|") + ")",
      parser: function(data) { this.month = jdate.monthNames.indexOf(data); }
    },
    C: { regex: "(\\d{1,2})", parser: function(d) { this.century = parseInt(d)} },
    d: { regex: "(\\d{1,2})", parser: function(d) { this.day = parseInt(d); } },
    H: { regex: "(\\d{1,2})", parser: function(d) { this.hour = parseInt(d); } },
    // This gives only the day. Parsing of the month happens at the end because
    // we also need the year
    j: { regex: "(\\d{1,3})", parser: function(d) { this.day = parseInt(d); } },
    L: { regex: "(\\d{3})", parser: function(d) { this.milliseconds = parseInt(d); } },
    m: { regex: "(\\d{1,2})", parser: function(d) { this.month = parseInt(d) - 1; } },
    M: { regex: "(\\d{2})", parser: function (d) { this.minute = parseInt(d); } },
    M: { regex: "(\\d{2})", parser: function (d) { this.minute = parseInt(d); } },
    p: {
      regex: "(AM|PM)",
      parser: function(d) {
        if (d == 'AM') {
          if (this.hour == 12) { this.hour = 0; }
        } else {
          if (this.hour < 12) { this.hour += 12; }
        }
      }
    },
    P: {
      regex: "(am|pm)",
      parser: function(d) {
        if (d == 'am') {
          if (this.hour == 12) { this.hour = 0; }
        } else {
          if (this.hour < 12) { this.hour += 12; }
        }
      }
    },
    q: { regex: "(?:" + jdate._obj.values_of(jdate.suffixes).join('|') + ")" },
    S: { regex: "(\\d{2})", parser: function(d) { this.second = parseInt(d); } },
    y: { regex: "(\\d{1,2})", parser: function(d) { this.year = parseInt(d); } },
    Y: { regex: "(\\d{4})", parser: function(d) { 
      this.century = Math.floor(parseInt(d) / 100);
      this.year = parseInt(d) % 100;
    }},
    z: { // "Z", "+05:00", "+0500" all acceptable.
      regex: "(Z|[+-]\\d{2}:?\\d{2})",
      parser: function(d) { 
        // UTC, no offset.
        if (d == "Z") { 
          this.zone = 0;
          return; 
        }

        var seconds = parseInt(d[0] + d[1] + d[2]) * 3600 ; // e.g., "+05" or "-08"
        if (d[3] == ":") {
          // "+HH:MM" is preferred iso8601 format
          seconds += parseInt(d[4] + d[5]) * 60;
        } else {
          // "+HHMM" is frequently used, though.
          seconds += parseInt(d[3] + d[4]) * 60;
        }
        this.zone = seconds;
      }
    }
  };
  parse_codes.e = parse_codes.d;
  parse_codes.h = parse_codes.b;
  parse_codes.I = parse_codes.H;
  parse_codes.k = parse_codes.H;
  parse_codes.l = parse_codes.H;


  jdate._date.strftime = function(d, format) {
    var pairs = format.split(/(%.)/);
    for (var i = 1; i < pairs.length; i += 2) {
      var ch = pairs[i].charAt(1);
      var func = format_codes[ch];
      if (func) pairs[i] = func.call(this, d);
    }
    return pairs.join('');
  };
  jdate.strftime = jdate._date.strftime;

  jdate.strptime = function(input, format) {
    var pairs = format.split(/(%.)/);
    var parsers = [];

    // Build the regex
    for (var i = 1; i < pairs.length; i += 2) {
      var ch = pairs[i].charAt(1);
      var obj = parse_codes[ch];
      if (obj.parser) { parsers = parsers.concat(obj.parser); }
      pairs[i] = obj.regex;
    }

    // Run the regex against the input
    var regex = new RegExp("^" + pairs.join('') + "$");
    var match = input.match(regex) || [];

    // Check that the input matched the format
    if (match.length != parsers.length + 1) { return null; }

    var date_obj = {};
    // Parse out the matches using each match's parsing function
    $.each(parsers, function(index, parser) {
      // Offset by one because first value of a regex is the full match
      parser.call(date_obj, match[index + 1]);
    });


    var now = new Date();

    if (date_obj.year) {
      if (date_obj.century) {
        date_obj.year += date_obj.century * 100;
      } else {
        // Assume the year is within 50 of now
        date_obj.year += this._date.century(now) * 100;
        var fifty_years = new Date(now.getFullYear() + 50, now.getMonth(), now.getDate());
        if (date_obj.year > fifty_years) date_obj.year -= 100;
      }
    }

    // Convert day-of-year into day and month
    // Have to do it here instead of in the parser, because we need the year to
    // work out whether we're in a leap year.
    if (date_obj.year && date_obj.day && !date_obj.month) {
      var d = new Date(date_obj.year, 0, 1);
      var months = jdate.daysInMonth(d);

      for (var i = 0; i < months.length; i++) {
        if (date_obj.day <= months[i]) {
          date_obj.month = i;
          break;
        }
        date_obj.day -= months[i];
      }
    }

    var parsed = new Date(
      date_obj.year || now.getFullYear(), date_obj.month || now.getMonth(),
      date_obj.day || now.getDate(), date_obj.hour || 0, date_obj.minute || 0,
      date_obj.second || 0, date_obj.milliseconds || 0
    );

    return parsed;
    // return this._date.applyOffset(parsed, date_obj.zone || 0);
  };
})(jdate);
