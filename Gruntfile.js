module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		mangle: false,
		compress: true, // {unsafe: true, unsafe_comps: true},
		//beautify: {semicolons: false, space_colon: false},
      },
      build: {
        src: 'demo.js',
        dest: 'build/demo.min.js'
      }
    },
	
	regpack: {
		args: {
		withMath : true,
		hash2DContext : true,  
		contextType: 0,
		contextVariableName : 'c',
        crushGainFactor: 1,
        crushLengthFactor: 1,
		crushCopiesFactor: 2,
        crushTiebreakerFactor : 0,
		reassignVars : true,
		varsNotReassigned : ['a', 'b', 'c', 'C', 'H', 'N', 'O']
      },
	  // more args for test series
      args2: {
		withMath : true,
		hash2DContext : true,  
		contextType: 0,
		contextVariableName : 'c',
        crushGainFactor: 1,
        crushLengthFactor: 1,
		crushCopiesFactor: 2,
        crushTiebreakerFactor : -1,
		reassignVars : true,
		varsNotReassigned : ['a', 'b', 'c', 'C', 'H', 'N', 'O']
      },
	  args3: {
		withMath : true,
		hash2DContext : true,  
		contextType: 0,
		contextVariableName : 'c',
        crushGainFactor: 1,
        crushLengthFactor: 0,
		crushCopiesFactor: 0,
        crushTiebreakerFactor : 0,
		reassignVars : true,
		varsNotReassigned : ['a', 'b', 'c', 'C', 'H', 'N', 'O']
      },
	  
	  args4: {
		withMath : true,
		hash2DContext : true,  
		contextType: 0,
		contextVariableName : 'c',
        crushGainFactor: 1,
        crushLengthFactor: 2,
		crushCopiesFactor: 4,
        crushTiebreakerFactor : 0,
		reassignVars : true,
		varsNotReassigned : ['a', 'b', 'c', 'C', 'H', 'N', 'O']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('regpack', function() {
    var fs = require('fs'),
        cmdRegPack = require('./node_modules/regpack').cmdRegPack, // + ' --force'
        args = grunt.config('regpack.args'),
		args2 = grunt.config('regpack.args2'),
		args3 = grunt.config('regpack.args3'),
		args4 = grunt.config('regpack.args4'),
    result = cmdRegPack(fs.readFileSync('build/demo.min.js', 'utf-8'), args);
	// test
	cmdRegPack(fs.readFileSync('build/demo.min.js', 'utf-8'), args2);
	cmdRegPack(fs.readFileSync('build/demo.min.js', 'utf-8'), args3);
	cmdRegPack(fs.readFileSync('build/demo.min.js', 'utf-8'), args4);
	
    fs.writeFileSync('build/demo.zip.js', result);
  });
  
  grunt.registerTask('compile', function() {
    var fs = require('fs'),
        demo = fs.readFileSync('build/demo.zip.js'),
        shim = fs.readFileSync('shim.html', {encoding: 'utf8'}),
		shim64 = fs.readFileSync('shim.html', {encoding: 'utf8'}),
        base64 = new Buffer(demo).toString('base64');
		
    fs.writeFileSync('build/demoBase64.txt', base64);
	
    shim = shim.split('DEMO_HERE').join(demo);
    fs.writeFileSync('build/shim.html', shim);
	
	shim64 = shim64.split('DEMO_HERE').join('eval(decodeURIComponent(escape(atob("' + base64 + '"))))');
    fs.writeFileSync('build/shimB64.html', shim64);
  });

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'regpack', 'compile']);

};