import { Idl, Coder } from "@project-serum/anchor";

import { MplTokenMetadataAccountsCoder } from "./accounts";
import { MplTokenMetadataEventsCoder } from "./events";
import { MplTokenMetadataInstructionCoder } from "./instructions";
import { MplTokenMetadataStateCoder } from "./state";
import { MplTokenMetadataTypesCoder } from "./types";

/**
 * Coder for MplTokenMetadata
 */
export class MplTokenMetadataCoder implements Coder {
  readonly accounts: MplTokenMetadataAccountsCoder;
  readonly events: MplTokenMetadataEventsCoder;
  readonly instruction: MplTokenMetadataInstructionCoder;
  readonly state: MplTokenMetadataStateCoder;
  readonly types: MplTokenMetadataTypesCoder;

  constructor(idl: Idl) {
    this.accounts = new MplTokenMetadataAccountsCoder(idl);
    this.events = new MplTokenMetadataEventsCoder(idl);
    this.instruction = new MplTokenMetadataInstructionCoder(idl);
    this.state = new MplTokenMetadataStateCoder(idl);
    this.types = new MplTokenMetadataTypesCoder(idl);
  }
}
