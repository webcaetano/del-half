var _ = require('lodash');
var del = require('del');
var glob = require('glob');
var path = require('path');
var fs = require('fs-extra');
var test = require('ava');

var self = require('./');

test.cb('should delete half files',function(t){
	var src = './test/dist/wizz/**/*.png';
	var dest = './test/dist/wizz';

	del.sync('./test/dist/');
	fs.copySync('./test/wizz-origin',dest);

	var inputFiles = glob.sync(src,{nodir:true});
	var numOfInput = inputFiles.length;

	self(src,function(err,data){
		var outputFiles = glob.sync(dest+'/**',{nodir:true});
		var numOutput = outputFiles.length;

		t.truthy(numOutput<=Math.ceil(numOfInput/2));
		t.falsy(err);
		t.pass();
		t.end();
	});
});

test.cb('should delete half files by even',function(t){
	var src = './test/dist/wizz/**/*.png';
	var dest = './test/dist/wizz';

	del.sync('./test/dist/');
	fs.copySync('./test/wizz-origin',dest);

	var inputFiles = glob.sync(src,{nodir:true});
	var numOfInput = inputFiles.length;

	self(src,{
		type:'even'
	},function(err,data){
		var outputFiles = glob.sync(dest+'/**',{nodir:true});
		var numOutput = outputFiles.length;

		t.truthy(numOutput<=Math.ceil(numOfInput/2));
		t.falsy(err);
		t.pass();
		t.end();
	});
});
