    'use strict';

    /**
     * @ngdoc function
     * @name waScrumApp.controller:GroupCtrl
     * @description
     * # GroupCtrl
     * Controller of the waScrumApp
     */
    angular.module('waScrumApp').controller('IssuesCtrl', Issues);

    Issues.$inject = ['$scope', '$rootScope', 'IssuesService', 'ProjectService', 'TeamService', 'toaster'];

    function Issues($scope, $rootScope, $controller, IssuesService, ProjectService, TeamService, toaster, $upload, $http) {

        $scope.defeultIssue = {
            name: '',
            type: 'Story',
            originalEstimate: '',
            priority: 'Major',
            description: '',
            assignee: null,
            project: null,
            epic: null
        }
		$scope.addIssueModalShow = false;
        $scope.editIssueModalShow = false;
        $scope.epics = [];
        $scope.filterValue = 'Filter by:';
        $scope.issue = {
            assignee: null,
            description: '',
            epic: null,
            originalEstimate: '',
            name: '',
            priority: 'Major',
            project: null,
            type: 'Story',
            sprint: null
        };
        $scope.issues = [];
        $scope.issueToEdit = null;
        $scope.projects = [];
        $scope.project = null;
        $scope.selectedIssue = null;
        $scope.filesToUpload = [];
        $scope.sprints = null;

        /**
         * Description
         * Create a new issue event
         */
        $scope.addOnClick = function(issue) {

            IssuesService.createIssue(issue)
                .then(function(res) {
                    if (res.status) {
                        $scope.addIssueModalShow = !$scope.addIssueModalShow;
						$scope.upload($scope.filesToUpload, res.result.newIssueID);
                        toaster.pop('success', "Issue Created", res.result.message);
                        $scope.issues = res.result.projectIssues;
                        $scope.selectedIssue = $scope.issues[$scope.issues.length - 1];
                        $scope.project = $scope.issue.project;
                        $scope.epics = res.result.projectEpics;
                        $scope.issue = {
                            assignee: null,
                            description: '',
                            epic: null,
                            originalEstimate: '',
                            name: '',
                            priority: 'Major',
                            project: null,
                            type: 'Story',
                            sprint: null
                        };
                    } else {
                        toaster.pop('error', "Unsaved issue error", res.result.message);
                    }
                });
        }

        /**
         * @Description
         * Assign issue
         **/
        $scope.assignIssue = function(issue) {

            IssuesService.assignIssue(issue)
                .then(function(res) {
                    if (res.status) {
                        $scope.editIssueModalShow = !$scope.editIssueModalShow;                        
                        toaster.pop('success', "Issue assigned", res.result.message);
                        $scope.project = issue.project;
                        $scope.selectedIssue = issue;
                        $scope.issues = res.result.projectIssues;
                    } else {

                        toaster.pop('error', "Connot assigned the issue", res.result.message);
                    }
                });
        }

        /**
         * @Description
         * Assign issue to current user
         **/
        $scope.assignIssueToMe = function() {
            $scope.issue.assignee = $rootScope.currentUser.data;
        }

        /**
         * @Description
         * Assign issue to current user
         **/
        $scope.assignIssueToCurrUser = function() {
            $scope.issueToEdit.assignee = $rootScope.currentUser.data;
        }

        /**
         * Description
         * Edit issue event
         */
        $scope.editOnClick = function(issue) {

            IssuesService.editIssue(issue)
                .then(function(res) {
                    if (res.status) {
                        $scope.editIssueModalShow = !$scope.editIssueModalShow;
                        toaster.pop('success', "Issue Updated", res.result.message);
                        $scope.selectedIssue = issue;
                        $scope.issueToEdit = null;
                        $scope.issues = res.result.projectIssues;
                        $scope.epics = res.result.projectEpics;
                    } else {

                        toaster.pop('error', "Unsaved update issue error", res.result.message);
                    }
                });
        }

        /**
         * @Description
         * Filter issue by type value (Story,bug,Feature..)
         * Result collection of filtred issues
         **/
        $scope.filterBy = function() {
            IssuesService.filterBy($scope.project, $scope.filterValue)
                .then(function(res) {
                    $scope.issues = res.result.filtredIssues;
                });
        }

        /**
         * @Descrption
         * filter issues by epics
         **/
        $scope.filterIssuesByEpic = function(selectedEpic) {
            //Get issues filtred by epic from model to link view 
            $scope.issues = selectedEpic.issues;
            $scope.selectedIssue = $scope.issues[0];
        }

        /**
         * @Descrption
         * Get Project Issues
         **/
        $scope.getAllIssues = function() {
            $scope.issues = $scope.project.projectIssues;
        }

        /*
         * Get projects Function
         **/
        $scope.getIssues = function() {
            //Get all issues from model to link view
            IssuesService.getProjectIssues($scope.project)
                .then(function(res) {
                    if (res.status) {           
                        $scope.epics = res.result.epics;
                        $scope.issues = res.result.issues;
                        $scope.selectedIssue = $scope.issues[0];
                    }else{
                        $scope.projects = res.result.projects; 
                    }
                });
            // Get team members
            TeamService.getTeamMembers($scope.project).then(function(res) {
                $scope.teamMembers = res.result.members;
            });
        }

        /**
         * @Descrption
         * Gets projects issues without epics
         **/
        $scope.getIssueswithoutEpics = function() {

            IssuesService.getIssuesWithoutEpic($scope.project)
                .then(function(res) {
                    if (res.status) {
                        $scope.issues = res.result.issues;
                        $scope.selectedIssue = $scope.issues[0];
                    } else {
                        toaster.pop('error', "Invalid project value", res.result.message);
                    }
                });
        }

        /**
         * @Description
         * Get team members on projects combobox change event
         * Result collection of users
         **/
        $scope.getProjectIssues = function() {
            // Select the issue project from projects list
            $scope.issues = $scope.project.projectIssues;
            $scope.selectedIssue = $scope.issues[0];
            $scope.sprints = $scope.project.sprints;
        }

        /**
         * @Description
         * Get team members on projects combobox change event
         * Result collection of users
         **/
        $scope.getTeamMembers = function() {
            // Select the issue project from projects list
            $scope.epics = $scope.issue.project.projectEpics;
            $scope.project = $scope.issue.project;
            $scope.sprints = $scope.project.sprints;
            TeamService.getTeamMembers($scope.issue.project)
                .then(function(res) {
                    $scope.teamMembers = res.result.members;
                });
        }

        /**
         * @Description
         * Affect the selected project to project issue
         */
        $scope.openAddModal = function() {
            $scope.issue.project = $scope.project;
            $scope.addIssueModalShow = !$scope.addIssueModalShow;
        }

        /**
         * @Description
         * Open Edit Issue Modal Function
         **/
        $scope.openEditModal = function() {
            //Select the issue/item to edit
            $scope.editIssueModalShow = !$scope.editIssueModalShow;
            $scope.issueToEdit = $scope.selectedIssue;
            if ($scope.epics.length == 0) {
                $scope.epics = $scope.selectedIssue.project.projectEpics;
            }

            // Get team members
            TeamService.getTeamMembers($scope.selectedIssue.project)
                .then(function(res) {
                    $scope.teamMembers = res.result.members;
                });
        }

        /**
         * @Description
         * Get selected issue details
         */

        $scope.selectIssue = function(i) {
            $scope.selectedIssue = i;
        }

        /**
         * @description
         * Remove File Item from Selected Files
         * @param {object} files pass a object File
         * 
         */
        $scope.removeFileItem = function(fileIndex, theEvent) {

            var currentElement = theEvent.currentTarget;
            var parrentElement = $(currentElement).parent();
            parrentElement.fadeOut(1000);
            $scope.filesToUpload.value.splice(fileIndex, 1);

        };

        /**
         * @description
         * Upload Files to Server
         * @param {object} files pass a object File
         * 
         */
        $scope.upload = function(files, issueId) {
            
            if (files.value && files.value.length > 0) {
                for (var i = 0; i < files.value.length; i++) {
                    var file = files.value[i];
                    $upload.upload({
                        url: '/uploadFile',
                        method: 'POST',
                        data: {
                            'currentIssue': issueId
                        },
                        file: file
                    }).progress(function(evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    }).success(function(data, status, headers, config) {
                        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    });
                }
            }
        };

        $scope.filesSelected = function(files, theEvent) {

            console.log("Changed");

        }
        /**
         * @description
         * Upload Files to Server
         * @param {object} files pass a object File
         * 
         */
        $scope.downloadAttachment = function(attachment) {
		
          var res = $http.post('/attachment',attachment);
          res.success(function(data, status, headers, config) {
          	
				       	
				console.log(status);
				
				
			});
          res.error(function(data, status, headers, config) {
              console.log("failure message: " + JSON.stringify({
                  data: data
              }));
          });

      };
    }
