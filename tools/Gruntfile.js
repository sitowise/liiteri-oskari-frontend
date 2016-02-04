/*global module:false*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        meta: {
            version: '0.1.0',
            banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '* http://PROJECT_WEBSITE/\n' + '* Copyright (c) <%= grunt.template.today("yyyy") %> ' + 'YOUR_NAME; Licensed MIT */'
        },
        //        lint: {
        //            files: ['applications/**/*.js', 'bundles/**/*.js', 'libraries/**/*.js', 'packages/**/*.js', 'resources/**/*.js', 'sources/**/*.js']
        //        },
        //        test: {
        //            files: ['test/**/*.js']
        //        },
        //        concat: {
        //            dist: {
        //                src: ['<banner:meta.banner>', '<file_strip_banner:lib/FILE_NAME.js>'],
        //                dest: 'dist/FILE_NAME.js'
        //            }
        //        },
        //        min: {
        //            dist: {
        //                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        //                dest: 'dist/FILE_NAME.min.js'
        //            }
        //        },
        compileAppSetupToStartupSequence: {
            files: ['../tests/minifierFullMapAppSetup.json']
        },
        watch: {
            appsetup: {
                files: '<%= compileAppSetupToStartupSequence.files %>',
                tasks: ['compileAppSetupToStartupSequence']
            },
            src: {
                //            files: '<config:lint.files>',
                files: ['../applications/**/*.js', '../bundles/**/*.js', '../libraries/**/*.js', '../packages/**/*.js', '../resources/**/*.js', '../sources/**/*.js'],
                // uncommented as validate causes unnecessary delay
                //            tasks: ['validate', 'compile', 'testacularRun:dev', 'yuidoc:dist']
                tasks: ['compileDev', 'karma:dev:run']
            },
            test: {
                files: ['../tests/**/*.js'],
                tasks: ['karma:dev:run']
            },
            sass: {
                files: ['../bundles/**/scss/*.scss', '../applications/**/scss/*.scss'],
                tasks: ['compileDev']
            }
        },
        sprite: {
            options: {
                iconDirectoryPath: '../applications/paikkatietoikkuna.fi/full-map/icons',
                resultImageName: '../applications/paikkatietoikkuna.fi/full-map/icons/icons.png',
                resultCSSName: '../applications/paikkatietoikkuna.fi/full-map/css/icons.css',
                spritePathInCSS: '../icons'
            }
        },
        compileDev: {
            options: {
                appSetupFile: '../tests/minifierFullMapAppSetup.json',
                dest: '../dist/',
                concat: true
            }
        },
        release: {
            options: {
                configs: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json,../applications/paikkatietoikkuna.fi/full-map_guest/minifierAppSetup.json,../applications/paikkatietoikkuna.fi/published-map/minifierAppSetup.json,../applications/parcel/minifierAppSetup.json',
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        buildApp: {
            options: {
                applicationPaths: '../applications/paikkatietoikkuna.fi/full-map/,../applications/paikkatietoikkuna.fi/full-map_guest/,../applications/paikkatietoikkuna.fi/published-map/,../applications/parcel/',
                buildsetupconfigFileName: 'buildsetupconfig.json',
                appsetupconfigFileName: 'appsetupconfig.json',
                defaultIconDirectoryPath: '../applications/default/icons/'
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            dev: {
                background: true
            },
            ci: {
                browsers: ['PhantomJS'],
                proxies: {
                    '/': 'http://dev.paikkatietoikkuna.fi/'
                },
                reporters: ['junit'],
                junitReporter: {
                    outputFile: 'test-results.xml'
                },
                singleRun: true
            },
            test: {
                configFile: 'src.conf.js'
            }
        },
        clean: {
            options: {
                force: true
            },
            build: ['../build'],
            dist: ['../dist']
        },
        oskaridoc: {
            dist: {
                options: {
                    paths: ['../sources/framework', '../bundles/framework', '../bundles/sample', '../bundles/catalogue'],
                    outdir: '../oskari.org/api/<%= version %>',
                    themedir: '../docs/yui/theme'
                }
            }
        },
        mddocs: {
            options: {
                'toolsPath': process.cwd(),
                'docsPath': '../docs',
                'docsurl': '/Oskari/<%= version %>docs/',
                'apiurl': '/Oskari/<%= version %>api/classes/',
                'outdir': '../dist/<%= version %>docs/'
            }
        },
        validateLocalizationJSON: {
            target: {
                src: ['../bundles/**/locale/*.js']
            }
        },
        beautifyJS: {
            target: {
                src: ['../{bundles,packages}/**/*.js']
            }
        },
        impL10nExcels: {
            target: {}
        },
        genL10nExcels: {
            target: {
                expand: true,
                src: ['../bundles/**/bundle/*/']
            }
        },
        compress: {
            zip: {
                options: {
                    archive: '../oskari.org/archives/oskari.<%= versionNum %>.zip',
                    mode: 'zip',
                    pretty: true
                },
                files: [
                    // Copy all files under the application template folder
                    {
                        cwd: './oskari_application_template/',
                        src: '**',
                        dest: '/',
                        expand: true
                    },
                    // Copy all minified oskari files
                    {
                        cwd: '../dist/<%= versionNum %>/<%= compress.options.fullMap %>',
                        src: 'oskari*',
                        dest: '/min/',
                        expand: true
                    }, {
                        src: '../bundles/bundle.js',
                        dest: '/',
                    }, {
                        src: '../packages/openlayers/startup.js',
                        dest: '/',
                    }
                ]
            },
            tgz: {
                options: {
                    archive: '../oskari.org/archives/oskari.<%= versionNum %>.tgz',
                    mode: 'tgz',
                    pretty: true
                },
                files: '<%= compress.zip.files %>'
            }
        },
        modulizeAll: {
            'admin-layerrights': '../packages/framework/bundle/admin-layerrights',
            'backendstatus': '../packages/framework/bundle/backendstatus',
            'coordinatedisplay': '../packages/framework/bundle/coordinatedisplay',
            // Manual modification          'divmanazer': '../packages/framework/bundle/divmanazer',
            'featuredata': '../packages/framework/bundle/featuredata',
            'featuredata2': '../packages/framework/bundle/featuredata2',
            // Manual modification          'guidedtour': '../packages/framework/bundle/guidedtour',
            'infobox': '../packages/framework/bundle/infobox',
            // Manual modification          'layerselection2': '../packages/framework/bundle/layerselection2',
            'layerselector2': '../packages/framework/bundle/layerselector2',
            'mapanalysis': '../packages/framework/bundle/mapanalysis',
            'mapfull': '../packages/framework/bundle/mapfull',
            'maplegend': '../packages/framework/bundle/maplegend',
            // Manual replaced by src/mapping/mapmodule-plugin          'mapmodule-plugin': '../packages/framework/bundle/mapmodule-plugin',
            'mapstats': '../packages/framework/bundle/mapstats',
            'mapwfs': '../packages/framework/bundle/mapwfs',
            'mapwfs2': '../packages/framework/bundle/mapwfs2',
            // Manual replaced by src/framework/mapwmts          'mapwmts': '../packages/framework/bundle/mapwmts',
            'metadata': '../packages/framework/bundle/metadata',
            'myplaces2': '../packages/framework/bundle/myplaces2',
            // Manual modification          'oskariui': '../packages/framework/bundle/oskariui',
            'parcel': '../packages/framework/bundle/parcel',
            'parcelinfo': '../packages/framework/bundle/parcelinfo',
            'parcelselector': '../packages/framework/bundle/parcelselector',
            'personaldata': '../packages/framework/bundle/personaldata',
            'postprocessor': '../packages/framework/bundle/postprocessor',
            'printout': '../packages/framework/bundle/printout',
            'promote': '../packages/framework/bundle/promote',
            'publisher': '../packages/framework/bundle/publisher',
            'routesearch': '../packages/framework/bundle/routesearch',
            'search': '../packages/framework/bundle/search',
            'statehandler': '../packages/framework/bundle/statehandler',
            'toolbar': '../packages/framework/bundle/toolbar',
            'usagetracker': '../packages/framework/bundle/usagetracker',
            'userguide': '../packages/framework/bundle/userguide',
            // Manual modification          'statsgrid': '../packages/statistics/bundle/statsgrid',
            'analyse': '../packages/analysis/bundle/analyse',
            // Manual modification          'metadataflyout': '../packages/catalogue/bundle/metadataflyout',
            'metadatacatalogue': '../packages/catalogue/bundle/metadataflyout'
        },
        minifyAll: {
            options: {
                baseUrl: '../',
                paths: {
                    jquery: 'empty:',
                    oskari: 'empty:',
                    css: 'libraries/requirejs/lib/css',
                    json: 'libraries/requirejs/lib/json',
                    domReady: 'libraries/requirejs/lib/domReady',
                    normalize: 'libraries/requirejs/lib/normalize',
                    i18n: 'libraries/requirejs/lib/i18n',
                    'css-builder': 'libraries/requirejs/lib/css-builder'
                },
                optimizeAllPluginResources: true,
                findNestedDependencies: true,
                preserveLicenseComments: true
            },
            'admin-layerrights': {
                name: 'src/framework/admin-layerrights/module',
                out: '../src/framework/admin-layerrights/minified.js'
            },
            'backendstatus': {
                name: 'src/framework/backendstatus/module',
                out: '../src/framework/backendstatus/minified.js'
            },
            'coordinatedisplay': {
                name: 'src/framework/coordinatedisplay/module',
                out: '../src/framework/coordinatedisplay/minified.js'
            },
            'divmanazer': {
                name: 'src/framework/divmanazer/module',
                out: '../src/framework/divmanazer/minified.js'
            },
            'featuredata': {
                name: 'src/framework/featuredata/module',
                out: '../src/framework/featuredata/minified.js'
            },
            'featuredata2': {
                name: 'src/framework/featuredata2/module',
                out: '../src/framework/featuredata2/minified.js'
            },
            'guidedtour': {
                name: 'src/framework/guidedtour/module',
                out: '../src/framework/guidedtour/minified.js'
            },
            'infobox': {
                name: 'src/framework/infobox/module',
                out: '../src/framework/infobox/minified.js'
            },
            'layerselection2': {
                name: 'src/framework/layerselection2/module',
                out: '../src/framework/layerselection2/minified.js'
            },
            'layerselector2': {
                name: 'src/framework/layerselector2/module',
                out: '../src/framework/layerselector2/minified.js'
            },
            'mapanalysis': {
                name: 'src/framework/mapanalysis/module',
                out: '../src/framework/mapanalysis/minified.js'
            },
            'mapfull': {
                name: 'src/framework/mapfull/module',
                out: '../src/framework/mapfull/minified.js'
            },
            'maplegend': {
                name: 'src/framework/maplegend/module',
                out: '../src/framework/maplegend/minified.js'
            },
            'mapstats': {
                name: 'src/framework/mapstats/module',
                out: '../src/framework/mapstats/minified.js'
            },
            'mapwfs': {
                name: 'src/framework/mapwfs/module',
                out: '../src/framework/mapwfs/minified.js'
            },
            'mapwfs2': {
                name: 'src/framework/mapwfs2/module',
                out: '../src/framework/mapwfs2/minified.js'
            },
            'mapwmts': {
                name: 'src/framework/mapwmts/module',
                out: '../src/framework/mapwmts/minified.js'
            },
            'metadata': {
                name: 'src/framework/metadata/module',
                out: '../src/framework/metadata/minified.js'
            },
            'myplaces2': {
                name: 'src/framework/myplaces2/module',
                out: '../src/framework/myplaces2/minified.js'
            },
            'oskariui': {
                name: 'src/framework/oskariui/module',
                out: '../src/framework/oskariui/minified.js'
            },
            'parcel': {
                name: 'src/framework/parcel/module',
                out: '../src/framework/parcel/minified.js'
            },
            'parcelinfo': {
                name: 'src/framework/parcelinfo/module',
                out: '../src/framework/parcelinfo/minified.js'
            },
            'parcelselector': {
                name: 'src/framework/parcelselector/module',
                out: '../src/framework/parcelselector/minified.js'
            },
            'personaldata': {
                name: 'src/framework/personaldata/module',
                out: '../src/framework/personaldata/minified.js'
            },
            'postprocessor': {
                name: 'src/framework/postprocessor/module',
                out: '../src/framework/postprocessor/minified.js'
            },
            'printout': {
                name: 'src/framework/printout/module',
                out: '../src/framework/printout/minified.js'
            },
            'promote': {
                name: 'src/framework/promote/module',
                out: '../src/framework/promote/minified.js'
            },
            'publisher': {
                name: 'src/framework/publisher/module',
                out: '../src/framework/publisher/minified.js'
            },
            'search': {
                name: 'src/framework/search/module',
                out: '../src/framework/search/minified.js'
            },
            'statehandler': {
                name: 'src/framework/statehandler/module',
                out: '../src/framework/statehandler/minified.js'
            },
            'toolbar': {
                name: 'src/framework/toolbar/module',
                out: '../src/framework/toolbar/minified.js'
            },
            'usagetracker': {
                name: 'src/framework/usagetracker/module',
                out: '../src/framework/usagetracker/minified.js'
            },
            'userguide': {
                name: 'src/framework/userguide/module',
                out: '../src/framework/userguide/minified.js'
            }
        }
    });


    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-compress');

    // Default task(s).
    grunt.registerTask('default', ['karma:dev', 'compileAppSetupToStartupSequence', 'compileDev', 'karma:dev:run', 'watch']);
    grunt.registerTask('ci', ['compileAppSetupToStartupSequence', 'compileDev', 'karma:ci']);
    // Default task.
    //    grunt.registerTask('default', 'watch testacularServer:dev');
    //    grunt.registerTask('default', 'testacularServer:dev watch');
    //    grunt.registerTask('default', 'lint test concat min');
    grunt.registerTask('compileDev', 'Developer compile', function () {
        var options = this.options();
        // set task configs
        grunt.config.set('compile.dev.options', options);
        grunt.task.run('compile');

        grunt.config.set(
            'compileAppCSS.dev.options', {
                appSetupFile: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json',
                dest: options.dest
            }
        );
        grunt.task.run('compileAppCSS');
    });

    grunt.registerTask('compileAppSetupToStartupSequence', function () {
        var done = this.async(),
            starttime = (new Date()).getTime(),
            files,
            outputFilename,
            fs = require('fs'),
            cfgFile,
            startupSequence,
            definedBundles = {},
            bundle,
            result = 'var _defaultsStartupSeq = ',
            i,
            ilen;

        grunt.log.writeln('Running compile AppSetup to startupSequence...');

        // read files and parse output name
        files = grunt.config(this.name).files[0];
        outputFilename = files.replace('.json', '.opts.js');

        // read file
        cfgFile = fs.readFileSync(files, 'utf8');

        // convert to usable format
        startupSequence = JSON.parse(cfgFile).startupSequence;

        // loop startup sequence bundles and add to hashmap of defined bundles
        for (i = 0, ilen = startupSequence.length; i < ilen; i += 1) {
            bundle = startupSequence[i];
            // Add here code to change bundlePath to "ignored/butRequiredToBeInMinifierFullMapAppSetupInTests/packages/framework/bundle/"
            // or something similar as the bundlePaths are not used with minifierAppSetup
            definedBundles[bundle.bundlename] = bundle;
        }

        // add stringified bundle definitions
        result += JSON.stringify(definedBundles);

        // write file to be used in testing as is
        fs.writeFileSync(outputFilename, result, 'utf8');

        grunt.log.writeln('compileAppSetupToStartupSequence completed in ' + (((new Date()).getTime() - starttime) / 1000) + ' seconds');
        done();
    });

    grunt.registerTask('release', 'Release build', function (version, configs, defaultIconDirectoryPath, copyResourcesToApplications, skipDocumentation) {
        var i,
            ilen,
            config,
            last,
            cwd,
            appName,
            APPSFOLDERNAME = 'applications',
            dest,
            options = this.options(),
            files,
            copyFiles,
            appNameSeparatorIndex,
            parentAppName;

        // use grunt default options
        if (options.configs && !configs) {
            configs = options.configs;
        }
        if (options.defaultIconDirectoryPath && !defaultIconDirectoryPath) {
            defaultIconDirectoryPath = options.defaultIconDirectoryPath;
        }

        if (!version || !configs) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt release:1.7:"../path/to/minifierAppSetup.json"', 1);
        }
        // set version in config for grunt templating
        grunt.config.set('version', version + '/');
        grunt.config.set('versionNum', version);

        // set multi task configs for compile and validate
        configs = configs.split(',');
        for (i = 0, ilen = configs.length; i < ilen; i += 1) {
            config = configs[i];
            last = (config.lastIndexOf('/'));
            cwd = config.substring(0, last);
            appName = config.substring(cwd.lastIndexOf('/') + 1, last);
            dest = '../dist/<%= version %>' + appName + '/';
            options = {
                iconDirectoryPath: config.substring(0, last) + '/icons',
                resultImageName: '../dist/<%= version %>' + appName + '/icons/icons.png',
                resultCSSName: '../dist/<%= version %>' + appName + '/css/icons.css',
                spritePathInCSS: '../icons',
                defaultIconDirectoryPath: defaultIconDirectoryPath
            };
            files = [];
            copyFiles = {
                expand: true,
                cwd: cwd + '/',
                src: ['css/**', 'images/**', '*.js'],
                dest: dest
            };

            // subsets have underscore (_) in appName, which means we need to
            // get the parent resources first and then replace with subset specific stuff
            appNameSeparatorIndex = appName.indexOf('_');
            if (appNameSeparatorIndex > 0) {
                parentAppName = appName.substring(0, appNameSeparatorIndex);
                // copy files from parent folder to be replaced by child
                files.push({
                    expand: true,
                    cwd: cwd.replace(appName, parentAppName) + '/',
                    src: ['css/**', 'images/**', '*.js'],
                    dest: dest
                });
                // modify css-sprite to use parent icons instead
                options.iconDirectoryPath = options.iconDirectoryPath.replace(appName, parentAppName);
            }

            // add files to be copied
            files.push(copyFiles);

            // setting task configs
            grunt.config.set('copy.' + appName + '.files', files);
            /*            grunt.config.set("validate." + appName + ".options", {
                            "appSetupFile": config,
                            "dest": dest
                        }); */
            grunt.config.set('compile.' + appName + '.options', {
                appSetupFile: config,
                dest: dest
            });
            grunt.config.set('compileAppCSS.' + appName + '.options', {
                appSetupFile: config,
                dest: dest
            });
            grunt.config.set('sprite.' + appName + '.options', options);

            if (appName === 'full-map') {
                grunt.config.set('compress.options.fullMap', appName);
            }
        }


        // add mddocs to dist
        // add resources to dist
        grunt.config.set('copy.common.files', [{
            expand: true,
            cwd: '../docs/',
            src: ['images/**', 'layout/**'],
            dest: grunt.config.get('mddocs.options.outdir')
        }, {
            expand: true,
            cwd: '../',
            src: ['resources/**', 'libraries/**', 'bundles/**', 'packages/**', 'src/**', 'applications/**', 'sources/**'],
            dest: '../dist/'
        }]);


        //        grunt.task.run('validate');

        // configure copy-task to copy back the results from dist/css and dist/icons to applications/appname/(css || icons)
        if (copyResourcesToApplications) {
            var copyApps = Object.keys(grunt.config.get('copy')),
                finalFiles = [];

            for (i = 0, ilen = copyApps.length; i < ilen; i += 1) {
                appName = copyApps[i];

                // skip common copy task, the rest should be real apps that are copied
                if ('common' !== appName) {
                    copyFiles = grunt.config.get('copy.' + copyApps[i] + '.files')[0];
                    finalFiles.push({
                        expand: true,
                        cwd: copyFiles.dest,
                        src: ['css/**', 'icons/**'],
                        dest: copyFiles.cwd
                    });
                }
                // only run the given copy tasks
                grunt.task.run('copy:' + copyApps[i]);
            }

            // add final copy settings to be run after compilation
            grunt.config.set('copy.final.files', finalFiles);
        } else {
            grunt.task.run('copy');
        }

        grunt.task.run('compile');
        grunt.task.run('compileAppCSS');
        grunt.task.run('sprite');
        if (!skipDocumentation) {
            grunt.task.run('oskaridoc');
        }

        if (grunt.config.get('compress.options.fullMap')) {
            grunt.task.run('compress');
        }
        if (copyResourcesToApplications) {
            grunt.task.run('copy:final');
        }
    });

    grunt.registerTask('packageopenlayer', 'Package openlayers according to packages', function (packages) {
        var fs = require('fs'),
            path = require('path'),
            wrench = require('wrench'),
            sourceDirectory,
            //outputFilenamePrefix = "OpenLayers.",
            //outputFilenamePostfix = ".min.js",
            cfg = null,
            cfgFile = null,
            i = null,
            ilen = null,
            j = null,
            jlen = null,
            k = null,
            klen = null,
            //cfgs = [],
            files = null,
            file = null,
            linegroup = null,
            profile = null,
            //dist = null,
            line = null,
            exclude,
            include,
            FIRST = '[first]',
            LAST = '[last]',
            INCLUDE = '[include]',
            EXCLUDE = '[exclude]';

        if (!packages) {
            grunt.log.writeln('No cfg packages given, reading all cfg files in current directory.');
            packages = [];
            files = fs.readdirSync(process.cwd());
            file = '';
            for (i in files) {
                if (files.hasOwnProperty(i)) {
                    file = files[i];
                    if (file.indexOf('.cfg') !== -1 && file.indexOf('2_13_1') !== -1) {
                        packages.push(file);
                    }
                }
            }
        } else {
            // transform comma separeted configs string to array
            packages = packages.split(',');
        }

        console.log('Running openlayers packager...');
        sourceDirectory = path.join(process.cwd(), '/components/openlayers/lib/');

        // read cfg files
        for (i = 0, ilen = packages.length; i < ilen; i += 1) {
            cfgFile = fs.readFileSync(packages[i], 'utf8').split('\r\n');
            profile = packages[i];
            profile = profile.substring(profile.lastIndexOf('/') + 1, profile.indexOf('.cfg'));

            cfg = {};
            for (j = 0, jlen = cfgFile.length; j < jlen; j += 1) {
                line = cfgFile[j];

                // skip empty lines and lines that start with #
                if ((line.length > 0) && (line[0] !== '#')) {
                    if (line === FIRST) {
                        linegroup = 'forceFirst';
                    } else if (line === LAST) {
                        linegroup = 'forceLast';
                    } else if (line === INCLUDE) {
                        linegroup = 'include';
                    } else if (line === EXCLUDE) {
                        linegroup = 'exclude';
                    } else {
                        // add array if not defined
                        if (!cfg[linegroup]) {
                            cfg[linegroup] = [];
                        }
                        // add line as absolute path to array

                        line = path.join(sourceDirectory, line);
                        cfg[linegroup].push(line);
                    }
                }
            }
            // assuming exclude can only occur when there is no include, or if there is, we overwrite it
            if (cfg.exclude) {
                exclude = cfg.exclude;
                include = null;
                cfg.include = [];

                // read all files in source folder
                files = wrench.readdirSyncRecursive(sourceDirectory);

                // loop files to exclude the ones that are not supposed to be included
                for (j = 0, jlen = files.length; j < jlen; j += 1) {
                    file = path.join(sourceDirectory, files[j]);
                    include = true;
                    for (k = 0, klen = exclude.length; k < klen; k += 1) {
                        // check the excluded path is not include
                        // exclude all non-js files such as folder as well
                        if (file.indexOf(exclude[k]) === 0) {
                            include = false;
                        } else if (file.indexOf('.js') === -1) {
                            include = false;
                        }
                    }
                    if (include) {
                        cfg.include.push(file);
                    }
                }
            }

            // clean up the profile name a bit
            if (profile.indexOf('openlayers-') === 0) {
                profile = profile.substring('openlayers-'.length);
            }

            // set configuration to concat
            grunt.config.set('concat.' + profile + '.src', cfg.include);
            grunt.config.set('concat.' + profile + '.dest', '../libraries/OpenLayers/OpenLayers.' + profile + '.js');
        }

        // concatenate the files
        grunt.task.run('concat');
    });

    grunt.registerTask('watchSCSS', 'Watch task for SCSS files', function () {
        grunt.config.set('compileAppCSS.watchCSS.options', {
            appSetupFile: '../applications/paikkatietoikkuna.fi/full-map/minifierAppSetup.json'
        });
        grunt.task.run('compileAppCSS');
    });

    // TODO compile bundle css only for bundles that the application uses
    grunt.registerMultiTask('compileAppCSS', 'Build css for application', function () {
        var varsDirectory = this.data.options.appSetupFile,
            appName = varsDirectory.substring(varsDirectory.lastIndexOf('/') + 1, varsDirectory.length),
            varsFileExists = true,
            invalidPaths = [],
            fs = require('fs');

        if (!varsDirectory) {
            grunt.fail.fatal('Missing parameter\nUsage: grunt sass-build-application:"../path/to/application"', 1);
        }


        // strip file part so we get the application path
        varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf('/'));
        grunt.log.writeln('Compiling app CSS with appPath ' + varsDirectory);


        // find valid applicationVariables.scss path
        grunt.log.writeln('Finding valid applicationVariables.scss path');
        if (!fs.existsSync(varsDirectory + '/_applicationVariables.scss')) {
            if (varsDirectory.indexOf('_') > 0) {
                // get parent application path
                varsDirectory = varsDirectory.substring(0, varsDirectory.lastIndexOf('_'));
                if (!fs.existsSync(varsDirectory + '/_applicationVariables.scss')) {
                    invalidPaths.push(varsDirectory);
                    varsFileExists = false;
                }
            } else {
                invalidPaths.push(varsDirectory);
                varsFileExists = false;
            }
            if (!varsFileExists) {
                grunt.fail.fatal('applicationVariables.scss not found, looked in:\n' + invalidPaths, 1);
            } else {
                grunt.log.writeln('Found valid applicationVariables.scss path:\n' + varsDirectory);
            }
        }


        // get application scss files
        /*
        grunt.log.writeln("Getting application SCSS files");
        var vars = fs.readFileSync(varsDirectory + "/_applicationVariables.scss"),
            scssFiles = fs.readdirSync(varsDirectory + "/scss/");
        */

        // compile to css
        grunt.log.writeln('Compiling app SCSS to CSS, using ' + varsDirectory + '/scss/ as SCSS folder.');
        grunt.config.set(
            'sass.' + appName + '.files', [{
                expand: true,
                cwd: varsDirectory + '/scss/',
                src: ['*.scss'],
                dest: varsDirectory + '/css/',
                ext: '.css'
            }]

        );

        grunt.task.run('sass');

        // build bundle css files
        // hackhack, copy applicationVariables to a 'static' location
        // TODO change to copy
        fs.createReadStream(varsDirectory + '/_applicationVariables.scss').pipe(fs.createWriteStream('../applications/_applicationVariables.scss'));

        grunt.log.writeln('Compiling bundle CSS');

        grunt.task.run('compileBundleCSS');


        if (this.data && this.data.options) {
            grunt.log.writeln('Minifying...');
            grunt.config.set('minifyAppCSS.' + appName + '.options', {
                appSetupFile: this.data.options.appSetupFile,
                dest: this.data.options.dest
            });
            grunt.task.run('minifyAppCSS');
        } else {
            if (!this.data) {
                grunt.log.writeln('this.data is undefined');
            }
            grunt.fail.fatal('Couldn\'t find options.');
        }

    });

    grunt.registerMultiTask('validateLocalizationJSON', 'Make sure localization files are actual JSON', function () {
        var startTime = new Date().getTime(),
            content,
            parsed,
            languageCode;
        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    // This is not fatal...
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                content = grunt.file.read(filepath);
                // Remove Oskari function call so we don't have to use eval...
                content = content.replace('Oskari.registerLocalization(', '');
                content = content.substring(0, content.lastIndexOf(');'));
                try {
                    parsed = JSON.parse(content);
                    languageCode = filepath.substring(filepath.lastIndexOf('/') + 1, filepath.lastIndexOf('.'));
                    if (languageCode !== parsed.lang) {
                        grunt.fail.fatal('Language code mismatch in ' + filepath + ':\nExpected ' + languageCode + ', found ' + parsed.lang + '.');
                    }
                } catch (err) {
                    grunt.fail.fatal(filepath + ': ' + err);
                }
            });
        });
    });

    grunt.registerMultiTask('beautifyJS', 'Clean up JS code style', function () {
        var startTime = new Date().getTime(),
            beautify = require('js-beautify'),
            beautifyOptions = {
                jslint_happy: true
            },
            contents;
        this.files.forEach(function (file) {
            file.src.filter(function (filepath) {
                if (!grunt.file.exists(filepath)) {
                    // This is not fatal...
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                grunt.log.writeln('Beautifying ' + filepath);
                // replace tabs with four spaces, beautify only does this for indentation
                contents = grunt.file.read(filepath).replace(/\t/g, '    ');
                grunt.file.write(filepath, beautify(contents, beautifyOptions));
                return true;
            });
        });
        grunt.log.writeln('Beautification took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds.');
    });

    grunt.registerTask('compileBundleCSS', 'Compile bundle SASS to CSS', function () {
        grunt.config.set(
            'sass.' + 'test' + '-bundles' + '.files', [{
                expand: true,
                cwd: '../bundles/',
                src: '**/*.scss',
                dest: '../resources/',
                rename: function (dest, src) {
                    return dest + src.replace('/scss/', '/css/');
                },
                ext: '.css'
            }]
        );
        grunt.task.run('sass');
    });

    grunt.registerMultiTask('minifyAppCSS', 'Concatenate and minify application css', function () {
        var done = this.async(),
            cssPacker = require('uglifycss'),
            parser = require('./parser.js'),
            fs = require('fs'),
            cssfiles = [],
            options = this.data.json.options,
            processedAppSetup = parser.getComponents(options.appSetupFile),
            i,
            pasFiles;

        grunt.log.writeln('Concatenating and minifying css');
        // internal minify CSS function
        this.minifyCSS = function (files, outputFile) {

            var value = '',
                j,
                content,
                packed;
            // read files to value
            grunt.log.writeln('Concatenating and minifying ' + files.length + ' files');
            for (j = 0; j < files.length; j += 1) {
                if (!fs.existsSync(files[j])) {
                    grunt.fail.fatal('Couldnt locate ' + files[j]);
                }
                content = fs.readFileSync(files[j], 'utf8');
                value = value + '\n' + content;
            }
            // minify value
            packed = cssPacker.processString(value);
            grunt.log.writeln('Writing packed CSS to ' + outputFile);

            // write value to outputfile
            fs.writeFile(outputFile, packed, function (err) {
                // ENOENT means the file did not exist, which is ok. Let's just create it.
                if (err && err.code !== 'ENOENT') {
                    grunt.fail.fatal('Error writing packed CSS: ' + err);
                }
                done();
            });
        };

        // gather css files from bundles' minifierAppSetups
        grunt.log.writeln('Getting files from processedAppSetups');
        for (i = 0; i < processedAppSetup.length; i += 1) {
            pasFiles = parser.getFilesForComponent(processedAppSetup[i], 'css');
            cssfiles = cssfiles.concat(pasFiles);
        }
        this.minifyCSS(cssfiles, options.dest + 'oskari.min.css');
    });

    grunt.registerMultiTask('modulizeAll', 'Convert all bundles to modules', function () {
        grunt.task.run('bundle2module:' + this.data);
    });

    grunt.registerMultiTask('minifyAll', 'Minify all modules', function () {
        var options = this.options(this.data);
        grunt.config.set('requirejs.' + this.target + '.options', options);
        grunt.task.run('requirejs:' + this.target);
    });

    grunt.registerTask('buildApp', 'Build App', function (applicationPaths, version, defaultIconDirectoryPath, copyResourcesToApplications) {
        grunt.log.writeln('Building Apps in ', applicationPaths);
        var i,
            ilen,
            applicationPath,
            buildsetupconfig,
            appsetupconfig,
            last,
            cwd,
            appName,
            APPSFOLDERNAME = 'applications',
            dest,
            options = this.options(),
            buildoptions,
            files,
            copyFiles,
            appNameSeparatorIndex,
            parentAppName;

        // use grunt default options
        if (options.applicationPaths && !applicationPaths) {
            applicationPaths = options.applicationPaths;
        }
        if (!version) {
            var packagejson = grunt.file.readJSON('../package.json');
            version = packagejson.version;
        }
        if (options.defaultIconDirectoryPath && !defaultIconDirectoryPath) {
            defaultIconDirectoryPath = options.defaultIconDirectoryPath;
        }

        // set version in config for grunt templating
        grunt.config.set('version', version);

        // set multi task configs for compile and validate
        applicationPaths = applicationPaths.split(',');
        for (i = 0, ilen = applicationPaths.length; i < ilen; i += 1) {
            applicationPath = applicationPaths[i];
            buildsetupconfig = applicationPath + options.buildsetupconfigFileName;
            appsetupconfig = applicationPath + options.appsetupconfigFileName;
            last = (applicationPath.lastIndexOf('/'));
            cwd = applicationPath.substring(0, last);
            appName = applicationPath.substring(cwd.lastIndexOf('/') + 1, last);
            dest = '../dist/<%= version %>/' + appName + '/';
            options = {
                iconDirectoryPath: applicationPath.substring(0, last) + '/icons',
                resultImageName: '../dist/<%= version %>/' + appName + '/icons/icons.png',
                resultCSSName: '../dist/<%= version %>/' + appName + '/css/icons.css',
                spritePathInCSS: '../icons',
                defaultIconDirectoryPath: defaultIconDirectoryPath
            };
            files = [];
            copyFiles = {
                expand: true,
                cwd: cwd + '/',
                src: ['css/**', 'images/**', '*.js'],
                dest: dest
            };

            // subsets have underscore (_) in appName, which means we need to
            // get the parent resources first and then replace with subset specific stuff
            appNameSeparatorIndex = appName.indexOf('_');
            if (appNameSeparatorIndex > 0) {
                parentAppName = appName.substring(0, appNameSeparatorIndex);
                // copy files from parent folder to be replaced by child
                files.push({
                    expand: true,
                    cwd: cwd.replace(appName, parentAppName) + '/',
                    src: ['css/**', 'images/**', '*.js'],
                    dest: dest
                });
                // modify css-sprite to use parent icons instead
                options.iconDirectoryPath = options.iconDirectoryPath.replace(appName, parentAppName);
            }

            // add files to be copied
            files.push(copyFiles);

            // setting task configs
            grunt.config.set('copy.' + appName + '.files', files);
            grunt.config.set('compileAppCSS.' + appName + '.options', {
                appSetupFile: appsetupconfig,
                dest: dest
            });
            grunt.config.set('sprite.' + appName + '.options', options);

            buildoptions = grunt.file.readJSON(buildsetupconfig);
            buildoptions.out = '../dist/' + version + '/' + appName + '/oskari.min.js';
            grunt.config.set('requirejs.' + appName + '.options', buildoptions);
        }

        // add resources to dist
        grunt.config.set('copy.common.files', [{
            expand: true,
            cwd: '../',
            src: ['resources/**', 'libraries/**', 'bundles/**', 'packages/**', 'src/**', 'applications/**', 'sources/**'],
            dest: '../dist/'
        }]);

        // configure copy-task to copy back the results from dist/css and dist/icons to applications/appname/(css || icons)
        if (copyResourcesToApplications) {
            var copyApps = Object.keys(grunt.config.get('copy')),
                finalFiles = [];

            for (i = 0, ilen = copyApps.length; i < ilen; i += 1) {
                appName = copyApps[i];

                // skip common copy task, the rest should be real apps that are copied
                if ('common' !== appName) {
                    copyFiles = grunt.config.get('copy.' + copyApps[i] + '.files')[0];
                    finalFiles.push({
                        expand: true,
                        cwd: copyFiles.dest,
                        src: ['css/**', 'icons/**'],
                        dest: copyFiles.cwd
                    });
                }
                // only run the given copy tasks
                grunt.task.run('copy:' + copyApps[i]);
            }

            // add final copy settings to be run after compilation
            grunt.config.set('copy.final.files', finalFiles);
        } else {
            grunt.task.run('copy');
        }

        grunt.task.run('compileAppCSS');
        grunt.task.run('requirejs');
        grunt.task.run('sprite');

        if (copyResourcesToApplications) {
            grunt.task.run('copy:final');
        }
    });
};
