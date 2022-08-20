use std::{
    char, env,
    error::Error,
    fs::{self, DirEntry},
    path::{Path, PathBuf},
    process::Command,
};

use anchor_syn::idl::IdlType;
use colored::Colorize;
use log::{debug, error, info, warn};

use crate::generator::GeneratorResult;

pub fn open_files<F>(dir_path: impl AsRef<Path>, f: &mut F) -> GeneratorResult
where
    F: FnMut(DirEntry) -> GeneratorResult,
{
    if let Ok(dir) = fs::read_dir(dir_path.as_ref()) {
        for entry in dir {
            if let Ok(dir_entry) = entry {
                match dir_entry.path().is_file() {
                    true => f(dir_entry)?,
                    false => {
                        let path = dir_entry.path();
                        let name = path.file_name().unwrap().to_str().unwrap();
                        if !name.starts_with('.') {
                            open_files(dir_entry.path(), f)?
                        }
                    }
                }
            }
        }
    }

    Ok(())
}

pub fn get_all_content_from_folder(path: impl AsRef<Path>) -> Result<String, Box<dyn Error>> {
    let mut all_content = String::new();

    let mut f = |dir_entry: DirEntry| -> GeneratorResult {
        let file_content = get_file_without_tests(dir_entry.path())?;
        all_content.push_str(&file_content);
        Ok(())
    };

    open_files(path, &mut f)?;

    Ok(all_content)
}

pub fn get_file_without_tests(path: impl AsRef<Path>) -> Result<String, Box<dyn Error>> {
    let mut file_content = fs::read_to_string(path)?;

    // Don't include tests
    if let Some(test_index) = file_content.find("#[cfg(test)]\nmod") {
        file_content = file_content.get(..test_index).unwrap().to_owned();
    }

    Ok(file_content)
}

