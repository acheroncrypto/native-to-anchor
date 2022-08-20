// Requirements:
// 1. Instruction names must be in the form of PascalCase.
// 2. Corresponding function names must be in snake_case.
// 3. Optional accounts must be after default accounts.
//
// You can fix it by adjusting the program based on the requirements.
//
// Remaining accounts will be commented out in the dummy Anchor program.

use std::{
    cell::RefCell,
    fs,
    path::{Path, PathBuf},
    usize,
};

use anchor_syn::idl::{self, Idl, IdlType};
use colored::Colorize;
use log::info;
use serde_json::to_string_pretty;

use crate::{
    constants::{
        common::*,
        idl::{ACCOUNT_TRAITS, DEFAULT_ARGS, PROGRAM_PRETEXT, SKIP_LINE},
        known_types::{APPENDABLE_TYPES, REPLECABLE_TYPES},
    },
    generator::{Generator, GeneratorResult},
    push_or_continue,
    utils::{
        common::{
            debug, error, get_absolute_path, get_all_content_from_folder, get_const_value,
            get_file_without_tests, get_inside_defined_type_name_from_str, get_inside_item,
            get_inside_type, get_item, get_item_indices, get_item_name_from_full_item,
            get_item_type_from_full_item, get_local_type, info, rustfmt, snake_from_kebab,
            snake_from_pascal, success, warn,
        },
        generator::ProgramInfo,
        idl::{create_context, is_type_defined},
    },
};

pub struct ProgramAndIdlGenerator<'a> {
    program_generator: Option<ProgramGenerator<'a>>,
    idl_generator: Option<IdlGenerator<'a>>,
    program_info: &'a ProgramInfo,
    all_content: &'a str,
    /// Anchor lib.rs path
    anchor_path: PathBuf,
    /// All content that will be written to program/lib.rs
    anchor_content: RefCell<String>,
    replecable_types: RefCell<Vec<&'static [&'static str; 2]>>,
    irreplecable_types: RefCell<Vec<String>>,
}

pub struct ProgramGenerator<'a> {
    pub native_src_path: &'a Path,
}

pub struct IdlGenerator<'a> {
    pub idl_path: &'a Path,
    /// Whether to keep generated anchor program folder after IDL creation
    pub keep_dummy_program: bool,
}

impl<'a> ProgramAndIdlGenerator<'a> {
    pub fn new_program(generator: &'a Generator) -> Self {
        let anchor_path = generator
            .generated_project_path
            .join(dirname::PROGRAM)
            .join(filename::LIB);

        let anchor_content = PROGRAM_PRETEXT.replace(
            "<ProgramName>",
            &snake_from_kebab(&generator.program_info.name),
        );

        Self {
            program_generator: Some(ProgramGenerator {
                native_src_path: &generator.native_src_path,
            }),
            idl_generator: None,
            program_info: &generator.program_info,
            all_content: &generator.all_content,
            anchor_path,
            anchor_content: RefCell::new(anchor_content),
            replecable_types: RefCell::new(vec![]),
            irreplecable_types: RefCell::new(vec![]),
        }
    }

    pub fn new_idl(
        generator: &'a Generator,
        keep_dummy_program: bool,
        maybe_dummy_program_path: &Option<PathBuf>,
    ) -> Self {
        let (anchor_path, anchor_content, program_generator) = match maybe_dummy_program_path {
            Some(path) => {
                let path = get_absolute_path(path);
                let content = fs::read_to_string(&path).unwrap();
                (path, content, None)
            }
            None => {
                let path = generator
                    .generated_project_path
                    .join(dirname::PROGRAM)
                    .join(filename::LIB);
                let content = PROGRAM_PRETEXT.replace(
                    "<ProgramName>",
                    &snake_from_kebab(&generator.program_info.name),
                );
                (
                    path,
                    content,
                    Some(ProgramGenerator {
                        native_src_path: &generator.native_src_path,
                    }),
                )
            }
        };

        Self {
            program_generator,
            idl_generator: Some(IdlGenerator {
                keep_dummy_program,
                idl_path: &generator.idl_path,
            }),
            program_info: &generator.program_info,
            all_content: &generator.all_content,
            anchor_path,
            anchor_content: RefCell::new(anchor_content),
            replecable_types: RefCell::new(vec![]),
            irreplecable_types: RefCell::new(vec![]),
        }
    }

