from __future__ import annotations

import json
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

DETAIL_FALLBACK_DATES = ["2026-04-10", "2026-04-17"]
FEATURE_ICONS = ["calendar", "lifebuoy", "ticket", "shield"]
ABOUT_HEADINGS = {"about this tour", "experience overview"}
SNAPSHOT_HEADINGS = {"what s waiting for you", "tour snapshot"}
FEATURE_HEADINGS = {"tour features", "key highlights"}
AVAILABILITY_HEADINGS = {"check dates and availability"}
CANCELLATION_HEADINGS = {"cancellation policy"}
REVIEWS_HEADINGS = {"what our clients are saying"}
META_HEADINGS = {"meta tags"}
BODY_SECTION_HEADINGS = {
    "detailed itinerary",
    "city highlights journey",
    "experience plan",
}

REPLACEMENTS = {
    "'": "'",
    "\u2018": "'",
    "\u2013": "-",
    "\u2014": "-",
    "\u00a0": " ",
    "\u00a1": "",
    "\u00bf": "",
    "\u00e0": "a",
    "\u00e1": "a",
    "\u00e2": "a",
    "\u00e3": "a",
    "\u00e4": "a",
    "\u00e5": "a",
    "\u00e6": "ae",
    "\u00e7": "c",
    "\u00e8": "e",
    "\u00e9": "e",
    "\u00ea": "e",
    "\u00eb": "e",
    "\u00ed": "i",
    "\u00ef": "i",
    "\u00f1": "n",
    "\u00f2": "o",
    "\u00f3": "o",
    "\u00f4": "o",
    "\u00f5": "o",
    "\u00f6": "o",
    "\u0153": "oe",
    "\u00f8": "o",
    "\u00fa": "u",
    "\u00fb": "u",
    "\u00fc": "u",
    "\u00fd": "y",
}

TITLE_ALIASES = {
    "edinburgh highlands cinematic adventure glenfinnan glencoe fort willi": "edinburgh-highlands-cinematic-adventure-glenfinnan-glencoe-fort-william",
}


def normalize(value: str) -> str:
    for source, target in REPLACEMENTS.items():
        value = value.replace(source, target)

    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower().replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def heading_key(value: str) -> str:
    return normalize(value)


def slugify(value: str) -> str:
    return normalize(value).replace(" ", "-")


def read_docx_paragraphs(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))

    paragraphs: list[str] = []
    for paragraph in root.findall(".//w:p", NS):
        text = "".join((node.text or "") for node in paragraph.findall(".//w:t", NS)).strip()
        if text:
            paragraphs.append(text)

    return paragraphs


def split_blocks(paragraphs: list[str]) -> list[list[str]]:
    blocks: list[list[str]] = []
    current: list[str] = []

    for line in paragraphs:
        if re.fullmatch(r"_+", line):
            if current:
                blocks.append(current)
                current = []
            continue

        current.append(re.sub(r"\s+", " ", line).strip())

    if current:
        blocks.append(current)

    return blocks


def load_tours() -> dict[str, dict[str, str]]:
    rows: dict[str, dict[str, str]] = {}
    pattern = re.compile(
        r'^\s+\["(?P<slug>[^"]+)", "(?P<title>[^"]+)", "(?P<region>[^"]+)", (?P<price>[^,]+), '
        r'"(?P<price_label>[^"]*)", "(?P<original_price_label>[^"]*)", "(?P<operator>[^"]*)", '
        r'"(?P<operator_website>[^"]*)", (?P<capacity>null|"[^"]*"), (?P<popularity>\d+), (?P<created_at>\d+)\],$'
    )

    for line in Path("src/features/tours/data/tours.ts").read_text(encoding="utf-8").splitlines():
        match = pattern.match(line)
        if not match:
            continue

        data = match.groupdict()
        rows[data["slug"]] = data

    return rows


def first_block(blocks: list[list[str]], headings: set[str]) -> list[str] | None:
    for block in blocks:
        if block and heading_key(block[0]) in headings:
            return block
    return None


def parse_meta(block: list[str] | None, tour_title: str) -> dict[str, str]:
    fallback = {
        "title": f"{tour_title} | Travellio Global",
        "description": tour_title,
    }

    if not block:
        return fallback

    meta = fallback.copy()
    for line in block[1:]:
        if line.startswith("Title:"):
            meta["title"] = line.split(":", 1)[1].strip()
        elif line.startswith("Description:"):
            meta["description"] = line.split(":", 1)[1].strip()

    return meta


def parse_snapshot_lines(lines: list[str]) -> tuple[dict[str, str], list[str]]:
    values: dict[str, str] = {}
    bullet_lines: list[str] = []

    for line in lines:
        match = re.match(r"^([^:]{2,40}):\s*(.+)$", line)
        if match:
            values[normalize(match.group(1))] = match.group(2).strip()
        bullet_lines.append(line)

    return values, bullet_lines


