var app = angular.module('scheduler', []);

app.controller("DaysController", function ($scope, Schedule){

});

app.controller("WidgetsController", function ($scope, Schedule){

});

app.controller("ScheduleController", function ($scope, Schedule){
	$scope.schedule = Schedule.schedule;
})

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
	return {'schedule': schedule};
});