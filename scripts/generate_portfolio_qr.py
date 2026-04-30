#!/usr/bin/env python3
"""Generate the portfolio QR code images."""

from __future__ import annotations

import argparse
from pathlib import Path

try:
    import qrcode
    from PIL import Image
    from qrcode.constants import ERROR_CORRECT_H
except ImportError as exc:  # pragma: no cover - dependency guidance
    raise SystemExit(
        "Missing dependency: qrcode[pil]\n"
        "Install it with:\n"
        "  python3 -m pip install 'qrcode[pil]'"
    ) from exc


DEFAULT_URL = "https://bravebird0914.github.io/"
REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = REPO_ROOT / "images" / "portfolio-site-qr.png"
DEFAULT_TRANSPARENT_WHITE_OUTPUT = (
    REPO_ROOT / "images" / "portfolio-site-qr-white-transparent.png"
)
BOX_SIZE = 20
BORDER = 4


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate the QR code for the portfolio URL."
    )
    parser.add_argument(
        "--url",
        default=DEFAULT_URL,
        help=f"URL to encode. Defaults to {DEFAULT_URL}",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output image path. Defaults to {DEFAULT_OUTPUT}",
    )
    parser.add_argument(
        "--transparent-white-output",
        type=Path,
        default=DEFAULT_TRANSPARENT_WHITE_OUTPUT,
        help=(
            "Output path for the white QR with transparent background. "
            f"Defaults to {DEFAULT_TRANSPARENT_WHITE_OUTPUT}"
        ),
    )
    return parser


def build_qr(url: str) -> qrcode.QRCode:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=BOX_SIZE,
        border=BORDER,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr


def save_standard_qr(qr: qrcode.QRCode, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image = qr.make_image(fill_color="black", back_color="white")
    image.save(output_path)


def save_transparent_white_qr(qr: qrcode.QRCode, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    matrix = qr.get_matrix()
    rows = len(matrix)
    cols = len(matrix[0])

    image = Image.new("RGBA", (cols, rows), (0, 0, 0, 0))
    pixels = image.load()
    for y, row in enumerate(matrix):
        for x, cell in enumerate(row):
            if cell:
                pixels[x, y] = (255, 255, 255, 255)

    resized = image.resize((cols * BOX_SIZE, rows * BOX_SIZE), Image.NEAREST)
    resized.save(output_path)


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    output_path = args.output
    if not output_path.is_absolute():
        output_path = (Path.cwd() / output_path).resolve()

    transparent_white_output_path = args.transparent_white_output
    if not transparent_white_output_path.is_absolute():
        transparent_white_output_path = (
            Path.cwd() / transparent_white_output_path
        ).resolve()

    qr = build_qr(args.url)
    save_standard_qr(qr, output_path)
    save_transparent_white_qr(qr, transparent_white_output_path)

    print(f"Saved QR code for {args.url}")
    print(f"Output: {output_path}")
    print(f"Transparent white output: {transparent_white_output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
