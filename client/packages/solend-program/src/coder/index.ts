import { Idl, Coder } from "@project-serum/anchor";

import { SolendProgramAccountsCoder } from "./accounts";
import { SolendProgramEventsCoder } from "./events";
import { SolendProgramInstructionCoder } from "./instructions";
import { SolendProgramStateCoder } from "./state";
import { SolendProgramTypesCoder } from "./types";

/**
 * Coder for SolendProgram
 */
export class SolendProgramCoder implements Coder {
  readonly accounts: SolendProgramAccountsCoder;
  readonly events: SolendProgramEventsCoder;
  readonly instruction: SolendProgramInstructionCoder;
  readonly state: SolendProgramStateCoder;
  readonly types: SolendProgramTypesCoder;

  constructor(idl: Idl) {
    this.accounts = new SolendProgramAccountsCoder(idl);
    this.events = new SolendProgramEventsCoder(idl);
    this.instruction = new SolendProgramInstructionCoder(idl);
    this.state = new SolendProgramStateCoder(idl);
    this.types = new SolendProgramTypesCoder(idl);
  }
}
