// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
import { Idl, InstructionCoder } from "@project-serum/anchor";

export class MplTokenMetadataInstructionCoder implements InstructionCoder {
  constructor(_idl: Idl) {}

  encode(ixName: string, ix: any): Buffer {
    switch (ixName) {
      case "createMetadataAccounts": {
        return encodeCreateMetadataAccounts(ix);
      }
      case "updateMetadataAccounts": {
        return encodeUpdateMetadataAccounts(ix);
      }
      case "deprecatedCreateMasterEdition": {
        return encodeDeprecatedCreateMasterEdition(ix);
      }
      case "deprecatedMintNewEditionFromMasterEditionViaPrintingToken": {
        return encodeDeprecatedMintNewEditionFromMasterEditionViaPrintingToken(
          ix
        );
      }
      case "updatePrimarySaleHappenedViaToken": {
        return encodeUpdatePrimarySaleHappenedViaToken(ix);
      }
      case "deprecatedSetReservationList": {
        return encodeDeprecatedSetReservationList(ix);
      }
      case "deprecatedCreateReservationList": {
        return encodeDeprecatedCreateReservationList(ix);
      }
      case "signMetadata": {
        return encodeSignMetadata(ix);
      }
      case "deprecatedMintPrintingTokensViaToken": {
        return encodeDeprecatedMintPrintingTokensViaToken(ix);
      }
      case "deprecatedMintPrintingTokens": {
        return encodeDeprecatedMintPrintingTokens(ix);
      }
      case "createMasterEdition": {
        return encodeCreateMasterEdition(ix);
      }
      case "mintNewEditionFromMasterEditionViaToken": {
        return encodeMintNewEditionFromMasterEditionViaToken(ix);
      }
      case "convertMasterEditionV1ToV2": {
        return encodeConvertMasterEditionV1ToV2(ix);
      }
      case "mintEditionFromMasterEditionViaVaultProxy": {
        return encodeMintEditionFromMasterEditionViaVaultProxy(ix);
      }
      case "puffMetadataAccount": {
        return encodePuffMetadataAccount(ix);
      }
      case "updateMetadataAccountV2": {
        return encodeUpdateMetadataAccountV2(ix);
      }
      case "createMetadataAccountV2": {
        return encodeCreateMetadataAccountV2(ix);
      }
      case "createMasterEditionV3": {
        return encodeCreateMasterEditionV3(ix);
      }
      case "verifyCollection": {
        return encodeVerifyCollection(ix);
      }
      case "utilize": {
        return encodeUtilize(ix);
      }
      case "approveUseAuthority": {
        return encodeApproveUseAuthority(ix);
      }
      case "revokeUseAuthority": {
        return encodeRevokeUseAuthority(ix);
      }
      case "unverifyCollection": {
        return encodeUnverifyCollection(ix);
      }
      case "approveCollectionAuthority": {
        return encodeApproveCollectionAuthority(ix);
      }
      case "revokeCollectionAuthority": {
        return encodeRevokeCollectionAuthority(ix);
      }
      case "setAndVerifyCollection": {
        return encodeSetAndVerifyCollection(ix);
      }
      case "freezeDelegatedAccount": {
        return encodeFreezeDelegatedAccount(ix);
      }
      case "thawDelegatedAccount": {
        return encodeThawDelegatedAccount(ix);
      }
      case "removeCreatorVerification": {
        return encodeRemoveCreatorVerification(ix);
      }
      case "burnNft": {
        return encodeBurnNft(ix);
      }
      case "verifySizedCollectionItem": {
        return encodeVerifySizedCollectionItem(ix);
      }
      case "unverifySizedCollectionItem": {
        return encodeUnverifySizedCollectionItem(ix);
      }
      case "setAndVerifySizedCollectionItem": {
        return encodeSetAndVerifySizedCollectionItem(ix);
      }
      case "createMetadataAccountV3": {
        return encodeCreateMetadataAccountV3(ix);
      }
      case "setCollectionSize": {
        return encodeSetCollectionSize(ix);
      }
      case "setTokenStandard": {
        return encodeSetTokenStandard(ix);
      }

      default: {
        throw new Error(`Invalid instruction: ${ixName}`);
      }
    }
  }

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("MplTokenMetadata does not have state");
  }
}

