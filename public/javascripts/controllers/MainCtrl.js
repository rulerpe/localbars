angular.module('MainCtrl',[])
	.controller('MainController',function(bars, $q, $window, $timeout){
		var vm = this;
		vm.bars = bars.bars;
		vm.location = '';
		OAuth.initialize('QNh6xHOe8LLupJaD1xMalmRH6L4', {cache: true});
		vm.findBars = function(){
			vm.moveSearch = "10%";
			bars.getAll({location: vm.location});
			

		};
		
		vm.addme = function(bar, username, index){
			bars.go({userName: $window.localStorage['userName'], bar: bar})
			console.log(vm.bars[index])
			vm.bars[index].visit.push(username);
			vm.bars[index].status = 'Remove me';
		};

		vm.removeme = function(bar, username, index){
			bars.remove({userName: $window.localStorage['userName'], bar: bar})
			console.log(vm.bars[index]);
			vm.bars[index].visit = vm.bars[index].visit.filter(function(ele){
				return ele !== username;
			})
			vm.bars[index].status = 'Add me';
		}

		vm.signin = function(bar, index){
				console.log('came');
			if($window.localStorage['userName']){
				if (vm.bars[index].status === 'Remove me'){
					vm.removeme(bar, vm.userName, index);
				} else {
					vm.addme(bar, vm.userName, index);
				}
			}else{

				OAuth.popup('twitter', {cache: true},function(err, result){
					if(!err) {
						var twitter = result;
						twitter.get('/1.1/account/settings.json')
							.done(function(data){
								//console.log(data);
								$window.localStorage['userName'] = data.screen_name;
								vm.userName = $window.localStorage['userName'];
								$timeout(function(){
									vm.bars.forEach(function(ele, i ){
										var visited = vm.bars[i].visit.some(function(ele){
											return ele == vm.userName;
										});
										console.log("in loop")
										ele.status = (visited) ? 'Remove me' : 'Add me'; 
									})
								})
								

							})
					}else{
						console.log(err);
					}
				})
			}

		};

	})