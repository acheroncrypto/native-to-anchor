## Client generation example

This example will demonstrate how we can generate an Anchor Client for a Native program and use it in Javascript.

### Requirements

- Rust
- Solana
- Yarn or NPM
- Native to Anchor

Make sure you've installed the required programs before continuing with the tutorial.

### Preperation

We have a simple program written in the `program` folder. We will be using this program for simplicity but you can choose to replace it with another program.

Program TL;DR is that it only has one instruction which is `InitializeAccount`. It expects an account owned by the current program and it will write the input data to the given account.

Let's build and deploy the program:

```sh
# in the program directory
cargo build-bpf

# get the program id
solana address -k target/deploy/nta_example-keypair.json

# change the program id in src/lib.rs with the output program id

# re-build
cargo build-bpf
# deploy with the output command
# solana program deploy ...
```

Now that the program is deployed on-chain we can test it!

### Generate client

Run:

```sh
# in the program directory
native-to-anchor package .
```

`.` here is the path to the program that we are generating from. Since we are in the program folder it's `.`. This will generate a folder called `generated` in our current directory, install dependencies and build the package we can import to our project.

You can choose to import this package to your project with the output command but we already have `tests` in this repository. To generate the client in the `client/packages/` directory, simply run:

```sh
# `-o` specifies the output directory for the generated package
native-to-anchor package . -o ../../client/packages/
```

**TIP:** You can add `-y` flag to the `package` command to use a prebuilt lock file for faster initialization.

That's it, we can now test our program!

### Testing

In `client/tests/src/example/nta-example.ts` we have a boilerplate testing code ready for us. Let's import the generated package.

```ts
import { ntaExampleProgram } from "@native-to-anchor/nta-example";
```

We can now get the program and setup tests:

```ts
async function ntaExampleTests() {
  const provider = await getProvider();
  const kp = await loadKp();
  const program = ntaExampleProgram({ provider });

  // This is the account we are going to create
  let accountPk: PublicKey;

  async function initializeAccount() {}

  async function fetchNtaExampleAccount() {}

  await test(initializeAccount);
  await test(fetchNtaExampleAccount);
}
```

Let's run the tests to see if we got the setup correctly before continuing.

Add the test function to `src/index.ts`

```ts
// ...
import { ntaExampleTests } from "./example";

mainTest(async () => {
  await programTest(ntaExampleTests);
  // ...
});
```

Run tests:

```sh
# in the `client/tests` directory
yarn test
```

You should see `All tests passed.(2)` as the last output if the setup was done correctly. If not please check the steps again.

Now let's add the actual test logic for `initializeAccount` in `src/example/nta-example.ts`:

```ts
async function initializeAccount() {
  const ntaAccountKp = new Keypair();
  accountPk = ntaAccountKp.publicKey;

  const txHash = await program.methods
    .initializeAccount({
      authority: kp.publicKey,
      favoriteByte: 42,
      favoriteBigNumber: new BN(837976),
    })
    .accounts({
      authority: kp.publicKey,
      ntaAccount: accountPk,
    })
    .preInstructions([
      await program.account.ntaExampleAccount.createInstruction(ntaAccountKp),
    ])
    .signers([ntaAccountKp])
    .rpc();

  await confirmTx(txHash);
}
```

You should get typescript autocomplete support when writing this function just like you would an Anchor program! We are creating the account in `preInstructions` and sending both instructions together.

Let's check if the account was created correctly:

```ts
async function fetchNtaExampleAccount() {
  const account = await program.account.ntaExampleAccount.fetch(accountPk);
  assert(account.data.authority.equals(kp.publicKey));
  assert(account.data.favoriteByte === 42);
  assert(account.data.favoriteBigNumber.eq(new BN(837976)));
}
```

We are using the same values at two different places. Let's make them constant so we only need to manage in one place.

Full code:

```ts
import assert from "assert";
import { ntaExampleProgram } from "@native-to-anchor/nta-example";
import { BN } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";

import { getProvider, loadKp, test, confirmTx } from "../utils";

export async function ntaExampleTests() {
  const provider = await getProvider();
  const kp = await loadKp();
  const program = ntaExampleProgram({ provider });

  let accountPk: PublicKey;

  const AUTHORITY = kp.publicKey;
  const FAVORITE_BYTE = 42;
  const FAVORITE_BIG_NUMBER = new BN(837976);

  async function initializeAccount() {
    const ntaAccountKp = new Keypair();
    accountPk = ntaAccountKp.publicKey;

    const txHash = await program.methods
      .initializeAccount({
        authority: AUTHORITY,
        favoriteByte: FAVORITE_BYTE,
        favoriteBigNumber: FAVORITE_BIG_NUMBER,
      })
      .accounts({
        authority: AUTHORITY,
        ntaAccount: accountPk,
      })
      .preInstructions([
        await program.account.ntaExampleAccount.createInstruction(ntaAccountKp),
      ])
      .signers([ntaAccountKp])
      .rpc();

    await confirmTx(txHash);
  }

  async function fetchNtaExampleAccount() {
    const account = await program.account.ntaExampleAccount.fetch(accountPk);
    assert(account.data.authority.equals(AUTHORITY));
    assert(account.data.favoriteByte === FAVORITE_BYTE);
    assert(account.data.favoriteBigNumber.eq(FAVORITE_BIG_NUMBER));
  }

  await test(initializeAccount);
  await test(fetchNtaExampleAccount);
}
```

Run tests:

```sh
yarn test
```

That's all! You can check out more complex examples in the repository and try creating your own clients.

**IMPORTANT:** The naming convention of instruction and it's signature functions is not a coincidence. Instruction names must follow `PascalCase` names and it's corresponding functions must be the exact `snake_case` version. Generator will warn you about this and you should make sure they match exactly before continuing with the process.
