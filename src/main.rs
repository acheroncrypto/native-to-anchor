// This is a very hacky way to convert native Solana programs into
// Anchor dummy programs in order to get Anchor IDL.

// Requirements:
// 1. Instruction names must be in the form of PascalCase.
// 2. Corresponding function names must be in snake_case.
// 3. Optional accounts must be after default accounts.

// Program will panic if the requiriments are not met.
// You can fix it by adjusting the program based on the requirements.

// Remaining accounts will be commented out in the dummy Anchor program.

mod constants;
mod utils;

use std::{
    error::Error,
    fs::{self, read_to_string, DirEntry},
    path::{Path, PathBuf},
    process::Command,
    usize,
};

use colored::Colorize;
use constants::INSTRUCTIONS_DIR;
use serde_json::to_string_pretty;

use crate::{
    constants::{ANCHOR_DIR, DEFAULT_ARGS, IDL_DIR, PROGRAM_BEGINNING, SKIP_LINE},
    utils::{convert_account_name, get_account_meta_indices, get_item, snake_case},
};

type AResult = Result<(), Box<dyn Error>>;

fn main() -> AResult {
    open_files(PathBuf::from(INSTRUCTIONS_DIR))?;

    Ok(())
}

fn open_files(dir_path: PathBuf) -> AResult {
    if let Ok(dir) = fs::read_dir(dir_path) {
        for entry in dir {
            if let Ok(dir_entry) = entry {
                match dir_entry.path().is_file() {
                    true => create_idl(dir_entry)?,
                    false => open_files(dir_entry.path())?,
                }
            }
        }
    }

    Ok(())
}

fn create_idl(dir_entry: DirEntry) -> AResult {
    let file_name = dir_entry.file_name();
    let file_name = file_name.to_str().expect("Invalid filename");
    let snake_case_name = file_name.replace('-', "_").replace(".rs", "");
    let path = dir_entry.path();
    let path = path.to_str().unwrap();

    // Format the code
    Command::new("sh")
        .arg("-c")
        .arg(format!("rustfmt {:?}", path))
        .output()?;

    // Read the file
    let content = read_to_string(path)?;

    // Compare curly braces count
    let mut open_count = 0u8;
    let mut close_count = 0u8;

    let mut ixs = PROGRAM_BEGINNING.replace("program_name", &snake_case_name);
    let mut accounts = String::new();

    let functions_print = format!("Creating Anchor program for {snake_case_name}...");
    println!("{}", functions_print.bold().blue());

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

            // Accounts
            if line.contains('(') && line.contains("),") {
                // One liner with argument defined somewhere else
                // Example: Trade(TradeArgs),
                // Args defined in a seperate struct
                let struct_name = line.get(..line.find('(').unwrap()).unwrap().to_owned();

                let function_name = snake_case(struct_name.clone());

                // Create #[Accounts] for the function
                create_accounts(&content, &mut accounts, &function_name, &struct_name);

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
                                    !line.contains("struct")
                                        && !line.contains('}')
                                        && !line.contains("///")
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
                line = format!("pub fn {}", snake_case(line));

                line.replace_range(
                    line.find('(').unwrap()..(line.find(',').unwrap() + 1),
                    &format!("(ctx: Context<{struct_name}>, {args}) -> Result<()> {{ Ok(()) }}\n"),
                );
                replaced = true;
            } else if line.contains("{}") {
                // One line no argument
                // Example: FinalizeVote {},
                let struct_name = line.split_whitespace().next().unwrap();
                let function_name = snake_case(struct_name.to_owned());

                // Create #[Accounts] for the function
                create_accounts(&content, &mut accounts, &function_name, &struct_name);

                line = format!("pub fn {function_name}(ctx: Context<{struct_name}>}},");
            } else if line.contains('{') && line.contains('}') {
                // One line with argument(s)
                // Example: Transfer { new_owner: Pubkey },
                let struct_name = line.split_whitespace().next().unwrap();
                let function_name = snake_case(struct_name.to_owned());

                // Create #[Accounts] for the function
                create_accounts(&content, &mut accounts, &function_name, &struct_name);

                line = line
                    .get(line.find(" {").unwrap()..)
                    .unwrap()
                    .replace(" {", &format!("(ctx: Context<{struct_name}>,"));

                line = format!("pub fn {function_name}{line}");
            } else if line.len() > 1 && !line.contains(':') && !line.contains('}') {
                // Remaining types
                // Example 1: DepositReserveLiquidity {
                // liquidity_amount: u64,
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

                let function_name = snake_case(struct_name.clone());

                // Create #[Accounts] for the function
                create_accounts(&content, &mut accounts, &function_name, &struct_name);

                // Rename function to snake_case
                line = format!("pub fn {}", snake_case(line));

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

            ixs.push_str(&line);

            if line.len() > 1 {
                ixs.push('\n');
            }
        }

        if line.contains("pub enum") && line.contains("Instruction") && line.contains("{") {
            open_count += 1;
        }
    }

    ixs.pop(); // Remove ',' at the end
    ixs.push_str("}\n\n"); // space for Accounts

    // Add accounts
    ixs.push_str(&accounts);

    // Dummy Anchor
    let anchor_dir_path = path
        .replace(INSTRUCTIONS_DIR, ANCHOR_DIR)
        .replace(file_name, "");

    // Create Anchor dir(s) recursively
    if !Path::new(&anchor_dir_path).is_dir() {
        fs::create_dir_all(&anchor_dir_path)?;
    }

    // Write anchor file
    let anchor_path = format!("{anchor_dir_path}{file_name}");
    fs::write(&anchor_path, ixs)?;

    // Format the code
    Command::new("sh")
        .arg("-c")
        .arg(format!("rustfmt {anchor_path}"))
        .output()?;

    // IDL
    let idl_print = format!("Creating IDL for {snake_case_name}...");
    println!("{}", idl_print.bold().cyan());

    let idl =
        anchor_syn::idl::file::parse(anchor_path, String::from("0.1.0"), false, false)?.unwrap();

    let idl_dir_path = path
        .replace(INSTRUCTIONS_DIR, IDL_DIR)
        .replace(file_name, "");

    let idl_path = format!("{}{}", idl_dir_path, file_name.replace(".rs", ".json"));

    // Create IDL dir(s) recursively
    if !Path::new(&idl_dir_path).is_dir() {
        fs::create_dir_all(&idl_dir_path)?;
    }

    fs::write(&idl_path, to_string_pretty(&idl)?)?;

    println!("{}\n", "Success.".bold().green());

    Ok(())
}

