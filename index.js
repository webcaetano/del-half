var path = require('path');
var glob = require('glob');
var del = require('del');
var async = require('async');
var naturalSort = require('node-natural-sort');
var _ = require('lodash');

// insert defaults here
var defaults = {
	type:'odd',
}

var isOdd = function(val){
	return (val % 2)==0;
}

var isEven = function(val){
	return (val % 2)==1;
}

var self = function(src, options, done){
	if(typeof options==='function') {
		var tmpVar = options;
		options = done ? done : {};
		done = tmpVar;
	}

	options = _.extend({},defaults,options);

	var checkFunc = {
		odd:isOdd,
		even:isEven,
	}[options.type];

	async.auto({
		files:function(callback){
			glob(src,{nodir:true},callback);
		},
		folders:['files',function(results,callback){
			var folders = _.reduce(results.files,function(folders,file){
				var folderName = path.dirname(file)
				if(!folders[path.dirname(file)]){
					folders[path.dirname(file)] = [];
				}

				folders[path.dirname(file)].push(file);

				return folders;
			},{});

			// console.log(folders)

			callback(null,folders);
		}],
		del:['folders',function(results,callback){
			var folders = results.folders;
			var run = [];

			_.each(folders,function(folder){

				var files = _.filter(folder.sort(naturalSort()),function(file,i){
					return checkFunc(i);
				});

				run.push(function(callback){
					del(files).then(function(data){
						callback(null,data);
					});
				});
			});

			async.parallel(run,callback);
		}]
	},function(err,results){
		if(done) done(err,results);
	})
}

module.exports = self;
