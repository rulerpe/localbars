var mongoose = require('mongoose');

var barSchema = new mongoose.Schema({
	name: String,
	link: String,
	visit: [String],
	status: String,
	location: { type: mongoose.Schema.Types.ObjectId, ref:'Location'}
	
});

barSchema.methods.findUser = function(userName) {
	var visited = this.visit.some(function(ele){
		return ele == userName;
	})
	return visited;
}

barSchema.methods.go = function(userName, cb) {
	this.visit.push(userName);
	this.save(cb);
}
barSchema.methods.remove = function(userName, cb) { 
	var removeIndex ; 
	this.visit = this.visit.filter(function(ele,index){
		return (ele !== userName)
	})
	this.save(cb);
}


mongoose.model('Bar', barSchema);