// This file is autogenerated with https://github.com/acheroncrypto/native-to-anchor

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod name_service {
    use super::*;

    pub fn create(
        ctx: Context<Create>,
        hashed_name: Vec<u8>,
        lamports: u64,
        space: u32,
    ) -> Result<()> {
        Ok(())
    }

    pub fn update(ctx: Context<Update>, offset: u32, data: Vec<u8>) -> Result<()> {
        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, new_owner: Pubkey) -> Result<()> {
        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    system_program: Program<'info, System>,
    #[account(mut)]
    payer: Signer<'info>,
    #[account(mut)]
    name_account: AccountInfo<'info>,
    name_owner: AccountInfo<'info>,
    //name_class: AccountInfo<'info>,
    //name_parent: AccountInfo<'info>,
    //key: Signer<'info>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    name_account: AccountInfo<'info>,
    name_update_signer: Signer<'info>,
    //#[account(mut)]
    //name_parent: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    name_account: AccountInfo<'info>,
    name_owner: Signer<'info>,
    //key: Signer<'info>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    name_account: AccountInfo<'info>,
    name_owner: Signer<'info>,
    #[account(mut)]
    refund_target: AccountInfo<'info>,
}
