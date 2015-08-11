'use strict';

var fs = require('fs');
var printf = require('util').format;
var fn = require('./functions');
var EOL = require('os').EOL;
var dates = {};
var currentDate;

if (process.argv.length < 3) {
  console.log('Usage: "node main <path>"');
  process.exit(1);
}

var filename = process.argv[2];

try {
  fs.readFileSync(filename).toString().split(/(\r?\n)/).forEach(processLine);
} catch (e) {
  console.log('File not found.');
  process.exit(1);
}
var allTasks = [];

for (var date in dates) {
  if (dates.hasOwnProperty(date)) {

    var tasks = dates[date];
    var groupedTasks = fn.getGroupedTasks(tasks);

    printTasks(date, groupedTasks);

    allTasks = allTasks.concat(groupedTasks);
  }
}

console.log('');

printTotalHours(allTasks);


function processLine(line) {
  var text = line.toString().replace(/[\r\n]/g, '');

  var type = fn.getTextType(text);

  switch (type) {
    case 'date':
      dates[text] = dates[text] || [];
      currentDate = text;
      break;
    case 'task':
      var task = fn.createTask(text);
      dates[currentDate].push(task);
      break;
  }
}

function printTasks(date, tasks) {
  var hours = fn.getHoursForTasks(tasks, fn.roundHours);

  console.log('\n%s (%d / %d)\n',
    date, hours.projectHours, hours.totalHours);

  for (var i in tasks) {
    var task = tasks[i];
    printTask(task);
  }
}

function printTask(task) {
  process.stdout.write(printf('  %s (%d)', task.project, fn.roundHours(task.time)));

  if (task.comments.size) {
    var first = true;
    task.comments.forEach(function (task) {
      if (first) {
        first = false;
        process.stdout.write(': ');
      } else {
        process.stdout.write(', ');
      }
      process.stdout.write(task);
    });
  }

  process.stdout.write(EOL);
}

function printTotalHours(tasks) {
  var hours = fn.getHoursForTasks(tasks, fn.roundHours);

  console.log('Total Hours: %d / %d',
    fn.roundHours(hours.projectHours),
    fn.roundHours(hours.totalHours));
}
