use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize)]
pub struct NtaExampleAccount {
    pub data: NtaExampleData,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct NtaExampleData {
    pub authority: Pubkey,
    pub favorite_byte: u8,
    pub favorite_big_number: u64,
}
