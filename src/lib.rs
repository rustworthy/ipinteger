#![allow(non_snake_case)]

mod utils;
use std::str::Split;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, ipinteger!");
}

fn parse_out_octets(ip: &str, validate_count: bool) -> Option<Split<'_, char>> {
    let octets = ip.split('.');
    if validate_count && octets.clone().count() != 4 {
        return None;
    }
    Some(octets)
}

fn parse_ip_v4_octet(octet: &str) -> Option<u32> {
    let octet_len = octet.len();
    let valid = octet_len <= 3 && octet_len > 0 && octet.chars().all(|c| c.is_numeric());
    if !valid {
        return None;
    }
    let result = octet.parse().unwrap();
    match result {
        0..=255 => Some(result),
        _ => None,
    }
}

#[wasm_bindgen]
pub fn ipV4ToInt(ip: &str) -> Option<u32> {
    let octets = parse_out_octets(ip, true)?;
    let mut result = 0u32;
    let octet_shifts: [u8; 4] = [24, 16, 8, 0];
    for (octet, octet_shift) in std::iter::zip(octets, octet_shifts) {
        let octet_int = parse_ip_v4_octet(octet)?;
        result += octet_int << octet_shift;
    }
    Some(result)
}

#[wasm_bindgen]
pub fn intToIpV4(val: u32) -> String {
    let mut result: Vec<u32> = Vec::new();
    let octet_shifts: [u8; 4] = [24, 16, 8, 0];
    for octet_shift in octet_shifts.iter() {
        let octet = (val >> octet_shift) & 0xff;
        result.push(octet);
    }
    result
        .iter()
        .map(|x| x.to_string())
        .collect::<Vec<_>>()
        .join(".")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ipV4ToInt() {
        let test_cases = vec![
            ("0.0.0.0", Some(u32::MIN)),
            ("0.0.0.1", Some(0x00000001)),
            ("0.0.1.0", Some(0x00000100)),
            ("0.1.0.0", Some(0x00010000)),
            ("1.0.0.0", Some(0x01000000)),
            ("0.0.0.255", Some(0x000000ff)),
            ("0.0.255.0", Some(0x0000ff00)),
            ("0.255.0.0", Some(0x00ff0000)),
            ("255.0.0.0", Some(0xff000000)),
            ("255.255.255.255", Some(u32::MAX)),
            ("8.8.8.8", Some(0x08080808)),
            ("10.0.0.1", Some(0x0a000001)),
            ("127.0.0.1", Some(0x7f000001)),
            ("169.254.0.1", Some(0xa9fe0001)),
            ("165.225.133.150", Some(0xa5e18596)),
            ("", None),
            ("255", None),
            ("255.12", None),
            ("255.12.12", None),
            ("256.12.12.12", None),
            ("255.12.12.12.12", None),
            ("abc", None),
            ("-255.254.0.1", None),
        ];

        for (ip, expected) in test_cases.iter() {
            let result = ipV4ToInt(ip);
            assert_eq!(result, *expected);
        }
    }

    #[test]
    fn test_intToIpV4() {
        let test_cases = [
            (u32::MIN, "0.0.0.0"),
            (0x00000001, "0.0.0.1"),
            (0x00000100, "0.0.1.0"),
            (0x00010000, "0.1.0.0"),
            (0x01000000, "1.0.0.0"),
            (0x000000ff, "0.0.0.255"),
            (0x0000ff00, "0.0.255.0"),
            (0x00ff0000, "0.255.0.0"),
            (0xff000000, "255.0.0.0"),
            (u32::MAX, "255.255.255.255"),
            (0x08080808, "8.8.8.8"),
            (0x0a000001, "10.0.0.1"),
            (0x7f000001, "127.0.0.1"),
            (0xa9fe0001, "169.254.0.1"),
            (0xa5e18596, "165.225.133.150"),
        ];

        for (int, expected) in test_cases {
            let result = intToIpV4(int);
            assert_eq!(result, expected);
        }
    }
}
