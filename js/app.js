var app = angular.module('scheduler', []);

app.controller("DaysController", function ($scope, Schedule){

});

app.controller("WidgetsController", function ($scope, Schedule){

});

app.controller("ScheduleController", function ($scope, Schedule){
	$scope.schedule = Schedule.schedule;
	$scope.title = "Scheduler";
	$scope.new_day_open = {};

	$scope.ctrlrFn = function(day, widgetName){

		day.dayWidget.push({widgetId: guid(), widgetName: widgetName});

	};

	$scope.addDay = function(){
		Schedule.addDay();

	};

	$scope.moveWidget = function(dayId, widgetId){
		//remove the old widget
		var widget;
		for (var i=0; i < $scope.schedule.days.length; i++){
			//remove the widget from the day, but keep the object
			//var day = $scope.schedule.days[i];
			for (var j=0; j < $scope.schedule.days[i].dayWidget.length; j++){
				var target = $scope.schedule.days[i].dayWidget[j].widgetId;
				if (target === widgetId){
					widget = target;
					console.log($scope.schedule.days[i].dayWidget, j)
					$scope.schedule.days[i].dayWidget.remove(j);
					console.log($scope.schedule.days[i].dayWidget, j)
				}
			} 
		}

		var day = _.find($scope.schedule.days, function(day){
			return day.dayId === dayId;
		});
		console.log(day);
		day.dayWidget.push(widget);
		$scope.$apply();
	}


	
});

app.directive('draggablewidget', function(){
	return {
		scope: true,
		restrict: 'A',
		controller: function($scope, $element, $attrs, $location){
			$element.attr('draggable', true);
			$element.on('dragstart', function(e) {
				console.log('dragstart:' + $attrs.draggablewidget);
				e.originalEvent.dataTransfer.effectAllowed = 'move';
				e.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({
					widgetId: $attrs.draggablewidget
				}));
			});

		}
	};
});

app.directive('recieveswidget', function(){
	return {
		restrict: 'A',
		scope: true,
		controller: function($scope, $element, $attrs, $location) {
			
			$element.on('dragover', function(e){
				e.preventDefault();
			});
			$element.on('drop', function(e){
				var dayId = parseInt($attrs.recieveswidget,10);
				var data = JSON.parse(e.originalEvent.dataTransfer.getData('text/plain'));
				console.log(data, dayId);
				e.preventDefault();
				$scope.moveWidget(dayId, data.widgetId);
			});
		}
	}
})


app.directive("widget", function(){
	return {
		restrict: 'E',
		scope: true,
		templateUrl: 'templates/widget.html',
		controller: function($scope, $element, $attrs, $location) {
			$scope.new_day_open = false;

			$scope.testFn = function() {
				$scope.new_day_open = false;
				console.log($scope);
				$scope.ctrlrFn($scope.day,$scope.widgetName);
				$scope.widgetName = "";
			};

		}
	};
});

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

	var addDay = function() {
		var max_day = _.max(schedule.days, function(day){
			return day.dayId;
		});
		schedule.days.push({
			dayId: max_day.dayId + 1,
			dayWidget: []
		});
	};


	return {
		'schedule': schedule,
		'addDay': addDay
	};
});


//helper functions
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