use std::{fs, path::Path};

use serde_derive::Deserialize;

#[derive(Deserialize)]
struct CargoToml {
    package: Package,
}

#[derive(Deserialize)]
pub struct Package {
    pub name: Option<String>,
    pub description: Option<String>,
    pub version: Option<String>,
    pub license: Option<String>,
    pub repository: Option<String>,
    pub authors: Option<Vec<String>>,
}

pub struct ProgramInfo {
    pub name: String,
    pub description: String,
    pub version: String,
    pub license: String,
    pub repository: String,
    pub author: String,
}

impl Default for ProgramInfo {
    fn default() -> Self {
        Self {
            name: "native-program".into(),
            version: "0.1.0".into(),
            license: "Apache-2.0".into(),
            description: "".into(),
            author: "".into(),
            repository: "".into(),
        }
    }
}

pub fn get_program_info(cargo_toml_path: &Path) -> ProgramInfo {
    let cargo_toml: CargoToml =
        toml::from_str(&fs::read_to_string(cargo_toml_path).unwrap()).unwrap();
    let package = cargo_toml.package;

    ProgramInfo {
        name: package.name.unwrap_or(ProgramInfo::default().name),
        description: package
            .description
            .unwrap_or(ProgramInfo::default().description),
        version: package.version.unwrap_or(ProgramInfo::default().version),
        license: package.license.unwrap_or(ProgramInfo::default().license),
        author: package
            .authors
            .unwrap_or(vec![ProgramInfo::default().author])
            .iter()
            .map(|a| a.to_owned())
            .reduce(|acc, cur| match acc.as_str() {
                "" => cur,
                _ => format!("{acc}, {cur}"),
            })
            .unwrap(),
        repository: package
            .repository
            .unwrap_or(ProgramInfo::default().repository),
    }
}
