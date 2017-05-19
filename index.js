var path = require('path');
var glob = require('glob');
var del = require('del');
var async = require('async');
var cpFile = require('cp-file');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var _ = require('lodash');

// insert defaults here
var defaults = {
	type:'odd',
}

var isOdd = function(val){
	return (val % 2)==1;
}

var isEven = function(val){
	return (val % 2)==0;
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
		del:['files',function(results,callback){
			var files = _.filter(results.files,function(file,i){
				return checkFunc(i);
			});

			del(files).then(function(data){
				callback(null,data);
			});
		}]
	},function(err,results){
		if(done) done(err,results);
	})
}

module.exports = self;
