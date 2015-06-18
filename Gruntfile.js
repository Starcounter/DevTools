module.exports = function (grunt) {

    grunt.initConfig({
        bump: {
            options: {
                files: ['src/starcounter-debug-aid.html'],
                commit: true,
                commitMessage: '%VERSION%',
                commitFiles: ['src/*'],
                createTag: true,
                tagName: '%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
};