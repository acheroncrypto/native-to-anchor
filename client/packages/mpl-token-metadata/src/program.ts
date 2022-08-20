import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";

import { MplTokenMetadataCoder } from "./coder";

export const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

interface GetProgramParams {
  programId?: PublicKey;
  provider?: AnchorProvider;
}

export function mplTokenMetadataProgram(
  params?: GetProgramParams
): Program<MplTokenMetadata> {
  return new Program<MplTokenMetadata>(
    IDL,
    params?.programId ?? MPL_TOKEN_METADATA_PROGRAM_ID,
    params?.provider,
    new MplTokenMetadataCoder(IDL)
  );
}

type MplTokenMetadata = {
  version: "1.3.4";
  name: "mpl_token_metadata";
  instructions: [
    {
      name: "createMetadataAccounts";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "Data";
          };
        },
        {
          name: "isMutable";
          type: "bool";
        }
      ];
    },
    {
      name: "updateMetadataAccounts";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            option: {
              defined: "Data";
            };
          };
        },
        {
          name: "updateAuthority";
          type: {
            option: "publicKey";
          };
        },
        {
          name: "primarySaleHappened";
          type: {
            option: "bool";
          };
        }
      ];
    },
    {
      name: "deprecatedCreateMasterEdition";
      accounts: [
        {
          name: "edition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "printingMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "oneTimePrintingAuthorizationMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "printingMintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "maxSupply";
          type: {
            option: "u64";
          };
        }
      ];
    },
    {
      name: "deprecatedMintNewEditionFromMasterEditionViaPrintingToken";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "printingMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "burnAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "masterUpdateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "masterMetadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "updatePrimarySaleHappenedViaToken";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "token";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "deprecatedSetReservationList";
      accounts: [
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "reservationList";
          isMut: true;
          isSigner: false;
        },
        {
          name: "resource";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "arg";
          type: {
            defined: "SetReservationListArgs";
          };
        }
      ];
    },
    {
      name: "deprecatedCreateReservationList";
      accounts: [
        {
          name: "reservationList";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: false;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "masterEdition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "resource";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "signMetadata";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "deprecatedMintPrintingTokensViaToken";
      accounts: [
        {
          name: "destination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "token";
          isMut: true;
          isSigner: false;
        },
        {
          name: "oneTimePrintingAuthorizationMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "printingMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "burnAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "arg";
          type: {
            defined: "MintPrintingTokensViaTokenArgs";
          };
        }
      ];
    },
    {
      name: "deprecatedMintPrintingTokens";
      accounts: [
        {
          name: "destination";
          isMut: true;
          isSigner: false;
        },
        {
          name: "printingMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "arg";
          type: {
            defined: "MintPrintingTokensViaTokenArgs";
          };
        }
      ];
    },
    {
      name: "createMasterEdition";
      accounts: [
        {
          name: "edition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "maxSupply";
          type: {
            option: "u64";
          };
        }
      ];
    },
    {
      name: "mintNewEditionFromMasterEditionViaToken";
      accounts: [
        {
          name: "newMetadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "editionMarkPda";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newMintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenAccountOwner";
          isMut: false;
          isSigner: true;
        },
        {
          name: "tokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "newMetadataUpdateAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "edition";
          type: "u64";
        }
      ];
    },
    {
      name: "convertMasterEditionV1ToV2";
      accounts: [
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "oneTimeAuth";
          isMut: true;
          isSigner: false;
        },
        {
          name: "printingMint";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "mintEditionFromMasterEditionViaVaultProxy";
      accounts: [
        {
          name: "newMetadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "masterEdition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "editionMarkPda";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newMintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "safetyDepositStore";
          isMut: false;
          isSigner: false;
        },
        {
          name: "safetyDepositBox";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: false;
          isSigner: false;
        },
        {
          name: "newMetadataUpdateAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenVaultProgramInfo";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "edition";
          type: "u64";
        }
      ];
    },
    {
      name: "puffMetadataAccount";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "updateMetadataAccountV2";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            option: {
              defined: "DataV2";
            };
          };
        },
        {
          name: "updateAuthority";
          type: {
            option: "publicKey";
          };
        },
        {
          name: "primarySaleHappened";
          type: {
            option: "bool";
          };
        },
        {
          name: "isMutable";
          type: {
            option: "bool";
          };
        }
      ];
    },
    {
      name: "createMetadataAccountV2";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "DataV2";
          };
        },
        {
          name: "isMutable";
          type: "bool";
        }
      ];
    },
    {
      name: "createMasterEditionV3";
      accounts: [
        {
          name: "edition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "maxSupply";
          type: {
            option: "u64";
          };
        }
      ];
    },
    {
      name: "verifyCollection";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "utilize";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "useAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "owner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "splAssociatedTokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "numberOfUses";
          type: "u64";
        }
      ];
    },
    {
      name: "approveUseAuthority";
      accounts: [
        {
          name: "useAuthorityRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "burner";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "numberOfUses";
          type: "u64";
        }
      ];
    },
    {
      name: "revokeUseAuthority";
      accounts: [
        {
          name: "useAuthorityRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: false;
          isSigner: false;
        },
        {
          name: "ownerTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "unverifyCollection";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "approveCollectionAuthority";
      accounts: [
        {
          name: "collectionAuthorityRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "newCollectionAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "revokeCollectionAuthority";
      accounts: [
        {
          name: "collectionAuthorityRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "delegateAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "revokeAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "metadata";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "setAndVerifyCollection";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "freezeDelegatedAccount";
      accounts: [
        {
          name: "delegate";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "thawDelegatedAccount";
      accounts: [
        {
          name: "delegate";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "removeCreatorVerification";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "creator";
          isMut: false;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "burnNft";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "token";
          isMut: true;
          isSigner: false;
        },
        {
          name: "edition";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "verifySizedCollectionItem";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "unverifySizedCollectionItem";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "setAndVerifySizedCollectionItem";
      accounts: [
        {
          name: "metadata";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collectionMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "collection";
          isMut: true;
          isSigner: false;
        },
        {
          name: "collectionMasterEditionAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "createMetadataAccountV3";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "data";
          type: {
            defined: "DataV2";
          };
        },
        {
          name: "isMutable";
          type: "bool";
        },
        {
          name: "collectionDetails";
          type: {
            option: {
              defined: "CollectionDetails";
            };
          };
        }
      ];
    },
    {
      name: "setCollectionSize";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: false;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "size";
          type: "u64";
        }
      ];
    },
    {
      name: "setTokenStandard";
      accounts: [
        {
          name: "metadataAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "updateAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mintAccount";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "collectionAuthorityRecord";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "edition";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "parent";
            type: "publicKey";
          },
          {
            name: "edition";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "editionMarker";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "ledger";
            type: {
              array: ["u8", 31];
            };
          }
        ];
      };
    },
    {
      name: "masterEditionV2";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "supply";
            type: "u64";
          },
          {
            name: "maxSupply";
            type: {
              option: "u64";
            };
          }
        ];
      };
    },
    {
      name: "masterEditionV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "supply";
            type: "u64";
          },
          {
            name: "maxSupply";
            type: {
              option: "u64";
            };
          },
          {
            name: "printingMint";
            type: "publicKey";
          },
          {
            name: "oneTimePrintingAuthorizationMint";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "metadata";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "updateAuthority";
            type: "publicKey";
          },
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "data";
            type: {
              defined: "Data";
            };
          },
          {
            name: "primarySaleHappened";
            type: "bool";
          },
          {
            name: "isMutable";
            type: "bool";
          },
          {
            name: "editionNonce";
            type: {
              option: "u8";
            };
          },
          {
            name: "tokenStandard";
            type: {
              option: {
                defined: "TokenStandard";
              };
            };
          },
          {
            name: "collection";
            type: {
              option: {
                defined: "Collection";
              };
            };
          },
          {
            name: "uses";
            type: {
              option: {
                defined: "Uses";
              };
            };
          },
          {
            name: "collectionDetails";
            type: {
              option: {
                defined: "CollectionDetails";
              };
            };
          }
        ];
      };
    },
    {
      name: "reservationListV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "masterEdition";
            type: "publicKey";
          },
          {
            name: "supplySnapshot";
            type: {
              option: "u64";
            };
          },
          {
            name: "reservations";
            type: {
              vec: {
                defined: "ReservationV1";
              };
            };
          }
        ];
      };
    },
    {
      name: "reservationListV2";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "masterEdition";
            type: "publicKey";
          },
          {
            name: "supplySnapshot";
            type: {
              option: "u64";
            };
          },
          {
            name: "reservations";
            type: {
              vec: {
                defined: "Reservation";
              };
            };
          },
          {
            name: "totalReservationSpots";
            type: "u64";
          },
          {
            name: "currentReservationSpots";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "useAuthorityRecord";
      type: {
        kind: "struct";
        fields: [
          {
            name: "key";
            type: {
              defined: "Key";
            };
          },
          {
            name: "allowedUses";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "Creator";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "verified";
            type: "bool";
          },
          {
            name: "share";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "Data";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "sellerFeeBasisPoints";
            type: "u16";
          },
          {
            name: "creators";
            type: {
              option: {
                vec: {
                  defined: "Creator";
                };
              };
            };
          }
        ];
      };
    },
    {
      name: "Collection";
      type: {
        kind: "struct";
        fields: [
          {
            name: "verified";
            type: "bool";
          },
          {
            name: "key";
            type: "publicKey";
          }
        ];
      };
    },
    {
      name: "Uses";
      type: {
        kind: "struct";
        fields: [
          {
            name: "useMethod";
            type: {
              defined: "UseMethod";
            };
          },
          {
            name: "remaining";
            type: "u64";
          },
          {
            name: "total";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "DataV2";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "sellerFeeBasisPoints";
            type: "u16";
          },
          {
            name: "creators";
            type: {
              option: {
                vec: {
                  defined: "Creator";
                };
              };
            };
          },
          {
            name: "collection";
            type: {
              option: {
                defined: "Collection";
              };
            };
          },
          {
            name: "uses";
            type: {
              option: {
                defined: "Uses";
              };
            };
          }
        ];
      };
    },
    {
      name: "Reservation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "spotsRemaining";
            type: "u64";
          },
          {
            name: "totalSpots";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "ReservationV1";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "spotsRemaining";
            type: "u8";
          },
          {
            name: "totalSpots";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "SetReservationListArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "reservations";
            type: {
              vec: {
                defined: "Reservation";
              };
            };
          },
          {
            name: "totalReservationSpots";
            type: {
              option: "u64";
            };
          },
          {
            name: "offset";
            type: "u64";
          },
          {
            name: "totalSpotOffset";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "MintPrintingTokensViaTokenArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "supply";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "Key";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Uninitialized";
          },
          {
            name: "EditionV1";
          },
          {
            name: "MasterEditionV1";
          },
          {
            name: "ReservationListV1";
          },
          {
            name: "MetadataV1";
          },
          {
            name: "ReservationListV2";
          },
          {
            name: "MasterEditionV2";
          },
          {
            name: "EditionMarker";
          },
          {
            name: "UseAuthorityRecord";
          },
          {
            name: "CollectionAuthorityRecord";
          }
        ];
      };
    },
    {
      name: "TokenStandard";
      type: {
        kind: "enum";
        variants: [
          {
            name: "NonFungible";
          },
          {
            name: "FungibleAsset";
          },
          {
            name: "Fungible";
          },
          {
            name: "NonFungibleEdition";
          }
        ];
      };
    },
    {
      name: "CollectionDetails";
      type: {
        kind: "enum";
        variants: [
          {
            name: "V1";
            fields: [
              {
                name: "size";
                type: "u64";
              }
            ];
          }
        ];
      };
    },
    {
      name: "UseMethod";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Burn";
          },
          {
            name: "Multiple";
          },
          {
            name: "Single";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 0;
      name: "InstructionUnpackError";
      msg: "Failed to unpack instruction data";
    },
    {
      code: 1;
      name: "InstructionPackError";
      msg: "Failed to pack instruction data";
    },
    {
      code: 2;
      name: "NotRentExempt";
      msg: "Lamport balance below rent-exempt threshold";
    },
    {
      code: 3;
      name: "AlreadyInitialized";
      msg: "Already initialized";
    },
    {
      code: 4;
      name: "Uninitialized";
      msg: "Uninitialized";
    },
    {
      code: 5;
      name: "InvalidMetadataKey";
      msg: " Metadata's key must match seed of ['metadata', program id, mint] provided";
    },
    {
      code: 6;
      name: "InvalidEditionKey";
      msg: "Edition's key must match seed of ['metadata', program id, name, 'edition'] provided";
    },
    {
      code: 7;
      name: "UpdateAuthorityIncorrect";
      msg: "Update Authority given does not match";
    },
    {
      code: 8;
      name: "UpdateAuthorityIsNotSigner";
      msg: "Update Authority needs to be signer to update metadata";
    },
    {
      code: 9;
      name: "NotMintAuthority";
      msg: "You must be the mint authority and signer on this transaction";
    },
    {
      code: 10;
      name: "InvalidMintAuthority";
      msg: "Mint authority provided does not match the authority on the mint";
    },
    {
      code: 11;
      name: "NameTooLong";
      msg: "Name too long";
    },
    {
      code: 12;
      name: "SymbolTooLong";
      msg: "Symbol too long";
    },
    {
      code: 13;
      name: "UriTooLong";
      msg: "URI too long";
    },
    {
      code: 14;
      name: "UpdateAuthorityMustBeEqualToMetadataAuthorityAndSigner";
      msg: "Update authority must be equivalent to the metadata's authority and also signer of this transaction";
    },
    {
      code: 15;
      name: "MintMismatch";
      msg: "Mint given does not match mint on Metadata";
    },
    {
      code: 16;
      name: "EditionsMustHaveExactlyOneToken";
      msg: "Editions must have exactly one token";
    },
    {
      code: 17;
      name: "MaxEditionsMintedAlready";
      msg: "Maximum editions printed already";
    },
    {
      code: 18;
      name: "TokenMintToFailed";
      msg: "Token mint to failed";
    },
    {
      code: 19;
      name: "MasterRecordMismatch";
      msg: "The master edition record passed must match the master record on the edition given";
    },
    {
      code: 20;
      name: "DestinationMintMismatch";
      msg: "The destination account does not have the right mint";
    },
    {
      code: 21;
      name: "EditionAlreadyMinted";
      msg: "An edition can only mint one of its kind!";
    },
    {
      code: 22;
      name: "PrintingMintDecimalsShouldBeZero";
      msg: "Printing mint decimals should be zero";
    },
    {
      code: 23;
      name: "OneTimePrintingAuthorizationMintDecimalsShouldBeZero";
      msg: "OneTimePrintingAuthorization mint decimals should be zero";
    },
    {
      code: 24;
      name: "EditionMintDecimalsShouldBeZero";
      msg: "EditionMintDecimalsShouldBeZero";
    },
    {
      code: 25;
      name: "TokenBurnFailed";
      msg: "Token burn failed";
    },
    {
      code: 26;
      name: "TokenAccountOneTimeAuthMintMismatch";
      msg: "The One Time authorization mint does not match that on the token account!";
    },
    {
      code: 27;
      name: "DerivedKeyInvalid";
      msg: "Derived key invalid";
    },
    {
      code: 28;
      name: "PrintingMintMismatch";
      msg: "The Printing mint does not match that on the master edition!";
    },
    {
      code: 29;
      name: "OneTimePrintingAuthMintMismatch";
      msg: "The One Time Printing Auth mint does not match that on the master edition!";
    },
    {
      code: 30;
      name: "TokenAccountMintMismatch";
      msg: "The mint of the token account does not match the Printing mint!";
    },
    {
      code: 31;
      name: "TokenAccountMintMismatchV2";
      msg: "The mint of the token account does not match the master metadata mint!";
    },
    {
      code: 32;
      name: "NotEnoughTokens";
      msg: "Not enough tokens to mint a limited edition";
    },
    {
      code: 33;
      name: "PrintingMintAuthorizationAccountMismatch";
      msg: "The mint on your authorization token holding account does not match your Printing mint!";
    },
    {
      code: 34;
      name: "AuthorizationTokenAccountOwnerMismatch";
      msg: "The authorization token account has a different owner than the update authority for the master edition!";
    },
    {
      code: 35;
      name: "Disabled";
      msg: "This feature is currently disabled.";
    },
    {
      code: 36;
      name: "CreatorsTooLong";
      msg: "Creators list too long";
    },
    {
      code: 37;
      name: "CreatorsMustBeAtleastOne";
      msg: "Creators must be at least one if set";
    },
    {
      code: 38;
      name: "MustBeOneOfCreators";
      msg: "If using a creators array, you must be one of the creators listed";
    },
    {
      code: 39;
      name: "NoCreatorsPresentOnMetadata";
      msg: "This metadata does not have creators";
    },
    {
      code: 40;
      name: "CreatorNotFound";
      msg: "This creator address was not found";
    },
    {
      code: 41;
      name: "InvalidBasisPoints";
      msg: "Basis points cannot be more than 10000";
    },
    {
      code: 42;
      name: "PrimarySaleCanOnlyBeFlippedToTrue";
      msg: "Primary sale can only be flipped to true and is immutable";
    },
    {
      code: 43;
      name: "OwnerMismatch";
      msg: "Owner does not match that on the account given";
    },
    {
      code: 44;
      name: "NoBalanceInAccountForAuthorization";
      msg: "This account has no tokens to be used for authorization";
    },
    {
      code: 45;
      name: "ShareTotalMustBe100";
      msg: "Share total must equal 100 for creator array";
    },
    {
      code: 46;
      name: "ReservationExists";
      msg: "This reservation list already exists!";
    },
    {
      code: 47;
      name: "ReservationDoesNotExist";
      msg: "This reservation list does not exist!";
    },
    {
      code: 48;
      name: "ReservationNotSet";
      msg: "This reservation list exists but was never set with reservations";
    },
    {
      code: 49;
      name: "ReservationAlreadyMade";
      msg: "This reservation list has already been set!";
    },
    {
      code: 50;
      name: "BeyondMaxAddressSize";
      msg: "Provided more addresses than max allowed in single reservation";
    },
    {
      code: 51;
      name: "NumericalOverflowError";
      msg: "NumericalOverflowError";
    },
    {
      code: 52;
      name: "ReservationBreachesMaximumSupply";
      msg: "This reservation would go beyond the maximum supply of the master edition!";
    },
    {
      code: 53;
      name: "AddressNotInReservation";
      msg: "Address not in reservation!";
    },
    {
      code: 54;
      name: "CannotVerifyAnotherCreator";
      msg: "You cannot unilaterally verify another creator, they must sign";
    },
    {
      code: 55;
      name: "CannotUnverifyAnotherCreator";
      msg: "You cannot unilaterally unverify another creator";
    },
    {
      code: 56;
      name: "SpotMismatch";
      msg: "In initial reservation setting, spots remaining should equal total spots";
    },
    {
      code: 57;
      name: "IncorrectOwner";
      msg: "Incorrect account owner";
    },
    {
      code: 58;
      name: "PrintingWouldBreachMaximumSupply";
      msg: "printing these tokens would breach the maximum supply limit of the master edition";
    },
    {
      code: 59;
      name: "DataIsImmutable";
      msg: "Data is immutable";
    },
    {
      code: 60;
      name: "DuplicateCreatorAddress";
      msg: "No duplicate creator addresses";
    },
    {
      code: 61;
      name: "ReservationSpotsRemainingShouldMatchTotalSpotsAtStart";
      msg: "Reservation spots remaining should match total spots when first being created";
    },
    {
      code: 62;
      name: "InvalidTokenProgram";
      msg: "Invalid token program";
    },
    {
      code: 63;
      name: "DataTypeMismatch";
      msg: "Data type mismatch";
    },
    {
      code: 64;
      name: "BeyondAlottedAddressSize";
      msg: "Beyond alotted address size in reservation!";
    },
    {
      code: 65;
      name: "ReservationNotComplete";
      msg: "The reservation has only been partially alotted";
    },
    {
      code: 66;
      name: "TriedToReplaceAnExistingReservation";
      msg: "You cannot splice over an existing reservation!";
    },
    {
      code: 67;
      name: "InvalidOperation";
      msg: "Invalid operation";
    },
    {
      code: 68;
      name: "InvalidOwner";
      msg: "Invalid Owner";
    },
    {
      code: 69;
      name: "PrintingMintSupplyMustBeZeroForConversion";
      msg: "Printing mint supply must be zero for conversion";
    },
    {
      code: 70;
      name: "OneTimeAuthMintSupplyMustBeZeroForConversion";
      msg: "One Time Auth mint supply must be zero for conversion";
    },
    {
      code: 71;
      name: "InvalidEditionIndex";
      msg: "You tried to insert one edition too many into an edition mark pda";
    },
    {
      code: 72;
      name: "ReservationArrayShouldBeSizeOne";
      msg: "In the legacy system the reservation needs to be of size one for cpu limit reasons";
    },
    {
      code: 73;
      name: "IsMutableCanOnlyBeFlippedToFalse";
      msg: "Is Mutable can only be flipped to false";
    },
    {
      code: 74;
      name: "CollectionCannotBeVerifiedInThisInstruction";
      msg: "Cannont Verify Collection in this Instruction";
    },
    {
      code: 75;
      name: "Removed";
      msg: "This instruction was deprecated in a previous release and is now removed";
    },
    {
      code: 76;
      name: "MustBeBurned";
      msg: "This token use method is burn and there are no remaining uses, it must be burned";
    },
    {
      code: 77;
      name: "InvalidUseMethod";
      msg: "This use method is invalid";
    },
    {
      code: 78;
      name: "CannotChangeUseMethodAfterFirstUse";
      msg: "Cannot Change Use Method after the first use";
    },
    {
      code: 79;
      name: "CannotChangeUsesAfterFirstUse";
      msg: "Cannot Change Remaining or Available uses after the first use";
    },
    {
      code: 80;
      name: "CollectionNotFound";
      msg: "Collection Not Found on Metadata";
    },
    {
      code: 81;
      name: "InvalidCollectionUpdateAuthority";
      msg: "Collection Update Authority is invalid";
    },
    {
      code: 82;
      name: "CollectionMustBeAUniqueMasterEdition";
      msg: "Collection Must Be a Unique Master Edition v2";
    },
    {
      code: 83;
      name: "UseAuthorityRecordAlreadyExists";
      msg: "The Use Authority Record Already Exists, to modify it Revoke, then Approve";
    },
    {
      code: 84;
      name: "UseAuthorityRecordAlreadyRevoked";
      msg: "The Use Authority Record is empty or already revoked";
    },
    {
      code: 85;
      name: "Unusable";
      msg: "This token has no uses";
    },
    {
      code: 86;
      name: "NotEnoughUses";
      msg: "There are not enough Uses left on this token.";
    },
    {
      code: 87;
      name: "CollectionAuthorityRecordAlreadyExists";
      msg: "This Collection Authority Record Already Exists.";
    },
    {
      code: 88;
      name: "CollectionAuthorityDoesNotExist";
      msg: "This Collection Authority Record Does Not Exist.";
    },
    {
      code: 89;
      name: "InvalidUseAuthorityRecord";
      msg: "This Use Authority Record is invalid.";
    },
    {
      code: 90;
      name: "InvalidCollectionAuthorityRecord";
      msg: "This Collection Authority Record is invalid.";
    },
    {
      code: 91;
      name: "InvalidFreezeAuthority";
      msg: "Metadata does not match the freeze authority on the mint";
    },
    {
      code: 92;
      name: "InvalidDelegate";
      msg: "All tokens in this account have not been delegated to this user.";
    },
    {
      code: 93;
      name: "CannotAdjustVerifiedCreator";
      msg: "Creator can not be adjusted once they are verified.";
    },
    {
      code: 94;
      name: "CannotRemoveVerifiedCreator";
      msg: "Verified creators cannot be removed.";
    },
    {
      code: 95;
      name: "CannotWipeVerifiedCreators";
      msg: "Can not wipe verified creators.";
    },
    {
      code: 96;
      name: "NotAllowedToChangeSellerFeeBasisPoints";
      msg: "Not allowed to change seller fee basis points.";
    },
    {
      code: 97;
      name: "EditionOverrideCannotBeZero";
      msg: "Edition override cannot be zero";
    },
    {
      code: 98;
      name: "InvalidUser";
      msg: "Invalid User";
    },
    {
      code: 99;
      name: "RevokeCollectionAuthoritySignerIncorrect";
      msg: "Revoke Collection Authority signer is incorrect";
    },
    {
      code: 100;
      name: "TokenCloseFailed";
      msg: "Token close failed";
    },
    {
      code: 101;
      name: "UnsizedCollection";
      msg: "Can't use this function on unsized collection";
    },
    {
      code: 102;
      name: "SizedCollection";
      msg: "Can't use this function on a sized collection";
    },
    {
      code: 103;
      name: "MissingCollectionMetadata";
      msg: "Can't burn a verified member of a collection w/o providing collection metadata account";
    },
    {
      code: 104;
      name: "NotAMemberOfCollection";
      msg: "This NFT is not a member of the specified collection.";
    },
    {
      code: 105;
      name: "NotVerifiedMemberOfCollection";
      msg: "This NFT is not a verified member of the specified collection.";
    },
    {
      code: 106;
      name: "NotACollectionParent";
      msg: "This NFT is not a collection parent NFT.";
    },
    {
      code: 107;
      name: "CouldNotDetermineTokenStandard";
      msg: "Could not determine a TokenStandard type.";
    },
    {
      code: 108;
      name: "MissingEditionAccount";
      msg: "This mint account has an edition but none was provided.";
    },
    {
      code: 109;
      name: "NotAMasterEdition";
      msg: "This edition is not a Master Edition";
    },
    {
      code: 110;
      name: "MasterEditionHasPrints";
      msg: "This Master Edition has existing prints";
    },
    {
      code: 111;
      name: "BorshDeserializationError";
      msg: "Borsh Deserialization Error";
    },
    {
      code: 112;
      name: "CannotUpdateVerifiedCollection";
      msg: "Cannot update a verified colleciton in this command";
    },
    {
      code: 113;
      name: "CollectionMasterEditionAccountInvalid";
      msg: "Edition account aoesnt match collection ";
    },
    {
      code: 114;
      name: "AlreadyVerified";
      msg: "Item is already verified.";
    },
    {
      code: 115;
      name: "AlreadyUnverified";
      msg: "Item is already unverified.";
    }
  ];
};

