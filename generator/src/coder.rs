use std::{
    fs,
    path::{Path, PathBuf},
};

use anchor_syn::idl::{Idl, IdlTypeDefinitionTy};
use colored::Colorize;
use log::info;
use serde_json::to_string_pretty;

use crate::{
    constants::{coder::*, common::*},
    generator::{Generator, GeneratorResult},
    utils::{
        coder::{get_buffer_type, get_max_span, get_total_space_for_account, AccountSpace},
        common::{
            camel_from_pascal, check_command, error, get_inside_item_line, info, pascal_from_camel,
            pascal_from_kebab, snake_from_kebab, snake_from_pascal, spawn_process, success, warn,
        },
        generator::ProgramInfo,
    },
};

pub struct CoderGenerator<'a> {
    program_info: &'a ProgramInfo,
    native_src_path: &'a Path,
    all_content: &'a str,
    idl_path: &'a Path,
    idl: Idl,
    coder_path: PathBuf,
    config: CoderConfig,
}

struct CoderConfig {
    keep_idl_json: bool,
    skip_init: bool,
    yarn_lock: bool,
}

enum CoderFile {
    Accounts,
    Events,
    Index,
    Instructions,
    State,
    Types,
}

impl<'a> CoderGenerator<'a> {
    pub fn new(
        generator: &'a Generator,
        keep_idl_json: bool,
        skip_init: bool,
        yarn_lock: bool,
        maybe_idl_path: Option<&PathBuf>,
    ) -> Self {
        let idl_path = match maybe_idl_path {
            Some(path) => path,
            None => &generator.idl_path,
        };
        let idl = fs::read_to_string(idl_path).unwrap();
        let idl: Idl = serde_json::from_str(&idl).unwrap();

        let coder_path = generator
            .generated_project_path
            .join(dirname::SRC)
            .join(dirname::CODER);

        Self {
            program_info: &generator.program_info,
            native_src_path: &generator.native_src_path,
            all_content: &generator.all_content,
            idl_path: &generator.idl_path,
            idl,
            coder_path,
            config: CoderConfig {
                keep_idl_json,
                skip_init,
                yarn_lock,
            },
        }
    }

    pub fn run(self) -> GeneratorResult {
        info(format!(
            "Creating Anchor Coder for {}...",
            self.program_info.name
        ));

        // Create coder dir(s) recursively if coder path doesn't exist
        if !Path::new(&self.coder_path).exists() {
            fs::create_dir_all(&self.coder_path)?;
        }

        // Create acounts
        self.create_accounts()?;

        // Create events
        self.create_events()?;

        // Create index
        self.create_index()?;

        // Create instructions
        self.create_instructions()?;

        // Create state
        self.create_state()?;

        // Create types
        self.create_types()?;

        // Create package
        self.create_package()?;

        Ok(())
    }

    fn create_accounts(&self) -> GeneratorResult {
        // Get IDL for accounts
        let idl = &self.idl;
        let all_content = self.all_content;

        let mut encode_cases = String::new();
        let mut decode_cases = String::new();
        let mut memcmp_cases = String::new();
        let mut size_cases = String::new();
        let mut decode_functions = String::new();
        let mut account_layouts = String::new();

        for acc in &idl.accounts {
            let acc_name = &acc.name;
            let camel_case_name = camel_from_pascal(acc_name);
            let layout_name = format!("{}_LAYOUT", snake_from_pascal(acc_name).to_uppercase());

            // Get account space
            let (space, maybe_padding, is_variable) =
                match get_total_space_for_account(acc_name, all_content, &self.idl) {
                    AccountSpace::Normal(s) => (Some(s), None, false),
                    AccountSpace::PaddingNeeded((s, p)) => (Some(s), Some(p), false),
                    AccountSpace::Variable => (None, None, true),
                    AccountSpace::NotFound => {
                        warn(format!(
                            "Could not calculate necessary space for account '{}'. Skipping...",
                            acc_name
                        ));
                        continue;
                    }
                };

            let variable_comment = match is_variable {
                true => "// Space is variable",
                false => "",
            };

            // Encode
            let encode_space = match space {
                Some(space) => space,
                None => 1024 * 1024 * 10,
            };
            let encode_case = format!(
                r#"case "{camel_case_name}": {{
    const buffer = Buffer.alloc({encode_space}); {variable_comment}
    const len = {layout_name}.encode(account, buffer);
    return buffer.slice(0, len);
}}"#,
            );

