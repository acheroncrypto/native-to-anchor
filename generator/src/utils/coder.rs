use anchor_syn::idl::{EnumFields, Idl, IdlField, IdlType, IdlTypeDefinitionTy};

use super::common::{
    camel_from_pascal, camel_from_snake, error, get_const_value, get_inside_item, get_item, warn,
};

pub enum AccountSpace {
    Normal(usize),
    PaddingNeeded((usize, usize)),
    Variable,
    NotFound,
}

pub fn get_total_space_for_account<A, C>(account_name: A, all_content: C, idl: &Idl) -> AccountSpace
where
    A: AsRef<str>,
    C: AsRef<str>,
{
    let acc_name = account_name.as_ref();
    let all_content = all_content.as_ref();

    // Try to calculate total space from the generated idl
    let idl_space = get_account_space_from_idl(acc_name, idl);

    // Check `Pack` implementation
    let maybe_pack_space = get_account_space_from_pack(acc_name, all_content);

    match idl_space {
        AccountSpace::Normal(idl_space) => match maybe_pack_space {
            Some(pack_space) => {
                if pack_space > idl_space {
                    return AccountSpace::PaddingNeeded((pack_space, pack_space - idl_space));
                } else if pack_space == idl_space {
                    return AccountSpace::Normal(pack_space);
                }

                error(format!("{acc_name} {idl_space} {pack_space}"));

                unreachable!("Idl space cannot be bigger than pack space!")
            }
            None => return AccountSpace::Normal(idl_space),
        },
        AccountSpace::Variable => {
            if let Some(pack_space) = maybe_pack_space {
                return AccountSpace::Normal(pack_space);
            }

            return AccountSpace::Variable;
        }
        AccountSpace::NotFound => {
            if let Some(pack_space) = maybe_pack_space {
                return AccountSpace::Normal(pack_space);
            }
        }
        _ => unreachable!(),
    }

    AccountSpace::NotFound
}

fn get_account_space_from_idl(account_name: impl AsRef<str>, idl: &Idl) -> AccountSpace {
    if let Some(acc) = idl
        .accounts
        .iter()
        .find(|&acc| acc.name == account_name.as_ref())
    {
        if let IdlTypeDefinitionTy::Struct { fields } = &acc.ty {
            let mut account_space = 0usize;
            for field in fields {
                match get_idl_type_size(&field.ty, idl) {
                    Some(field_size) => account_space += field_size,
                    None => return AccountSpace::Variable,
                }
            }

            return AccountSpace::Normal(account_space);
        }
    };

    AccountSpace::NotFound
}

fn get_account_space_from_pack<A, C>(account_name: A, all_content: C) -> Option<usize>
where
    A: AsRef<str>,
    C: AsRef<str>,
{
    let acc_name = account_name.as_ref();
    let all_content = all_content.as_ref();

    if let Some(i) = all_content.find(&format!("impl Pack for {acc_name} ")) {
        let pack_impl_content = get_item(all_content.get(i..).unwrap(), '{');
        let len_line = pack_impl_content
            .lines()
            .filter(|&l| l.trim_start().starts_with("const") && l.contains("LEN"))
            .collect::<Vec<&str>>()[0];
        let len = len_line
            .split_once(';')
            .unwrap()
            .0
            .split_whitespace()
            .last()
            .unwrap();
        // len could be defined as a constant in another place
        let len = match len.parse::<usize>() {
            Ok(l) => l,
            Err(_) => {
                // len is not a usize, check for const definition
                let maybe_const_str = get_const_value(len, all_content);
                if let Some(const_str) = maybe_const_str {
                    return Some(const_str.parse::<usize>().unwrap());
                }

                return None;
            }
        };

        return Some(len);
    }

    None
}