const IDL: MplTokenMetadata = {
  version: "1.3.4",
  name: "mpl_token_metadata",
  instructions: [
    {
      name: "createMetadataAccounts",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "Data",
          },
        },
        {
          name: "isMutable",
          type: "bool",
        },
      ],
    },
    {
      name: "updateMetadataAccounts",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            option: {
              defined: "Data",
            },
          },
        },
        {
          name: "updateAuthority",
          type: {
            option: "publicKey",
          },
        },
        {
          name: "primarySaleHappened",
          type: {
            option: "bool",
          },
        },
      ],
    },
    {
      name: "deprecatedCreateMasterEdition",
      accounts: [
        {
          name: "edition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "printingMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "oneTimePrintingAuthorizationMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "printingMintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "maxSupply",
          type: {
            option: "u64",
          },
        },
      ],
    },
    {
      name: "deprecatedMintNewEditionFromMasterEditionViaPrintingToken",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "printingMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "burnAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "masterUpdateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "masterMetadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "updatePrimarySaleHappenedViaToken",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "token",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "deprecatedSetReservationList",
      accounts: [
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "reservationList",
          isMut: true,
          isSigner: false,
        },
        {
          name: "resource",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "arg",
          type: {
            defined: "SetReservationListArgs",
          },
        },
      ],
    },
    {
      name: "deprecatedCreateReservationList",
      accounts: [
        {
          name: "reservationList",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: false,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "masterEdition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "resource",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "signMetadata",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "deprecatedMintPrintingTokensViaToken",
      accounts: [
        {
          name: "destination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "oneTimePrintingAuthorizationMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "printingMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "burnAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "arg",
          type: {
            defined: "MintPrintingTokensViaTokenArgs",
          },
        },
      ],
    },
    {
      name: "deprecatedMintPrintingTokens",
      accounts: [
        {
          name: "destination",
          isMut: true,
          isSigner: false,
        },
        {
          name: "printingMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "arg",
          type: {
            defined: "MintPrintingTokensViaTokenArgs",
          },
        },
      ],
    },
    {
      name: "createMasterEdition",
      accounts: [
        {
          name: "edition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "maxSupply",
          type: {
            option: "u64",
          },
        },
      ],
    },
    {
      name: "mintNewEditionFromMasterEditionViaToken",
      accounts: [
        {
          name: "newMetadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "editionMarkPda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newMintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenAccountOwner",
          isMut: false,
          isSigner: true,
        },
        {
          name: "tokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "newMetadataUpdateAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "edition",
          type: "u64",
        },
      ],
    },
    {
      name: "convertMasterEditionV1ToV2",
      accounts: [
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "oneTimeAuth",
          isMut: true,
          isSigner: false,
        },
        {
          name: "printingMint",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "mintEditionFromMasterEditionViaVaultProxy",
      accounts: [
        {
          name: "newMetadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "masterEdition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "editionMarkPda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newMintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "safetyDepositStore",
          isMut: false,
          isSigner: false,
        },
        {
          name: "safetyDepositBox",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: false,
          isSigner: false,
        },
        {
          name: "newMetadataUpdateAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenVaultProgramInfo",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "edition",
          type: "u64",
        },
      ],
    },
    {
      name: "puffMetadataAccount",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "updateMetadataAccountV2",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            option: {
              defined: "DataV2",
            },
          },
        },
        {
          name: "updateAuthority",
          type: {
            option: "publicKey",
          },
        },
        {
          name: "primarySaleHappened",
          type: {
            option: "bool",
          },
        },
        {
          name: "isMutable",
          type: {
            option: "bool",
          },
        },
      ],
    },
    {
      name: "createMetadataAccountV2",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "DataV2",
          },
        },
        {
          name: "isMutable",
          type: "bool",
        },
      ],
    },
    {
      name: "createMasterEditionV3",
      accounts: [
        {
          name: "edition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "maxSupply",
          type: {
            option: "u64",
          },
        },
      ],
    },
    {
      name: "verifyCollection",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "utilize",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "useAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "owner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "splAssociatedTokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "numberOfUses",
          type: "u64",
        },
      ],
    },
    {
      name: "approveUseAuthority",
      accounts: [
        {
          name: "useAuthorityRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "burner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "numberOfUses",
          type: "u64",
        },
      ],
    },
    {
      name: "revokeUseAuthority",
      accounts: [
        {
          name: "useAuthorityRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ownerTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "unverifyCollection",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "approveCollectionAuthority",
      accounts: [
        {
          name: "collectionAuthorityRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "newCollectionAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "revokeCollectionAuthority",
      accounts: [
        {
          name: "collectionAuthorityRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "delegateAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "revokeAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "metadata",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "setAndVerifyCollection",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "freezeDelegatedAccount",
      accounts: [
        {
          name: "delegate",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "thawDelegatedAccount",
      accounts: [
        {
          name: "delegate",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "removeCreatorVerification",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "creator",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "burnNft",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "token",
          isMut: true,
          isSigner: false,
        },
        {
          name: "edition",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "verifySizedCollectionItem",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "unverifySizedCollectionItem",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "setAndVerifySizedCollectionItem",
      accounts: [
        {
          name: "metadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collectionMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "collection",
          isMut: true,
          isSigner: false,
        },
        {
          name: "collectionMasterEditionAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "createMetadataAccountV3",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "data",
          type: {
            defined: "DataV2",
          },
        },
        {
          name: "isMutable",
          type: "bool",
        },
        {
          name: "collectionDetails",
          type: {
            option: {
              defined: "CollectionDetails",
            },
          },
        },
      ],
    },
    {
      name: "setCollectionSize",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "size",
          type: "u64",
        },
      ],
    },
    {
      name: "setTokenStandard",
      accounts: [
        {
          name: "metadataAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "updateAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mintAccount",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "collectionAuthorityRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "edition",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "parent",
            type: "publicKey",
          },
          {
            name: "edition",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "editionMarker",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "ledger",
            type: {
              array: ["u8", 31],
            },
          },
        ],
      },
    },
    {
      name: "masterEditionV2",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "supply",
            type: "u64",
          },
          {
            name: "maxSupply",
            type: {
              option: "u64",
            },
          },
        ],
      },
    },
    {
      name: "masterEditionV1",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "supply",
            type: "u64",
          },
          {
            name: "maxSupply",
            type: {
              option: "u64",
            },
          },
          {
            name: "printingMint",
            type: "publicKey",
          },
          {
            name: "oneTimePrintingAuthorizationMint",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "metadata",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "updateAuthority",
            type: "publicKey",
          },
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "data",
            type: {
              defined: "Data",
            },
          },
          {
            name: "primarySaleHappened",
            type: "bool",
          },
          {
            name: "isMutable",
            type: "bool",
          },
          {
            name: "editionNonce",
            type: {
              option: "u8",
            },
          },
          {
            name: "tokenStandard",
            type: {
              option: {
                defined: "TokenStandard",
              },
            },
          },
          {
            name: "collection",
            type: {
              option: {
                defined: "Collection",
              },
            },
          },
          {
            name: "uses",
            type: {
              option: {
                defined: "Uses",
              },
            },
          },
          {
            name: "collectionDetails",
            type: {
              option: {
                defined: "CollectionDetails",
              },
            },
          },
        ],
      },
    },
    {
      name: "reservationListV1",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "masterEdition",
            type: "publicKey",
          },
          {
            name: "supplySnapshot",
            type: {
              option: "u64",
            },
          },
          {
            name: "reservations",
            type: {
              vec: {
                defined: "ReservationV1",
              },
            },
          },
        ],
      },
    },
    {
      name: "reservationListV2",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "masterEdition",
            type: "publicKey",
          },
          {
            name: "supplySnapshot",
            type: {
              option: "u64",
            },
          },
          {
            name: "reservations",
            type: {
              vec: {
                defined: "Reservation",
              },
            },
          },
          {
            name: "totalReservationSpots",
            type: "u64",
          },
          {
            name: "currentReservationSpots",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "useAuthorityRecord",
      type: {
        kind: "struct",
        fields: [
          {
            name: "key",
            type: {
              defined: "Key",
            },
          },
          {
            name: "allowedUses",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Creator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "verified",
            type: "bool",
          },
          {
            name: "share",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "Data",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
          {
            name: "creators",
            type: {
              option: {
                vec: {
                  defined: "Creator",
                },
              },
            },
          },
        ],
      },
    },
    {
      name: "Collection",
      type: {
        kind: "struct",
        fields: [
          {
            name: "verified",
            type: "bool",
          },
          {
            name: "key",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "Uses",
      type: {
        kind: "struct",
        fields: [
          {
            name: "useMethod",
            type: {
              defined: "UseMethod",
            },
          },
          {
            name: "remaining",
            type: "u64",
          },
          {
            name: "total",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "DataV2",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
          {
            name: "creators",
            type: {
              option: {
                vec: {
                  defined: "Creator",
                },
              },
            },
          },
          {
            name: "collection",
            type: {
              option: {
                defined: "Collection",
              },
            },
          },
          {
            name: "uses",
            type: {
              option: {
                defined: "Uses",
              },
            },
          },
        ],
      },
    },
    {
      name: "Reservation",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "spotsRemaining",
            type: "u64",
          },
          {
            name: "totalSpots",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "ReservationV1",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "spotsRemaining",
            type: "u8",
          },
          {
            name: "totalSpots",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "SetReservationListArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "reservations",
            type: {
              vec: {
                defined: "Reservation",
              },
            },
          },
          {
            name: "totalReservationSpots",
            type: {
              option: "u64",
            },
          },
          {
            name: "offset",
            type: "u64",
          },
          {
            name: "totalSpotOffset",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "MintPrintingTokensViaTokenArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "supply",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Key",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Uninitialized",
          },
          {
            name: "EditionV1",
          },
          {
            name: "MasterEditionV1",
          },
          {
            name: "ReservationListV1",
          },
          {
            name: "MetadataV1",
          },
          {
            name: "ReservationListV2",
          },
          {
            name: "MasterEditionV2",
          },
          {
            name: "EditionMarker",
          },
          {
            name: "UseAuthorityRecord",
          },
          {
            name: "CollectionAuthorityRecord",
          },
        ],
      },
    },
    {
      name: "TokenStandard",
      type: {
        kind: "enum",
        variants: [
          {
            name: "NonFungible",
          },
          {
            name: "FungibleAsset",
          },
          {
            name: "Fungible",
          },
          {
            name: "NonFungibleEdition",
          },
        ],
      },
    },
    {
      name: "CollectionDetails",
      type: {
        kind: "enum",
        variants: [
          {
            name: "V1",
            fields: [
              {
                name: "size",
                type: "u64",
              },
            ],
          },
        ],
      },
    },
    {
      name: "UseMethod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Burn",
          },
          {
            name: "Multiple",
          },
          {
            name: "Single",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 0,
      name: "InstructionUnpackError",
      msg: "Failed to unpack instruction data",
    },
    {
      code: 1,
      name: "InstructionPackError",
      msg: "Failed to pack instruction data",
    },
    {
      code: 2,
      name: "NotRentExempt",
      msg: "Lamport balance below rent-exempt threshold",
    },
    {
      code: 3,
      name: "AlreadyInitialized",
      msg: "Already initialized",
    },
    {
      code: 4,
      name: "Uninitialized",
      msg: "Uninitialized",
    },
    {
      code: 5,
      name: "InvalidMetadataKey",
      msg: " Metadata's key must match seed of ['metadata', program id, mint] provided",
    },
    {
      code: 6,
      name: "InvalidEditionKey",
      msg: "Edition's key must match seed of ['metadata', program id, name, 'edition'] provided",
    },
    {
      code: 7,
      name: "UpdateAuthorityIncorrect",
      msg: "Update Authority given does not match",
    },
    {
      code: 8,
      name: "UpdateAuthorityIsNotSigner",
      msg: "Update Authority needs to be signer to update metadata",
    },
    {
      code: 9,
      name: "NotMintAuthority",
      msg: "You must be the mint authority and signer on this transaction",
    },
    {
      code: 10,
      name: "InvalidMintAuthority",
      msg: "Mint authority provided does not match the authority on the mint",
    },
    {
      code: 11,
      name: "NameTooLong",
      msg: "Name too long",
    },
    {
      code: 12,
      name: "SymbolTooLong",
      msg: "Symbol too long",
    },
    {
      code: 13,
      name: "UriTooLong",
      msg: "URI too long",
    },
    {
      code: 14,
      name: "UpdateAuthorityMustBeEqualToMetadataAuthorityAndSigner",
      msg: "Update authority must be equivalent to the metadata's authority and also signer of this transaction",
    },
    {
      code: 15,
      name: "MintMismatch",
      msg: "Mint given does not match mint on Metadata",
    },
    {
      code: 16,
      name: "EditionsMustHaveExactlyOneToken",
      msg: "Editions must have exactly one token",
    },
    {
      code: 17,
      name: "MaxEditionsMintedAlready",
      msg: "Maximum editions printed already",
    },
    {
      code: 18,
      name: "TokenMintToFailed",
      msg: "Token mint to failed",
    },
    {
      code: 19,
      name: "MasterRecordMismatch",
      msg: "The master edition record passed must match the master record on the edition given",
    },
    {
      code: 20,
      name: "DestinationMintMismatch",
      msg: "The destination account does not have the right mint",
    },
    {
      code: 21,
      name: "EditionAlreadyMinted",
      msg: "An edition can only mint one of its kind!",
    },
    {
      code: 22,
      name: "PrintingMintDecimalsShouldBeZero",
      msg: "Printing mint decimals should be zero",
    },
    {
      code: 23,
      name: "OneTimePrintingAuthorizationMintDecimalsShouldBeZero",
      msg: "OneTimePrintingAuthorization mint decimals should be zero",
    },
    {
      code: 24,
      name: "EditionMintDecimalsShouldBeZero",
      msg: "EditionMintDecimalsShouldBeZero",
    },
    {
      code: 25,
      name: "TokenBurnFailed",
      msg: "Token burn failed",
    },
    {
      code: 26,
      name: "TokenAccountOneTimeAuthMintMismatch",
      msg: "The One Time authorization mint does not match that on the token account!",
    },
    {
      code: 27,
      name: "DerivedKeyInvalid",
      msg: "Derived key invalid",
    },
    {
      code: 28,
      name: "PrintingMintMismatch",
      msg: "The Printing mint does not match that on the master edition!",
    },
    {
      code: 29,
      name: "OneTimePrintingAuthMintMismatch",
      msg: "The One Time Printing Auth mint does not match that on the master edition!",
    },
    {
      code: 30,
      name: "TokenAccountMintMismatch",
      msg: "The mint of the token account does not match the Printing mint!",
    },
    {
      code: 31,
      name: "TokenAccountMintMismatchV2",
      msg: "The mint of the token account does not match the master metadata mint!",
    },
    {
      code: 32,
      name: "NotEnoughTokens",
      msg: "Not enough tokens to mint a limited edition",
    },
    {
      code: 33,
      name: "PrintingMintAuthorizationAccountMismatch",
      msg: "The mint on your authorization token holding account does not match your Printing mint!",
    },
    {
      code: 34,
      name: "AuthorizationTokenAccountOwnerMismatch",
      msg: "The authorization token account has a different owner than the update authority for the master edition!",
    },
    {
      code: 35,
      name: "Disabled",
      msg: "This feature is currently disabled.",
    },
    {
      code: 36,
      name: "CreatorsTooLong",
      msg: "Creators list too long",
    },
    {
      code: 37,
      name: "CreatorsMustBeAtleastOne",
      msg: "Creators must be at least one if set",
    },
    {
      code: 38,
      name: "MustBeOneOfCreators",
      msg: "If using a creators array, you must be one of the creators listed",
    },
    {
      code: 39,
      name: "NoCreatorsPresentOnMetadata",
      msg: "This metadata does not have creators",
    },
    {
      code: 40,
      name: "CreatorNotFound",
      msg: "This creator address was not found",
    },
    {
      code: 41,
      name: "InvalidBasisPoints",
      msg: "Basis points cannot be more than 10000",
    },
    {
      code: 42,
      name: "PrimarySaleCanOnlyBeFlippedToTrue",
      msg: "Primary sale can only be flipped to true and is immutable",
    },
    {
      code: 43,
      name: "OwnerMismatch",
      msg: "Owner does not match that on the account given",
    },
    {
      code: 44,
      name: "NoBalanceInAccountForAuthorization",
      msg: "This account has no tokens to be used for authorization",
    },
    {
      code: 45,
      name: "ShareTotalMustBe100",
      msg: "Share total must equal 100 for creator array",
    },
    {
      code: 46,
      name: "ReservationExists",
      msg: "This reservation list already exists!",
    },
    {
      code: 47,
      name: "ReservationDoesNotExist",
      msg: "This reservation list does not exist!",
    },
    {
      code: 48,
      name: "ReservationNotSet",
      msg: "This reservation list exists but was never set with reservations",
    },
    {
      code: 49,
      name: "ReservationAlreadyMade",
      msg: "This reservation list has already been set!",
    },
    {
      code: 50,
      name: "BeyondMaxAddressSize",
      msg: "Provided more addresses than max allowed in single reservation",
    },
    {
      code: 51,
      name: "NumericalOverflowError",
      msg: "NumericalOverflowError",
    },
    {
      code: 52,
      name: "ReservationBreachesMaximumSupply",
      msg: "This reservation would go beyond the maximum supply of the master edition!",
    },
    {
      code: 53,
      name: "AddressNotInReservation",
      msg: "Address not in reservation!",
    },
    {
      code: 54,
      name: "CannotVerifyAnotherCreator",
      msg: "You cannot unilaterally verify another creator, they must sign",
    },
    {
      code: 55,
      name: "CannotUnverifyAnotherCreator",
      msg: "You cannot unilaterally unverify another creator",
    },
    {
      code: 56,
      name: "SpotMismatch",
      msg: "In initial reservation setting, spots remaining should equal total spots",
    },
    {
      code: 57,
      name: "IncorrectOwner",
      msg: "Incorrect account owner",
    },
    {
      code: 58,
      name: "PrintingWouldBreachMaximumSupply",
      msg: "printing these tokens would breach the maximum supply limit of the master edition",
    },
    {
      code: 59,
      name: "DataIsImmutable",
      msg: "Data is immutable",
    },
    {
      code: 60,
      name: "DuplicateCreatorAddress",
      msg: "No duplicate creator addresses",
    },
    {
      code: 61,
      name: "ReservationSpotsRemainingShouldMatchTotalSpotsAtStart",
      msg: "Reservation spots remaining should match total spots when first being created",
    },
    {
      code: 62,
      name: "InvalidTokenProgram",
      msg: "Invalid token program",
    },
    {
      code: 63,
      name: "DataTypeMismatch",
      msg: "Data type mismatch",
    },
    {
      code: 64,
      name: "BeyondAlottedAddressSize",
      msg: "Beyond alotted address size in reservation!",
    },
    {
      code: 65,
      name: "ReservationNotComplete",
      msg: "The reservation has only been partially alotted",
    },
    {
      code: 66,
      name: "TriedToReplaceAnExistingReservation",
      msg: "You cannot splice over an existing reservation!",
    },
    {
      code: 67,
      name: "InvalidOperation",
      msg: "Invalid operation",
    },
    {
      code: 68,
      name: "InvalidOwner",
      msg: "Invalid Owner",
    },
    {
      code: 69,
      name: "PrintingMintSupplyMustBeZeroForConversion",
      msg: "Printing mint supply must be zero for conversion",
    },
    {
      code: 70,
      name: "OneTimeAuthMintSupplyMustBeZeroForConversion",
      msg: "One Time Auth mint supply must be zero for conversion",
    },
    {
      code: 71,
      name: "InvalidEditionIndex",
      msg: "You tried to insert one edition too many into an edition mark pda",
    },
    {
      code: 72,
      name: "ReservationArrayShouldBeSizeOne",
      msg: "In the legacy system the reservation needs to be of size one for cpu limit reasons",
    },
    {
      code: 73,
      name: "IsMutableCanOnlyBeFlippedToFalse",
      msg: "Is Mutable can only be flipped to false",
    },
    {
      code: 74,
      name: "CollectionCannotBeVerifiedInThisInstruction",
      msg: "Cannont Verify Collection in this Instruction",
    },
    {
      code: 75,
      name: "Removed",
      msg: "This instruction was deprecated in a previous release and is now removed",
    },
    {
      code: 76,
      name: "MustBeBurned",
      msg: "This token use method is burn and there are no remaining uses, it must be burned",
    },
    {
      code: 77,
      name: "InvalidUseMethod",
      msg: "This use method is invalid",
    },
    {
      code: 78,
      name: "CannotChangeUseMethodAfterFirstUse",
      msg: "Cannot Change Use Method after the first use",
    },
    {
      code: 79,
      name: "CannotChangeUsesAfterFirstUse",
      msg: "Cannot Change Remaining or Available uses after the first use",
    },
    {
      code: 80,
      name: "CollectionNotFound",
      msg: "Collection Not Found on Metadata",
    },
    {
      code: 81,
      name: "InvalidCollectionUpdateAuthority",
      msg: "Collection Update Authority is invalid",
    },
    {
      code: 82,
      name: "CollectionMustBeAUniqueMasterEdition",
      msg: "Collection Must Be a Unique Master Edition v2",
    },
    {
      code: 83,
      name: "UseAuthorityRecordAlreadyExists",
      msg: "The Use Authority Record Already Exists, to modify it Revoke, then Approve",
    },
    {
      code: 84,
      name: "UseAuthorityRecordAlreadyRevoked",
      msg: "The Use Authority Record is empty or already revoked",
    },
    {
      code: 85,
      name: "Unusable",
      msg: "This token has no uses",
    },
    {
      code: 86,
      name: "NotEnoughUses",
      msg: "There are not enough Uses left on this token.",
    },
    {
      code: 87,
      name: "CollectionAuthorityRecordAlreadyExists",
      msg: "This Collection Authority Record Already Exists.",
    },
    {
      code: 88,
      name: "CollectionAuthorityDoesNotExist",
      msg: "This Collection Authority Record Does Not Exist.",
    },
    {
      code: 89,
      name: "InvalidUseAuthorityRecord",
      msg: "This Use Authority Record is invalid.",
    },
    {
      code: 90,
      name: "InvalidCollectionAuthorityRecord",
      msg: "This Collection Authority Record is invalid.",
    },
    {
      code: 91,
      name: "InvalidFreezeAuthority",
      msg: "Metadata does not match the freeze authority on the mint",
    },
    {
      code: 92,
      name: "InvalidDelegate",
      msg: "All tokens in this account have not been delegated to this user.",
    },
    {
      code: 93,
      name: "CannotAdjustVerifiedCreator",
      msg: "Creator can not be adjusted once they are verified.",
    },
    {
      code: 94,
      name: "CannotRemoveVerifiedCreator",
      msg: "Verified creators cannot be removed.",
    },
    {
      code: 95,
      name: "CannotWipeVerifiedCreators",
      msg: "Can not wipe verified creators.",
    },
    {
      code: 96,
      name: "NotAllowedToChangeSellerFeeBasisPoints",
      msg: "Not allowed to change seller fee basis points.",
    },
    {
      code: 97,
      name: "EditionOverrideCannotBeZero",
      msg: "Edition override cannot be zero",
    },
    {
      code: 98,
      name: "InvalidUser",
      msg: "Invalid User",
    },
    {
      code: 99,
      name: "RevokeCollectionAuthoritySignerIncorrect",
      msg: "Revoke Collection Authority signer is incorrect",
    },
    {
      code: 100,
      name: "TokenCloseFailed",
      msg: "Token close failed",
    },
    {
      code: 101,
      name: "UnsizedCollection",
      msg: "Can't use this function on unsized collection",
    },
    {
      code: 102,
      name: "SizedCollection",
      msg: "Can't use this function on a sized collection",
    },
    {
      code: 103,
      name: "MissingCollectionMetadata",
      msg: "Can't burn a verified member of a collection w/o providing collection metadata account",
    },
    {
      code: 104,
      name: "NotAMemberOfCollection",
      msg: "This NFT is not a member of the specified collection.",
    },
    {
      code: 105,
      name: "NotVerifiedMemberOfCollection",
      msg: "This NFT is not a verified member of the specified collection.",
    },
    {
      code: 106,
      name: "NotACollectionParent",
      msg: "This NFT is not a collection parent NFT.",
    },
    {
      code: 107,
      name: "CouldNotDetermineTokenStandard",
      msg: "Could not determine a TokenStandard type.",
    },
    {
      code: 108,
      name: "MissingEditionAccount",
      msg: "This mint account has an edition but none was provided.",
    },
    {
      code: 109,
      name: "NotAMasterEdition",
      msg: "This edition is not a Master Edition",
    },
    {
      code: 110,
      name: "MasterEditionHasPrints",
      msg: "This Master Edition has existing prints",
    },
    {
      code: 111,
      name: "BorshDeserializationError",
      msg: "Borsh Deserialization Error",
    },
    {
      code: 112,
      name: "CannotUpdateVerifiedCollection",
      msg: "Cannot update a verified colleciton in this command",
    },
    {
      code: 113,
      name: "CollectionMasterEditionAccountInvalid",
      msg: "Edition account aoesnt match collection ",
    },
    {
      code: 114,
      name: "AlreadyVerified",
      msg: "Item is already verified.",
    },
    {
      code: 115,
      name: "AlreadyUnverified",
      msg: "Item is already unverified.",
    },
  ],
};
