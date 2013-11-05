var app = angular.module('scheduler', []);


app.controller("ScheduleController", function ($scope, Schedule){
	$scope.schedule = Schedule.schedule;
	$scope.title = "Scheduler";


	$scope.addWidget = function(day, widgetName){
		day.dayWidget.push({widgetId: guid(), widgetName: widgetName});
	};

	$scope.addDay = function(){

		//determine the new day id
		var max_day = _.max($scope.schedule.days, function(day){
			return day.dayId;
		});
		$scope.schedule.days.push({
			dayId: max_day.dayId + 1,
			dayWidget: []
		});

	};

	$scope.moveWidget = function(dayId, widgetId){
		var widget;
		for (var i=0; i < $scope.schedule.days.length; i++){
			//remove the widget from the day, but keep the object
			for (var j=0; j < $scope.schedule.days[i].dayWidget.length; j++){
				var target = $scope.schedule.days[i].dayWidget[j];
				if (target.widgetId === widgetId){
					widget = target;
					$scope.schedule.days[i].dayWidget.remove(j);
				}
			}
		}

		//find the day for the id

		var day = _.find($scope.schedule.days, function(day){
			return day.dayId === dayId;
		});

		//add it, notify angular
		day.dayWidget.push(widget);
		$scope.$apply();
	};
});

app.directive('draggablewidget', function(){
	return {
		scope: true,
		restrict: 'A',
		link: function(scope, element, attrs, location){
			element.attr('draggable', true);
			element.on('dragstart', function(e) {
				//data is sent as text, so JSON encode it.
				e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({
					widgetId: attrs.draggablewidget
				}));
			});
		}
	};
});

app.directive('recieveswidget', function(){
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs, location) {
			element.on('dragover', function(e){
				e.preventDefault();
			});
			element.on('drop', function(e){
				//everything is a string, need to parse it
				var dayId = parseInt(attrs.recieveswidget,10);
				var data = JSON.parse(e.originalEvent.dataTransfer.getData('text/plain'));

				e.preventDefault();

				scope.moveWidget(dayId, data.widgetId);
			});
			element.on('dragenter', function(e){
				element.addClass('droptarget');
			});
			element.on('dragleave', function(e){
				element.removeClass('droptarget');
			});
		}
	};
});


app.directive("widget", function(){
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'templates/widget.html',
		link: function(scope, element, attrs, location) {
			scope.show_form = false;

			scope.directiveAddWidget = function() {
				scope.show_form = false;
				//call the controller function
				scope.addWidget(scope.day, scope.widgetName);
				//clear the form
				scope.widgetName = "";
			};

		}
	};
});


//paste in new test data here
app.factory('Schedule', function(){
	var schedule = {
		name: 'My Project',
		days: [
			{
				dayId: 1,
				dayWidget: [
					{widgetId: guid(), widgetName: "Foo"},
					{widgetId: guid(), widgetName: "Bar"},
					{widgetId: guid(), widgetName: "Baz"}
				]
			},
			{
				dayId: 2,
				dayWidget: [
				]
			},
			{
				dayId: 3,
				dayWidget: [
					{widgetId: guid(), widgetName: "Foo"},
					{widgetId: guid(), widgetName: "Bar"}
				]
			}
		]
	};


	return {
		'schedule': schedule
	};
});


//helper functions
//stackoverflow js uuid
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};