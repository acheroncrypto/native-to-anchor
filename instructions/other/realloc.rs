use crate::id;
use {
    borsh::{BorshDeserialize, BorshSerialize},
    solana_program::{
        instruction::{AccountMeta, Instruction},
        pubkey::Pubkey,
    },
};

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum WhitelistInstruction {
    Initialize,
    AddKey { key: Pubkey },
}

pub fn initialize(
    funding_account: &Pubkey,
    white_list_account: &Pubkey,
    system_program: &Pubkey,
) -> Instruction {
    Instruction::new_with_borsh(
        id(),
        &WhitelistInstruction::Initialize,
        vec![
            AccountMeta::new(*funding_account, true),
            AccountMeta::new(*white_list_account, true),
            AccountMeta::new_readonly(*system_program, false),
        ],
    )
}

pub fn add_key(
    funding_account: &Pubkey,
    white_list_account: &Pubkey,
    system_program: &Pubkey,
    new_key: &Pubkey,
) -> Instruction {
    Instruction::new_with_borsh(
        id(),
        &WhitelistInstruction::AddKey { key: *new_key },
        vec![
            AccountMeta::new(*funding_account, true),
            AccountMeta::new(*white_list_account, true),
            AccountMeta::new_readonly(*system_program, false),
        ],
    )
}
