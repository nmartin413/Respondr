module.exports = function (grunt) {

	grunt.initConfig({

		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['uglify', 'copy']
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			main: {
				files: {
					'src/respondr.min.js': ['src/respondr.js']
				}
			}

		},

		copy: {
			main: {
				files: [
					{ src: ['src/respondr.js'], dest: 'test/respondr.js' },
					{ src: ['src/respondr.min.js'], dest: 'test/respondr.min.js' },
					{ src: ['node_modules/mocha/mocha.js'], dest: 'test/lib/mocha.js' },
					{ src: ['node_modules/mocha/mocha.css'], dest: 'test/css/mocha.css' },
					{ src: ['node_modules/chai/chai.js'], dest: 'test/lib/chai.js' }
				]
			}
		}

	});


	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify', 'copy']);

}