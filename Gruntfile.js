module.exports = function (grunt) {

    grunt.initConfig({
        bump: {
            options: {
                files: ['src/starcounter-debug-aid.html', 'bower.json'],
                commit: true,
                commitMessage: '%VERSION%',
                commitFiles: ['src/starcounter-debug-aid.html', 'bower.json'],
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
