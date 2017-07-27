# docker build -t bryanmacfarlane/sanenode-api .
# docker run -p 7770:7770 -it bryanmacfarlane/sanenode-api
# docker run -it bryanmacfarlane/sanenode-api bash

# https://hub.docker.com/_/ubuntu/
FROM ubuntu:xenial

RUN apt-get update

RUN apt-get install -y --no-install-recommends apt-utils

RUN apt-get update

RUN apt-get install -y --no-install-recommends --fix-missing curl \
    apt-transport-https \
    ca-certificates \
	sudo

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

COPY . /sanenode

WORKDIR /sanenode/api

EXPOSE 7770

CMD [ "npm", "start" ]