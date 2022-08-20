mod cli;
mod coder;
mod constants;
mod generator;
mod idl;
mod utils;

fn main() -> generator::GeneratorResult {
    cli::parse()
}
