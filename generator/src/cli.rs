use std::path::PathBuf;

use clap::{Args, Parser, Subcommand};

use crate::{
    constants::common::dirname,
    generator::{generate, GeneratorConfig, GeneratorResult},
};

#[derive(Parser)]
#[clap(version, about, long_about = None)]
struct Cli {
    /// Output directory
    #[clap(short, long, global = true, default_value_t = dirname::GENERATED.into())]
    output_dir: String,

    /// Turn off logging
    #[clap(short, long, action, global = true)]
    silent: bool,

    /// Show debug info
    #[clap(long, action, global = true)]
    debug: bool,

    #[clap(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Generate Anchor dummy program
    Program(ProgramArgs),

    /// Generate Anchor IDL
    Idl(IdlArgs),

    /// Generate Anchor client as an importable JS package
    Package(PackageArgs),
}

#[derive(Args)]
pub struct ProgramArgs {
    /// Path of the directory that contains Solana program(s)
    #[clap(value_parser)]
    pub path: Option<PathBuf>,
}

#[derive(Args)]
pub struct IdlArgs {
    /// Path of the directory that contains Solana program(s)
    #[clap(value_parser)]
    pub path: Option<PathBuf>,

    /// Keep generated Anchor dummy program after generating the IDL
    #[clap(short, long, action)]
    pub keep_dummy_program: bool,

    /// Path of existing Anchor dummy program file(lib.rs)
    #[clap(short, long, value_parser)]
    pub dummy_program_path: Option<PathBuf>,
}

#[derive(Args)]
pub struct PackageArgs {
    /// Path of the directory that contains Solana program(s)
    #[clap(value_parser)]
    pub path: Option<PathBuf>,

    /// Keep both generated program and IDL
    #[clap(short, long, action)]
    pub keep: bool,

    /// Keep generated Anchor dummy program after generating the IDL
    #[clap(long, action)]
    pub keep_dummy_program: bool,

    /// Keep generated idl.json file
    #[clap(long, action)]
    pub keep_idl_json: bool,

    /// Skip initialization of the package
    #[clap(long, action)]
    pub skip_init: bool,

    /// Use a prebuilt yarn.lock file(faster initialization)
    #[clap(short, long, action)]
    pub yarn_lock: bool,

    /// Path of existing Anchor dummy program file(lib.rs)
    #[clap(short, long, value_parser)]
    pub dummy_program_path: Option<PathBuf>,

    /// Path of existing Anchor IDL file(JSON)
    #[clap(short, long, value_parser)]
    pub idl_path: Option<PathBuf>,
}

struct GeneratorLogger;

impl log::Log for GeneratorLogger {
    fn enabled(&self, metadata: &log::Metadata) -> bool {
        metadata.level() <= log::Level::Debug
    }

    fn log(&self, record: &log::Record) {
        if self.enabled(record.metadata()) {
            println!("{}", record.args());
        }
    }

    fn flush(&self) {}
}

static LOGGER: GeneratorLogger = GeneratorLogger;

fn init_logger(silent: bool, debug: bool) {
    log::set_logger(&LOGGER)
        .map(|()| {
            log::set_max_level(match silent {
                true => log::LevelFilter::Off,
                false => match debug {
                    true => log::LevelFilter::Debug,
                    false => log::LevelFilter::Info,
                },
            })
        })
        .unwrap();
}

pub fn parse() -> GeneratorResult {
    let cli = Cli::parse();
    init_logger(cli.silent, cli.debug);
    match cli.command {
        Commands::Program(args) => generate(GeneratorConfig::program(args, cli.output_dir)),
        Commands::Idl(args) => generate(GeneratorConfig::idl(args, cli.output_dir)),
        Commands::Package(args) => generate(GeneratorConfig::package(args, cli.output_dir)),
    }
}
