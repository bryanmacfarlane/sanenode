# Hello Service API Sample Notes

## Dependencies and Dev Tools

Install [node and npm](https://nodejs.org) >= 6.9.2 LTS

## Dev Shell

Develop in a consistent dev container.  From root of repo

```bash
$ ./dev
```

change to api

```bash
cd api
```

type alias to see convenient aliases

```bash
root@sanenode-dev:/sanenode# alias
alias napi='npm run api'
alias nb='npm run build'
alias ni='npm install'
alias nim='npm run image'
alias nt='npm test'
```

# Install Dependencies

once or dependencies updated.  from api

```bash
$ ni
```

## Build

from api

```bash
$ nb
```

## Run

from api

```bash
$ napi
```

## Test

From the api folder:

```bash
$ nt
```

## Create Image

From the api folder:

```bash
$ nim
```

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
