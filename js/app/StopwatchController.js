myApp.controller('StopwatchController', ['$scope', 'StopwatchService', '$interval', function ($scope, StopwatchService, $interval) {
	
	StopwatchService.getElapsedTime(function (elapsedObj) {
		var secDisp = elapsedObj.elapsedSec % 60 + '';
		var minDisp = elapsedObj.elapsedMin % 60 + '';
		var hrsDisp = elapsedObj.elapsedHrs + '';
		if (secDisp.length == 1) {
			secDisp = "0" + secDisp;
		}
		if (minDisp.length == 1) {
			minDisp = "0" + minDisp;
		}
		if (hrsDisp.length == 1) {
			hrsDisp = "0" + hrsDisp;
		}
		$scope.elapsedSec = secDisp;
		$scope.elapsedMin = minDisp;
		$scope.elapsedHrs = hrsDisp;
		$scope.running = elapsedObj.running;
		if (elapsedObj.running) {
			timerPromise = $interval(function() {
				$scope.getElapsedTime();
			})
		}
		$scope.$apply();
	})
	$scope.elapsedSec = "00";
	$scope.elapsedMin = "00";
	$scope.elapsedHrs = "00";

	var totalElapsedMs = 0;
    var elapsedMs = 0;
   
    var startTime;
    var timerPromise;

    $scope.running = false;

    $scope.$on("timeEntryError", function() {
    	$scope.clear();
    })

    $scope.$on("timeEntrySuccess", function() {
    	$scope.clear();
    })

    $scope.clear = function() {
    	$scope.elapsedSec = "00";
    	$scope.elapsedMin = "00";
		$scope.elapsedHrs = "00";
    	$scope.running = false;
    	$scope.$parent.runningStopwatch = false;
    	$interval.cancel(timerPromise);
    	timerPromise = undefined;
    	StopwatchService.clear(function() { console.log("Cleared stopwatch")})
    }

	$scope.start = function () {
		if (!timerPromise) {
			StopwatchService.markStartTime(function (start) {
				startTime = start;
	      		$scope.running = true;
	      		$scope.$parent.runningStopwatch = true;
	      		timerPromise = $interval(function() {
	      			var now = new Date();
	      			$scope.getElapsedTime();
	      		}, 31)
			}) 		
     	}
	}

	$scope.stop = function() {
		if (timerPromise) {
		    StopwatchService.markEndTime (function () {
		      	$scope.running = false;
		      	$scope.$parent.runningStopwatch  = false;
		      	$interval.cancel(timerPromise);
			    timerPromise = undefined;
			  	$scope.$apply();

			  	var response = confirm("Save time entry of " + $scope.elapsedHrs + ":" +
			  	 	$scope.elapsedMin + ":" + $scope.elapsedSec + "?");
			  	if (response) {
			  		$("#save-time-entry").click();
			  	} else {
			  		$scope.elapsedSec = "00";
			  		$scope.elapsedMin = "00";
			  		$scope.elapsedHrs = "00";
			  		StopwatchService.clear(function () { console.log("Canceled stopwatch")});
			  		$scope.$apply();
			  	}
		    })
			      
		}
	}


	$scope.getElapsedTime = function () {
		StopwatchService.getElapsedTime(function (elapsedObj) {
    		secDisp = elapsedObj.elapsedSec % 60 + '';
    		minDisp = elapsedObj.elapsedMin % 60 + '';
    		hrsDisp = elapsedObj.elapsedHrs + '';
    		if (secDisp.length == 1) {
    			secDisp = "0" + secDisp;
    		}
    		if (minDisp.length == 1) {
    			minDisp = "0" + minDisp;
    		}
    		if (hrsDisp.length == 1) {
    			hrsDisp = "0" + hrsDisp;
    		}
    		$scope.elapsedSec = secDisp;
    		$scope.elapsedMin = minDisp;
    		$scope.elapsedHrs = hrsDisp;
    	})
	}
}])