pub fn snake_from_pascal(pascal_case: impl AsRef<str>) -> String {
    let mut snake_case = String::new();

    for (i, c) in pascal_case.as_ref().chars().enumerate() {
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

pub fn snake_from_kebab(kebab_case: impl AsRef<str>) -> String {
    kebab_case.as_ref().replace('-', "_")
}

pub fn pascal_from_snake(snake_case: impl AsRef<str>) -> String {
    let mut pascal_case = String::new();

    let mut uppercase_indexes = Vec::new();

    for (i, c) in snake_case.as_ref().chars().enumerate() {
        if i == 0 || uppercase_indexes.contains(&i) {
            pascal_case.push_str(&c.to_uppercase().to_string());
        } else if c == '_' {
            uppercase_indexes.push(i + 1)
        } else {
            pascal_case.push(c);
        }
    }

    pascal_case
}

pub fn pascal_from_camel(camel_case: impl AsRef<str>) -> String {
    let bytes = camel_case.as_ref().as_bytes();
    let first_byte = bytes[0].to_ascii_uppercase();
    let mut new_bytes = Vec::with_capacity(bytes.len());
    new_bytes.push(first_byte);
    new_bytes.extend_from_slice(&bytes[1..]);

    String::from_utf8(new_bytes).unwrap()
}

pub fn pascal_from_kebab(kebab_case: impl AsRef<str>) -> String {
    pascal_from_snake(snake_from_kebab(kebab_case))
}

pub fn camel_from_pascal(pascal_case: impl AsRef<str>) -> String {
    let bytes = pascal_case.as_ref().as_bytes();
    let first_byte = bytes[0].to_ascii_lowercase();
    let mut new_bytes = Vec::with_capacity(bytes.len());
    new_bytes.push(first_byte);
    new_bytes.extend_from_slice(&bytes[1..]);

    String::from_utf8(new_bytes).unwrap()
}

pub fn camel_from_snake(snake_case: impl AsRef<str>) -> String {
    camel_from_pascal(pascal_from_snake(snake_case))
}

pub fn get_item_indices<C, I>(content: C, item: I) -> Vec<(usize, usize)>
where
    C: AsRef<str>,
    I: AsRef<str>,
{
    content
        .as_ref()
        .match_indices(item.as_ref())
        .map(|(i, _)| i)
        .enumerate()
        .collect::<Vec<(usize, usize)>>()
}

fn get_matching_closing_char(open_char: char) -> char {
    match open_char {
        '(' => ')',
        '{' => '}',
        '[' => ']',
        '<' => '>',
        '"' => '"',
        _ => unreachable!(),
    }
}

pub fn get_item(content: impl AsRef<str>, open_char: char) -> String {
    let close_char = get_matching_closing_char(open_char);

    let mut open_count = 0;
    let mut close_count = 0;
    let mut item = String::new();

    for line in content.as_ref().lines() {
        let line_open_count = line
            .match_indices(open_char)
            .map(|(index, _)| index)
            .collect::<Vec<usize>>()
            .len();
        let line_close_indexes = line
            .match_indices(close_char)
            .map(|(index, _)| index)
            .collect::<Vec<usize>>();

        let line_close_count = line_close_indexes.len();

        if line_close_count + close_count > line_open_count + open_count {
            // should break when close and open are equal
            // e.g AccountMeta::new(*account_pubkey, false));
            let last_valid_open_index_vec = line_close_indexes
                .iter()
                .enumerate()
                .filter(|(i, _)| *i == (line_open_count + open_count) - 1)
                .map(|(_, index)| *index)
                .collect::<Vec<usize>>();

            if last_valid_open_index_vec.len() != 0 {
                let valid_part = line.get(..last_valid_open_index_vec[0] + 1).unwrap();
                item.push_str(valid_part);
                item.push('\n');
                break;
            }
        }

        open_count += line_open_count;
        close_count += line_close_count;

        item.push_str(line.trim_end());
        item.push('\n');

        if open_count == close_count && open_count != 0 {
            break;
        }
    }

    item
}

pub fn get_inside_item(content: &str, open_char: char) -> Option<&str> {
    match content.find(open_char) {
        Some(open_index) => {
            let close_char = get_matching_closing_char(open_char);
            let close_indices = content
                .match_indices(close_char)
                .collect::<Vec<(usize, &str)>>();
            match close_indices.last() {
                Some((close_index, _)) => {
                    let inside = content.get(open_index + 1..*close_index).unwrap();
                    return Some(inside);
                }
                None => (),
            }
        }
        None => (),
    }
    None
}

pub fn get_inside_item_line(content: &str, open_char: char) -> Option<&str> {
    get_inside_item(content.lines().next().unwrap(), open_char)
}

pub fn get_inside_type(ty: &IdlType) -> Option<&Box<IdlType>> {
    match ty {
        IdlType::Array(inside, _) | IdlType::Option(inside) | IdlType::Vec(inside) => Some(inside),
        _ => None,
    }
}

pub fn get_inside_defined_type_name_from_str(ty_str: impl AsRef<str>) -> Option<String> {
    match ty_str.as_ref().parse::<IdlType>() {
        Ok(t) => get_inside_defined_type_name(t),
        Err(_) => None,
    }
}

fn get_inside_defined_type_name(ty: IdlType) -> Option<String> {
    match ty {
        IdlType::Defined(defined) => {
            if defined.starts_with("COption") {
                let inside = get_inside_item(&defined, '<');
                return inside.map(|i| i.to_owned());
            }

            Some(defined)
        }
        IdlType::Array(inside_type, _)
        | IdlType::Option(inside_type)
        | IdlType::Vec(inside_type) => get_inside_defined_type_name(*inside_type),
        _ => None,
    }
}

pub fn get_local_type<C, N>(name: N, content: C) -> Option<String>
where
    N: AsRef<str>,
    C: AsRef<str>,
{
    let name = name.as_ref();
    let content = content.as_ref();

    // Space at the end is to prevent incomplete names getting picked up
    if let Some(i) = content.find(&format!("pub struct {name} ")) {
        // Normal struct
        let item = get_item(content.get(i..).unwrap(), '{');
        return Some(item);
    }
    if let Some(i) = content.find(&format!("pub struct {name}(")) {
        // Wrapper struct
        let item = get_item(content.get(i..).unwrap(), '(');
        return Some(item);
    }
    if let Some(i) = content.find(&format!("pub struct {name};")) {
        // e.g pub struct ConstantProductCurve;
        // Get the line until ';'
        let start_content = content.get(i..).unwrap();
        let item = start_content
            .get(..start_content.find(';').unwrap())
            .unwrap();

        // Empty structs are not allowed for anchor so add {} at the end
        return Some(format!("{item} {{}}\n"));
    }
    if let Some(i) = content.find(&format!("pub enum {name} ")) {
        // Normal enum
        let item = get_item(content.get(i..).unwrap(), '{');
        return Some(item);
    }

    None
}

pub fn get_item_name_from_full_item(item: &str) -> &str {
    get_item_info_from_full_item_and_index(item, 2)
}

pub fn get_item_type_from_full_item(item: &str) -> &str {
    get_item_info_from_full_item_and_index(item, 1)
}

fn get_item_info_from_full_item_and_index(item: &str, index: usize) -> &str {
    item.lines()
        .enumerate()
        .find(|(i, _)| *i == 0)
        .map(|(_, l)| {
            l.split_whitespace()
                .enumerate()
                .find(|(i, _)| *i == index)
                .map(|(_, item_end)| item_end.split('(').next().unwrap())
                .unwrap()
        })
        .unwrap()
        .trim()
}

pub fn get_const_value<'a>(const_name: &str, all_content: &'a str) -> Option<&'a str> {
    let name = match const_name.contains(':') {
        true => {
            // Self::LEN
            const_name.split(':').last().unwrap()
        }
        false => const_name,
    };
    match all_content.find(&format!("const {name}")) {
        Some(i) => {
            let const_line = all_content.get(i..).unwrap().lines().next().unwrap();
            let const_str = const_line
                .split(';')
                .next()
                .unwrap()
                .split_whitespace()
                .last()
                .unwrap();

            Some(const_str)
        }
        None => None,
    }
}

