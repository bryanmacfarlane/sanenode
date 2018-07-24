# Hello Service API Sample Notes

## Dependencies and Dev Tools

Container (recommended):
For a consistent dev environment, you can start the dev container.

```bash
$ ./dev
ensuring docker
/usr/local/bin/docker
starting dev shell
root@sanenode-dev:/sanenode#
```

Or use host OS:
Install [node and npm](https://nodejs.org) >= 8.11.2 LTS

## Dev Lifecycle

Install packages: `npm install`  
Build: `npm run build`  
Unit tests: `npm run units`  
Run on Host: `npm run api`  
Docker Image: `npm run image`  
Container up: `npm run up`  
Container down: `npm run down`  

## Typings

How typings were created using @types

```bash
$ npm install @types/express --save
$ npm install @types/node --save
$ npm install @types/nedb --save
$ npm install @types/q --save
$ npm install @types/jsonwebtoken --save
$ npm install @types/cors --save

# test
$ npm install @types/mocha --save-dev
$ npm install @types/supertest --save-dev
$ npm install @types/superagent --save-dev
```
