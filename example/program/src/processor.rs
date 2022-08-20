use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
};

use crate::{error::NtaExampleError, state::NtaExampleAccount};

pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let authority = next_account_info(accounts_iter)?;
    let nta_account = next_account_info(accounts_iter)?;

    let nta_example_account = NtaExampleAccount::try_from_slice(&instruction_data[1..])?;
    if nta_example_account.data.authority != *authority.key {
        return Err(NtaExampleError::IncorrectAuthority.into());
    }

    nta_example_account.serialize(&mut &mut nta_account.data.borrow_mut()[..])?;
    msg!("Initialized account: {}", nta_account.key);

    Ok(())
}
