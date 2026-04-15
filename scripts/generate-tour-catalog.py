from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

REGION_MAP = {
    1: "europe",
    2: "asia",
    3: "australia-pacific",
    4: "asia",
    5: "asia",
    6: "caribbean",
    7: "europe",
    8: "europe",
    9: "middle-east-africa",
    10: "europe",
    11: "asia",
    12: "caribbean",
    13: "caribbean",
    14: "caribbean",
    15: "caribbean",
    16: "central-south-america",
    17: "central-south-america",
    18: "central-south-america",
    19: "central-south-america",
    20: "central-south-america",
    21: "europe",
    22: "europe",
    23: "europe",
    24: "north-america",
    25: "north-america",
    26: "north-america",
    27: "north-america",
    28: "central-south-america",
    29: "central-south-america",
    30: "europe",
    31: "middle-east-africa",
    32: "asia",
    33: "asia",
    34: "asia",
    35: "asia",
    36: "asia",
    37: "asia",
    38: "asia",
    39: "asia",
    40: "europe",
    41: "europe",
    42: "europe",
    43: "europe",
    44: "europe",
    45: "europe",
    46: "europe",
    47: "europe",
    48: "asia",
    49: "asia",
    50: "asia",
    51: "asia",
    52: "asia",
    53: "asia",
    54: "asia",
    55: "asia",
}

MIN_CAPACITY_OVERRIDES = {
    "santiago-coastal-escape-valpara-so-vi-a-del-mar-casablanca-wine-tasting": 2,
    "k-drama-dreamscape-journey-nami-island-petite-france-garden-of-morning-calm": 2,
    "dmz-deep-dive-private-peace-tour-from-seoul-with-3rd-tunnel-dora-observatory-suspension-bridge": 2,
}

REPLACEMENTS = {
    "’": "'",
    "–": "-",
    "—": "-",
    "à": "a",
    "á": "a",
    "â": "a",
    "ä": "a",
    "ç": "c",
    "è": "e",
    "é": "e",
    "ê": "e",
    "ë": "e",
    "í": "i",
    "ï": "i",
    "ñ": "n",
    "ó": "o",
    "ô": "o",
    "ö": "o",
    "ú": "u",
    "ü": "u",
    "æ": "ae",
    "ø": "o",
    "å": "a",
}


def slugify(value: str) -> str:
    for source, target in REPLACEMENTS.items():
        value = value.replace(source, target)

    value = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return re.sub(r"-+", "-", value)


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def parse_price(value: str) -> float:
    digits = re.sub(r"[^0-9.]", "", value)
    return float(digits) if digits else 0.0


def read_shared_strings(workbook: zipfile.ZipFile) -> list[str]:
    root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    shared_strings: list[str] = []

    for item in root.findall("m:si", NS):
        text_parts: list[str] = []
        for node in item.iter():
            if node.tag == "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t":
                text_parts.append(node.text or "")
        shared_strings.append("".join(text_parts))

    return shared_strings


def cell_value(cell: ET.Element, shared_strings: list[str]) -> str:
    value_node = cell.find("m:v", NS)
    if value_node is None:
        return ""

    value = value_node.text or ""
    if cell.attrib.get("t") == "s":
        value = shared_strings[int(value)]

    return value.strip().replace("\n", " ").strip()


def main() -> int:
    source_path = Path("public/docs/Travellio Global - Tours + Prices.xlsx")
    out_path = Path("src/features/tours/data/tours.ts")

    with zipfile.ZipFile(source_path) as workbook:
        shared_strings = read_shared_strings(workbook)
        sheet = ET.fromstring(workbook.read("xl/worksheets/sheet2.xml"))
        rows = sheet.find("m:sheetData", NS).findall("m:row", NS)

    lines = [
        'import type { Tour, TourRegion } from "../model/types";\n',
        "\n",
        'const TOUR_IMAGE = "/images/tours/detail/hero-section.png";\n',
        "\n",
        "const MIN_CAPACITY_OVERRIDES: Record<string, number> = {\n",
    ]

    for key, value in MIN_CAPACITY_OVERRIDES.items():
        lines.append(f'  "{key}": {value},\n')

    lines.extend(
        [
            "};\n",
            "\n",
            "const TOUR_ROWS: Array<\n",
            "  [\n",
            "    slug: string,\n",
            "    title: string,\n",
            "    region: TourRegion,\n",
            "    price: number,\n",
            "    priceLabel: string,\n",
            "    originalPriceLabel: string,\n",
            "    operator: string,\n",
            "    operatorWebsite: string,\n",
            "    maxCapacityLabel: string | null,\n",
            "    popularity: number,\n",
            "    createdAt: number,\n",
            "  ]\n",
            "> = [\n",
        ]
    )

    for row in rows[1:]:
        cells: dict[str, str] = {}

        for cell in row.findall("m:c", NS):
            cell_ref = cell.attrib.get("r", "")
            column = "".join(ch for ch in cell_ref if ch.isalpha())
            cells[column] = cell_value(cell, shared_strings)

        title = cells.get("B", "")
        row_number = int(float(cells.get("A", "0") or "0")) if cells.get("A") else 0

        if not title or row_number < 1 or row_number > 55:
            continue

        slug = slugify(title)
        max_capacity = cells.get("I", "").strip() or None
        if max_capacity == "-":
            max_capacity = None
        max_capacity_literal = "null" if not max_capacity else f'"{escape(max_capacity)}"'

        lines.append(
            f'  ["{escape(slug)}", "{escape(title)}", "{REGION_MAP[row_number]}", {parse_price(cells.get("G", "")):g}, '
            f'"{escape(cells.get("G", ""))}", "{escape(cells.get("D", ""))}", '
            f'"{escape(cells.get("E", "").replace("Operated by ", "").strip())}", '
            f'"{escape(cells.get("F", "").strip())}", '
            f"{max_capacity_literal}, {200 - row_number}, {200 - row_number}],\n"
        )

    lines.extend(
        [
            "];\n",
            "\n",
            "export const TOUR_CATALOG: Tour[] = TOUR_ROWS.map(\n",
            "  ([\n",
            "    slug,\n",
            "    title,\n",
            "    region,\n",
            "    price,\n",
            "    priceLabel,\n",
            "    originalPriceLabel,\n",
            "    operator,\n",
            "    operatorWebsite,\n",
            "    maxCapacityLabel,\n",
            "    popularity,\n",
            "    createdAt,\n",
            "  ]) => ({\n",
            "    id: slug,\n",
            "    slug,\n",
            "    title,\n",
            "    price,\n",
            "    priceLabel,\n",
            "    originalPriceLabel,\n",
            "    operator,\n",
            "    operatorWebsite,\n",
            "    minCapacity: MIN_CAPACITY_OVERRIDES[slug] ?? 1,\n",
            "    maxCapacityLabel,\n",
            "    region,\n",
            "    rating: 4.5,\n",
            "    reviewCount: 20,\n",
            "    image: TOUR_IMAGE,\n",
            "    popularity,\n",
            "    createdAt,\n",
            "    detailContentKey: slug,\n",
            "  }),\n",
            ");\n",
        ]
    )

    out_path.write_text("".join(lines), encoding="utf-8")
    print(f"Wrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
