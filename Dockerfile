#-----------------------------------------------------------------------
# Dev image used to build and run unit tests 
# * consistent developer toolsets
# * dev == CI
#-----------------------------------------------------------------------
# docker build -t bryanmacfarlane/sanenode-dev .
# docker run -it -h sanenode-dev -p 7770:7770 -v $(pwd):/sanenode -it bryanmacfarlane/sanenode-dev bash

# https://hub.docker.com/_/ubuntu/
FROM ubuntu:xenial

RUN apt-get update

RUN apt-get install -y --no-install-recommends apt-utils

#-----------------------------------------------------------------------
# Dev image may have dev tools, SDKs, etc... that a prod image
# would not have
#-----------------------------------------------------------------------
RUN apt-get install -y --no-install-recommends \
	apt-transport-https \
	build-essential \
	ca-certificates \
	curl \
	g++ \
	gcc \
	git \
	make \
	nginx \
	sudo \
	wget

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

#-------------------------------------------------------------------------------------
# install node using nvm
# https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application
#-------------------------------------------------------------------------------------
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.11.0
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
