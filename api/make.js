require('shelljs/make');
var path = require('path');
var fs = require('fs');

var rp = function(relPath) {
    return path.join(__dirname, relPath);
}

var buildPath = path.join(__dirname, '_build');
var apiBuildPath = path.join(buildPath, 'api');

var run = function(cl) {
    console.log('> ' + cl);
    var rc = exec(cl).code;
    if (rc !== 0) {
        echo('Exec failed with rc ' + rc);
        exit(rc);
    }
}

target.clean = function() {
    rm('-Rf', buildPath);
};

target.build = function(dev) {
    target.clean();

    run('tsc --version');
    run('tsc --outDir ' + buildPath);
    cp(rp('package.json'), apiBuildPath);
    cp(rp('config.json'), apiBuildPath);
    cp('-R', rp('sampledata'), apiBuildPath);
    cp('-R', rp('bin'), apiBuildPath);
    cp(rp('Dockerfile'), buildPath);

    // dev should use node_modules with all dev dependencies
    // prod build should just pull prod dependencies (not dev)
    if (dev) {
        cp('-R', rp('node_modules'), apiBuildPath);        
    }
    else {
        rm(path.join(apiBuildPath, 'tests.js'));
        pushd(apiBuildPath);
        run('npm install --production');
        popd();
    }
}

target.test = function() {
    target.build(true); //dev deps

    pushd(apiBuildPath);
    run('mocha ' + path.join(process.cwd(), 'tests.js'));
    popd();
}

target.buildImage = function() {
    target.build(); // prod

    pushd('_build');
    run('docker build -t bryanmacfarlane/sanenode-api .');
    popd();
}
