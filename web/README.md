# Hello Service Web UI Sample Notes

## Dependencies and Dev Tools

Install [node and npm](https://nodejs.org) >= 6.9.2 LTS

## Build

From api folder ...

once or if new dependencies added / updated:

```bash
$ typings install
$ npm install
```

every time:

```bash
$ npm run build
```

## Run

From the api folder:

```bash
$ npm run quotesweb
```

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