    pub fn run(self) -> GeneratorResult {
        // Create dummy program
        if self.program_generator.is_some() {
            info(format!(
                "Creating Anchor program for {}...",
                self.program_info.name
            ));

            // Create Anchor dir(s) recursively
            let anchor_dir = &self.anchor_path.parent().unwrap();
            if !Path::new(anchor_dir).is_dir() {
                fs::create_dir_all(anchor_dir)?;
            }

            // Format the code
            rustfmt(&self.anchor_path)?;

            // Create instructions
            self.create_instructions()?;

            // Create accounts
            self.create_accounts()?;

            // Create errors
            self.create_errors()?;

            // Write Anchor file
            self.write_anchor_dummy()?;
            success("Success.");
        }

        // Create IDL
        if self.idl_generator.is_some() {
            self.create_idl()?;
            success("Success.")
        }

        Ok(())
    }

    fn native_src_path(&self) -> &Path {
        self.program_generator.as_ref().unwrap().native_src_path
    }

    fn idl_generator(&self) -> &IdlGenerator {
        self.idl_generator.as_ref().unwrap()
    }

    fn create_instructions(&self) -> GeneratorResult {
        info!("{}", "Contexts".purple().bold());
        // Read instruction file
        let instruction_path = self.native_src_path().join(filename::INSTRUCTION);
        let maybe_instruction_content = fs::read_to_string(instruction_path);
        let content = match &maybe_instruction_content {
            Ok(c) => c,
            Err(_) => {
                warn("Could not find instruction file.");
                self.all_content
            }
        };

        let mut anchor_content = self.anchor_content.borrow_mut();
        let mut contexts = String::new();

        // Compare curly braces count
        let mut open_count = 0u8;
        let mut close_count = 0u8;

        'line_loop: for line in content.lines() {
            for skip_str in SKIP_LINE {
                if line.contains(skip_str) {
                    continue 'line_loop;
                }
            }

            if open_count > 0 {
                if line.contains("{") {
                    open_count += 1;
                }
                if line.contains('}') {
                    close_count += 1;

                    if close_count == open_count {
                        break;
                    }
                }

                let mut line = line.to_string();
                // Remove in line comments
                if let Some(start_index) = line.find("//") {
                    line.replace_range(start_index..line.len(), "");
                }

                line = line.trim().to_string();

                let mut replaced = false;

                // Contexts
                if line.contains('(') && line.contains("),") {
                    // One liner with argument defined somewhere else
                    // Example: Trade(TradeArgs),
                    // Args defined in a seperate struct
                    let struct_name = line.get(..line.find('(').unwrap()).unwrap().to_owned();
                    let function_name = snake_from_pascal(&struct_name);

                    // Create #[Accounts] for the function
                    push_or_continue!(
                        contexts,
                        create_context(&content, &self.all_content, &function_name, &struct_name)
                    );

                    // Get arguments from struct;
                    let arg_struct_name = line
                        .get((line.find('(').unwrap() + 1)..line.find(')').unwrap())
                        .unwrap();

                    // Get args
                    // Check if struct name is among the defaults
                    let args = if DEFAULT_ARGS.contains(&arg_struct_name) {
                        format!("arg: {arg_struct_name}")
                    } else {
                        match content.find(&format!("pub struct {arg_struct_name}")) {
                            Some(start_index) => {
                                let start_from_struct = content.split_at(start_index).1;
                                let struct_end_index = start_from_struct.find('}').unwrap();
                                let full_struct =
                                    start_from_struct.get(..struct_end_index + 1).unwrap();

                                full_struct
                                    .lines()
                                    .filter(|line| {
                                        !line.contains("struct ")
                                            && !line.contains('}')
                                            && !line.contains("//")
                                    })
                                    .map(|arg| arg.trim().replace("pub ", ""))
                                    .reduce(|acc, arg| format!("{acc}{arg}"))
                                    .unwrap_or_default()
                            }
                            // Could be Enum Type
                            None => format!("arg: {arg_struct_name}"),
                        }
                    };

                    // Rename function to snake_case
                    line = format!("pub fn {}", snake_from_pascal(&line));

                    line.replace_range(
                        line.find('(').unwrap()..(line.find(',').unwrap() + 1),
                        &format!(
                            "(ctx: Context<{struct_name}>, {args}) -> Result<()> {{ Ok(()) }}\n"
                        ),
                    );
                    replaced = true;
                } else if line.contains("{}") {
                    // One line no argument
                    // Example: FinalizeVote {},
                    let struct_name = line.split_whitespace().next().unwrap();
                    let function_name = snake_from_pascal(&struct_name);

                    // Create #[Accounts] for the function
                    push_or_continue!(
                        contexts,
                        create_context(&content, &self.all_content, &function_name, &struct_name)
                    );

                    line = format!("pub fn {function_name}(ctx: Context<{struct_name}>}},");
                } else if line.contains('{') && line.contains('}') {
                    // One line with argument(s)
                    // Example: Transfer { new_owner: Pubkey },
                    let struct_name = line.split_whitespace().next().unwrap();
                    let function_name = snake_from_pascal(&struct_name);

                    // Create #[Accounts] for the function
                    push_or_continue!(
                        contexts,
                        create_context(&content, &self.all_content, &function_name, &struct_name)
                    );

                    line = line
                        .get(line.find(" {").unwrap()..)
                        .unwrap()
                        .replace(" {", &format!("(ctx: Context<{struct_name}>,"));

                    line = format!("pub fn {function_name}{line}");
                } else if line.len() > 1 && !line.contains(':') && !line.contains('}') {
                    // Remaining types
                    // Example 1: DepositReserveLiquidity {
                    //     liquidity_amount: u64,
                    // },
                    // Example 2: Settle,

                    // Get struct name
                    let struct_name = if line.contains(" {") {
                        // '{' specified
                        line.get(..line.find(" {").unwrap()).unwrap().to_owned()
                    } else {
                        // No arg with ,
                        line.replace(',', "")
                    };

                    let function_name = snake_from_pascal(&struct_name);

                    // Create #[Accounts] for the function
                    push_or_continue!(
                        contexts,
                        create_context(&content, &self.all_content, &function_name, &struct_name)
                    );

                    // Rename function to snake_case
                    line = format!("pub fn {}", snake_from_pascal(&line));

                    if line.ends_with(',') {
                        // One liner without argument
                        line = line.replace(
                            ',',
                            &format!("(ctx: Context<{struct_name}>) -> Result<()> {{ Ok(()) }}\n"),
                        );
                        replaced = true;
                    } else {
                        line = line.replace(" {", &format!("(ctx: Context<{struct_name}>,"))
                    }
                }

                if !replaced {
                    line = line.replace("},", ") -> Result<()> { Ok(()) }\n");
                }

                anchor_content.push_str(&line);

                if line.len() > 1 {
                    anchor_content.push('\n');
                }
            }

            if line.contains("pub enum") && line.contains("Instruction") && line.contains("{") {
                open_count += 1;
            }
        }