            encode_cases.push_str(&encode_case);

            // Decode
            let decode_case = format!(
                r#"case "{camel_case_name}": {{
    return decode{acc_name}Account(ix);
}}"#
            );

            decode_cases.push_str(&decode_case);

            // Memcmp
            let memcmp_return = match space {
                Some(s) => format!("dataSize: {s},"),
                None => variable_comment.into(),
            };
            let memcmp_case = format!(
                r#"case "{camel_case_name}": {{
    return {{
        {memcmp_return}
    }};
    
}}"#
            );

            memcmp_cases.push_str(&memcmp_case);

            // Size
            let size_return = match space {
                Some(s) => s,
                None => 0,
            };
            let size_case = format!(
                r#"case "{camel_case_name}": {{
    return {size_return} {variable_comment};
}}"#
            );

            size_cases.push_str(&size_case);

            // Decode Functions
            let decode_function = format!(
                r#"function decode{acc_name}Account<T = any>(ix: Buffer): T {{
    return {layout_name}.decode(ix) as T;
}}"#
            );

            decode_functions.push_str(&decode_function);
            decode_functions.push('\n');

            // Account Layouts
            let mut account_layout = format!("const {layout_name}: any = B.struct([");
            match &acc.ty {
                IdlTypeDefinitionTy::Struct { fields } => {
                    for field in fields {
                        // let buffer_type = get_buffer_type(&field.ty, idl);
                        // account_layout.push_str(&format!(r#"{buffer_type}"{}"),"#, field.name));
                        account_layout.push_str(&get_buffer_type(field, idl));
                    }
                }
                _ => warn(format!("Account '{acc_name}' is enum.")),
            }
            // Check if there is extra padding needed
            if let Some(padding) = maybe_padding {
                account_layout.push_str(&format!(r#"B.blob({padding}, "padding")"#));
            }

            // Close account layout
            account_layout.push_str("]);\n\n");

            account_layouts.push_str(&account_layout);
        }

        let (accounts_path, accounts_content) = self.get_filepath_and_content(CoderFile::Accounts);

        let accounts_content = accounts_content
            .replace("<EncodeCases>", &encode_cases)
            .replace("<DecodeCases>", &decode_cases)
            .replace("<MemCmpCases>", &memcmp_cases)
            .replace("<SizeCases>", &size_cases)
            .replace("<DecodeFunctions>", &decode_functions)
            .replace("<AccountLayouts>", &account_layouts);

        fs::write(accounts_path, accounts_content)?;

        Ok(())
    }

    fn create_events(&self) -> GeneratorResult {
        let (events_path, events_content) = self.get_filepath_and_content(CoderFile::Events);
        fs::write(events_path, events_content)?;

        Ok(())
    }

    fn create_index(&self) -> GeneratorResult {
        let (index_path, index_content) = self.get_filepath_and_content(CoderFile::Index);
        fs::write(index_path, index_content)?;

        Ok(())
    }

    fn create_instructions(&self) -> GeneratorResult {
        // Get IDL for instructions
        let idl = &self.idl;

        let mut cases = String::new();
        let mut functions = String::new();
        let mut layouts: String = String::new();
        let mut layout_index = 0u8;

        for ix in &idl.instructions {
            let fn_name = &ix.name;
            let encode_fn_name = format!("encode{}", pascal_from_camel(&fn_name));

            // Get case
            let case = format!(r#"case "{fn_name}": {{return {encode_fn_name}(ix);}}"#,);
            cases.push_str(&case);
            cases.push('\n');

            // Get function and layout
            let mut args = String::new();
            let mut layout = format!(r#"LAYOUT.addVariant({layout_index}, B.struct(["#);
            let mut max_span = String::from(&format!("1"));
            for arg in &ix.args {
                args.push_str(&arg.name);
                args.push(',');

                // Get type
                // let buffer_type = get_buffer_type(&arg.ty, idl);
                // layout.push_str(&format!(r#"{buffer_type}"{}"),"#, arg.name));
                layout.push_str(&get_buffer_type(arg, idl));

                // Get max span
                max_span.push_str(&get_max_span(&arg.ty, &arg.name, idl));
            }

            // Close layout
            layout.push_str(&format!(r#"]), "{fn_name}");"#));

            layouts.push_str(&layout);

            functions.push_str(&format!(
                "function {encode_fn_name}({{{args}}}: any): Buffer {{return encodeData({{{fn_name}: {{{args}}}}}, {max_span});}}\n\n"
            ));

            layout_index += 1;
        }

        let (ix_path, ix_content) = self.get_filepath_and_content(CoderFile::Instructions);

        let ix_content = ix_content
            .replace("<Cases>", &cases)
            .replace("<Functions>", &functions)
            .replace("<Layouts>", &layouts);

        fs::write(ix_path, ix_content)?;

        Ok(())
    }

    fn create_state(&self) -> GeneratorResult {
        let (state_path, state_content) = self.get_filepath_and_content(CoderFile::State);
        fs::write(state_path, state_content)?;

        Ok(())
    }

    fn create_types(&self) -> GeneratorResult {
        let (types_path, types_content) = self.get_filepath_and_content(CoderFile::Types);
        fs::write(types_path, types_content)?;

        Ok(())
    }

    fn create_package(mut self) -> GeneratorResult {
        // Problems occur when accounts are not camelCase.
        // Accounts are PascalCase by default so we change it here
        for acc in &mut self.idl.accounts {
            acc.name = camel_from_pascal(&acc.name)
        }
        let idl = to_string_pretty(&self.idl).unwrap();

        let program_name = pascal_from_kebab(&self.program_info.name);
        let program_id_name = format!(
            "{}_PROGRAM_ID",
            snake_from_kebab(&self.program_info.name).to_uppercase()
        );

        let ty = format!("type {} = {}", program_name, idl);
        let idl = format!("const IDL: {} = {}", program_name, idl);

        let src_dir = self.coder_path.parent().unwrap();

        // Create program.ts
        let program_path = src_dir.join(src::PROGRAM_FILENAME);
        let mut program_content = src::PROGRAM_CONTENT
            .replace("<ProgramName>", &program_name)
            .replace("<ProgramNameCamel>", &camel_from_pascal(program_name))
            .replace("<ProgramIdName>", &program_id_name)
            .replace("<Type>", &ty)
            .replace("<Idl>", &idl);

        // Get Program ID
        let lib_content_result = fs::read_to_string(self.native_src_path.join(filename::LIB));
        let lib_content = match &lib_content_result {
            Ok(c) => c,
            Err(_) => self.all_content,
        };
        let mut warn_no_program_id = || {
            warn(format!(
                "Could not find program id for {}.",
                self.program_info.name
            ));
            program_content = program_content.replace(
                "<ProgramId>",
                &format!("const {program_id_name} = PublicKey.default"),
            )
        };
        match lib_content.find("declare_id!") {
            Some(program_id_index) => {
                let start_from_program_id_line = lib_content.get(program_id_index..).unwrap();
                match get_inside_item_line(start_from_program_id_line, '"') {
                    Some(program_id) => {
                        program_content = program_content.replace(
                            "<ProgramId>",
                            &format!(
                                r#"export const {program_id_name} = new PublicKey("{program_id}");"#
                            ),
                        )
                    }
                    None => warn_no_program_id(),
                }
            }
            None => warn_no_program_id(),
        }
        fs::write(program_path, program_content)?;

        // Create index.ts
        let index_path = src_dir.join(src::INDEX_FILENAME);
        fs::write(index_path, src::INDEX_CONTENT)?;

        // Create package
        let package_dir = src_dir.parent().unwrap().canonicalize().unwrap();

        // Create package.json
        let package_name = format!("@native-to-anchor/{}", self.program_info.name);
        let package_json_path = package_dir.join(package::PACKAGE_JSON_FILENAME);
        let package_json_content = package::PACKAGE_JSON_CONTENT
            .replace("<Name>", &package_name)
            .replace("<Description>", &self.program_info.description)
            .replace("<Version>", &self.program_info.version)
            .replace("<Author>", &self.program_info.author)
            .replace("<License>", &self.program_info.license)
            .replace(
                "<Repository>",
                &format!("{}.git", self.program_info.repository),
            );
        fs::write(package_json_path, package_json_content)?;

        // Create tsconfig
        let tsconfig_json_path = package_dir.join(package::TSCONFIG_JSON_FILENAME);
        fs::write(tsconfig_json_path, package::TSCONFIG_JSON_CONTENT)?;

        // Create tsconfig base
        let tsconfig_base_json_path = package_dir.join(package::TSCONFIG_BASE_JSON_FILENAME);
        fs::write(tsconfig_base_json_path, package::TSCONFIG_BASE_JSON_CONTENT)?;

        // Create tsconfig cjs
        let tsconfig_cjs_json_path = package_dir.join(package::TSCONFIG_CJS_JSON_FILENAME);
        fs::write(tsconfig_cjs_json_path, package::TSCONFIG_CJS_JSON_CONTENT)?;

        // Create rollup config
        let rollup_config_path = package_dir.join(package::ROLLUP_CONFIG_FILENAME);
        fs::write(rollup_config_path, package::ROLLUP_CONFIG_CONTENT)?;

        // Remove generated idl if configured
        if !self.config.keep_idl_json {
            fs::remove_file(self.idl_path)?;
        }

        // Initialize package
        if self.config.skip_init {
            return Ok(());
        }

        let init_package = |cmd: &str| {
            info("Initializing package...");
            if let Err(e) = spawn_process(cmd) {
                error(format!(
                    "Something went wrong! Make sure you have yarn or npm installed. {e}"
                ))
            }
        };

        let is_yarn = match check_command("yarn -v") {
            true => {
                // Create yarn.lock
                if self.config.yarn_lock {
                    let yarn_lock_path = package_dir.join(package::YARN_LOCK_FILENAME);
                    fs::write(yarn_lock_path, package::YARN_LOCK_CONTENT)?;
                }

                init_package(&format!("yarn --cwd {package_dir:?} init:yarn"));
                true
            }
            false => match check_command("npm -v") {
                true => {
                    init_package(&format!("npm run --prefix {package_dir:?} init:npm"));
                    false
                }
                false => {
                    error("Could not find yarn or npm to initialize the project.");
                    return Ok(());
                }
            },
        };

        // Check if the package has been initialized
        let node_modules_path = package_dir.join(dirname::NODE_MODULES);
        match node_modules_path.exists() {
            true => {
                success("Succesfully initialized the package.");

                let package_manager_text = match is_yarn {
                    true => "yarn add",
                    false => "npm i",
                };
                info(format!(
                    "Add the package to your project with:\n{} {}@file:{}",
                    package_manager_text,
                    package_name,
                    package_dir.to_str().unwrap()
                ))
            }
            false => error("Something went wrong when initializing package."),
        }

        Ok(())
    }

    fn get_filepath_and_content(&self, file: CoderFile) -> (PathBuf, String) {
        let defaults = match file {
            CoderFile::Accounts => (accounts::FILENAME, accounts::CODER_TYPE, accounts::CONTENT),
            CoderFile::Events => (events::FILENAME, events::CODER_TYPE, events::CONTENT),
            CoderFile::Index => (index::FILENAME, index::CODER_TYPE, index::CONTENT),
            CoderFile::Instructions => (
                instructions::FILENAME,
                instructions::CODER_TYPE,
                instructions::CONTENT,
            ),
            CoderFile::State => (state::FILENAME, state::CODER_TYPE, state::CONTENT),
            CoderFile::Types => (types::FILENAME, types::CODER_TYPE, types::CONTENT),
        };

        let program_name_pascal = pascal_from_kebab(&self.program_info.name);

        info!(
            "{}",
            format!(
                "Creating coder: {}{}",
                program_name_pascal.bold(),
                defaults.1.bold()
            )
        );

        (
            self.coder_path.join(defaults.0),
            defaults.2.replace("<ProgramName>", &program_name_pascal),
        )
    }
}
