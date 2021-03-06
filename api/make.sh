#!/usr/bin/env bash
set -e

# ensure dependencies
function failed()
{
   echo "error: $1" >&2
   exit 1
}

which docker || failed "docker not in path"
which kubectl || failed "kubectl not in path"
which gomplate || failed "gomplate not in path"

ARGS=("$@")

SRC_PATH=`dirname "$0"`
BUILD_PATH="${SRC_PATH}/_build"
API_BUILD_PATH="${BUILD_PATH}/api"
MOD_BIN="$SRC_PATH/node_modules/.bin"
IMAGE_NAME="bryanmacfarlane/sanenode-api"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

function clean() {
    rm -Rf "${BUILD_PATH}"
}

function build() {
    echo "building [${PACKAGE_VERSION}]"
    clean
    mkdir -p ${API_BUILD_PATH}
    "${MOD_BIN}/tsc" --outDir "${BUILD_PATH}"
    cp package.json "${API_BUILD_PATH}"
    cp config.json "${API_BUILD_PATH}"
    cp Dockerfile "${API_BUILD_PATH}"
    cp -R sampledata "${API_BUILD_PATH}"
    cp -R bin "${API_BUILD_PATH}"
    cp -R node_modules "${API_BUILD_PATH}"

    if [ "$1" = true ]; then
        rm "${API_BUILD_PATH}/tests.js"
        pushd "${API_BUILD_PATH}" > /dev/null
        npm prune --production
        popd
    fi
}

function run() {
    pushd "${API_BUILD_PATH}"
    npm start
    popd
}

function units() { 
    build
    pushd "${API_BUILD_PATH}"
    "${MOD_BIN}/mocha" tests.js
    popd
}

function image() {
    build true #prod
    pushd "${API_BUILD_PATH}" > /dev/null
    docker build -t bryanmacfarlane/sanenode-api:latest -t "bryanmacfarlane/sanenode-api:${PACKAGE_VERSION}" .
    popd
}

function up() {
    docker run --cidfile ./cid  -p 7770:7770 -d "bryanmacfarlane/sanenode-api:${PACKAGE_VERSION}"
}

function down() {
    if [ -f ./cid ]; then
        CID=`cat ./cid`
        docker stop $CID
        docker rm $CID
        rm ./cid
    fi
}

function kubeApply() {
    export imageTag="${1:-latest}"

    echo "deploying ${IMAGE_NAME}:${imageTag}"
    echo "templatizing deployment files..."
    gomplate -f ./deploy/deployment-templ.yaml -o ./deploy/deployment.yaml
    gomplate -f ./deploy/service-templ.yaml -o ./deploy/service.yaml

    kubectl apply -f ./deploy/deployment.yaml
    kubectl apply -f ./deploy/service.yaml
}

function test() {
    kubeApply

}

function deploy() {
    kubeApply "${PACKAGE_VERSION}"

}

 "$@"