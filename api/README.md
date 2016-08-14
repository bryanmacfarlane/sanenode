# Hello Service API Sample Notes

## Dependencies and Dev Tools

Install [node and npm](https://nodejs.org) >= 4.4

Install [typescript](https://www.typescriptlang.org/) compiler and [typings](http://definitelytyped.org) clis globally

```bash
sudo npm install tsc -g
sudo npm install typings -g
```

Install node modules used by the api

```bash
$ npm install
```

## Build

once:

```bash
$ typings install
```

From the api folder:

```bash
$ tsc
```

## Run

From the api folder:

```bash
$ npm start run
```

## Test

From the api folder:

```bash
$ npm test
```

## Typings

How typings were created.

```bash
# this created a typings.json file
$ typings init

# express and it's dependencies
# had to install it's dependencies as well
$ typings install dt~express --global --save
$ typings install dt~express-serve-static-core --global --save
$ typings install dt~serve-static --global --save
$ typings install dt~body-parser --global --save
$ typings install dt~cookie-parser --global --save
$ typings install dt~mime --global --save
$ typings install dt~node --global --save
$ typings install dt~nedb --global --save
$ typings install dt~q --global --save
$ typings install dt~jsonwebtoken --global --save
$ typings install dt~cors --global --save

# test
$ typings install dt~mocha --global --save
$ typings install dt~supertest --global --save
$ typings install dt~superagent --global --save
```