fn create_accounts(content: &str, accounts: &mut String, function_name: &str, struct_name: &str) {
    println!("Creating context: {}", struct_name.bold());
    let (_, start_from_function) = content.split_at(
        content
            .find(&format!("pub fn {function_name}("))
            .expect("Function not found"),
    );

    // Get only function
    let function = get_item(start_from_function, '{');

    // Get default accounts
    let mut default_accounts = vec![];

    // Get vec! start index
    match function.find("vec!") {
        Some(vec_start_index) => {
            let function_starting_from_vec = function.split_at(vec_start_index).1;
            let vec_end_index = function_starting_from_vec.find(']').unwrap();
            let default_account_metas =
                function_starting_from_vec.get(..vec_end_index - 1).unwrap();

            let account_meta_split = default_account_metas
                .split("AccountMeta")
                .filter(|str| str.contains("::"))
                .map(|str| str.replace('*', ""))
                .collect::<Vec<String>>();

            for account_meta_str in &account_meta_split {
                let name_start_index = account_meta_str.find('(').unwrap() + 1;
                let name_end_index = account_meta_str.find(',').unwrap();
                let raw_account_name = account_meta_str
                    .get(name_start_index..name_end_index)
                    .unwrap();

                default_accounts.push(convert_account_name(raw_account_name).to_owned());
            }
        }
        None => {
            // Vec::with_capacity();
            let vec_string = "Vec::with_capacity";
            let function_starting_from_vec =
                function.split_at(function.find(vec_string).unwrap()).1;
            let inside_start_index = function_starting_from_vec.find('(').unwrap() + 1;
            let inside_end_index = function_starting_from_vec.find(");").unwrap();

            let total_capacity = function_starting_from_vec
                .get(inside_start_index..inside_end_index)
                .unwrap()
                .split('+')
                .map(|str| str.trim())
                .filter(|str| str.parse::<usize>().is_ok())
                .map(|number_str| number_str.parse::<usize>().unwrap())
                .reduce(|accum, number| number + accum)
                .unwrap_or_default();

            let account_meta_indices = get_account_meta_indices(function_starting_from_vec);
            let default_account_meta_indices = account_meta_indices
                .iter()
                .filter(|(current_index, _)| *current_index < total_capacity)
                .map(|(_, function_index)| *function_index)
                .collect::<Vec<usize>>();

            for i in default_account_meta_indices {
                let starting_from_account_meta = function_starting_from_vec.get(i..).unwrap();
                // Get inside account meta
                let account_name_start_index = starting_from_account_meta.find('(').unwrap() + 1;
                let account_name_end_index = starting_from_account_meta.find(',').unwrap();
                let raw_account_name = starting_from_account_meta
                    .get(account_name_start_index..account_name_end_index)
                    .unwrap()
                    .replace('*', "");

                default_accounts.push(convert_account_name(&raw_account_name).to_owned());
            }
        }
    };

    // Get all account metas
    let account_meta_indices = get_account_meta_indices(&function);

    for (index, meta_index) in account_meta_indices {
        let start_from_account_meta = function.get(meta_index..).unwrap();
        // Get only account meta
        let account_meta = get_item(start_from_account_meta, '(');

        let name_uncut = account_meta
            .get(account_meta.find('(').unwrap()..account_meta.find(',').unwrap())
            .unwrap()
            .replace('*', "")
            .replace('(', "");

        let account_name = convert_account_name(&name_uncut);

        let is_mut = !account_meta.contains("new_readonly(");
        let is_signer = !account_meta.contains(", false");

        // Accounts beginning
        if index == 0 {
            accounts.push_str(&format!(
                r#"#[derive(Accounts)]
pub struct {struct_name}<'info> {{
"#
            ));
        }

        let account_type = match is_signer {
            true => "Signer<'info>",
            false => match account_name {
                "system_program" => "Program<'info, System>",
                "token_program" => "Program<'info, Token>",
                "rent" => "Sysvar<'info, Rent>",
                "clock" => "Sysvar<'info, Clock>",
                _ => "AccountInfo<'info>",
            },
        };

        if !account_name.contains("Pubkey::default") {
            let is_optional_account =
                default_accounts.len() > 0 && !default_accounts.contains(&account_name.to_string());

            if is_mut {
                if is_optional_account {
                    // Add comment
                    accounts.push_str("//");
                }

                accounts.push_str("#[account(mut)]\n");
            }

            if is_optional_account {
                // Add comment
                accounts.push_str("//");
            }

            accounts.push_str(&format!("{account_name}: {account_type},\n"));
        }
    }

    // Close Accounts '}'
    if accounts.len() >= 3 {
        let last = accounts.get(accounts.len() - 3..).unwrap().trim();
        if last != "}" {
            accounts.push_str("}\n\n");
        }
    }
}
