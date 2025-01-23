# JavaScript API

This project is a monorepo for various NPM packages scoped under `@fastnear/`.

[Yarn](https://yarnpkg.com/getting-started/install) is used in this repo, and it's likely not the yarn commonly installed. You must run:

    yarn set version berry

## Using this repo

    yarn build

Will go through all the workspaces packages (see `workspaces` key in `package.json`) and build them for ECMAScript, CommonJS, and a Universal Module Definition. This is achieved using [`esbuild`](https://esbuild.github.io).

Each workspace package (NPM module) has an `esbuild.config.mjs` file that's used to take the TypeScript files in the `src` directory and compile them to:

### 1. ESM (EcmaScript)

The modern JavaScript module system, primarily used for browser and server environments, and the default for most new packages.

### 2. CJS (CommonJS)

The older module system for NodeJS, ensuring backwards compatibility.

### 3. UMD (Universal Module Definition)

A universal module format that works in browsers (with or without a bundler) and in NodeJS, bridging the gap between different environments.

>Universal Module Definition (UMD) is a versatile module format that aims to provide compatibility across different environments, including both browsers and server-side applications. Unlike purely browser-centric solutions like AMD or server-specific formats like CommonJS, UMD offers a unified approach. It checks the environment and adapts accordingly, making it suitable for various scenarios without requiring major adjustments.
[source](https://www.devzery.com/post/your-guide-to-universal-module-definition)

## Contributing

All workspace packages publish a new version regardless of whether the package was modified.

Each package's `dist` folder is revisioned, so make sure to run build. Not intending to focus much on CI. 

## Bump the version

In the project root, open `package.json` and change the version that should be reflected in all packages.

    yarn constraints

The file `yarn.config.cjs` defines a Yarn constraint that takes the root manifest and updates all the workspace package versions based on that.

## Publish to NPM

OTP is required and can be input into the command:

    yarn workspaces foreach --all -ptv run publish --access public --tolerate-republish --otp 

## IN PROGRESS

### Rollup

The `rollup` solution is partway done. This allows us to expose helpful information to developers, including for static <script> imports. It's possible we don't need it if esbuild seems to be doing it? just realizing. gotta survey and decide, task-force style

### `wallet-adapter-widget`

This package seems close to building, but left out to get this repo up for others to see and work on.

### Survey examples directory

Put attention there, could have unaddressed issues
