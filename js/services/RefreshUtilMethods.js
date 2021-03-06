// refresh service methods, for use in refresh function in TimeEntryController.js
myApp.service('RefreshUtilMethods', ['TimeEntryService', 'EntityService', function (TimeEntryService, EntityService) {

	var me = this;

    //TODO Yuan: move all setError strings into into the template. ng-show on $scope var
    // move error setting into the save function because it doesn't make sense for it to be 
    // in refresh
	this.afterGetJobClients = function(jobClientsList, $scope) {
        var currentJobClient = {
            'job' : $scope.timeEntry.job,
            'client' : $scope.timeEntry.client,
            'DisplayName' :  $scope.timeEntry.client.DisplayName + " - " 
                            + $scope.timeEntry.job.DisplayName 
        }
        if (!EntityService.hasJobClient(jobClientsList, currentJobClient)) {
            $scope.setError("jobConflict", "We're sorry but the "
                + $scope.company.ClientTermSingular + "/"
                + $scope.company.JobTermSingular + " "
                + currentJobClient.DisplayName + " you've chosen is no longer available. "
                + "Please choose a different "
                + $scope.company.ClientTermSingular + "/"
                + $scope.ccompany.JobTermSingular
                + " or contact your company's ClickTime administrator for more details.");
            $scope.jobClients = jobClientsList;
            $scope.jobClient = jobClientsList[0];
            if ($scope.jobClient) {
                $scope.timeEntry.job = $scope.jobClient.job;
                $scope.timeEntry.JobID = $scope.jobClient.job.JobID;
                $scope.timeEntry.client = $scope.jobClient.client;
            }
            TimeEntryService.updateInProgressEntry("job", $scope.timeEntry.job, function() {
                TimeEntryService.updateInProgressEntry("client", $scope.timeEntry.client);
            })
        } else {
            $scope.jobClients = jobClientsList;
            var index = EntityService.indexJobClient(jobClientsList, currentJobClient);
            $scope.jobClient = jobClientsList[index];
            var currentJob = $scope.jobClient.job;
            var currentTask = $scope.task;
            if (currentTask && $scope.company && $scope.company.TaskRestrictionMethod == "byjob") {
                var permittedTaskIDs = currentJob.PermittedTasks.split(",");
                if (!EntityService.hasTaskID(permittedTaskIDs, currentTask.TaskID)) {
                    $scope.setError("taskConflict", "We're sorry but the "
                        + $scope.company.TaskTermSingular + " "
                        + currentTask.DisplayName + " you've chosen is no longer available. "
                        + "Please choose a different "
                        + $scope.company.TaskTermSingular
                        + " or contact your company's ClickTime administrator for more details.");
                }
            }
        }
        if (jobClientsList.length == 0) {
            $scope.HasEmptyEntities = true;
        }
	}

	this.afterGetTasks = function(tasksList, $scope) {
        var currentTask = $scope.timeEntry.task;
        if (currentTask) {
            if (!EntityService.hasTask(tasksList, currentTask)) {
                $scope.setError("taskConflict", "We're sorry but the "
                            + $scope.company.TaskTermSingular + " "
                            + currentTask.DisplayName + " you've chosen is no longer available. "
                            + "Please choose a different "
                            + $scope.company.TaskTermSingular
                            + " or contact your company's ClickTime administrator for more details.");
                $scope.allTasks = tasksList;
                if ($scope.jobClient && $scope.company && $scope.company.TaskRestrictionMethod == "byjob") {
                    var permittedTaskIDs = $scope.jobClient.job.PermittedTasks.split(",");
                    var permittedTasks = [];
                    for (i in tasksList) {
                        var t = tasksList[i];
                        if (EntityService.hasTaskID(permittedTaskIDs, t.TaskID)) {
                            permittedTasks.push(t);
                        }
                    }
                    $scope.tasks = permittedTasks;
                } else {
                    $scope.tasks = tasksList;    
                }
                if ($scope.tasks.length > 0) {
                    $scope.task = $scope.tasks[0];
                }
                if ($scope.task) {
                    $scope.timeEntry.task = $scope.task;
                    $scope.timeEntry.TaskID = $scope.task.TaskID;
                }
                TimeEntryService.updateInProgressEntry('task', $scope.timeEntry.task);
            } else {
                var currentJob = $scope.timeEntry.job;
                if ($scope.company && $scope.company.TaskRestrictionMethod == "byjob") {
                    var permittedTaskIDs = currentJob.PermittedTasks.split(",");
                    if (!EntityService.hasTaskID(permittedTaskIDs, currentTask.TaskID)) {
                        $scope.setError("taskConflict", "We're sorry but the "
                                + $scope.company.TaskTermSingular + " "
                                + currentTask.DisplayName + " you've chosen is no longer available. "
                                + "Please choose a different "
                                + $scope.company.TaskTermSingular
                                + " or contact your company's ClickTime administrator for more details.");
                        $scope.allTasks = tasksList;
                        if ($scope.jobClient) {
                            var permittedTaskIDs = $scope.jobClient.job.PermittedTasks.split(",");
                            var permittedTasks = [];
                            for (i in tasksList) {
                                var t = tasksList[i];
                                if (EntityService.hasTaskID(permittedTaskIDs, t.TaskID)) {
                                    permittedTasks.push(t);
                                }
                            }
                            $scope.tasks = permittedTasks;
                        } else {
                            $scope.tasks = tasksList;    
                        }
                        if ($scope.tasks.length > 0) {
                            $scope.task = $scope.tasks[0];
                        }
                        if ($scope.task) {
                            $scope.timeEntry.task = $scope.task;
                            $scope.timeEntry.TaskID = $scope.task.TaskID;
                        }
                        TimeEntryService.updateInProgressEntry('task', $scope.timeEntry.task);                    
                    } else {
                        $scope.allTasks = tasksList;
                        if ($scope.jobClient) {
                            var permittedTaskIDs = $scope.jobClient.job.PermittedTasks.split(",");
                            var permittedTasks = [];
                            for (i in tasksList) {
                                var t = tasksList[i];
                                if (EntityService.hasTaskID(permittedTaskIDs, t.TaskID)) {
                                    permittedTasks.push(t);
                                }
                            }
                            $scope.tasks = permittedTasks;
                        } else {
                            $scope.tasks = tasksList;    
                        }
                        var taskIndex = EntityService.indexTask($scope.tasks, currentTask);
                        if (taskIndex != -1) {
                            $scope.task = $scope.tasks[taskIndex];
                        } else {
                            $scope.task = $scope.tasks[0];
                        }
                        if ($scope.task) {
                            $scope.timeEntry.task = $scope.task;
                            $scope.timeEntry.TaskID = $scope.task.TaskID;
                        }
                        TimeEntryService.updateInProgressEntry('task', $scope.timeEntry.task);
                    }
                }
            }
        }
	}

    // $scope.user is the old user. 
    // user in the param is the new user pulled from api
	this.afterGetUser = function(user, $scope) {
        if ($scope.user.RequireStartEndTime != user.RequireStartEndTime) {
            $scope.setError("userConflict", "We're sorry but the "
                + "time entry method" + " "
                + " you've chosen is no longer available. "
                + "Please contact your company's ClickTime administrator for more details.");
            if (user.RequireStartEndTime) {
              changeTimeEntryMethod("start-end");
              chrome.storage.sync.set({
                'timeEntryMethod' : {
                  UserID: user.UserID,
                  method: 'start-end'
                }
              })
            } else {
              changeTimeEntryMethod("duration");
              chrome.storage.sync.set({ 
                'timeEntryMethod' : {
                  UserID: user.UserID,
                  method: 'duration'
                }
              })
            }
        }
	}
}])
