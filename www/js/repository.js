(function (angular) {
    'use strict';
    var inject = ['$filter', '$localStorage'];

    function RepositoryFactory($filter, $localStorage) {
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
            currentList = listToSelect;
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

        function archiveList() {
            var newList;

            if (currentList.archived) {
                return _setSelected(store.lists[0]);
            }

            currentList.archived = new Date();
            currentList.selected = false;

            newList = _setSelected({items: []})

            store.lists.unshift(newList);
            return newList;
        }

        function selectList(list) {
            currentList.selected = false;
            return _setSelected(list)
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
            selectList: selectList
        };
    }
    RepositoryFactory.$inject = inject;
    angular.module('app').factory('repository', RepositoryFactory);
}(angular));