function encodeCreateMetadataAccounts({ data, isMutable }: any): Buffer {
  return encodeData(
    { createMetadataAccounts: { data, isMutable } },
    1 +
      4 +
      data.name.length +
      4 +
      data.symbol.length +
      4 +
      data.uri.length +
      2 +
      1 +
      (data.creators === null ? 0 : 4 + data.creators.length * 34) +
      1
  );
}

function encodeUpdateMetadataAccounts({
  data,
  updateAuthority,
  primarySaleHappened,
}: any): Buffer {
  return encodeData(
    { updateMetadataAccounts: { data, updateAuthority, primarySaleHappened } },
    1 +
      1 +
      (data === null
        ? 0
        : 4 +
          data.name.length +
          4 +
          data.symbol.length +
          4 +
          data.uri.length +
          2 +
          1 +
          (data.creators === null ? 0 : 4 + data.creators.length * 34)) +
      1 +
      (updateAuthority === null ? 0 : 32) +
      1 +
      (primarySaleHappened === null ? 0 : 1)
  );
}

function encodeDeprecatedCreateMasterEdition({ maxSupply }: any): Buffer {
  return encodeData(
    { deprecatedCreateMasterEdition: { maxSupply } },
    1 + 1 + (maxSupply === null ? 0 : 8)
  );
}

function encodeDeprecatedMintNewEditionFromMasterEditionViaPrintingToken({}: any): Buffer {
  return encodeData(
    { deprecatedMintNewEditionFromMasterEditionViaPrintingToken: {} },
    1
  );
}

function encodeUpdatePrimarySaleHappenedViaToken({}: any): Buffer {
  return encodeData({ updatePrimarySaleHappenedViaToken: {} }, 1);
}

function encodeDeprecatedSetReservationList({ arg }: any): Buffer {
  return encodeData(
    { deprecatedSetReservationList: { arg } },
    1 +
      4 +
      arg.reservations.length * 48 +
      1 +
      (arg.totalReservationSpots === null ? 0 : 8) +
      8 +
      8
  );
}

function encodeDeprecatedCreateReservationList({}: any): Buffer {
  return encodeData({ deprecatedCreateReservationList: {} }, 1);
}

function encodeSignMetadata({}: any): Buffer {
  return encodeData({ signMetadata: {} }, 1);
}

function encodeDeprecatedMintPrintingTokensViaToken({ arg }: any): Buffer {
  return encodeData({ deprecatedMintPrintingTokensViaToken: { arg } }, 1 + 8);
}

function encodeDeprecatedMintPrintingTokens({ arg }: any): Buffer {
  return encodeData({ deprecatedMintPrintingTokens: { arg } }, 1 + 8);
}

function encodeCreateMasterEdition({ maxSupply }: any): Buffer {
  return encodeData(
    { createMasterEdition: { maxSupply } },
    1 + 1 + (maxSupply === null ? 0 : 8)
  );
}

function encodeMintNewEditionFromMasterEditionViaToken({
  edition,
}: any): Buffer {
  return encodeData(
    { mintNewEditionFromMasterEditionViaToken: { edition } },
    1 + 8
  );
}

function encodeConvertMasterEditionV1ToV2({}: any): Buffer {
  return encodeData({ convertMasterEditionV1ToV2: {} }, 1);
}

function encodeMintEditionFromMasterEditionViaVaultProxy({
  edition,
}: any): Buffer {
  return encodeData(
    { mintEditionFromMasterEditionViaVaultProxy: { edition } },
    1 + 8
  );
}

function encodePuffMetadataAccount({}: any): Buffer {
  return encodeData({ puffMetadataAccount: {} }, 1);
}

function encodeUpdateMetadataAccountV2({
  data,
  updateAuthority,
  primarySaleHappened,
  isMutable,
}: any): Buffer {
  return encodeData(
    {
      updateMetadataAccountV2: {
        data,
        updateAuthority,
        primarySaleHappened,
        isMutable,
      },
    },
    1 +
      1 +
      (data === null
        ? 0
        : 4 +
          data.name.length +
          4 +
          data.symbol.length +
          4 +
          data.uri.length +
          2 +
          1 +
          (data.creators === null ? 0 : 4 + data.creators.length * 34) +
          1 +
          (data.collection === null ? 0 : 33) +
          1 +
          (data.uses === null ? 0 : 17)) +
      1 +
      (updateAuthority === null ? 0 : 32) +
      1 +
      (primarySaleHappened === null ? 0 : 1) +
      1 +
      (isMutable === null ? 0 : 1)
  );
}

