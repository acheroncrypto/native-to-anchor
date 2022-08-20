// @ts-nocheck
import * as B from "@native-to-anchor/buffer-layout";
import { AccountsCoder, Idl } from "@project-serum/anchor";
import { IdlTypeDef } from "@project-serum/anchor/dist/cjs/idl";

export class MplTokenMetadataAccountsCoder<A extends string = string>
  implements AccountsCoder
{
  constructor(_idl: Idl) {}

  public async encode<T = any>(accountName: A, account: T): Promise<Buffer> {
    switch (accountName) {
      case "collectionAuthorityRecord": {
        const buffer = Buffer.alloc(2);
        const len = COLLECTION_AUTHORITY_RECORD_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "edition": {
        const buffer = Buffer.alloc(41);
        const len = EDITION_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "editionMarker": {
        const buffer = Buffer.alloc(32);
        const len = EDITION_MARKER_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "masterEditionV2": {
        const buffer = Buffer.alloc(10485760); // Space is variable
        const len = MASTER_EDITION_V2_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "masterEditionV1": {
        const buffer = Buffer.alloc(10485760); // Space is variable
        const len = MASTER_EDITION_V1_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "metadata": {
        const buffer = Buffer.alloc(10485760); // Space is variable
        const len = METADATA_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "reservationListV1": {
        const buffer = Buffer.alloc(10485760); // Space is variable
        const len = RESERVATION_LIST_V1_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "reservationListV2": {
        const buffer = Buffer.alloc(10485760); // Space is variable
        const len = RESERVATION_LIST_V2_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "useAuthorityRecord": {
        const buffer = Buffer.alloc(10);
        const len = USE_AUTHORITY_RECORD_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public decode<T = any>(accountName: A, ix: Buffer): T {
    return this.decodeUnchecked(accountName, ix);
  }

  public decodeUnchecked<T = any>(accountName: A, ix: Buffer): T {
    switch (accountName) {
      case "collectionAuthorityRecord": {
        return decodeCollectionAuthorityRecordAccount(ix);
      }
      case "edition": {
        return decodeEditionAccount(ix);
      }
      case "editionMarker": {
        return decodeEditionMarkerAccount(ix);
      }
      case "masterEditionV2": {
        return decodeMasterEditionV2Account(ix);
      }
      case "masterEditionV1": {
        return decodeMasterEditionV1Account(ix);
      }
      case "metadata": {
        return decodeMetadataAccount(ix);
      }
      case "reservationListV1": {
        return decodeReservationListV1Account(ix);
      }
      case "reservationListV2": {
        return decodeReservationListV2Account(ix);
      }
      case "useAuthorityRecord": {
        return decodeUseAuthorityRecordAccount(ix);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public memcmp(
    accountName: A,
    _appendData?: Buffer
  ): { dataSize?: number; offset?: number; bytes?: string } {
    switch (accountName) {
      case "collectionAuthorityRecord": {
        return {
          dataSize: 2,
        };
      }
      case "edition": {
        return {
          dataSize: 41,
        };
      }
      case "editionMarker": {
        return {
          dataSize: 32,
        };
      }
      case "masterEditionV2": {
        return {
          // Space is variable
        };
      }
      case "masterEditionV1": {
        return {
          // Space is variable
        };
      }
      case "metadata": {
        return {
          // Space is variable
        };
      }
      case "reservationListV1": {
        return {
          // Space is variable
        };
      }
      case "reservationListV2": {
        return {
          // Space is variable
        };
      }
      case "useAuthorityRecord": {
        return {
          dataSize: 10,
        };
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public size(idlAccount: IdlTypeDef): number {
    switch (idlAccount.name) {
      case "collectionAuthorityRecord": {
        return 2;
      }
      case "edition": {
        return 41;
      }
      case "editionMarker": {
        return 32;
      }
      case "masterEditionV2": {
        return 0; // Space is variable;
      }
      case "masterEditionV1": {
        return 0; // Space is variable;
      }
      case "metadata": {
        return 0; // Space is variable;
      }
      case "reservationListV1": {
        return 0; // Space is variable;
      }
      case "reservationListV2": {
        return 0; // Space is variable;
      }
      case "useAuthorityRecord": {
        return 10;
      }
      default: {
        throw new Error(`Invalid account name: ${idlAccount.name}`);
      }
    }
  }
}

function decodeCollectionAuthorityRecordAccount<T = any>(ix: Buffer): T {
  return COLLECTION_AUTHORITY_RECORD_LAYOUT.decode(ix) as T;
}
function decodeEditionAccount<T = any>(ix: Buffer): T {
  return EDITION_LAYOUT.decode(ix) as T;
}
function decodeEditionMarkerAccount<T = any>(ix: Buffer): T {
  return EDITION_MARKER_LAYOUT.decode(ix) as T;
}
function decodeMasterEditionV2Account<T = any>(ix: Buffer): T {
  return MASTER_EDITION_V2_LAYOUT.decode(ix) as T;
}
function decodeMasterEditionV1Account<T = any>(ix: Buffer): T {
  return MASTER_EDITION_V1_LAYOUT.decode(ix) as T;
}
function decodeMetadataAccount<T = any>(ix: Buffer): T {
  return METADATA_LAYOUT.decode(ix) as T;
}
function decodeReservationListV1Account<T = any>(ix: Buffer): T {
  return RESERVATION_LIST_V1_LAYOUT.decode(ix) as T;
}
function decodeReservationListV2Account<T = any>(ix: Buffer): T {
  return RESERVATION_LIST_V2_LAYOUT.decode(ix) as T;
}
function decodeUseAuthorityRecordAccount<T = any>(ix: Buffer): T {
  return USE_AUTHORITY_RECORD_LAYOUT.decode(ix) as T;
}

const COLLECTION_AUTHORITY_RECORD_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.u8("bump"),
]);

const EDITION_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.publicKey("parent"),
  B.u64("edition"),
]);

const EDITION_MARKER_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.seq(B.u8(), 31, "ledger"),
]);

const MASTER_EDITION_V2_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.u64("supply"),
  B.option(B.u64(), "maxSupply"),
]);

const MASTER_EDITION_V1_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.u64("supply"),
  B.option(B.u64(), "maxSupply"),
  B.publicKey("printingMint"),
  B.publicKey("oneTimePrintingAuthorizationMint"),
]);

const METADATA_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.publicKey("updateAuthority"),
  B.publicKey("mint"),
  B.struct(
    [
      B.utf8Str("name"),
      B.utf8Str("symbol"),
      B.utf8Str("uri"),
      B.u16("sellerFeeBasisPoints"),
      B.option(
        B.vec(
          B.struct([B.publicKey("address"), B.bool("verified"), B.u8("share")])
        ),
        "creators"
      ),
    ],
    "data"
  ),
  B.bool("primarySaleHappened"),
  B.bool("isMutable"),
  B.option(B.u8(), "editionNonce"),
  B.option(
    ((p: string) => {
      const U = B.union(B.u8("discriminator"), null, p);
      U.addVariant(0, B.struct([]), "nonFungible");
      U.addVariant(1, B.struct([]), "fungibleAsset");
      U.addVariant(2, B.struct([]), "fungible");
      U.addVariant(3, B.struct([]), "nonFungibleEdition");
      return U;
    })(),
    "tokenStandard"
  ),
  B.option(B.struct([B.bool("verified"), B.publicKey("key")]), "collection"),
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
  B.option(
    ((p: string) => {
      const U = B.union(B.u8("discriminator"), null, p);
      U.addVariant(0, B.struct([B.u64("size")]), "v1");
      return U;
    })(),
    "collectionDetails"
  ),
]);

const RESERVATION_LIST_V1_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.publicKey("masterEdition"),
  B.option(B.u64(), "supplySnapshot"),
  B.vec(
    B.struct([
      B.publicKey("address"),
      B.u8("spotsRemaining"),
      B.u8("totalSpots"),
    ]),
    "reservations"
  ),
]);

const RESERVATION_LIST_V2_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.publicKey("masterEdition"),
  B.option(B.u64(), "supplySnapshot"),
  B.vec(
    B.struct([
      B.publicKey("address"),
      B.u64("spotsRemaining"),
      B.u64("totalSpots"),
    ]),
    "reservations"
  ),
  B.u64("totalReservationSpots"),
  B.u64("currentReservationSpots"),
]);

const USE_AUTHORITY_RECORD_LAYOUT: any = B.struct([
  ((p: string) => {
    const U = B.union(B.u8("discriminator"), null, p);
    U.addVariant(0, B.struct([]), "uninitialized");
    U.addVariant(1, B.struct([]), "editionV1");
    U.addVariant(2, B.struct([]), "masterEditionV1");
    U.addVariant(3, B.struct([]), "reservationListV1");
    U.addVariant(4, B.struct([]), "metadataV1");
    U.addVariant(5, B.struct([]), "reservationListV2");
    U.addVariant(6, B.struct([]), "masterEditionV2");
    U.addVariant(7, B.struct([]), "editionMarker");
    U.addVariant(8, B.struct([]), "useAuthorityRecord");
    U.addVariant(9, B.struct([]), "collectionAuthorityRecord");
    return U;
  })("key"),
  B.u64("allowedUses"),
  B.u8("bump"),
]);
