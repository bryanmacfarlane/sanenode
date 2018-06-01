#/bin/bash

set -e

function failed()
{
   echo "error: $1" >&2
   exit 1
}

echo 'ensuring docker'
which docker || failed "docker not in path"

echo 'starting dev shell'
docker run -it -h sanenode-dev -p 7770:7770 -v $(pwd):/sanenode -v /var/run/docker.sock:/var/run/docker.sock -w /sanenode -it bryanmacfarlane/sanenode-dev bash