function encodeCreateMetadataAccountV2({ data, isMutable }: any): Buffer {
  return encodeData(
    { createMetadataAccountV2: { data, isMutable } },
    1 +
      4 +
      data.name.length +
      4 +
      data.symbol.length +
      4 +
      data.uri.length +
      2 +
      1 +
      (data.creators === null ? 0 : 4 + data.creators.length * 34) +
      1 +
      (data.collection === null ? 0 : 33) +
      1 +
      (data.uses === null ? 0 : 17) +
      1
  );
}

function encodeCreateMasterEditionV3({ maxSupply }: any): Buffer {
  return encodeData(
    { createMasterEditionV3: { maxSupply } },
    1 + 1 + (maxSupply === null ? 0 : 8)
  );
}

function encodeVerifyCollection({}: any): Buffer {
  return encodeData({ verifyCollection: {} }, 1);
}

function encodeUtilize({ numberOfUses }: any): Buffer {
  return encodeData({ utilize: { numberOfUses } }, 1 + 8);
}

function encodeApproveUseAuthority({ numberOfUses }: any): Buffer {
  return encodeData({ approveUseAuthority: { numberOfUses } }, 1 + 8);
}

function encodeRevokeUseAuthority({}: any): Buffer {
  return encodeData({ revokeUseAuthority: {} }, 1);
}

function encodeUnverifyCollection({}: any): Buffer {
  return encodeData({ unverifyCollection: {} }, 1);
}

function encodeApproveCollectionAuthority({}: any): Buffer {
  return encodeData({ approveCollectionAuthority: {} }, 1);
}

function encodeRevokeCollectionAuthority({}: any): Buffer {
  return encodeData({ revokeCollectionAuthority: {} }, 1);
}

function encodeSetAndVerifyCollection({}: any): Buffer {
  return encodeData({ setAndVerifyCollection: {} }, 1);
}

function encodeFreezeDelegatedAccount({}: any): Buffer {
  return encodeData({ freezeDelegatedAccount: {} }, 1);
}

function encodeThawDelegatedAccount({}: any): Buffer {
  return encodeData({ thawDelegatedAccount: {} }, 1);
}

function encodeRemoveCreatorVerification({}: any): Buffer {
  return encodeData({ removeCreatorVerification: {} }, 1);
}

function encodeBurnNft({}: any): Buffer {
  return encodeData({ burnNft: {} }, 1);
}

function encodeVerifySizedCollectionItem({}: any): Buffer {
  return encodeData({ verifySizedCollectionItem: {} }, 1);
}

function encodeUnverifySizedCollectionItem({}: any): Buffer {
  return encodeData({ unverifySizedCollectionItem: {} }, 1);
}

function encodeSetAndVerifySizedCollectionItem({}: any): Buffer {
  return encodeData({ setAndVerifySizedCollectionItem: {} }, 1);
}

function encodeCreateMetadataAccountV3({
  data,
  isMutable,
  collectionDetails,
}: any): Buffer {
  return encodeData(
    { createMetadataAccountV3: { data, isMutable, collectionDetails } },
    1 +
      4 +
      data.name.length +
      4 +
      data.symbol.length +
      4 +
      data.uri.length +
      2 +
      1 +
      (data.creators === null ? 0 : 4 + data.creators.length * 34) +
      1 +
      (data.collection === null ? 0 : 33) +
      1 +
      (data.uses === null ? 0 : 17) +
      1 +
      1 +
      (collectionDetails === null ? 0 : 9)
  );
}

function encodeSetCollectionSize({ size }: any): Buffer {
  return encodeData({ setCollectionSize: { size } }, 1 + 8);
}

function encodeSetTokenStandard({}: any): Buffer {
  return encodeData({ setTokenStandard: {} }, 1);
}

