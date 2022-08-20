use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum NtaExampleError {
    #[error("Authority doesn't match the signer authority.")]
    IncorrectAuthority,
}

impl From<NtaExampleError> for ProgramError {
    fn from(e: NtaExampleError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
