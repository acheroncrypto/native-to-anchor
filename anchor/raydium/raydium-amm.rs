// This file is autogenerated with https://github.com/acheroncrypto/native-to-anchor

use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod raydium_amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, nonce: u8, open_time: u64) -> Result<()> {
        Ok(())
    }

    pub fn deposit(
        ctx: Context<Deposit>,
        max_coin_amount: u64,
        max_pc_amount: u64,
        base_side: u64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        Ok(())
    }

    pub fn swap_base_in(
        ctx: Context<SwapBaseIn>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn pre_initialize(ctx: Context<PreInitialize>, nonce: u8) -> Result<()> {
        Ok(())
    }

    pub fn swap_base_out(
        ctx: Context<SwapBaseOut>,
        max_amount_in: u64,
        amount_out: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
    #[account(mut)]
    amm: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    #[account(mut)]
    amm_open_orders: AccountInfo<'info>,
    #[account(mut)]
    lp_mint_address: AccountInfo<'info>,
    coin_mint_address: AccountInfo<'info>,
    pc_mint_address: AccountInfo<'info>,
    pool_coin_token_account: AccountInfo<'info>,
    pool_pc_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_withdraw_queue: AccountInfo<'info>,
    #[account(mut)]
    pool_target_orders_account: AccountInfo<'info>,
    #[account(mut)]
    pool_lp_token_account: AccountInfo<'info>,
    pool_temp_lp_token_account: AccountInfo<'info>,
    serum_program: AccountInfo<'info>,
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    user_wallet: Signer<'info>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    token_program: Program<'info, Token>,
    #[account(mut)]
    amm: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    amm_open_orders: AccountInfo<'info>,
    #[account(mut)]
    amm_target_orders: AccountInfo<'info>,
    #[account(mut)]
    lp_mint_address: AccountInfo<'info>,
    #[account(mut)]
    pool_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_pc_token_account: AccountInfo<'info>,
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    user_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    user_pc_token_account: AccountInfo<'info>,
    #[account(mut)]
    user_lp_token_account: AccountInfo<'info>,
    user_owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    token_program: Program<'info, Token>,
    #[account(mut)]
    amm: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    #[account(mut)]
    amm_open_orders: AccountInfo<'info>,
    #[account(mut)]
    amm_target_orders: AccountInfo<'info>,
    #[account(mut)]
    lp_mint_address: AccountInfo<'info>,
    #[account(mut)]
    pool_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_pc_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_withdraw_queue: AccountInfo<'info>,
    #[account(mut)]
    pool_temp_lp_token_account: AccountInfo<'info>,
    serum_program: AccountInfo<'info>,
    #[account(mut)]
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    serum_coin_vault_account: AccountInfo<'info>,
    #[account(mut)]
    serum_pc_vault_account: AccountInfo<'info>,
    serum_vault_signer: AccountInfo<'info>,
    #[account(mut)]
    user_lp_token_account: AccountInfo<'info>,
    #[account(mut)]
    uer_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    uer_pc_token_account: AccountInfo<'info>,
    user_owner: Signer<'info>,
    #[account(mut)]
    serum_event_q: AccountInfo<'info>,
    #[account(mut)]
    serum_bids: AccountInfo<'info>,
    #[account(mut)]
    serum_asks: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SwapBaseIn<'info> {
    token_program: Program<'info, Token>,
    #[account(mut)]
    amm: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    #[account(mut)]
    amm_open_orders: AccountInfo<'info>,
    #[account(mut)]
    amm_target_orders: AccountInfo<'info>,
    #[account(mut)]
    pool_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_pc_token_account: AccountInfo<'info>,
    serum_program: AccountInfo<'info>,
    #[account(mut)]
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    serum_bids: AccountInfo<'info>,
    #[account(mut)]
    serum_asks: AccountInfo<'info>,
    #[account(mut)]
    serum_event_queue: AccountInfo<'info>,
    #[account(mut)]
    serum_coin_vault_account: AccountInfo<'info>,
    #[account(mut)]
    serum_pc_vault_account: AccountInfo<'info>,
    serum_vault_signer: AccountInfo<'info>,
    #[account(mut)]
    uer_source_token_account: AccountInfo<'info>,
    #[account(mut)]
    uer_destination_token_account: AccountInfo<'info>,
    user_source_owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct PreInitialize<'info> {
    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
    #[account(mut)]
    amm_target_orders: AccountInfo<'info>,
    #[account(mut)]
    pool_withdraw_queue: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    #[account(mut)]
    lp_mint_address: AccountInfo<'info>,
    coin_mint_address: AccountInfo<'info>,
    pc_mint_address: AccountInfo<'info>,
    #[account(mut)]
    pool_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_pc_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_temp_lp_token_account: AccountInfo<'info>,
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    user_wallet: Signer<'info>,
}

#[derive(Accounts)]
pub struct SwapBaseOut<'info> {
    token_program: Program<'info, Token>,
    #[account(mut)]
    amm: AccountInfo<'info>,
    amm_authority: AccountInfo<'info>,
    #[account(mut)]
    amm_open_orders: AccountInfo<'info>,
    #[account(mut)]
    amm_target_orders: AccountInfo<'info>,
    #[account(mut)]
    pool_coin_token_account: AccountInfo<'info>,
    #[account(mut)]
    pool_pc_token_account: AccountInfo<'info>,
    serum_program: AccountInfo<'info>,
    #[account(mut)]
    serum_market: AccountInfo<'info>,
    #[account(mut)]
    serum_bids: AccountInfo<'info>,
    #[account(mut)]
    serum_asks: AccountInfo<'info>,
    #[account(mut)]
    serum_event_queue: AccountInfo<'info>,
    #[account(mut)]
    serum_coin_vault_account: AccountInfo<'info>,
    #[account(mut)]
    serum_pc_vault_account: AccountInfo<'info>,
    serum_vault_signer: AccountInfo<'info>,
    #[account(mut)]
    uer_source_token_account: AccountInfo<'info>,
    #[account(mut)]
    uer_destination_token_account: AccountInfo<'info>,
    user_source_owner: Signer<'info>,
}
