/* global cordova */
/* global angular */
angular.module('controllers', ['ionic'])
.controller('TodoListController', function ($scope, $ionicPopup, $timeout, $localStorage,
	                                        focus, $ionicModal) {

    var todoList = this;
    todoList.$storage = $localStorage.$default({ todos: [] });

    todoList.itemTemp = {};
    todoList.indexEditing = {};

	//init the modal
	$ionicModal.fromTemplateUrl('modalAddItem.tpl', {
		scope: $scope,
		animation: 'slide-in-up',
		focusFirstInput: true
	}).then(function (modal) {
	  	todoList.modal = modal;
	});

	// function to close the modal
	todoList.closeModal = function () {
		todoList.modal.hide();
        todoList.indexEditing = "";
        todoList.itemTemp     = "";
	};

	// function to open the modal
	todoList.openModal = function () {
		todoList.indexEditing = "";
		todoList.statusItem = "";
		todoList.modal.show();
		focus('text');
	};

	todoList.editItem = function(item, index){
		todoList.indexEditing = index;
		todoList.itemTemp     = {text: item.text, qtd: item.qtd, done: item.done};
		todoList.statusItem = "";
		todoList.modal.show();
	};

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () { todoList.modal.remove(); });

	//function to add items to the existing list
	todoList.addItem = function (data, idxItemEdited) {
		if (!data) return;
		if (!data.text) return;

		if (!idxItemEdited) {
	        todoList.$storage.todos.push({
		      	text:data.text,
		      	qtd: data.qtd,
		      	done:false
	      	});
	      	focus('text');
		  	data.text = '';
		  	data.qtd = '';
		    todoList.statusItem = "Salvo com sucesso!";
	    	cordova.plugins.Keyboard.show();
		} else {
			todoList.$storage.todos.splice(idxItemEdited, 1, {
				text: data.text,
				qtd: data.qtd,
				done: data.done
			});
			todoList.indexEditing = "";
			todoList.closeModal();
		};
	};

	todoList.removeItem = function (idx) {
		todoList.$storage.todos.splice(idx, 1);
	};

	todoList.atualizaStatusItem = function(text) {
		if (text) todoList.statusItem = "";
	};

    todoList.archive = function() {
      var oldTodos = todoList.$storage.todos;
      todoList.$storage.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.$storage.todos.push(todo);
      });
    };

    todoList.keyDownItemForm = function(event) {
    	if (event.keyCode == 13)
    		todoList.addItem(todoList.itemTemp, todoList.indexEditing);

    	todoList.atualizaStatusItem(todoList.itemTemp.text);
    };

    todoList.getDescricaoItem = function(data){
    	if (data.qtd) return data.qtd + " - " + data.text;
    	return data.text;
    };

	// A confirm dialog
	todoList.confirmArchive = function() {
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
	     		todoList.archive();
	     	} else {
	       		console.log('You are not sure');
	     	}
	    });
	    $timeout(function() {
	      	confirmPopup.close(); //close the popup after 7 seconds for some reason
	    }, 7000);
	};

	todoList.help = function() {
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

	todoList.rate = function() {
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