        anchor_content.pop(); // Remove ',' at the end
        anchor_content.push_str("}\n\n"); // space for Contexts

        // Add contexts
        anchor_content.push_str(&contexts);

        Ok(())
    }

    fn create_accounts(&self) -> GeneratorResult {
        let state_path = self.native_src_path().join(filename::STATE);
        let content = if state_path.exists() {
            get_file_without_tests(state_path)?
        } else {
            // State file doesn't exist, look for state folder
            let state_path = self.native_src_path().join(dirname::STATE);
            if !state_path.exists() {
                warn("Could not find state file or folder.");
                return Ok(());
            }

            // Get all state folder content
            get_all_content_from_folder(state_path)?
        };

        self.create_accounts_from_content(content)
    }

    fn create_accounts_from_content(&self, content: String) -> GeneratorResult {
        let all_content = self.all_content;

        // Get all structs and types, remaining ones are accounts
        let all_types = RefCell::new(vec![]);
        let all_type_names = RefCell::new(vec![]);
        let types = RefCell::new(vec![]);
        let type_names = RefCell::new(vec![]);

        let mut push_all_types = |full_type: String| {
            let name = get_item_name_from_full_item(&full_type).to_owned();
            let mut all_type_names = all_type_names.borrow_mut();
            if !all_type_names.contains(&name) {
                all_types.borrow_mut().push(full_type);
                all_type_names.push(name);
            }
        };

        let mut push_types = |full_type: String| {
            let type_name = get_item_name_from_full_item(&full_type).to_owned();
            let mut type_names = type_names.borrow_mut();
            if !type_names.contains(&type_name) {
                types.borrow_mut().push(full_type);
                type_names.push(type_name);
            }
        };

        // Get all structs(from state file/folder)
        let indices = get_item_indices(&content, "pub struct");
        for (_, struct_indices) in indices {
            let full_struct = get_item(content.get(struct_indices..).unwrap(), '{');
            self.get_property_types(
                full_struct,
                &mut Box::new(&mut push_all_types),
                &mut Box::new(&mut push_types),
            );
        }

        // Add extra types that are not defined as a property(e.g fn params)
        for ty in all_types.borrow().iter() {
            let item_name = get_item_name_from_full_item(ty);
            if all_content.find(&format!("-> {item_name}")).is_some()
                || all_content.find(&format!(": {item_name},")).is_some()
                || all_content.find(&format!(": {item_name})")).is_some()
                || all_content.find(&format!("<{item_name}, ")).is_some()
            {
                push_types((*ty).to_owned());
            }
        }

        // Add accounts and fix mistyped accounts if any
        let account_names = self.get_best_guess_account_names();
        for &account_name in &account_names {
            // Check if the account has been added to types
            {
                let mut type_names = type_names.borrow_mut();
                if let Some(type_index) = type_names.iter().position(|name| name == account_name) {
                    type_names.swap_remove(type_index);
                    types.borrow_mut().swap_remove(type_index);
                }
            }

            // Add the account to all_types if it doesn't exist
            let all_type_names = all_type_names.borrow();
            if let None = all_type_names.iter().position(|name| name == account_name) {
                // Drop the borrow to not get runtime errors
                drop(all_type_names);

                match get_local_type(account_name, all_content) {
                    Some(full_account) => {
                        // We can just push all types because all properties are guaranteed to exist
                        push_all_types(full_account)
                    }
                    None => match APPENDABLE_TYPES.iter().find(|el| el[0] == account_name) {
                        Some(el) => {
                            let ty = el[1];
                            // We need to check the properties of the imported type because it will
                            // not exist inside the crate
                            self.get_property_types(
                                ty.into(),
                                &mut Box::new(&mut push_all_types),
                                &mut Box::new(&mut push_types),
                            );
                        }
                        None => error(format!(
                            "Account: '{account_name}' not found inside the crate."
                        )),
                    },
                }
            }
        }

        // Types that are not in all_types are accounts
        let all_types = all_types.borrow();
        let accounts = all_types
            .iter()
            .filter(|t| account_names.contains(&get_item_name_from_full_item(t)))
            .collect::<Vec<&String>>();

        let mut anchor_content = self.anchor_content.borrow_mut();

        info!("{}", "Accounts".purple().bold());
        for account in &accounts {
            let account_name = get_item_name_from_full_item(account);
            info!("Creating account: {}", account_name.bold());
            let account = format!("#[account]\n{account}");
            anchor_content.push_str(&format!("{account}\n"));
        }

        info!("{}", "Types".purple().bold());
        let types = all_types
            .iter()
            .filter(|t| !accounts.contains(&t))
            .collect::<Vec<&String>>();
        for ty in types {
            let type_name = get_item_name_from_full_item(&ty);
            info!("Creating type: {}", type_name.bold());
            let ty = format!("#[derive(AnchorSerialize, AnchorDeserialize)]\n{ty}\n");
            anchor_content.push_str(&ty);
        }

        // Remove unused types
        // Recursion is used here because the types we remove might potentially make other types useless
        loop {
            let mut used_once_count = 0usize;
            for type_name in type_names.borrow().iter() {
                let indices = get_item_indices(anchor_content.as_str(), type_name);
                if indices.len() == 1 {
                    debug(format!("Type '{type_name}' is only used once. Removing..."));

                    let item = get_local_type(type_name, anchor_content.as_str()).unwrap();
                    let anchor_serde_len =
                        "#[derive(AnchorSerialize, AnchorDeserialize)]".len() + 1;
                    let start_index = match get_item_type_from_full_item(&item) {
                        "struct" => indices[0].1 - (("pub struct".len() + 1) + anchor_serde_len),
                        "enum" => indices[0].1 - (("pub enum".len() + 1) + anchor_serde_len),
                        _ => unreachable!(),
                    };
                    anchor_content.replace_range(
                        start_index..start_index + item.len() + anchor_serde_len,
                        "",
                    );
                    used_once_count += 1;
                }
            }

            if used_once_count == 0 {
                break;
            }
        }

        Ok(())
    }

    // Returned names from this function is not guaranteed to be accounts. Works for most programs.
    fn get_best_guess_account_names(&self) -> Vec<&str> {
        let all_content = self.all_content;
        // Get guaranteed accounts
        let mut account_names = vec![];

        let mut push_account_name = |acc_name: &'a str| {
            if !account_names.contains(&acc_name)
                && !acc_name.contains("Instruction")
                && is_type_defined(acc_name)
                && acc_name != "Self"
            {
                account_names.push(acc_name)
            }
        };

        // Accounts from traits
        for account_trait in ACCOUNT_TRAITS {
            let indices = get_item_indices(all_content, &format!("impl {account_trait} for"));

            for (_, i) in indices {
                let line = all_content.get(i..).unwrap().lines().next().unwrap();
                let account_name = line.split_whitespace().collect::<Vec<&str>>()[3];
                push_account_name(account_name);
            }
        }

        // Accounts from `try_from_slice`
        for (_, i) in get_item_indices(all_content, &format!("::try_from_slice(")) {
            // This is the last \n index + 1 .. i
            if let Some(account_name_start_index) = all_content.get(..i).unwrap().rfind('\n') {
                let account_name = all_content
                    .get(account_name_start_index..i)
                    .unwrap()
                    .split_whitespace()
                    .last()
                    .unwrap();
                push_account_name(account_name);
            }
        }

        // Accounts from `try_from_slice_unchecked`
        for (_, i) in get_item_indices(all_content, &format!("try_from_slice_unchecked::")) {
            let account_name_line = all_content.get(i..).unwrap().lines().next().unwrap();
            if let Some(account_name) = get_inside_item(account_name_line, '<') {
                if is_type_defined(account_name) && account_name != "Self" {
                    push_account_name(account_name.split(':').last().unwrap());
                }
            }
        }

        account_names
    }

    fn get_property_types(
        &self,
        full_type: String,
        push_all_types: &mut Box<&mut dyn FnMut(String)>,
        push_types: &mut Box<&mut dyn FnMut(String)>,
    ) {
        let first_line = full_type.lines().next().unwrap();
        let is_wrapper_struct = first_line.ends_with(");");

        if is_wrapper_struct {
            // e.g: struct Wrapper(Foo);
            // Get inside type
            let inside = get_inside_item(first_line, '(');
            if let Some(inside_struct_name) = inside {
                // Get whether the inside struct is defined in the crate
                self.get_and_run_local_type(&inside_struct_name, push_all_types, push_types);
            };

            (*push_all_types)(format!("{first_line}\n"));
        } else {
            'line_loop: for line in full_type.lines() {
                for skip_str in SKIP_LINE {
                    if line.contains(skip_str) {
                        continue 'line_loop;
                    }
                }

                // For enums
                if get_item_type_from_full_item(&full_type) == "enum" {
                    let maybe_wrapped = get_inside_item(line, '(');
                    if let Some(wrapped) = maybe_wrapped {
                        match get_inside_item(&wrapped, '<') {
                            Some(wrapped) => {
                                self.get_and_run_local_type(&wrapped, push_all_types, push_types);
                            }
                            None => {
                                self.get_and_run_local_type(&wrapped, push_all_types, push_types);
                            }
                        }
                    }
                }

                // Only get properties from the type
                if !line.contains(':') || (line.contains("//") && line.contains(':')) {
                    continue;
                }

                // Get property types and find the types in the file
                let property_type = line
                    .split_once(':')
                    .unwrap()
                    .1
                    .trim()
                    .strip_suffix(',')
                    .unwrap();

                // Check for arrays for constant length
                if property_type.starts_with('[') {
                    let arr_len = property_type
                        .split(';')
                        .last()
                        .unwrap()
                        .strip_suffix(']')
                        .unwrap()
                        .trim_start();

                    if arr_len.parse::<usize>().is_err() {
                        if let Some(const_str) = get_const_value(arr_len, self.all_content) {
                            if const_str.parse::<usize>().is_ok() {
                                (*push_all_types)(full_type.replace(arr_len, const_str));
                                break;
                            }
                        }
                    }
                }

                if let Some(defined) = get_inside_defined_type_name_from_str(property_type) {
                    // Get whether the defined type is defined inside the crate
                    self.get_and_run_local_type(&defined, push_all_types, push_types);
                };
            }

            // Pushing at last because of const values, [Pubkey; MAX_SIGNERS]
            (*push_all_types)(full_type);
        }
    }

    fn get_and_run_local_type(
        &self,
        item_name: &str,
        push_all_types: &mut Box<&mut dyn FnMut(String)>,
        push_types: &mut Box<&mut dyn FnMut(String)>,
    ) {
        match get_local_type(item_name, self.all_content) {
            Some(local_type) => {
                self.get_property_types(local_type, push_all_types, push_types);
            }
            None => match REPLECABLE_TYPES.iter().find(|el| el[0] == item_name) {
                Some(ty) => self.push_replecable_types(ty),
                None => match APPENDABLE_TYPES.iter().find(|el| el[0] == item_name) {
                    Some(ty) => {
                        self.get_property_types(ty[1].into(), push_all_types, push_types);
                    }
                    None => {
                        let mut irreplecable_types = self.irreplecable_types.borrow_mut();
                        let item_name = item_name.to_owned();
                        if is_type_defined(&item_name) && !irreplecable_types.contains(&item_name) {
                            // Check if it's a tuple type e.g 'Meta, Stake'
                            if item_name.contains(',') {
                                for item_name in item_name.split(',') {
                                    self.get_and_run_local_type(
                                        item_name.trim(),
                                        push_all_types,
                                        push_types,
                                    );
                                }
                            } else {
                                warn(format!("Type '{item_name}' is not found."));
                                irreplecable_types.push(item_name);
                            }
                        }
                    }
                },
            },
        }
    }

    fn create_errors(&self) -> GeneratorResult {
        info!("{}", "Errors".purple().bold());

        let error_path = self.native_src_path().join(filename::ERROR);
        let content = match fs::read_to_string(error_path) {
            Ok(c) => c,
            Err(_) => {
                warn("Could not find error file.");
                return Ok(());
            }
        };

        if let Some(error_index) = content.find(&format!("pub enum")) {
            let error = get_item(content.get(error_index..).unwrap(), '{');
            let error = error.replace("#[error", "#[msg");
            let error_name = get_item_name_from_full_item(&error);
            info!("Creating error: {}", error_name.bold());

            let mut anchor_content = self.anchor_content.borrow_mut();
            anchor_content.push_str(&format!("#[error_code]{error}"));
        }

        Ok(())
    }

    fn write_anchor_dummy(&self) -> GeneratorResult {
        let mut anchor_content = self.anchor_content.borrow_mut();

        for replecable_type in self.replecable_types.borrow().iter() {
            (*anchor_content) = (*anchor_content)
                .replace(
                    &format!(": {},", replecable_type[0]),
                    &format!(": {},", replecable_type[1]),
                )
                .replace(
                    &format!("<{}", replecable_type[0]),
                    &format!("<{}", replecable_type[1]),
                )
                .replace(
                    &format!(", {}", replecable_type[0]),
                    &format!(", {}", replecable_type[1]),
                )
                .replace(
                    &format!("{}>", replecable_type[0]),
                    &format!("{}>", replecable_type[1]),
                );
        }

        fs::write(&self.anchor_path, anchor_content.as_bytes())?;

        // Format the code
        rustfmt(&self.anchor_path)?;

        Ok(())
    }

    fn create_idl(&self) -> GeneratorResult {
        info(format!(
            "Creating Anchor IDL for {}...",
            self.program_info.name
        ));

        let mut idl = self.parse_idl();
        let mut new_idl = false;

        // Check to see if all instruction arguments exist if they are defined
        for ix in &idl.instructions {
            for arg in &ix.args {
                let mut arg_type = &arg.ty;
                if let Some(inside_type) = get_inside_type(&arg.ty) {
                    arg_type = inside_type;
                }

                if let IdlType::Defined(name) = arg_type {
                    // Exclude some of the known types like COption
                    if name.contains("COption") || name.contains("&'") {
                        continue;
                    }

                    let mut anchor_content = self.anchor_content.borrow_mut();
                    if let None = get_local_type(name, anchor_content.as_str()) {
                        // Defined type doesn't exist in anchor file
                        // Try to find it from all content
                        match get_local_type(name, self.all_content) {
                            Some(defined_type) => {
                                info!("{}", format!("Adding missing type '{name}'").purple());

                                // Add the type to anchor content
                                anchor_content.push_str(&format!("\n#[derive(AnchorSerialize, AnchorDeserialize)]\n{defined_type}\n"));
                                new_idl = true;
                            }
                            None => match REPLECABLE_TYPES.iter().find(|el| el[0] == name) {
                                Some(ty) => {
                                    self.push_replecable_types(ty);
                                    new_idl = true;
                                }
                                None => {
                                    error(format!("Instruction: '{}' arg: '{}' type: '{}' is not defined inside the crate.",
                                    ix.name,
                                    arg.name,
                                    name
                               ))
                                }
                            },
                        }
                    }
                }
            }
        }

        if new_idl {
            // Rewrite the anchor file
            self.write_anchor_dummy()?;

            // Re-create the idl
            idl = self.parse_idl();
        }

        // Normalize error codes from 6000 to 0
        for errors in &mut idl.errors {
            for error in errors {
                error.code -= 6000
            }
        }

        fs::write(&self.idl_generator().idl_path, to_string_pretty(&idl)?)?;

        // Delete anchor dummy if configured
        if !self.idl_generator().keep_dummy_program {
            // Dangerous O_o
            // fs::remove_dir_all(self.anchor_path.parent().unwrap())?;
            fs::remove_file(&self.anchor_path)?;
            fs::remove_dir(self.anchor_path.parent().unwrap())?;
        }

        Ok(())
    }

    fn parse_idl(&self) -> Idl {
        idl::file::parse(
            &self.anchor_path,
            self.program_info.version.to_owned(),
            false,
            true,
            false,
        )
        .unwrap()
        .unwrap()
    }

    fn push_replecable_types(&self, ty: &'static [&str; 2]) {
        let mut replecable_types = self.replecable_types.borrow_mut();
        if !replecable_types.contains(&ty) {
            replecable_types.push(ty);
        }
    }
}
