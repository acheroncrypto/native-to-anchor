### Running tests

- **IMPORTANT:** Make sure all programs that are in tests are deployed in your local validator and they are up-to date.
- Make sure to update program ids in `src/constants.ts` if needed.
- Install dependencies with:

```sh
yarn
```

**Run:**

```sh
yarn test
```

**NOTE:** Tests are for whether we are successfully able to call programs with Anchor and fetch state, and not for whether program logic works as intended.
