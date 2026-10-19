"""Regenerate public/og-image.png (the social preview image).

Run this after changing cv.name / cv.headline in public/archived/data.json:

    python scripts/make-og-image.py

The result is committed rather than generated at build time because CI only has
Node available, and because a Next.js `opengraph-image` route is exported without
a file extension -- GitHub Pages would serve that as application/octet-stream,
which social crawlers reject. Requires Pillow.
"""

import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "public", "archived", "data.json")
OUT = os.path.join(ROOT, "public", "og-image.png")

WIDTH, HEIGHT = 1200, 630
MARGIN = 80

BACKGROUND_START = (17, 24, 39)   # gray-900
BACKGROUND_END = (31, 41, 55)     # gray-800
ACCENT = (249, 246, 0)            # #F9F600
WHITE = (255, 255, 255)
MUTED = (209, 213, 219)           # gray-300

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]
REGULAR_FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
]


def load_font(candidates, size):
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    print("warning: no TrueType font found, falling back to the bitmap default", file=sys.stderr)
    return ImageFont.load_default(size)


def draw_tracked(draw, xy, text, font, fill, spacing):
    """Draw text with extra letter spacing, as PIL has no tracking support."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + spacing


def main():
    with open(DATA, encoding="utf-8") as handle:
        data = json.load(handle)

    cv = data.get("cv", {})
    name = cv.get("name") or data["meta"]["title"].split(" - ")[0]
    headline = (cv.get("headline") or data["intro"].get("professional", "")).strip("{}")

    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND_START)
    draw = ImageDraw.Draw(image)

    for x in range(WIDTH):
        ratio = x / (WIDTH - 1)
        draw.line(
            [(x, 0), (x, HEIGHT)],
            fill=tuple(
                int(BACKGROUND_START[i] + (BACKGROUND_END[i] - BACKGROUND_START[i]) * ratio)
                for i in range(3)
            ),
        )

    label_font = load_font(FONT_CANDIDATES, 26)
    name_font = load_font(FONT_CANDIDATES, 82)
    headline_font = load_font(REGULAR_FONT_CANDIDATES, 40)

    draw_tracked(draw, (MARGIN, 150), "PORTFOLIO", label_font, ACCENT, 7)
    draw.text((MARGIN, 208), name, font=name_font, fill=WHITE)
    draw.text((MARGIN, 330), headline, font=headline_font, fill=MUTED)
    draw.rectangle([MARGIN, HEIGHT - 150, MARGIN + 170, HEIGHT - 141], fill=ACCENT)

    image.save(OUT, optimize=True)
    print("wrote %s (%d bytes, %dx%d)" % (OUT, os.path.getsize(OUT), WIDTH, HEIGHT))


if __name__ == "__main__":
    main()