def extract_time_choices(lines: list[str]) -> tuple[list[str], str]:
    raw_choices: list[str] = []

    for line in lines:
        if line.startswith("Start times:"):
            tail = line.split(":", 1)[1]
            for part in re.split(r"\s+or\s+|/", tail):
                match = re.search(r"\d{1,2}:\d{2}\s*[AP]M", part)
                if match:
                    raw_choices.append(match.group(0))
        elif line.startswith("Starts at:"):
            tail = line.split(":", 1)[1]
            for part in re.split(r"/|,|\s+or\s+", tail):
                match = re.search(r"\d{1,2}:\d{2}\s*[AP]M", part)
                if match:
                    raw_choices.append(match.group(0))

    if not raw_choices:
        for line in lines:
            raw_choices.extend(re.findall(r"\d{1,2}:\d{2}\s*[AP]M", line))

    display = raw_choices[0] if raw_choices else "Selected time slot"
    normalized_choices: list[str] = []

    for value in raw_choices:
        converted = to_twenty_four_hour(value)
        if converted not in normalized_choices:
            normalized_choices.append(converted)

    if not normalized_choices:
        normalized_choices = ["09:00"]

    return normalized_choices, display


def to_twenty_four_hour(value: str) -> str:
    match = re.fullmatch(r"(\d{1,2}):(\d{2})\s*([AP]M)", value.strip(), re.IGNORECASE)
    if not match:
        return value

    hour = int(match.group(1))
    minute = int(match.group(2))
    meridiem = match.group(3).upper()

    if meridiem == "AM":
        hour = 0 if hour == 12 else hour
    else:
        hour = 12 if hour == 12 else hour + 12

    return f"{hour:02d}:{minute:02d}"


def split_feature_line(value: str) -> tuple[str, str]:
    match = re.match(r"^([^:]{3,90}):\s*(.+)$", value)
    if match:
        return match.group(1).strip(), match.group(2).strip()

    clean_value = value.strip().rstrip(".")
    if len(clean_value) <= 64:
        return clean_value, value.strip()

    short_title = clean_value[:61].rstrip(", ") + "..."
    return short_title, value.strip()


