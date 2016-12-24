/* global cordova, angular */
angular.module('controllers', ['ionic'])
.controller('TodoListController', function ($filter, $scope, $ionicPopup, $timeout, $localStorage,
	                                        focus, $ionicModal, notifyService, repository) {

    var ctrl = this;
	ctrl.lista = repository.getSelectedList();
	ctrl.listas = repository.getLists();
	ctrl.dateFormat = 'dd/MMM/yyyy HH:mm:ss';

    ctrl.itemTemp = {};
    ctrl.indexEditing = {};

	ctrl.removeItem = repository.removeItemByIndex;

	//init the modal
	$ionicModal.fromTemplateUrl('modalAddItem.tpl', {
		scope: $scope,
		animation: 'slide-in-up',
		focusFirstInput: true
	}).then(function (modal) {
	  	ctrl.modal = modal;
	});

	$ionicModal.fromTemplateUrl('modalArquivados.tpl', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		ctrl.modalArquivados = modal;
	});

	// function to close the modal
	ctrl.closeModal = function () {
		ctrl.modal.hide();
        ctrl.indexEditing = "";
        ctrl.itemTemp     = "";
	};

	// function to open the modal
	ctrl.openModal = function () {
		ctrl.indexEditing = "";
		ctrl.statusItem = "";
		ctrl.modal.show();
		focus('text');
	};

	ctrl.selectList = function (list) {
		ctrl.lista = repository.selectList(list);
		ctrl.closeArquivados();
	}

	ctrl.openArquivados = function () {
		ctrl.modalArquivados.show();
	};

	ctrl.closeArquivados = function () {
		ctrl.modalArquivados.hide();
	};

	ctrl.editItem = function(item, index){
		ctrl.indexEditing = index;
		ctrl.itemTemp     = {text: item.text, qtd: item.qtd, done: item.done};
		ctrl.statusItem = "";
		ctrl.modal.show();
	};

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () {
		ctrl.modal.remove();
		ctrl.modalArquivados.remove();
	});

	ctrl.getListTitle = function (list, selected) {
		if (list.indexOf(selected)) {
			return selected.title || $filter('date')(selected.archived, ctrl.dateFormat);
		}
		return "Lista de Compras Simplificada";
	};

	//function to add items to the existing list
	ctrl.addItem = function (data, idxItemEdited) {
		if (!data) return;
		if (!data.text) return;

		if (angular.isUndefined(idxItemEdited) || idxItemEdited === '') {
			repository.addItem({
				text: data.text,
				qtd: data.qtd
			});
	      	focus('text');
		  	data.text = '';
		  	data.qtd = '';
			notifyService.alert("Salvo com sucesso");

			if (window.cordova) {
				cordova.plugins.Keyboard.show();
			}
		} else {
			repository.updateItemByIndex(idxItemEdited, {
				text: data.text,
				qtd: data.qtd,
				done: data.done
			});
			ctrl.indexEditing = "";
			ctrl.closeModal();
		};
	};

	ctrl.atualizaStatusItem = function(text) {
		if (text) ctrl.statusItem = "";
	};

    ctrl.keyDownItemForm = function(event) {
    	if (event.keyCode == 13)
    		ctrl.addItem(ctrl.itemTemp, ctrl.indexEditing);

    	ctrl.atualizaStatusItem(ctrl.itemTemp.text);
    };

    ctrl.getDescricaoItem = function(data){
    	if (data.qtd) return data.qtd + " - " + data.text;
    	return data.text;
    };

	// A confirm dialog
	ctrl.confirmArchive = function() {
		repository.archiveList().then(function (list) {
			ctrl.lista = list;
			notifyService.alert('Arquivado com sucesso');
		}).catch(function (error) {
			var errPopup = $ionicPopup.show({
				title: 'Aviso',
				template: error,
				buttons: [{ text: '<b>Ok</b>' }]
			});

			$timeout(function() {
				errPopup.close();
			}, 15000);
		});
	};

	ctrl.removeArchived = function (list) {
		repository.removeArchived(list)
			.then(function (selectedList) {
				notifyService.alert("Lista Removida com sucesso");
				ctrl.lista = selectedList;
			});
	};

	ctrl.help = function() {
	    var helpPopup = $ionicPopup.show({
	    	title: 'Ajuda',
	    	template: 'Utilize os botões da parte de baixo da tela para inserir ou arquivar a lista de compra.' +
	    			  '<br><br>Deslize o dedo para a esquerda para exibir as opções do item.' +
					  '<br><br>Muito obrigado pelas avaliações :)' +
	    	          '<br><hr>Desenvolvedor: <a href="https://br.linkedin.com/pub/dhiego-hendrix-atencio/29/ba0/2bb">Dhiego Hendrix</a>' ,
	    	buttons: [{ text: '<b>Ok</b>' }]
	    });

	    $timeout(function() {
	      	helpPopup.close();
	    }, 15000);
	};

	ctrl.renameList = function (list) {
		$scope.data = {newListName: list.title};
		var renamePopup =  $ionicPopup.show({
	    	title: 'Renomear Lista',
	    	template: '<input ng-model="data.newListName"></input>' ,
			scope: $scope,
	    	buttons: [
				{ text: 'Cancel' },
				{
					text: "Salvar",
					type: 'button-positive',
					onTap: function (e) {
						return $scope.data.newListName;
					}
				}
			]

	    }).then(function(res) {
			list.title = res || list.title;
			return false;
	    });
	};

	ctrl.isFirstList = function (list) {
		return !!ctrl.listas.indexOf(list);
	};

	ctrl.rate = function() {
	    var avaliePopup = $ionicPopup.show({
	    	title: 'Avalie',
	    	template: 'Obrigado por avaliar nosso app.<br>São coisas assim que fazem a humanidade melhorar :)' ,
	    	buttons: [{ text: '<b>Ok</b>' }]

	    }).then(function(res) {
			return false;
	    });
	};
});