const LAYOUT = B.union(B.u8("instruction"));
LAYOUT.addVariant(
  0,
  B.struct([
    B.struct(
      [
        B.utf8Str("name"),
        B.utf8Str("symbol"),
        B.utf8Str("uri"),
        B.u16("sellerFeeBasisPoints"),
        B.option(
          B.vec(
            B.struct([
              B.publicKey("address"),
              B.bool("verified"),
              B.u8("share"),
            ])
          ),
          "creators"
        ),
      ],
      "data"
    ),
    B.bool("isMutable"),
  ]),
  "createMetadataAccounts"
);
LAYOUT.addVariant(
  1,
  B.struct([
    B.option(
      B.struct([
        B.utf8Str("name"),
        B.utf8Str("symbol"),
        B.utf8Str("uri"),
        B.u16("sellerFeeBasisPoints"),
        B.option(
          B.vec(
            B.struct([
              B.publicKey("address"),
              B.bool("verified"),
              B.u8("share"),
            ])
          ),
          "creators"
        ),
      ]),
      "data"
    ),
    B.option(B.publicKey(), "updateAuthority"),
    B.option(B.bool(), "primarySaleHappened"),
  ]),
  "updateMetadataAccounts"
);
LAYOUT.addVariant(
  2,
  B.struct([B.option(B.u64(), "maxSupply")]),
  "deprecatedCreateMasterEdition"
);
LAYOUT.addVariant(
  3,
  B.struct([]),
  "deprecatedMintNewEditionFromMasterEditionViaPrintingToken"
);
LAYOUT.addVariant(4, B.struct([]), "updatePrimarySaleHappenedViaToken");
LAYOUT.addVariant(
  5,
  B.struct([
    B.struct(
      [
        B.vec(
          B.struct([
            B.publicKey("address"),
            B.u64("spotsRemaining"),
            B.u64("totalSpots"),
          ]),
          "reservations"
        ),
        B.option(B.u64(), "totalReservationSpots"),
        B.u64("offset"),
        B.u64("totalSpotOffset"),
      ],
      "arg"
    ),
  ]),
  "deprecatedSetReservationList"
);
LAYOUT.addVariant(6, B.struct([]), "deprecatedCreateReservationList");
LAYOUT.addVariant(7, B.struct([]), "signMetadata");
LAYOUT.addVariant(
  8,
  B.struct([B.struct([B.u64("supply")], "arg")]),
  "deprecatedMintPrintingTokensViaToken"
);
LAYOUT.addVariant(
  9,
  B.struct([B.struct([B.u64("supply")], "arg")]),
  "deprecatedMintPrintingTokens"
);
LAYOUT.addVariant(
  10,
  B.struct([B.option(B.u64(), "maxSupply")]),
  "createMasterEdition"
);
LAYOUT.addVariant(
  11,
  B.struct([B.u64("edition")]),
  "mintNewEditionFromMasterEditionViaToken"
);
LAYOUT.addVariant(12, B.struct([]), "convertMasterEditionV1ToV2");
LAYOUT.addVariant(
  13,
  B.struct([B.u64("edition")]),
  "mintEditionFromMasterEditionViaVaultProxy"
);
LAYOUT.addVariant(14, B.struct([]), "puffMetadataAccount");
LAYOUT.addVariant(
  15,
  B.struct([
    B.option(
      B.struct([
        B.utf8Str("name"),
        B.utf8Str("symbol"),
        B.utf8Str("uri"),
        B.u16("sellerFeeBasisPoints"),
        B.option(
          B.vec(
            B.struct([
              B.publicKey("address"),
              B.bool("verified"),
              B.u8("share"),
            ])
          ),
          "creators"
        ),
        B.option(
          B.struct([B.bool("verified"), B.publicKey("key")]),
          "collection"
        ),
        B.option(
          B.struct([
            ((p: string) => {
              const U = B.union(B.u8("discriminator"), null, p);
              U.addVariant(0, B.struct([]), "burn");
              U.addVariant(1, B.struct([]), "multiple");
              U.addVariant(2, B.struct([]), "single");
              return U;
            })("useMethod"),
            B.u64("remaining"),
            B.u64("total"),
          ]),
          "uses"
        ),
      ]),
      "data"
    ),
    B.option(B.publicKey(), "updateAuthority"),
    B.option(B.bool(), "primarySaleHappened"),
    B.option(B.bool(), "isMutable"),
  ]),
  "updateMetadataAccountV2"
);
LAYOUT.addVariant(
  16,
  B.struct([
    B.struct(
      [
        B.utf8Str("name"),
        B.utf8Str("symbol"),
        B.utf8Str("uri"),
        B.u16("sellerFeeBasisPoints"),
        B.option(
          B.vec(
            B.struct([
              B.publicKey("address"),
              B.bool("verified"),
              B.u8("share"),
            ])
          ),
          "creators"
        ),
        B.option(
          B.struct([B.bool("verified"), B.publicKey("key")]),
          "collection"
        ),
        B.option(
          B.struct([
            ((p: string) => {
              const U = B.union(B.u8("discriminator"), null, p);
              U.addVariant(0, B.struct([]), "burn");
              U.addVariant(1, B.struct([]), "multiple");
              U.addVariant(2, B.struct([]), "single");
              return U;
            })("useMethod"),
            B.u64("remaining"),
            B.u64("total"),
          ]),
          "uses"
        ),
      ],
      "data"
    ),
    B.bool("isMutable"),
  ]),
  "createMetadataAccountV2"
);
LAYOUT.addVariant(
  17,
  B.struct([B.option(B.u64(), "maxSupply")]),
  "createMasterEditionV3"
);
LAYOUT.addVariant(18, B.struct([]), "verifyCollection");
LAYOUT.addVariant(19, B.struct([B.u64("numberOfUses")]), "utilize");
LAYOUT.addVariant(20, B.struct([B.u64("numberOfUses")]), "approveUseAuthority");
LAYOUT.addVariant(21, B.struct([]), "revokeUseAuthority");
LAYOUT.addVariant(22, B.struct([]), "unverifyCollection");
LAYOUT.addVariant(23, B.struct([]), "approveCollectionAuthority");
LAYOUT.addVariant(24, B.struct([]), "revokeCollectionAuthority");
LAYOUT.addVariant(25, B.struct([]), "setAndVerifyCollection");
LAYOUT.addVariant(26, B.struct([]), "freezeDelegatedAccount");
LAYOUT.addVariant(27, B.struct([]), "thawDelegatedAccount");
LAYOUT.addVariant(28, B.struct([]), "removeCreatorVerification");
LAYOUT.addVariant(29, B.struct([]), "burnNft");
LAYOUT.addVariant(30, B.struct([]), "verifySizedCollectionItem");
LAYOUT.addVariant(31, B.struct([]), "unverifySizedCollectionItem");
LAYOUT.addVariant(32, B.struct([]), "setAndVerifySizedCollectionItem");
LAYOUT.addVariant(
  33,
  B.struct([
    B.struct(
      [
        B.utf8Str("name"),
        B.utf8Str("symbol"),
        B.utf8Str("uri"),
        B.u16("sellerFeeBasisPoints"),
        B.option(
          B.vec(
            B.struct([
              B.publicKey("address"),
              B.bool("verified"),
              B.u8("share"),
            ])
          ),
          "creators"
        ),
        B.option(
          B.struct([B.bool("verified"), B.publicKey("key")]),
          "collection"
        ),
        B.option(
          B.struct([
            ((p: string) => {
              const U = B.union(B.u8("discriminator"), null, p);
              U.addVariant(0, B.struct([]), "burn");
              U.addVariant(1, B.struct([]), "multiple");
              U.addVariant(2, B.struct([]), "single");
              return U;
            })("useMethod"),
            B.u64("remaining"),
            B.u64("total"),
          ]),
          "uses"
        ),
      ],
      "data"
    ),
    B.bool("isMutable"),
    B.option(
      ((p: string) => {
        const U = B.union(B.u8("discriminator"), null, p);
        U.addVariant(0, B.struct([B.u64("size")]), "v1");
        return U;
      })(),
      "collectionDetails"
    ),
  ]),
  "createMetadataAccountV3"
);
LAYOUT.addVariant(34, B.struct([B.u64("size")]), "setCollectionSize");
LAYOUT.addVariant(35, B.struct([]), "setTokenStandard");

function encodeData(ix: any, span: number): Buffer {
  const b = Buffer.alloc(span);
  LAYOUT.encode(ix, b);
  return b;
}
