module.exports = function(grunt) {

    grunt.initConfig({
        sass: {
            dist: {
                options : {
                    style: 'expanded'
                }
            },
            files: {
                expand: true,
                cwd: 'public/css',
                src: ['*.scss'],
                dest: 'public/css',
                ext: '.css'
              }
        },
        autoprefixer: {
            single_file: {
                src: "public/css/style.css",
                dest: "public/css/style.css"
            }
        },
        browserify: {
            dist: {
                options: {
                   transform: [['babelify', { presets: ["react", "es2015"], plugins: ["transform-object-rest-spread"] }]]
                },
                src: ['client/**/*.js','client/**/*.jsx'],
                dest: 'public/js/bundle.js'
            }
        },
        uglify: {
            my_target: {
              files: {
                'public/js/bundle.min.js': ['public/js/bundle.js']
                }
            }
        },
        watch: {
            css: {
                files: ["public/css/*.scss"],
                tasks: ["css"]
            },
            scripts: {
                files: ["lib/*.js","public/js/*.js",'client/**/*.js','client/**/*.jsx', '!public/js/bundle.js'],
                tasks: ["browserify"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-autoprefixer");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("css", ["sass", "autoprefixer"]);

    grunt.registerTask("default", ["browserify", "css"]);
};