use std::char;

use crate::constants::ACCOUNT_SPLIT;

pub fn snake_case(pascal_case: String) -> String {
    let mut snake_case = String::new();

    for (i, c) in pascal_case.chars().enumerate() {
        if c.is_uppercase() {
            if i == 0 {
                snake_case.push_str(&c.to_lowercase().to_string())
            } else {
                snake_case.push_str(&format!("_{}", c.to_lowercase()))
            }
        } else {
            snake_case.push(c);
        }
    }

    snake_case
}

pub fn convert_account_name(name_uncut: &str) -> &str {
    let mut account_name = &name_uncut[..];

    for split in ACCOUNT_SPLIT {
        let split_parts = name_uncut.trim().split(split).collect::<Vec<&str>>();
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
    } else if account_name.contains("rent::") {
        "rent"
    } else if account_name.contains("clock") {
        "clock"
    } else if account_name.contains(".unwrap") {
        account_name.split('.').collect::<Vec<&str>>()[0]
    } else {
        account_name
    };

    account_name.trim()
}

pub fn get_account_meta_indices(str: &str) -> Vec<(usize, usize)> {
    str.match_indices("AccountMeta::")
        .map(|(i, _)| i)
        .enumerate()
        .collect::<Vec<(usize, usize)>>()
}

pub fn get_item(str: &str, open_char: char) -> String {
    let close_char = match open_char {
        '(' => ')',
        '{' => '}',
        '[' => ']',
        _ => '_',
    };

    let mut open_count = 0;
    let mut close_count = 0;
    let mut item = String::new();

    for line in str.lines() {
        let line_open_count = line
            .match_indices(open_char)
            .map(|(index, _)| index)
            .collect::<Vec<usize>>()
            .len();
        let line_close_count = line
            .match_indices(close_char)
            .map(|(index, _)| index)
            .collect::<Vec<usize>>()
            .len();

        open_count += line_open_count;
        close_count += line_close_count;

        item.push_str(line);
        item.push('\n');

        if open_count != 0 && open_count == close_count {
            break;
        }
    }

    item
}
