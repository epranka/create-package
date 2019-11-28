<h1 align="center" style="border-bottom: none;">⚒️ @epranka/create-package</h1>

<h3 align="center">Ultimate starter kit for JS, JSX, TS, TSX module</h3>

<p align="center">
        <a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/badge/license-ISC-blue.svg" />
  </a>
   <a href="https://www.npmjs.com/package/@epranka/create-package">
    <img alt="npm version" src="https://img.shields.io/npm/v/@epranka/create-package.svg?style=flat" />
  </a> <a href="https://www.npmjs.com/package/@epranka/create-package">
    <img alt="npm downloads" src="https://img.shields.io/npm/dt/@epranka/create-package.svg?style=flat" />
  </a> <a href="https://travis-ci.org/epranka/create-package">
      <img alt="build status" src="https://travis-ci.org/epranka/create-package.svg?branch=master" />
    </a> <a href="https://travis-ci.org/epranka/create-package">
      <img alt="ci travis" src="https://img.shields.io/badge/ci-travis-yellow" />
    </a> <a href="https://github.com/semantic-release/semantic-release">
      <img alt="semantic release" src="https://img.shields.io/badge/%E2%9C%A8-semantic--release-e10079" />
    </a> 
</p>

## Features

- Interactive package creation
- Choices of JS, JSX, TS, TSX
- Silent mode
- Package manager selection (yarn or npm)
- Choices of ES, CJS, UMD modules and all together
- RollUp bundler
- Linting
- Tests
- Semantic Release
- README template with badges
- Continuous integration: Travis
- License selection (ISC, MIT, UNLICENSED)

## Create package

To create package once, package runner is recommended

```bash
$ npx @epranka/create-package my-package

# or

$ yarn create @epranka/package my-package
```

If you want to create packages later, install and use this package as follows

```bash
$ npm install -g @epranka/create-package

# or

$ yarn global add @epranka/create-package

# and then use

$ create-package my-package

```

You will be asked some questions about package

```
@epranka/create-package
✨ Generating package in my-package
? Package name my-package
? Package description My cat's meow package
? Package type React Typescript (TSX)
? Full name of package author Edvinas Pranka
? Email of package author (public) epranka@gmail.com
? Select license ISC
? Choose the package manager Yarn
? Build to UMD module for browsers (CommonJS is default) ? No
? Build to ES Module ? Yes
? Use unit tests ? Yes
? Use automatic semantic releases ? Yes
? Use Travis ? Yes
? Repository URL https://github.com/epranka/create-package
```

If automated semantic releases are selected, package generation will take longer and you will be prompted for semantic release options

When your package are generated your entry point is in `./src/` directory. If _Use unit tests_ are selected, tests can be found in `./__tests__` directory

In your package root directory you can run following commands

To build package

```
  $ yarn build    // or npm run build
```

To watch changes and build

```
  $ yarn watch    // or npm run watch
```

To lint package

```
  $ yarn lint     // or npm run lint
```

If _Use unit tests_ are selected, test package

```
  $ yarn test     // npm run test
```

## CLI Help

```
@epranka/create-package

Usage:
  $ create-package [out-dir]

Commands:
  [out-dir]  Generate in a <out-dir> or current directory

For more info, run any command with the `--help` flag:
  $ create-package --help

Options:
  -i, --info                     Print out debugging information relating to the local environment
  -s, --silent                   Silent mode. Create package without user interaction
  --name <name>                  Name of the package
  --description <name>           Description of the package
  --author <fullname>            Author of package <fullname>
  --email <email>                <email> of author
  --npm                          Use NPM package manager. Default is YARN
  --mit                          MIT license. Default is ISC
  --umd <GlobalName>             Build UMD module with <GlobalName>
  --type <ts|tsx|js|jsx>         Type of package, one of TS, TSX, JS, JSX. Default is TS
  --unlicensed                   Unlicensed. This option overrides --mit option
  --travis                       Use Travis ci
  --semantic-release             Use semantic release
  --no-private                   No private:true property in package.json (default: true)
  --no-es                        Don't build ES Module (default: true)
  --no-tests                     Don't use tests (default: true)
  --skip-semantic-release-setup  Skip semantic release setup
  --verbose                      Show debug logs
  -h, --help                     Display this message
  -v, --version                  Display version number

```

## JS package structure

Created **JS** package will have following structure (if Use tests, Semantic Release and Travis is selected)

```
my-package
├── src
│   └── index.js        // your entry point
├── __tests__
│   └── index.spec.js   // tests goes here
├── node_modules
├── babel.config.js
├── .eslintrc
├── .gitignore
├── jest.config.js
├── LICENSE
├── package.json
├── README.md
├── .releaserc
├── rollup.config.js
└── .travis.yml
```

## JSX package structure

Created **JSX** package will have following structure (if Use tests, Semantic Release and Travis is selected)

```
my-package
├── src
│   └── index.jsx         // your entry point
├── __tests__
│   └── index.spec.jsx    //  tests goes here
├── node_modules
├── babel.config.js
├── .eslintrc
├── .gitignore
├── jest.config.js
├── LICENSE
├── package.json
├── README.md
├── .releaserc
├── rollup.config.js
└── .travis.yml
```

## TS package structure

Created **TS** package will have following structure (if Use tests, Semantic Release and Travis is selected)

```
my-package
├── src
│   └── index.ts          // your entry point
├── __tests__
│   └── index.spec.ts     // tests goes here
├── node_modules
├── babel.config.js
├── .gitignore
├── jest.config.js
├── LICENSE
├── package.json
├── README.md
├── .releaserc
├── rollup.config.js
├── .travis.yml
├── tsconfig.json
└── tslint.json
```

## TSX package structure

Created **TSX** package will have following structure (if Use tests, Semantic Release and Travis is selected)

```
my-package
├── src
│   └── index.tsx          // your entry point
├── __tests__
│   └── index.spec.tsx     // tests goes here
├── node_modules
├── babel.config.js
├── .gitignore
├── jest.config.js
├── LICENSE
├── package.json
├── README.md
├── .releaserc
├── rollup.config.js
├── .travis.yml
├── tsconfig.json
└── tslint.json
```

## Badge

Let people know that your package is generated using **@epranka/create-package** by including this badge in your readme

<a href="https://github.com/epranka/create-package">
  <img alt="generated with" src="https://img.shields.io/badge/generated%20with-%40epranka%2Fcreate--package-blue" />
</a>

Using Markdown

```
[![generated with @epranka/create-package](https://img.shields.io/badge/generated%20with-%40epranka%2Fcreate--package-blue)](https://github.com/epranka/create-package)
```

Using HTML

```
<a href="https://github.com/epranka/create-package">
  <img alt="generated with" src="https://img.shields.io/badge/generated%20with-%40epranka%2Fcreate--package-blue" />
</a>
```

## Author

Edvinas pranka ([epranka@gmail.com](mailto:epranka@gmail.com))

Follow on Twitter [@epranka](https://twitter.com/epranka)

https://www.kodmina.lt

## License

ISC License

Copyright (c) 2019, Edvinas Pranka (epranka@gmail.com)

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
