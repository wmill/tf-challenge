var app = angular.module('scheduler', []);

app.controller("DaysController", function ($scope, Schedule){

});

app.controller("WidgetsController", function ($scope, Schedule){

});

app.controller("ScheduleController", function ($scope, Schedule){
	$scope.schedule = Schedule.schedule;
	$scope.title = "Scheduler";
	$scope.new_day_open = {};

	$scope.addWidget = function(dayId){
		$scope.new_day_open[dayId] = true;

		//current_day = day for day in $scope.schedule.days when day.dayId == dayId
		var current_day, day, _i, _len, _ref;

		_ref = $scope.schedule.days;
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			day = _ref[_i];
			if (day.dayId === dayId) {
				current_day = day;
			}
		}
		console.log(current_day);
	};

	$scope.addDay = function(){
		Schedule.addDay();

	}
});

app.directive("new-widget", function(){
	return {
		restrict: 'E',
		scope: {
			submit: "&",
			day: '&'
		},
		template: '<form ng-show="new_day_open" ng-submit="addWidget(day.dayId,widgetName)">' +
			'<input type="text" ng-model="widgetName" ng-required/>' +
            '<br/>' +
            '<button class="btn" type="submit">Save</button>' +
            '</form>'
	};
});

app.factory('Schedule', function(){
	var schedule = {
		name: 'My Project',
		days: [
			{
				dayId: 1,
				dayWidget: [
					{widgetId: 1, widgetName: "Foo"},
					{widgetId: 2, widgetName: "Bar"},
					{widgetId: 3, widgetName: "Baz"}
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
					{widgetId: 1, widgetName: "Foo"},
					{widgetId: 2, widgetName: "Bar"}
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