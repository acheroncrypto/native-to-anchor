use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
};

use crate::state::NtaExampleData;

#[derive(BorshSerialize, BorshDeserialize)]
pub struct InitializeAccountArgs {
    pub data: NtaExampleData,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum NtaExampleInstruction {
    InitializeAccount(InitializeAccountArgs),
}

pub fn initialize_account(
    program_id: Pubkey,
    authority_pubkey: Pubkey,
    nta_account_pubkey: Pubkey,
    nta_data: NtaExampleData,
) -> Instruction {
    Instruction {
        program_id,
        accounts: vec![
            AccountMeta::new(authority_pubkey, true),
            AccountMeta::new(nta_account_pubkey, false),
        ],
        data: NtaExampleInstruction::InitializeAccount(InitializeAccountArgs { data: nta_data })
            .try_to_vec()
            .unwrap(),
    }
}
