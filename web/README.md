# Hello Service Web UI Sample Notes

## Dependencies and Dev Tools

Install [node and npm](https://nodejs.org) >= 6.9.2 LTS

Install [typescript](https://www.typescriptlang.org/) compiler and [typings](https://www.npmjs.com/package/typings#) clis globally

```bash
sudo npm install typings -g
```

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
