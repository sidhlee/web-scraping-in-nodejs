# Web Scraping in Nodejs & JavaScript

Code-along repo for the Udemy course: [Web Scraping in Nodejs & JavaScript](https://www.udemy.com/course/web-scraping-in-nodejs/)

## Alterations

TypeScript, Eslint and Prettier along with others are added to the dev environment referencing:

- [Node.js (Express) with TypeScript, Eslint, Jest, Prettier and Husky](Node.js (Express) with TypeScript, Eslint, Jest, Prettier and Husky)

  - Airbnb rules were not added because I thought they were too restricting.
  - Also, Husky is not used because I am using auto-format on save. Also used `eslint-plugin-prettier` & `eslint-config-prettier` to draw formatting rules from prettier.
  - Jest is not set up because I feel like I need more understanding of testing (with Kent C. Dodds course). Also I wanted to focus more on the web-scraping topic.

## Jest with Typescript and Node

Jest supports TypeScript via Babel.
Note that jest will not type-check the tests as they are run. You can use `ts-test` instead if you want that behavior.

```bash
npm i -D babel-jest @babel/core @babel/preset-env @babel/preset-typescript
```

```js
// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
}
```

`package.json`

```json
{
  ...
  "scripts" : {
    "test": "env-cmd -f ./config/dev.env jest --watchAll",
    "build": "tsc",
    "start": "env-cmd -f ./config/dev.env nodemon"
  },
  ...
}
```
