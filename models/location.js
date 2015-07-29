var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
	location: {type: String, lowercase: true, unique: true},
	bars: [{ type: mongoose.Schema.Types.ObjectId, ref:'Bar'}],
});




mongoose.model('Location', locationSchema);