pub fn get_absolute_path(path: impl AsRef<Path>) -> PathBuf {
    let path = path.as_ref();
    match path.is_absolute() {
        true => path.canonicalize().unwrap(),
        false => env::current_dir()
            .unwrap()
            .join(path)
            .canonicalize()
            .unwrap(),
    }
}

pub fn run_cmd(cmd: impl AsRef<str>) -> GeneratorResult {
    Command::new("sh").arg("-c").arg(cmd.as_ref()).output()?;
    Ok(())
}

pub fn spawn_process(cmd: impl AsRef<str>) -> GeneratorResult {
    Command::new("sh")
        .arg("-c")
        .arg(cmd.as_ref())
        .spawn()?
        .wait_with_output()?;
    Ok(())
}

pub fn rustfmt(path: impl AsRef<Path>) -> GeneratorResult {
    run_cmd(format!("rustfmt {:?}", path.as_ref()))
}

pub fn check_command(cmd: impl AsRef<str>) -> bool {
    let output = Command::new("sh")
        .arg("-c")
        .arg(cmd.as_ref())
        .output()
        .unwrap();
    output.status.success()
}

pub fn error(msg: impl AsRef<str>) {
    error!("{}", msg.as_ref().red().bold());
}

pub fn warn(msg: impl AsRef<str>) {
    warn!("{}", msg.as_ref().yellow().bold());
}

pub fn success(msg: impl AsRef<str>) {
    info!("{}", msg.as_ref().green().bold());
}

pub fn info(msg: impl AsRef<str>) {
    info!("{}", msg.as_ref().cyan().bold());
}

pub fn debug(msg: impl AsRef<str>) {
    debug!("[DEBUG]: {}", msg.as_ref())
}
