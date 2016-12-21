/* global cordova */
/* global angular */
angular.module('controllers', ['ionic'])
.controller('TodoListController', function ($scope, $ionicPopup, $timeout, $localStorage,
	                                        focus, $ionicModal, notifyService, repository) {

    var ctrl = this;
    //ctrl.$storage = $localStorage.$default({ todos: [] });
	ctrl.lista = repository.getSelectedList();
	ctrl.listas = repository.getLists();

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

    ctrl.archive = function() {
		
		/*
      var oldTodos = ctrl.$storage.todos;
      ctrl.$storage.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) ctrl.$storage.todos.push(todo);
      });*/
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
		ctrl.lista = repository.archiveList();
		/*
	    var confirmPopup = $ionicPopup.confirm({
	    	title: 'Arquivar',
	    	template: 'Tem certeza que deseja arquivar os itens marcados?',
	    	buttons: [
	    		{ text: "Cancelar" },
	    		{ text: '<b>Sim</b>',
	    		  type: 'button-positive',
	    		  onTap: function(e) {return "ok";}
	    		}
	    	]
	    });
	    confirmPopup.then(function(res) {
	    	if(res) {
	     		ctrl.archive();
				notifyService.alert('Os produtos marcados foram removidos.')
	     	} else {
	       		console.log('You are not sure');
	     	}
	    });
	    $timeout(function() {
	      	confirmPopup.close(); //close the popup after 7 seconds for some reason
	    }, 7000);*/
	};

	ctrl.help = function() {
	    var helpPopup = $ionicPopup.show({
	    	title: 'Ajuda',
	    	template: 'Utilize os botões da parte de baixo da tela para inserir ou arquivar itens já comprados.' +
	    			  '<br><br>Deslize o dedo para a esquerda para exibir as opções do item.' +
	    	          '<br><hr>Desenvolvedor: <a href="https://br.linkedin.com/pub/dhiego-hendrix-atencio/29/ba0/2bb">Dhiego Hendrix</a>' ,
	    	buttons: [{ text: '<b>Ok</b>' }]
	    });

	    $timeout(function() {
	      	helpPopup.close();
	    }, 15000);
	};

	ctrl.rate = function() {
	    var avaliePopup = $ionicPopup.show({
	    	title: 'Avalie',
	    	template: 'Obrigado por avaliar o app na play store.' ,
	    	buttons: [{ text: '<b>Ok</b>' }]
	    });
		avaliePopup.then(function(res) {
			return false;
	    });
	    $timeout(function() {
	      	avaliePopup.close();
	    }, 30000);
	};
});