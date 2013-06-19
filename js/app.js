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
		//$scope.new_day_open[dayId] = true;
		//console.log(dayId, widgetName);

		day.dayWidget.push({widgetId: guid(), widgetName: widgetName});


		//current_day = day for day in $scope.schedule.days when day.dayId == dayId

	};

	$scope.addDay = function(){
		Schedule.addDay();

	};
});

app.directive("widget", function(){
	return {
		restrict: 'E',
		scope: true,
		template: '<form ng-show="new_day_open" ng-submit="testFn()">' +
		'<input type="text" ng-model="widgetName" ng-required/>' +
		'<br/>' +
		'<button class="btn" type="submit">Save</button>' +
		'<button class="btn" ng-click="new_day_open = false">Cancel</button>' +
		'</form>' +
		'<button ng-hide="new_day_open" class="btn-block new-widget-btn" ng-click="new_day_open = true">+</button>',
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


//helper function
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}