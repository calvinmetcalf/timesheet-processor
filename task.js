'use strict';

/// returns: array of unique comment strings or an
///          empty array if there are no comments
function parseComments(commentsString) {
  return new Set(commentsString.split(',').map(function (s) {
    return s.trim();
  }).filter(function (s) {
    return s;
  }));
}

function getElapsedTime(startTime, endTime) {
  // Example: ('12:45', '2:15') => 1.5
  var start = getFractionalHour(startTime);
  var end = getFractionalHour(endTime);

  if (end < start) {
    end += 12; // end is PM, start is AM
  }

  return end - start;
}

function getFractionalHour(timeString) {

  // Example: ('8:45') => 8.75
  var timeArray = timeString.split(':');
  var hour = parseInt(timeArray[0], 10);
  var minute = timeArray[1] ? parseInt(timeArray[1], 10) / 60 : 0;

  return hour + minute;
}

// Task model 'class'
exports.Task = function (project, startTime, endTime, comments) {

  this.project = project;
  this.time = getElapsedTime(startTime, endTime);
  this.comments = parseComments(comments);

};

// Shared task functions
exports.Task.prototype.isBillable = function () {
  return this.comments.size > 0 &&
    this.project.lastIndexOf('*') !== this.project.length - 1;
};
