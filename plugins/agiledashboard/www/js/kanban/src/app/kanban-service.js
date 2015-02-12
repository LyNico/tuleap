(function () {
    angular
        .module('kanban')
        .service('KanbanService', KanbanService);

    KanbanService.$inject = ['Restangular', '$q'];

    function KanbanService(Restangular, $q) {
        var rest = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setFullResponse(true);
            RestangularConfigurer.setBaseUrl('/api/v1');
        });

        return {
            getKanban:  getKanban,
            getBacklog: getBacklog,
            getArchive: getArchive,
            getItems:   getItems
        };

        function getKanban(id) {
            var data = $q.defer();

            rest
                .one('kanban', id)
                .get()
                .then(function (response) {
                    data.resolve(response.data);
                });

            return data.promise;
        }

        function getBacklog(id, limit, offset) {
            var data = $q.defer();

            rest
                .one('kanban', id)
                .one('backlog')
                .get({
                    limit: limit,
                    offset: offset
                })
                .then(function (response) {
                    var result = {
                        results: response.data.collection,
                        total: response.headers('X-PAGINATION-SIZE')
                    };

                    data.resolve(result);
                });

            return data.promise;
        }

        function getArchive(id, limit, offset) {
            var data = $q.defer();

            rest
                .one('kanban', id)
                .one('archive')
                .get({
                    limit: limit,
                    offset: offset
                })
                .then(function (response) {
                    var result = {
                        results: response.data.collection,
                        total: response.headers('X-PAGINATION-SIZE')
                    };

                    data.resolve(result);
                });

            return data.promise;
        }

        function getItems(id, column_id, limit, offset) {
            var data = $q.defer();

            rest
                .one('kanban', id)
                .one('items')
                .get({
                    column_id: column_id,
                    limit: limit,
                    offset: offset
                })
                .then(function (response) {
                    var result = {
                        results: response.data.collection,
                        total: response.headers('X-PAGINATION-SIZE')
                    };

                    data.resolve(result);
                });

            return data.promise;
        }
    }
})();