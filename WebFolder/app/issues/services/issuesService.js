    'use strict';

    /**
     * @ngdoc overview
     * @name waScrumApp.service:GroupService
     * @description
     * # waScrumApp
     * # GroupService
     * Service of the waScrumApp
     */
    angular.module('waScrumApp').factory('IssuesService', IssuesService);

    IssuesService.$inject = ['$wakanda', '$q'];

    function IssuesService($wakanda, $q) {

        var issuesService = {};

        /**
         * Description
         * Assign issue
         * Return object result
         **/

        issuesService.assignIssue = function(issue) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var result = ds.Issue.assignIssue(issue);
                    res.resolve(result);
                });

            return res.promise;
        };

        /**
         * Description
         * Create a new issue
         * Return object result
         **/

        issuesService.createIssue = function(issue) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var result = ds.Issue.createIssue(issue);
                    res.resolve(result);
                });

            return res.promise;
        };

        /**
         * Description
         * Edit issue
         * Return object result
         **/

        issuesService.editIssue = function(issue) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var result = ds.Issue.editIssue(issue);
                    res.resolve(result);
                });

            return res.promise;
        };

        /**
         * Description
         * Filter project issue by
         * Return collection of issues
         **/

        issuesService.filterBy = function(project, value) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var issues = ds.Issue.filterIssueBy(project, value);
                    res.resolve(issues);
                });

            return res.promise;
        };

        /**
         * @Description
         * Get project issues not assigned to epics
         * Return Collection of issues
         **/

        issuesService.getIssuesWithoutEpic = function(project) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var issues = ds.Issue.getIssueWithoutEpic(project);
                    res.resolve(issues);
                });

            return res.promise;
        };

        /**
         * @Description
         * Get Project issues Function
         * Return Collection of issues
         **/

        issuesService.getProjectIssues = function(project) {

            var promise = $wakanda.init();
            var res = $q.defer();

            promise
                .then(function(ds) {
                    var issues = ds.Issue.getIssues(project);
                    res.resolve(issues);
                });

            return res.promise;
        };

        return issuesService;
    }