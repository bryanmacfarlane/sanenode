# docker build -t bryanmacfarlane/sanenode-api .
#
# run:
# docker run -p 7770:7770 -d bryanmacfarlane/sanenode-api
#
# docker create -p 7770:7770 bryanmacfarlane/sanenode-api
# docker container ls -all
# docker start <id>
# docker stop <id>
# docker rm <id>

FROM node:8.11.2-slim

COPY . /sanenode

WORKDIR /sanenode/api

EXPOSE 7770

CMD [ "npm", "start" ]