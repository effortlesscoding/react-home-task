# How to run

Well, you could install `ts-node` and run src/index.ts directly. This is sufficient in dev environment, to be honest.

However, you can also run:

1. `nvm use` to use the recommended node version
2. `npm run build`
3. `npm start`

This will build the `src/*` and generate a `dist/*` folder with vanilla JS you can run with node directly (that's what `npm start` does).
