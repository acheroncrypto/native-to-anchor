use anchor_syn::idl::IdlType;
use colored::Colorize;
use log::info;

use crate::{
    constants::idl::ACCOUNT_SPLIT,
    utils::common::{get_item, get_item_indices, warn},
};

#[macro_export]
macro_rules! push_or_continue {
    ($contexts:expr, $maybe_context:expr) => {{
        match $maybe_context {
            Some(c) => $contexts.push_str(&c),
            None => continue,
        };
    }};
}

pub fn convert_account_name(name_uncut: impl AsRef<str>) -> String {
    let mut account_name = name_uncut.as_ref();

    for split in ACCOUNT_SPLIT {
        let split_parts = name_uncut
            .as_ref()
            .trim()
            .split(split)
            .collect::<Vec<&str>>();
        if split_parts.len() > 1 {
            account_name = split_parts[0];
            break;
        }
    }

    account_name = if account_name.contains("system_program") {
        "system_program"
    } else if account_name.contains("token_program") || account_name.contains("spl_token") {
        "token_program"
    } else if account_name.contains("bpf_loader_upgradeable") {
        "bpf_loader_upgradeable"
    } else if account_name.contains("::rent") {
        "rent"
    } else if account_name.contains("clock") {
        "clock"
    } else {
        account_name
    };

    account_name = account_name.trim();

    if account_name.contains("::") {
        return account_name.replace("::", "_");
    }
    if account_name.contains('.') {
        return account_name.replace('.', "_");
    }

    account_name.to_owned()
}

pub fn is_type_defined(type_name: impl AsRef<str>) -> bool {
    match type_name.as_ref().parse::<IdlType>() {
        Ok(t) => match t {
            IdlType::Defined(_) => true,
            _ => false,
        },
        Err(_) => false,
    }
}

pub fn create_context(
    content: &str,
    all_content: &str,
    function_name: &str,
    struct_name: &str,
) -> Option<String> {
    let mut context = String::new();
    info!("Creating context: {}", struct_name.bold());

    // Get the function
    let function = match content.find(&format!("pub fn {function_name}(")) {
        Some(start_index) => get_item(content.get(start_index..).unwrap(), '{'),
        None => match all_content.find(&format!("pub fn {function_name}(")) {
            Some(start_index) => get_item(all_content.get(start_index..).unwrap(), '{'),
            None => {
                warn(format!("Function '{function_name}' not found. This may make instruction layouts invalid, check and fix if it's needed."));
                return None;
            }
        },
    };

    // Get default accounts
    let mut default_accounts = vec![];

    // Get vec! start index
    match function.find("vec!") {
        Some(vec_start_index) => {
            // vec!
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

            let account_meta_indices =
                get_item_indices(function_starting_from_vec, "AccountMeta::");
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
    let account_meta_indices = get_item_indices(&function, "AccountMeta::");

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
            context.push_str(&format!(
                r#"#[derive(Accounts)]
pub struct {struct_name}<'info> {{
"#
            ));
        }

        let account_type = match is_signer {
            true => "Signer<'info>",
            false => match account_name.as_str() {
                "system_program" => "Program<'info, System>",
                "token_program" => "Program<'info, Token>",
                "rent" => "Sysvar<'info, Rent>",
                "clock" => "Sysvar<'info, Clock>",
                _ => "AccountInfo<'info>",
            },
        };

        if !account_name.contains("Pubkey::default") {
            let is_optional_account =
                default_accounts.len() > 0 && !default_accounts.contains(&account_name.to_owned());

            if is_mut {
                if is_optional_account {
                    // Add comment
                    context.push_str("// ");
                }

                context.push_str("#[account(mut)]\n");
            }

            if is_optional_account {
                // Add prefix
                context.push_str("// optional_");
            }

            context.push_str(&format!("{account_name}: {account_type},\n"));
        }
    }

    // Close Accounts '}'
    if context.len() >= 3 {
        let last = context.get(context.len() - 3..).unwrap().trim();
        if last != "}" {
            context.push_str("}\n\n");
        }
    }

    Some(context)
}
