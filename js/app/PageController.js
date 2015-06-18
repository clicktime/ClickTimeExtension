
// Main controller for the extension. By this point, user must be logged in. 
myApp.controller("PageController", ['$scope', 'APIService', '$http',
    function ($scope, APIService, $http) {
    $scope.UserName = null;
    $scope.UserID = null;

    // API base url
    var baseURL = "";


    // Function for making async API calls.
    // Entity must be plural 
    $scope.api = function (entity, email, token, method) {
        if (baseURL == "") {
            alert("Need to get user session before making API calls");
            return;
        }

        var url = baseURL + "/" + entity;

        return APIService.apiCall(url, email, token, method)
            .then(function (response) {
                if (response.data == null) {
                    alert("We're sorry, there was an error fetching the " + entity + " list");
                }

                return response;
            })
    }

    // Logout function
    $scope.logout = function() {
        chrome.storage.sync.remove('session', function () {
            chrome.storage.sync.remove('clientsList', function () {
                console.log("removed clients list.");
            })
            chrome.storage.sync.remove('jobsList', function () {
                console.log("removed jobs list.");
            })
            chrome.storage.sync.remove('tasksList', function() {
                console.log("removed tasks list.");
            })
            alert("Logged out.");
            window.location.href = "../../templates/login.html";
        })
    }
    
    // Get the session of the user from storage.
    chrome.storage.sync.get('session', function (items) {
        if ('session' in items) {
            var session = items.session.data;
            if (session != null) {
                // Everything's good to go here



                // Session values
                $scope.UserName = session.UserName;
                $scope.UserID = session.UserID;
                $scope.CompanyID = session.CompanyID;
                $scope.UserEmail = session.UserEmail;
                $scope.Token = session.Token;



                baseURL = API_BASE + "Companies/" + $scope.CompanyID + "/Users/" + $scope.UserID;

                // Refresh function
                // This forces an API call for the jobs, clients, and tasks dropdown menus
                $scope.refresh = function() {
                    console.log("Fetching most recent data from Clicktime");
                    $scope.api('Clients', $scope.UserEmail, $scope.Token, 'GET')
                    .then(function (response) {
                        $scope.clients = response.data;
                        $scope.client = response.data[0];
                        return response;
                    })
                    .then (function (response) {
                        chrome.storage.sync.set({
                            'clientsList' : response,
                        }, function () {
                            console.log("Set clients list to local storage");
                        })
                    })

                    $scope.api('Jobs', $scope.UserEmail, $scope.Token, 'GET')
                    .then( function (response) {
                        $scope.jobs = response.data;
                        $scope.job = response.data[0];
                        return response;
                    })
                    .then (function (response) {
                        chrome.storage.sync.set({
                            'jobsList' : response,
                        }, function () {
                            console.log("Set jobs list to local storage");
                        })
                    })

                    $scope.api('Tasks', $scope.UserEmail, $scope.Token, 'GET')
                    .then( function (response) {
                        $scope.tasks = response.data;
                        $scope.task = response.data[0];
                        return response;
                    })
                    .then (function (response) {
                        chrome.storage.sync.set({
                            'tasksList' : response,
                        }, function () {
                            console.log("Set tasks list to local storage");
                        })
                    })
                }


                //////////////// Initialization calls ///////////////////////////////////

                // Fetch the clients
                // First check local storage. 
                chrome.storage.sync.get('clientsList', function (items) {
                    if ('clientsList' in items) {
                        // Clients were stored locally, great!
                        var clientsList = items.clientsList.data;
                        if (clientsList != null) {
                            console.log("Fetched clients list from local storage");
                            $scope.clients = clientsList;
                            $scope.client = clientsList[0];
                            $scope.$apply();
                            return;
                        } 
                    } else {
                        // Clients don't exist in local storage. Need to call API
                        $scope.api('Clients', $scope.UserEmail, $scope.Token, 'GET')
                        .then( function (response) {
                            $scope.clients = response.data;
                            $scope.client = response.data[0];
                            return response;
                        })
                        .then (function (response) {
                            chrome.storage.sync.set({
                                'clientsList' : response,
                            }, function () {
                                console.log("Set clients list to local storage");
                            })
                        })
                    }
                })

                // Fetch the jobs
                // First check local storage. 
                chrome.storage.sync.get('jobsList', function (items) {
                    if ('jobsList' in items) {
                        // Jobs were stored locally, great!
                        var jobsList = items.jobsList.data;
                        if (jobsList != null) {
                            console.log("Fetched jobs list from local storage");
                            $scope.jobs = jobsList;
                            $scope.job = jobsList[0];
                            $scope.$apply();
                            return;
                        } 
                    } else {
                        // Jobs don't exist in local storage. Need to call API
                        $scope.api('Jobs', $scope.UserEmail, $scope.Token, 'GET')
                        .then( function (response) {
                            $scope.jobs = response.data;
                            $scope.job = response.data[0];
                            return response;
                        })
                        .then (function (response) {
                            chrome.storage.sync.set({
                                'jobsList' : response,
                            }, function () {
                                console.log("Set jobs list to local storage");
                            })
                        })
                    }
                })

                // Fetch the tasks
                // First check local storage. 
                chrome.storage.sync.get('tasksList', function (items) {
                    if ('tasksList' in items) {
                        // Tasks were stored locally, great!
                        var tasksList = items.tasksList.data;
                        if (tasksList != null) {
                            console.log("Fetched tasks list from local storage");
                            $scope.tasks = tasksList;
                            $scope.task = tasksList[0];
                            $scope.$apply();
                            return;
                        } 
                    } else {
                        // Tasks don't exist in local storage. Need to call API
                        $scope.api('Tasks', $scope.UserEmail, $scope.Token, 'GET')
                        .then( function (response) {
                            $scope.tasks = response.data;
                            $scope.task = response.data[0];
                            return response;
                        })
                        .then (function (response) {
                            chrome.storage.sync.set({
                                'tasksList' : response,
                            }, function () {
                                console.log("Set tasks list to local storage");
                            })
                        })
                    }
                })
            
                ////////////////////////////////////////////////////////////



                return;
            }
        }
        // Session couldn't be found
        alert('Session could not be found');
        return;
    })

}]);



