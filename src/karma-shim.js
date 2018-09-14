if (!Object.hasOwnProperty('name')) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            var matches = this.toString().match(/^\s*function\s*(\S*)\s*\(/);
            var name = matches && matches.length > 1 ? matches[1] : "";
            Object.defineProperty(this, 'name', { value: name });
            return name;
        }
    });
}

Error.stackTraceLimit = Infinity;

require('core-js/client/shim');
require('reflect-metadata');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

__karma__.loaded = function () {
};

System.config({
    baseURL: '/base/'
});

System.config({
    defaultJSExtensions: true,
    packageConfigPaths: [
        '/node_modules/*/package.json',
        '/node_modules/**/package.json',
        '/node_modules/@angular/*/package.json'
    ],
    map: {
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
        '@angular/core/testing': 'node_modules/@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'node_modules/@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'node_modules/@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'node_modules/@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'node_modules/@angular/forms/bundles/forms-testing.umd.js',
    },
    packages: {
        '@angular/common': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/common/testing': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/compiler/testing': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/core': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/core/testing': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser/testing': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic/testing': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'rxjs': {
            defaultExtension: 'js'
        }
    }
});

Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {
    var testing = providers[0];
    var testingBrowser = providers[1];

    testing.TestBed.initTestEnvironment(
        testingBrowser.BrowserDynamicTestingModule,
        testingBrowser.platformBrowserDynamicTesting()
    );
}).then(function () {
    return Promise.all(
        Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(file2moduleName)
            .map(function (path) {
                return System.import(path).then(function (module) {
                    if (module.hasOwnProperty('main')) {
                        module.main();
                    } else {
                        throw new Error('Module ' + path + ' does not implement main() method.');
                    }
                });
            }));
})
    .then(function () {
        __karma__.start();
    }, function (error) {
        console.error(error.stack || error);
        __karma__.start();
    });

function onlySpecFiles(path) {
    // check for individual files, if not given, always matches to all
    var patternMatched = __karma__.config.files ?
        path.match(new RegExp(__karma__.config.files)) : true;

    return patternMatched && /[\.|_]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
    return filePath.replace(/\\/g, '/')
        .replace(/^\/base\//, '')
        .replace(/\.js$/, '');
}
const appContext = require.context('./src', true, /\.spec\.ts/);

// get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here
appContext.keys().forEach(appContext);

// Select BrowserDomAdapter.
// see https://github.com/AngularClass/angular2-webpack-starter/issues/124
// Somewhere in the test setup
const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
