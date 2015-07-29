angular.module('GetBars',[])
	.factory('bars', function($http,$window){
		var o = {
			bars: []
		};

		o.getAll = function(location){
			return $http.post('/findBars',location).success(function(data){
				angular.copy(data.theBars, o.bars);
				//console.log(data);
				o.bars.forEach(function(ele, i ){
				var visited = o.bars[i].visit.some(function(ele){
					return ele == $window.localStorage['userName'];
				});
				if($window.localStorage['userName']){
					ele.status = (visited == true) ? 'Remove me' : 'Addd me'; 
				}else{
					ele.status = 'Log In';
				}
			})
			})
		};

		o.go = function(bar){
			return $http.put('/addMe',bar).success(function(data){
				//console.log(data);
			})
		};

		o.remove = function(bar){
			return $http.put('/addMe',bar).success(function(data){
			})
		};
	
		return o;
	})