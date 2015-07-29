var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Location = mongoose.model('Location');
var Bar = mongoose.model('Bar');
var yelp = require('yelp').createClient({
	consumer_key: "un0C8s4Dxla0_XIK5DRUcQ",
	consumer_secret: "v6G4d22iAyL6HK9YpHNYTXqyViU",
	token: "Obkg43RwyFABS07kFLilaTPsp2j9kZ0k",
	token_secret: "GUhNu0MlQoY-7x78ddbkrSM8d3E"
});

/*
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
	consumerKey: '0Ssnus75LQY8rFtzOqjtHm9gB',
	consumerSecret: 'S5G1kMsCiJomfbXm33NxBptdCKApoiOzMoyZRyyMxwN8uHKVXg',
	callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
	},
	function(token, tokenSecret, profile, done){
		User.findOne({name:profile.displayName}, function(err, user){
			if(err){ return res.done(err)};
			if(user){
				return done(null, token)
			}else{
				var newUser = new User();
				newUser.name = profile.displayName;
				newUser.save(function(err){
					if(err) throw err;
					return done(null, token) 
				})
			}
		})
	}

))
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user || "none" });
});

router.post('/findBars', function(req,res,next){
	
	Location.findOne({location: req.body.location}, function(err, loc){
		if(err){ return res.send(err)}
		if(!loc){
			var locBars = new Location();
			locBars.location = req.body.location;
			locBars.bars = [];

			yelp.search({term:"bars", location:req.body.location}, function(err, data){
				if(err){ return res.send(err)}
				data.businesses.forEach(function(ele){
					var bar = new Bar();
					bar.name = ele.name;
					bar.link = ele.url;
					bar.visit = [];
					bar.status = "Add me";
					bar.location = locBars;
					bar.save(function(err,data){
						if(err) return res.send(err);
					})
					locBars.bars.push(bar);
				})
				locBars.save(function(err, allBars){
					if(err) return res.send(err);
					var obj = {};
					Bar.find({location: allBars._id}, function(err, d){
						if(err) return res.send(err);
						obj.theBars = d;
						obj.location = allBars.location;
						res.json(obj);
					})
				})

			})

			

		}else {
			var obj = {};
			Bar.find({location: loc._id}, function(err, d){
				if(err) return res.send(err);
				obj.theBars = d;
				obj.location = loc.location;
				res.json(obj);
			})
		}
	})
	
})

router.put('/addMe', function(req, res, next){
	Bar.findOne({name: req.body.bar}, function(err, theBar){
		if(err){ return res.send(err)};
		if(theBar.findUser(req.body.userName)){
			theBar.remove(req.body.userName, function(err, location){
				if(err) { return res.send(err);}
				res.json(location);
			})
		}else{
			theBar.go(req.body.userName, function(err, location){
				if(err) { return res.send(err);}
				res.json(location);
			})
		}
	})
})

router.put('/remove', function(req, res, next){
	Location.findOne({location: req.body.location}, function(err, loc){
		if(err){ return res.send(err)}
		loc.remove(req.body.index, function(err, location){
			if(err) { return res.send(err);}
			res.json(location);
		})
	})
})
/*
router.get('/auth/twitter',passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter',{successRedirect:'/', failureRedirect: '/'}))
*/


module.exports = router;