def unique_lines(lines: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []

    for line in lines:
        clean_line = line.strip()
        if not clean_line or clean_line in seen:
            continue
        seen.add(clean_line)
        result.append(clean_line)

    return result


def build_feature_cards(primary_lines: list[str], secondary_lines: list[str]) -> list[dict[str, str]]:
    pool = unique_lines(primary_lines + secondary_lines)
    cards: list[dict[str, str]] = []

    for index, line in enumerate(pool[:4]):
        title, body = split_feature_line(line)
        cards.append(
            {
                "number": f"{index + 1:02d}.",
                "title": title,
                "body": body,
                "icon": FEATURE_ICONS[index % len(FEATURE_ICONS)],
            }
        )

    while len(cards) < 4:
        index = len(cards)
        cards.append(
            {
                "number": f"{index + 1:02d}.",
                "title": "Tour highlight",
                "body": "Full experience details are included in the tour overview below.",
                "icon": FEATURE_ICONS[index % len(FEATURE_ICONS)],
            }
        )

    return cards


def build_price_label(tour_row: dict[str, str]) -> str:
    price_label = tour_row["price_label"].strip()
    if "€" in price_label:
        return price_label

    price = str(tour_row["price"]).strip()
    if price.endswith(".0"):
        price = price[:-2]

    return f"€{price}"


def parse_cancellation_policy(block: list[str] | None) -> dict[str, object] | None:
    if not block:
        return None

    sections: list[dict[str, object]] = []
    current: dict[str, object] | None = None

    def flush_current() -> None:
        nonlocal current
        if not current:
            return
        if not current.get("subtitle") and not current.get("bullets") and not current.get("body"):
            current = None
            return
        sections.append(current)
        current = None

    for line in block[1:]:
        match = re.match(r"^([^:]{2,80}):(.*)$", line)
        if match:
            subtitle_base = match.group(1).strip()
            remainder = match.group(2).strip()
            normalized_subtitle = heading_key(subtitle_base)

            if normalized_subtitle.startswith("for ") or normalized_subtitle in {
                "refund processing",
                "weather related cancellations",
                "standard policy",
            }:
                flush_current()
                current = {"subtitle": subtitle_base + ":"}
                if remainder:
                    current["body"] = [remainder]
                continue

            if current is None:
                current = {}
            current.setdefault("bullets", []).append(line)
            continue

        if current is None:
            current = {}

        bucket = "bullets" if len(line) <= 180 else "body"
        current.setdefault(bucket, []).append(line)

    flush_current()

    if not sections:
        return None

    return {
        "heading": block[0],
        "sections": sections,
    }


def build_reviews(block: list[str] | None) -> list[dict[str, object]]:
    if not block:
        return []

    reviews: list[dict[str, object]] = []
    rating_map = {"★★★★★": 5, "★★★★☆": 4, "★★★☆☆": 3, "★★☆☆☆": 2, "★☆☆☆☆": 1}

    for line in block[1:]:
        match = re.match(r"^(★★★★★|★★★★☆|★★★☆☆|★★☆☆☆|★☆☆☆☆)\s+(.+?)\s+[—-]\s+(.+)$", line)
        if not match:
            continue

        author = match.group(2).strip()
        tail = match.group(3).strip()
        market = tail
        quote = ""

        tight_market = re.match(r"^([A-Z][A-Za-z .&'-]+?)([A-Z].+)$", tail)
        if tight_market:
            market = tight_market.group(1).strip()
            quote = tight_market.group(2).strip()
        else:
            parts = re.split(r"\.\s+", tail, maxsplit=1)
            if len(parts) == 2:
                market = parts[0].strip()
                quote = parts[1].strip()

        reviews.append(
            {
                "author": author,
                "market": market,
                "rating": rating_map[match.group(1)],
                "quote": quote or tail,
            }
        )

        if len(reviews) == 3:
            break

    return reviews


def create_overview_section(title: str, lines: list[str]) -> dict[str, object] | None:
    lines = unique_lines(lines)
    if not lines:
        return None

    normalized_title = heading_key(title)
    title = title.strip()

    if normalized_title in BODY_SECTION_HEADINGS:
        return {"title": title, "body": lines}

    if normalized_title in FEATURE_HEADINGS:
        return {"title": title, "bullets": lines}

    if normalized_title in SNAPSHOT_HEADINGS:
        return {"title": title, "bullets": lines}

    if normalized_title in {"included in price", "not included", "who should avoid this tour", "important trip info"}:
        return {"title": title, "bullets": lines}

    if normalized_title == "traveler suitability":
        return {"title": title, "body": lines}

    body_like = sum(1 for line in lines if len(line) > 150)
    if body_like >= max(1, len(lines) // 2):
        return {"title": title, "body": lines}

    return {"title": title, "bullets": lines}


def parse_doc(path: Path, tours_by_title: dict[str, str], tour_rows: dict[str, dict[str, str]]) -> tuple[str, dict[str, object]]:
    paragraphs = read_docx_paragraphs(path)
    blocks = split_blocks(paragraphs)
    title_block = next((block for block in blocks if block and not block[0].startswith("Source ")), [])
    doc_title = title_block[0] if title_block else path.stem
    normalized_title = normalize(doc_title)
    slug = tours_by_title.get(normalized_title) or TITLE_ALIASES.get(normalized_title)

    if not slug:
        raise KeyError(f"Unable to match docx title to a tour slug: {doc_title}")

    tour_row = tour_rows[slug]
    about_block = first_block(blocks, ABOUT_HEADINGS)
    snapshot_block = first_block(blocks, SNAPSHOT_HEADINGS)
    availability_block = first_block(blocks, AVAILABILITY_HEADINGS)
    features_block = first_block(blocks, FEATURE_HEADINGS)
    cancellation_block = first_block(blocks, CANCELLATION_HEADINGS)
    reviews_block = first_block(blocks, REVIEWS_HEADINGS)
    meta_block = first_block(blocks, META_HEADINGS)

    lead_paragraph = " ".join(about_block[1:]).strip() if about_block else doc_title
    snapshot_values, snapshot_lines = parse_snapshot_lines(snapshot_block[1:] if snapshot_block else [])
    availability_times, start_time = extract_time_choices(availability_block[1:] if availability_block else [])

    duration = snapshot_values.get("duration")
    if not duration and availability_block:
        duration_line = next((line for line in availability_block[1:] if line.startswith("Duration:")), "")
        if duration_line:
            duration = duration_line.split(":", 1)[1].strip()
    duration = duration or "Check available dates"

    meeting_point = (
        snapshot_values.get("meeting point")
        or snapshot_values.get("meetingpoint")
        or "Meeting point details are shared after booking confirmation."
    )

    important_block = next(
        (block for block in blocks if block and heading_key(block[0]) == "important trip info"),
        None,
    )
    booking_note = important_block[1] if important_block and len(important_block) > 1 else None

    feature_source_lines = features_block[1:] if features_block else []
    fallback_feature_lines = snapshot_lines or [lead_paragraph]
    feature_cards = build_feature_cards(feature_source_lines, fallback_feature_lines)

    hero_summary = next(
        (
            line
            for block in blocks
            for line in block
            if "per person" in line.lower()
        ),
        f"{duration} | {build_price_label(tour_row)} per person",
    )

    overview_sections: list[dict[str, object]] = []
    about_index = next(
        (index for index, block in enumerate(blocks) if block and heading_key(block[0]) in ABOUT_HEADINGS),
        -1,
    )

    for index, block in enumerate(blocks):
        if not block:
            continue

        if index <= about_index:
            continue

        key = heading_key(block[0])
        if key in ABOUT_HEADINGS | AVAILABILITY_HEADINGS | CANCELLATION_HEADINGS | REVIEWS_HEADINGS | META_HEADINGS:
            continue

        if block[0].startswith("Source ") or "Add to wishlist" in block[0]:
            continue

        if ("per person" in block[0].lower() or block[0].startswith("★★★★★")) and any(
            line in {"Image", "🏕", "Add to wishlist ♡"} for line in block[1:]
        ):
            continue

        if block[0].startswith(("★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆")) or "See more reviews" in block:
            continue

        if len(block) == 1:
            continue

        section = create_overview_section(block[0], block[1:])
        if section:
            overview_sections.append(section)

    content = {
        "key": slug,
        "heroSummary": hero_summary,
        "leadParagraph": lead_paragraph,
        "featureCards": feature_cards,
        "availabilityDates": DETAIL_FALLBACK_DATES,
        "availabilityTimes": availability_times,
        "duration": duration,
        "startTime": start_time,
        "meetingPoint": meeting_point,
        "reserveMessage": lead_paragraph,
        "bookingNote": booking_note,
        "overviewTitle": "Tour details",
        "overviewSections": overview_sections,
        "cancellationPolicy": parse_cancellation_policy(cancellation_block),
        "meta": parse_meta(meta_block, tour_row["title"]),
        "reviews": build_reviews(reviews_block),
    }

    return slug, content


def fallback_content(slug: str, tour_row: dict[str, str]) -> dict[str, object]:
    lead = (
        f"{tour_row['title']} is available through {tour_row['operator']}. "
        f"Detailed tour copy has not been added to public/docs yet, so this page is using a temporary summary."
    )

    return {
        "key": slug,
        "heroSummary": f"{tour_row['price_label']} per person",
        "leadParagraph": lead,
        "featureCards": build_feature_cards(
            [
                f"Operated by: {tour_row['operator']}",
                f"Our price: {tour_row['price_label']}",
                "Booking details are added to checkout automatically.",
                "Meeting details are shared after confirmation.",
            ],
            [],
        ),
        "availabilityDates": DETAIL_FALLBACK_DATES,
        "availabilityTimes": ["09:00"],
        "duration": "Check available dates",
        "startTime": "Selected time slot",
        "meetingPoint": "Meeting point details are shared after booking confirmation.",
        "reserveMessage": lead,
        "bookingNote": "Add the preferred date, time, participants, duration, and meeting point during checkout.",
        "overviewTitle": "Tour details",
        "overviewSections": [
            {
                "title": "Temporary content notice",
                "body": [
                    "A dedicated .docx source file for this tour is not yet available in public/docs.",
                    "Once a matching source document is added, rerun the tour content generator to replace this temporary copy.",
                ],
            }
        ],
        "cancellationPolicy": None,
        "meta": {
            "title": f"{tour_row['title']} | Travellio Global",
            "description": f"Explore {tour_row['title']} with {tour_row['operator']}. Pricing starts at {tour_row['price_label']}.",
        },
        "reviews": [],
    }


def main() -> int:
    out_path = Path("src/features/tours/data/tour-content.ts")
    tour_rows = load_tours()
    tours_by_title = {normalize(data["title"]): slug for slug, data in tour_rows.items()}
    content_by_slug: dict[str, dict[str, object]] = {}

    for path in sorted(Path("public/docs").glob("*.docx")):
        slug, content = parse_doc(path, tours_by_title, tour_rows)
        content_by_slug[slug] = content

    missing_slugs = [slug for slug in tour_rows if slug not in content_by_slug]
    for slug in missing_slugs:
        content_by_slug[slug] = fallback_content(slug, tour_rows[slug])

    ordered_content = {slug: content_by_slug[slug] for slug in tour_rows}
    ts_body = json.dumps(ordered_content, indent=2, ensure_ascii=False)
    out_path.write_text(
        'import type { TourDetailContent } from "../model/types";\n\n'
        f"export const TOUR_DETAIL_CONTENT: Record<string, TourDetailContent> = {ts_body};\n",
        encoding="utf-8",
    )

    print(f"Wrote {out_path}")
    if missing_slugs:
        print("Fallback content used for:")
        for slug in missing_slugs:
            print(f" - {slug}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
