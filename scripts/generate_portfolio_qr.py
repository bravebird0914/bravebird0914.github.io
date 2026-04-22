#!/usr/bin/env python3
"""Generate the portfolio QR code image."""

from __future__ import annotations

import argparse
from pathlib import Path

try:
    import qrcode
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
    return parser


def generate_qr(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=20,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    image = qr.make_image(fill_color="black", back_color="white")
    image.save(output_path)


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    output_path = args.output
    if not output_path.is_absolute():
        output_path = (Path.cwd() / output_path).resolve()

    generate_qr(args.url, output_path)
    print(f"Saved QR code for {args.url}")
    print(f"Output: {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
