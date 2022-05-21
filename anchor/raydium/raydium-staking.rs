// This file is autogenerated with https://github.com/acheroncrypto/native-to-anchor

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod raydium_staking {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        nonce: u64,
        reward_per_slot: u64,
        ignore: u128,
    ) -> Result<()> {
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, arg: u64) -> Result<()> {
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, arg: u64) -> Result<()> {
        Ok(())
    }

    pub fn update_pool(ctx: Context<UpdatePool>) -> Result<()> {
        Ok(())
    }

    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        Ok(())
    }

    pub fn create_associated_account(ctx: Context<CreateAssociatedAccount>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    stake_pool: Signer<'info>,
    authority: AccountInfo<'info>,
    lp_vault: AccountInfo<'info>,
    reward_vault: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    pool_authority: AccountInfo<'info>,
    #[account(mut)]
    staker_info: AccountInfo<'info>,
    staker_owner: Signer<'info>,
    #[account(mut)]
    src_lp_token: AccountInfo<'info>,
    #[account(mut)]
    vault_lp_token: AccountInfo<'info>,
    #[account(mut)]
    dest_reward_token: AccountInfo<'info>,
    #[account(mut)]
    vault_reward_token: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    pool_authority: AccountInfo<'info>,
    #[account(mut)]
    staker_info: AccountInfo<'info>,
    staker_owner: Signer<'info>,
    #[account(mut)]
    dest_lp_token: AccountInfo<'info>,
    #[account(mut)]
    vault_lp_token: AccountInfo<'info>,
    #[account(mut)]
    dest_reward_token: AccountInfo<'info>,
    #[account(mut)]
    vault_reward_token: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdatePool<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    #[account(mut)]
    vault_lp_token: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
}

#[derive(Accounts)]
pub struct EmergencyWithdraw<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    pool_authority: AccountInfo<'info>,
    #[account(mut)]
    staker_info: AccountInfo<'info>,
    staker_owner: Signer<'info>,
    #[account(mut)]
    dest_lp_token: AccountInfo<'info>,
    #[account(mut)]
    vault_lp_token: AccountInfo<'info>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateAssociatedAccount<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    #[account(mut)]
    associated_user_stake_info: AccountInfo<'info>,
    owner: Signer<'info>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}