pub fn get_idl_type_size(idl_type: &IdlType, idl: &Idl) -> Option<usize> {
    let size: usize = match idl_type {
        IdlType::Bool => 1,
        IdlType::U8 => 1,
        IdlType::I8 => 1,
        IdlType::U16 => 2,
        IdlType::I16 => 2,
        IdlType::U32 => 4,
        IdlType::I32 => 4,
        IdlType::F32 => 4,
        IdlType::U64 => 8,
        IdlType::I64 => 8,
        IdlType::F64 => 8,
        IdlType::U128 => 16,
        IdlType::I128 => 16,
        IdlType::PublicKey => 32,
        IdlType::Defined(name) => {
            // Known defined types
            match name.as_str() {
                "Decimal" => return Some(16),
                "&'staticstr" => return None,
                _ => (),
            }

            if let Some(type_def) = idl
                .types
                .iter()
                .find(|&type_def| &type_def.name == name)
                .or(idl.accounts.iter().find(|&acc_def| &acc_def.name == name))
            {
                match &type_def.ty {
                    IdlTypeDefinitionTy::Enum { variants } => {
                        // Calculate maximum enum size
                        let mut maximum_enum_size = 0usize;
                        for variant in variants {
                            if let Some(fields) = &variant.fields {
                                match fields {
                                    EnumFields::Named(names) => {
                                        let mut named_size = 0usize;
                                        for name in names {
                                            if let Some(name_size) =
                                                get_idl_type_size(&name.ty, idl)
                                            {
                                                named_size += name_size
                                            }
                                        }
                                        if named_size > maximum_enum_size {
                                            maximum_enum_size = named_size
                                        }
                                    }
                                    EnumFields::Tuple(tuples) => {
                                        for tuple in tuples {
                                            if let Some(tuple_size) = get_idl_type_size(tuple, idl)
                                            {
                                                if tuple_size > maximum_enum_size {
                                                    maximum_enum_size = tuple_size
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        return Some(1 + maximum_enum_size);
                    }
                    IdlTypeDefinitionTy::Struct { fields } => {
                        let mut total_size = 0usize;
                        for field in fields {
                            match get_idl_type_size(&field.ty, idl) {
                                Some(field_size) => total_size += field_size,
                                None => return None,
                            }
                        }

                        return Some(total_size);
                    }
                }
            }

            return None;
        }
        IdlType::Array(inside_type, len) => match get_idl_type_size(inside_type, idl) {
            Some(inside_size) => inside_size * len,
            None => return None,
        },
        IdlType::Bytes | IdlType::String | IdlType::Vec(_) | IdlType::Option(_) => return None,
    };

    Some(size)
}

pub fn get_max_span(ty: &IdlType, arg_name: impl AsRef<str>, idl: &Idl) -> String {
    let arg_name = arg_name.as_ref();

    match ty {
        IdlType::Bytes | IdlType::String => format!("+4 + {arg_name}.length"),
        IdlType::Array(element_type, len) => match get_idl_type_size(element_type, idl) {
            Some(element_size) => format!("+{element_size} * {len}"),
            None => unreachable!(),
        },
        IdlType::Defined(defined_type_name) => {
            let mut needed_span = String::new();

            if defined_type_name.contains("COption") {
                needed_span.push_str("+4");
                let inside_type = get_inside_item(defined_type_name, '<').unwrap();
                match inside_type.parse::<IdlType>() {
                    Ok(inside_type) => {
                        needed_span.push_str(&get_max_span(&inside_type, arg_name, idl))
                    }
                    Err(_) => error(format!("Could not get size of COption arg '{}'.", arg_name)),
                }
            }

            if let Some(defined_type) = idl
                .types
                .iter()
                .find(|&type_def| &type_def.name == defined_type_name)
                .or(idl
                    .accounts
                    .iter()
                    .find(|&acc_def| &acc_def.name == defined_type_name))
            {
                match &defined_type.ty {
                    IdlTypeDefinitionTy::Struct { fields } => {
                        for field in fields {
                            needed_span.push_str(&get_max_span(
                                &field.ty,
                                format!("{}.{}", arg_name, field.name),
                                idl,
                            ));
                        }
                    }
                    IdlTypeDefinitionTy::Enum { variants } => {
                        needed_span
                            .push_str(&format!("+(() => {{switch (Object.keys({arg_name})[0]) {{"));

                        for variant in variants {
                            let variant_name = camel_from_pascal(&variant.name);
                            needed_span.push_str(&format!(r#"case "{}": return 1 "#, variant_name));
                            match &variant.fields {
                                Some(fields) => match fields {
                                    EnumFields::Named(named_field_types) => {
                                        for named_field in named_field_types {
                                            needed_span.push_str(&get_max_span(
                                                &named_field.ty,
                                                &format!("{arg_name}.{variant_name}"),
                                                idl,
                                            ))
                                        }
                                        needed_span.push(';')
                                    }
                                    EnumFields::Tuple(field_types) => {
                                        for field_type in field_types {
                                            needed_span
                                                .push_str(&get_max_span(field_type, arg_name, idl));
                                        }

                                        needed_span.push(';')
                                    }
                                },
                                None => needed_span.push(';'),
                            }
                        }

                        needed_span.push_str("}})()")
                    }
                }
            }

            needed_span
        }
        IdlType::Option(inside_type) => match get_idl_type_size(inside_type, idl) {
            Some(inside_size) => {
                format!("+1 + ({arg_name} === null ? 0 : {inside_size})")
            }
            None => {
                format!(
                    "+1 + ({arg_name} === null ? 0 : {})",
                    get_max_span(inside_type, arg_name, idl).trim_start_matches('+')
                )
            }
        },
        IdlType::Vec(element_type) => {
            match get_idl_type_size(element_type, idl) {
                Some(element_size) => {
                    // Sized
                    format!("+4 + {arg_name}.length * {element_size}")
                }
                None => {
                    // Unsized
                    format!(
                        "+4 + {arg_name}.reduce((a: number, c: any) => a {}, 0)",
                        get_max_span(element_type, "c", idl)
                    )
                }
            }
        }
        _ => match get_idl_type_size(ty, idl) {
            Some(sized_span) => format!("+ {sized_span}"),
            None => unreachable!(),
        },
    }
}

pub fn get_buffer_type(idl_field: &IdlField, idl: &Idl) -> String {
    format!(
        r#"{}"{}"),"#,
        get_buffer_type_internal(&idl_field.ty, idl),
        idl_field.name
    )
}

fn get_buffer_type_internal(idl_type: &IdlType, idl: &Idl) -> String {
    let buffer_type = match idl_type {
        IdlType::Array(inside_type, len) => {
            return format!(
                "B.seq({}), {len}, ",
                get_buffer_type_internal(inside_type, idl)
            );
        }
        IdlType::Bool => "B.bool",
        IdlType::Bytes => "B.bytes",
        IdlType::Defined(t) => {
            if t.starts_with("COption") {
                let inside_result = get_inside_item(t, '<').unwrap().parse::<IdlType>();
                match inside_result {
                    Ok(inside) => {
                        let inside_buffer_type = get_buffer_type_internal(&inside, idl);
                        return format!("B.coption({inside_buffer_type}), ");
                    }
                    Err(_) => error(format!("Type {t} not parseable")),
                }
            } else {
                match t.as_str() {
                    "Decimal" => return format!("B.decimal("),
                    "&'astr" => return get_buffer_type_internal(&IdlType::String, idl),
                    _ => (),
                }
            }

            // Check types and accounts
            let maybe_type_def = idl
                .types
                .iter()
                .find(|&type_def| &type_def.name == t)
                .or(idl.accounts.iter().find(|&type_def| &type_def.name == t));
            if let Some(type_def) = maybe_type_def {
                match &type_def.ty {
                    IdlTypeDefinitionTy::Struct { fields } => {
                        let mut struct_properties = String::new();
                        for field in fields {
                            let inside_buffer_type = get_buffer_type_internal(&field.ty, idl);
                            struct_properties
                                .push_str(&format!(r#"{}"{}"),"#, inside_buffer_type, field.name));
                        }

                        return format!("B.struct([{struct_properties}], ");
                    }
                    IdlTypeDefinitionTy::Enum { variants } => {
                        let mut enum_buffer_type = format!(
                            r#"((p: string) => {{ const U = B.union(B.u8("discriminator"), null, p);"#,
                        );

                        for (i, variant) in variants.iter().enumerate() {
                            let variant_name = camel_from_pascal(&variant.name);
                            match &variant.fields {
                                Some(fields) => match fields {
                                    EnumFields::Named(named_field_types) => {
                                        let mut properties = String::new();
                                        for named_field in named_field_types {
                                            properties.push_str(&format!(
                                                r#"{}"{}"),"#,
                                                get_buffer_type_internal(&named_field.ty, idl),
                                                camel_from_snake(&named_field.name)
                                            ))
                                        }

                                        enum_buffer_type.push_str(&format!(
                                            r#"U.addVariant({i}, B.struct([{properties}]), "{variant_name}");"#,
                                        ));
                                    }
                                    EnumFields::Tuple(field_types) => {
                                        if field_types.len() != 1 {
                                            error(format!(
                                                "Tuple enum type for '{}' is not supported!",
                                                variant_name
                                            ));
                                        }
                                        // TODO: support tuple enum types (u64, String)
                                        let field_type = &field_types[0];
                                        let buffer_type =
                                            get_buffer_type_internal(&field_type, idl);
                                        enum_buffer_type.push_str(&format!(
                                            r#"U.addVariant({i}, {buffer_type}), "{variant_name}");"#,
                                        ));
                                    }
                                },
                                None => {
                                    enum_buffer_type.push_str(&format!(
                                        r#"U.addVariant({i}, B.struct([]), "{variant_name}");"#,
                                    ));
                                }
                            }
                        }

                        enum_buffer_type.push_str("return U;})(");

                        return enum_buffer_type;
                    }
                }
            }

            warn(format!("Type '{t}' not found. Please implement it manually or re-run the program after adding the type."));
            "B.u8"
        }
        IdlType::F32 => "B.f32",
        IdlType::F64 => "B.f64",
        IdlType::I128 => "B.i128",
        IdlType::I16 => "B.i16",
        IdlType::I32 => "B.i32",
        IdlType::I64 => "B.i64",
        IdlType::I8 => "B.i8",
        IdlType::Option(inside) => {
            let inside_buffer_type = get_buffer_type_internal(&inside, idl);
            return format!("B.option({inside_buffer_type}), ");
        }
        IdlType::PublicKey => "B.publicKey",
        IdlType::String => "B.utf8Str",
        IdlType::U128 => "B.u128",
        IdlType::U16 => "B.u16",
        IdlType::U32 => "B.u32",
        IdlType::U64 => "B.u64",
        IdlType::U8 => "B.u8",
        IdlType::Vec(inside) => {
            return format!("B.vec({}), ", get_buffer_type_internal(inside, idl))
        }
    };

    format!("{buffer_type}(")
}
