use std::{
    env,
    error::Error,
    fs,
    path::{Path, PathBuf},
};

use crate::{
    cli::{Commands, IdlArgs, PackageArgs, ProgramArgs},
    coder::CoderGenerator,
    constants::common::*,
    idl::ProgramAndIdlGenerator,
    utils::{
        common::{get_absolute_path, get_all_content_from_folder, open_files},
        generator::{get_program_info, ProgramInfo},
    },
};

pub type GeneratorResult = Result<(), Box<dyn Error>>;

pub struct Generator {
    /// program info from Cargo.toml or default
    pub program_info: ProgramInfo,
    /// program-name/src
    pub native_src_path: PathBuf,
    /// Generated project path
    pub generated_project_path: PathBuf,
    /// Generated IDL Path
    pub idl_path: PathBuf,
    /// All crate files are dumped into this
    pub all_content: String,
}

impl Generator {
    fn new(cargo_toml_path: &Path, generated_path: &Path) -> Self {
        let program_info = get_program_info(cargo_toml_path);

        let generated_project_path = match generated_path.is_absolute() {
            true => generated_path.join(&program_info.name),
            false => {
                let cwd = env::current_dir().unwrap();
                cwd.join(generated_path).join(&program_info.name)
            }
        };
        let idl_path = generated_project_path.join(filename::IDL);

        let native_src_path = cargo_toml_path.parent().unwrap().join(dirname::SRC);
        let all_content = get_all_content_from_folder(&native_src_path).unwrap();

        Self {
            program_info,
            native_src_path,
            generated_project_path,
            idl_path,
            all_content,
        }
    }

    fn run(&self, command: &Commands) -> GeneratorResult {
        match command {
            Commands::Program(_) => {
                ProgramAndIdlGenerator::new_program(self).run()?;
            }
            Commands::Idl(args) => {
                ProgramAndIdlGenerator::new_idl(
                    self,
                    args.keep_dummy_program,
                    &args.dummy_program_path,
                )
                .run()?;
            }
            Commands::Package(args) => {
                if args.idl_path.is_none() {
                    ProgramAndIdlGenerator::new_idl(
                        self,
                        args.keep_dummy_program,
                        &args.dummy_program_path,
                    )
                    .run()?;
                }

                CoderGenerator::new(
                    self,
                    args.keep_idl_json,
                    args.skip_init,
                    args.yarn_lock,
                    args.idl_path.as_ref(),
                )
                .run()?;
            }
        }

        Ok(())
    }
}

pub struct GeneratorConfig {
    command: Commands,
    generated_path: PathBuf,
    maybe_path: Option<PathBuf>,
}

impl GeneratorConfig {
    pub fn program(args: ProgramArgs, generated_path_string: String) -> GeneratorConfig {
        let maybe_path = args.path.clone();
        GeneratorConfig {
            command: Commands::Program(args),
            generated_path: PathBuf::from(generated_path_string),
            maybe_path,
        }
    }

    pub fn idl(args: IdlArgs, generated_path_string: String) -> GeneratorConfig {
        let maybe_path = args.path.clone();
        GeneratorConfig {
            command: Commands::Idl(IdlArgs {
                // Keep the dummy program if the user gave program path
                keep_dummy_program: match args.dummy_program_path {
                    Some(_) => true,
                    None => args.keep_dummy_program,
                },
                ..args
            }),
            generated_path: PathBuf::from(generated_path_string),
            maybe_path,
        }
    }

    pub fn package(args: PackageArgs, generated_path_string: String) -> GeneratorConfig {
        // Keep the program and IDL if the user gave dummy program path or idl path
        let (keep_dummy_program, keep_idl_json) =
            if args.keep || args.dummy_program_path.is_some() || args.idl_path.is_some() {
                (true, true)
            } else {
                (args.keep_dummy_program, args.keep_idl_json)
            };

        let maybe_path = args.path.clone();

        GeneratorConfig {
            command: Commands::Package(PackageArgs {
                keep_dummy_program,
                keep_idl_json,
                ..args
            }),
            generated_path: PathBuf::from(generated_path_string),
            maybe_path,
        }
    }
}

pub fn generate(config: GeneratorConfig) -> GeneratorResult {
    let native_path = match &config.maybe_path {
        Some(path) => get_absolute_path(path),
        None => get_absolute_path(dirname::NATIVE),
    };
    let native_path = native_path.canonicalize()?;

    let mut f = |dir_entry: fs::DirEntry| -> GeneratorResult {
        let file_path = dir_entry.path();
        let file_name = file_path.file_name().unwrap().to_str().unwrap();
        if file_name != filename::CARGO_TOML {
            return Ok(());
        }
        let cargo_toml_path = file_path;

        Generator::new(&cargo_toml_path, &config.generated_path).run(&config.command)
    };

    open_files(&native_path, &mut f)
}
