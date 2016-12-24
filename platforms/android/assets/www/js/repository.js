(function (angular) {
    'use strict';
    var inject = ['$q', '$filter', '$localStorage'];

    function RepositoryFactory($q, $filter, $localStorage) {
        var store = $localStorage.$default({
            lists: [{items: [], selected: true}]
        }),
        currentList;

        function _init() {
            //keep old versions. Maybe it works
            if (store.todos) {
                store.lists = [{
                    items: store.todos,
                    selected: true
                }];
                delete store.todos;
            }
        }

        function _setSelected(listToSelect) {
            currentList = listToSelect || store.lists[0];
            currentList.selected = true;
            return currentList;
        }

        function getSelectedList() {
            var selected = $filter('filter')(store.lists, {selected: true})[0];
            return _setSelected(selected);
        }

        function addItem(item) {
            item.done = false;
            currentList.items.push(item);
        }

        function updateItemByIndex(index, item) {
            currentList.items.splice(index, 1, {
				text: item.text,
				qtd: item.qtd,
				done: item.done
			});
        }

        function removeItemByIndex(index) {
            currentList.items.splice(index, 1);
        }

        function _deselectAll(list) {
            var i,
                items = list.items;
            for (i = 0; i < items.length; i++) {
                delete items[i].done;
            }
        }

        function archiveList() {
            var newList;

            _deselectAll(currentList);

            if (currentList.archived) {
                return $q.when(_setSelected());
            }

            if (store.lists.length >= 10) {
                return $q.reject('Somente 10 listas são permitidas. Por favor, exclua uma lista não utilizada antes de arquivar a atual');
            }

            currentList.archived = new Date();
            currentList.selected = false;

            newList = _setSelected({items: []})
            store.lists.unshift(newList);

            return $q.when(newList);
        }

        function selectList(list) {
            currentList.selected = false;
            return _setSelected(list)
        }

        function removeArchived(listToRemove) {
            var index = store.lists.indexOf(listToRemove),
                toSelect;

            if (currentList === listToRemove) {
                toSelect = _setSelected(); //get the first list
            } else {
                toSelect = currentList;
            }

            store.lists.splice(index, 1);
            return $q.when(toSelect);
        }

        function getLists() {
            return store.lists;
        }

        _init();
        return {
            getLists: getLists,
            getSelectedList: getSelectedList,
            addItem: addItem,
            updateItemByIndex: updateItemByIndex,
            removeItemByIndex: removeItemByIndex,
            archiveList: archiveList,
            removeArchived: removeArchived,
            selectList: selectList
        };
    }
    RepositoryFactory.$inject = inject;
    angular.module('app').factory('repository', RepositoryFactory);
}(angular));