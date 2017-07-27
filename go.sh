
ACTION=$1

if [ "${ACTION}" = "dev" ]; then
    docker run -it -h sanenode-dev -p 7770:7770 -v $(pwd):/sanenode -w /sanenode -it bryanmacfarlane/sanenode-dev bash
fi;

if [ "${ACTION}" = "api" ]; then
    docker run -p 7770:7770 -it bryanmacfarlane/sanenode-api
fi;