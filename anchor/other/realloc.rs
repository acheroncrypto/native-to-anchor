// This file is autogenerated with https://github.com/acheroncrypto/native-to-anchor

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod realloc {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn add_key(ctx: Context<AddKey>, key: Pubkey) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    funding_account: Signer<'info>,
    #[account(mut)]
    white_list_account: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddKey<'info> {
    #[account(mut)]
    funding_account: Signer<'info>,
    #[account(mut)]
    white_list_account: Signer<'info>,
    system_program: Program<'info, System>,
}
