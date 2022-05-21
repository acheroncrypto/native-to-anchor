# Native Solana To Anchor IDL

Autogenerate [Anchor](https://docs.rs/anchor-lang/latest/anchor_lang/) IDL from programs written in Native [Solana](https://solana.com).

## Disclaimer

The instructions must follow strict set of rules in order for the autogeneration to work.

For example: `InitializeAccount` instruction requires `initialize_account` function. The program will panic in the case of a mismatch.
This is especially the case with [Serum](https://github.com/project-serum/serum-dex/blob/master/dex/src/instruction.rs) and [Mango](https://github.com/blockworks-foundation/mango-v3/blob/main/program/src/instruction.rs).

## How to generate?

1. Clone the repo:

```sh
git clone https://github.com/acheroncrypto/native-to-anchor.git
cd native-to-anchor
```

2. Put instructions file inside `instructions/` directory.
3. Run the program.

```
cargo run
```

- Anchor dummy programs will be generated in `anchor/`.
- IDLs will be generated in `idl/`.

## License

Licensed under [MIT](https://github.com/acheroncrypto/native-to-anchor/blob/master/LICENSE).
