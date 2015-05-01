angular.module('controllers', ['ionic'])
.controller('TodoListController', function ($scope, $ionicPopup, $timeout, $localStorage) {

    var todoList = this;

    todoList.$storage = $localStorage.$default({
        todos: []
    });

	todoList.showPopup = function() {
	   $scope.data = {}

	    // An elaborate, custom popup
	    var myPopup = $ionicPopup.show({
		    template: '<input type="text" ng-model="data.text" autofocus>',
		    title: 'Novo item',
		    subTitle: 'Adicione a descrição do item',
		    scope: $scope,
		    buttons: [
		       {	text: 'Cancelar'	},
		       {    text: '<b>Salvar</b>',
		         	type: 'button-positive',
		         	onTap: function(e) {
			           	if (!$scope.data.text) {
			            	//don't allow the user to close unless he enters wifi password
			             	e.preventDefault();
			           	} else {
			             	return $scope.data.text;
			           	}
		        	}
		       },
		    ]
	   });
	   myPopup.then(function(res) {
	   		if (res) {
	   			todoList.todoText = res;
	   			todoList.addTodo();
	   		}

	     	console.log('Tapped!', res);
	   });
	   $timeout(function() {
	      	myPopup.close(); //close the popup after 15 seconds for some reason
	   }, 15000);
	};

    todoList.addTodo = function() {
      todoList.$storage.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };

    todoList.archive = function() {
      var oldTodos = todoList.$storage.todos;
      todoList.$storage.todos = [];
      angular.forEach(oldTodos, function(todo) {
        if (!todo.done) todoList.$storage.todos.push(todo);
      });
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
	    		  onTap: function(e) {return "ok"}
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

	// A confirm dialog
	todoList.help = function() {
	    var helpPopup = $ionicPopup.show({
	    	title: 'Ajuda',
	    	template: 'Utilize os botões da parte de baixo da tela para inserir ou arquivar itens já comprados.' +
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
	    }, 15000);
	}
});