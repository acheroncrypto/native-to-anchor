// This file is autogenerated with https://github.com/acheroncrypto/native-to-anchor

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod stake_pool {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        fee: Fee,
        withdrawal_fee: Fee,
        deposit_fee: Fee,
        referral_fee: u8,
        max_validators: u32,
    ) -> Result<()> {
        Ok(())
    }

    pub fn add_validator_to_pool(ctx: Context<AddValidatorToPool>) -> Result<()> {
        Ok(())
    }

    pub fn remove_validator_from_pool(ctx: Context<RemoveValidatorFromPool>) -> Result<()> {
        Ok(())
    }

    pub fn decrease_validator_stake(
        ctx: Context<DecreaseValidatorStake>,
        lamports: u64,
        transient_stake_seed: u64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn increase_validator_stake(
        ctx: Context<IncreaseValidatorStake>,
        lamports: u64,
        transient_stake_seed: u64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn set_preferred_validator(
        ctx: Context<SetPreferredValidator>,
        validator_type: PreferredValidatorType,
        validator_vote_address: Option<Pubkey>,
    ) -> Result<()> {
        Ok(())
    }

    pub fn update_validator_list_balance(
        ctx: Context<UpdateValidatorListBalance>,
        start_index: u32,
        no_merge: bool,
    ) -> Result<()> {
        Ok(())
    }

    pub fn update_stake_pool_balance(ctx: Context<UpdateStakePoolBalance>) -> Result<()> {
        Ok(())
    }

    pub fn cleanup_removed_validator_entries(
        ctx: Context<CleanupRemovedValidatorEntries>,
    ) -> Result<()> {
        Ok(())
    }

    pub fn deposit_stake(ctx: Context<DepositStake>) -> Result<()> {
        Ok(())
    }

    pub fn withdraw_stake(ctx: Context<WithdrawStake>, arg: u64) -> Result<()> {
        Ok(())
    }

    pub fn set_manager(ctx: Context<SetManager>) -> Result<()> {
        Ok(())
    }

    pub fn set_fee(ctx: Context<SetFee>, fee: FeeType) -> Result<()> {
        Ok(())
    }

    pub fn set_staker(ctx: Context<SetStaker>) -> Result<()> {
        Ok(())
    }

    pub fn deposit_sol(ctx: Context<DepositSol>, arg: u64) -> Result<()> {
        Ok(())
    }

    pub fn set_funding_authority(
        ctx: Context<SetFundingAuthority>,
        arg: FundingType,
    ) -> Result<()> {
        Ok(())
    }

    pub fn withdraw_sol(ctx: Context<WithdrawSol>, arg: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    manager: Signer<'info>,
    staker: AccountInfo<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list: AccountInfo<'info>,
    reserve_stake: AccountInfo<'info>,
    #[account(mut)]
    pool_mint: AccountInfo<'info>,
    #[account(mut)]
    manager_pool_account: AccountInfo<'info>,
    token_program: Program<'info, Token>,
    //deposit_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AddValidatorToPool<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    staker: Signer<'info>,
    #[account(mut)]
    funder: Signer<'info>,
    stake_pool_withdraw: AccountInfo<'info>,
    #[account(mut)]
    validator_list: AccountInfo<'info>,
    #[account(mut)]
    stake: AccountInfo<'info>,
    validator: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    clock: Sysvar<'info, Clock>,
    //sysvar::stake_history::id): AccountInfo<'info>,
    //stake::config::id): AccountInfo<'info>,
    system_program: Program<'info, System>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct RemoveValidatorFromPool<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    staker: Signer<'info>,
    stake_pool_withdraw: AccountInfo<'info>,
    new_stake_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list: AccountInfo<'info>,
    #[account(mut)]
    stake_account: AccountInfo<'info>,
    transient_stake_account: AccountInfo<'info>,
    #[account(mut)]
    destination_stake_account: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct DecreaseValidatorStake<'info> {
    stake_pool: AccountInfo<'info>,
    staker: Signer<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list: AccountInfo<'info>,
    #[account(mut)]
    validator_stake: AccountInfo<'info>,
    #[account(mut)]
    transient_stake: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    rent: Sysvar<'info, Rent>,
    system_program: Program<'info, System>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct IncreaseValidatorStake<'info> {
    stake_pool: AccountInfo<'info>,
    staker: Signer<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list: AccountInfo<'info>,
    #[account(mut)]
    reserve_stake: AccountInfo<'info>,
    #[account(mut)]
    transient_stake: AccountInfo<'info>,
    validator_stake: AccountInfo<'info>,
    validator: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    rent: Sysvar<'info, Rent>,
    //sysvar::stake_history::id): AccountInfo<'info>,
    //stake::config::id): AccountInfo<'info>,
    system_program: Program<'info, System>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetPreferredValidator<'info> {
    #[account(mut)]
    stake_pool_address: AccountInfo<'info>,
    staker: Signer<'info>,
    validator_list_address: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UpdateValidatorListBalance<'info> {
    stake_pool: AccountInfo<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list_address: AccountInfo<'info>,
    #[account(mut)]
    reserve_stake: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    //sysvar::stake_history::id): AccountInfo<'info>,
    //stake::program::id): AccountInfo<'info>,
    //#[account(mut)]
    //validator_stake_account: AccountInfo<'info>,
    //#[account(mut)]
    //transient_stake_account: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UpdateStakePoolBalance<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    validator_list_storage: AccountInfo<'info>,
    reserve_stake: AccountInfo<'info>,
    #[account(mut)]
    manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    stake_pool_mint: AccountInfo<'info>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CleanupRemovedValidatorEntries<'info> {
    stake_pool: AccountInfo<'info>,
    #[account(mut)]
    validator_list_storage: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct DepositStake<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    #[account(mut)]
    validator_list_storage: AccountInfo<'info>,
    stake_pool_deposit_authority: AccountInfo<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    deposit_stake_address: AccountInfo<'info>,
    #[account(mut)]
    validator_stake_account: AccountInfo<'info>,
    #[account(mut)]
    reserve_stake_account: AccountInfo<'info>,
    #[account(mut)]
    pool_tokens_to: AccountInfo<'info>,
    #[account(mut)]
    manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    referrer_pool_tokens_account: AccountInfo<'info>,
    #[account(mut)]
    pool_mint: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    //sysvar::stake_history::id): AccountInfo<'info>,
    token_program: Program<'info, Token>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct WithdrawStake<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    #[account(mut)]
    validator_list_storage: AccountInfo<'info>,
    stake_pool_withdraw: AccountInfo<'info>,
    #[account(mut)]
    stake_to_split: AccountInfo<'info>,
    #[account(mut)]
    stake_to_receive: AccountInfo<'info>,
    user_stake_authority: AccountInfo<'info>,
    user_transfer_authority: Signer<'info>,
    #[account(mut)]
    user_pool_token_account: AccountInfo<'info>,
    #[account(mut)]
    manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    pool_mint: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    token_program: Program<'info, Token>,
    //stake::program::id): AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetManager<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    manager: Signer<'info>,
    new_manager: Signer<'info>,
    new_fee_receiver: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SetFee<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    manager: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetStaker<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    set_staker_authority: Signer<'info>,
    new_staker: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    #[account(mut)]
    reserve_stake_account: AccountInfo<'info>,
    #[account(mut)]
    lamports_from: Signer<'info>,
    #[account(mut)]
    pool_tokens_to: AccountInfo<'info>,
    #[account(mut)]
    manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    referrer_pool_tokens_account: AccountInfo<'info>,
    #[account(mut)]
    pool_mint: AccountInfo<'info>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SetFundingAuthority<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    manager: Signer<'info>,
    //auth: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct WithdrawSol<'info> {
    #[account(mut)]
    stake_pool: AccountInfo<'info>,
    stake_pool_withdraw_authority: AccountInfo<'info>,
    user_transfer_authority: Signer<'info>,
    #[account(mut)]
    pool_tokens_from: AccountInfo<'info>,
    #[account(mut)]
    reserve_stake_account: AccountInfo<'info>,
    #[account(mut)]
    lamports_to: AccountInfo<'info>,
    #[account(mut)]
    manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    pool_mint: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    //sysvar::stake_history::id): AccountInfo<'info>,
    //stake::program::id): AccountInfo<'info>,
    token_program: Program<'info, Token>,
}