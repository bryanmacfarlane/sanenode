#-----------------------------------------------------------------------
# Dev image used to build and run unit tests 
# * consistent developer toolsets
# * dev == CI
#-----------------------------------------------------------------------
# docker build -t bryanmacfarlane/sanenode-dev .
# docker run -it -h sanenode-dev -p 7770:7770 -v $(pwd):/sanenode -v /var/run/docker.sock:/var/run/docker.sock -w /sanenode -it bryanmacfarlane/sanenode-dev bash

FROM debian:stretch-slim

RUN apt-get update

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get install -y --no-install-recommends \
	ca-certificates \
    curl \
    dnsutils \
    file \
    ftp \
    iproute2 \
    iputils-ping \
    locales \
	lsb-release \
    sudo \
    time \
    unzip \
    wget \
    zip \
 && rm -rf /var/lib/apt/lists/*


# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# install docker cli
# RUN curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-18.03.1-ce.tgz && tar --strip-components=1 -xvzf docker-18.03.1-ce.tgz -C /usr/local/bin

RUN curl -L https://git.io/n-install | bash -s -- -y 8

#-------------------------------------------------------------------------------------
# install node using nvm
# https://semaphoreci.com/community/tutorials/dockerizing-a-node-js-web-application
#-------------------------------------------------------------------------------------
# ENV NVM_DIR /usr/local/nvm
# ENV NODE_VERSION 8.11.2
# RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash \
#     && source $NVM_DIR/nvm.sh \
#     && nvm install $NODE_VERSION \
#     && nvm alias default $NODE_VERSION \
#     && nvm use default

# ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
# ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH


