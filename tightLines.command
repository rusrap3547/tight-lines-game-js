#!/bin/zsh

# Root launcher for the packaged macOS app.
# Double-click this file to start Tight Lines.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_PATH="$SCRIPT_DIR/release/mac-arm64/Tight Lines.app"
ZIP_PATH="$SCRIPT_DIR/release/Tight Lines-1.0.0-arm64-mac.zip"

if [[ -d "$APP_PATH" ]]; then
	open "$APP_PATH"
	exit 0
fi

if [[ -f "$ZIP_PATH" ]]; then
	echo "Found packaged zip. Extracting app bundle..."
	unzip -o "$ZIP_PATH" -d "$SCRIPT_DIR/release" >/dev/null
	if [[ -d "$APP_PATH" ]]; then
		open "$APP_PATH"
		exit 0
	fi
fi

echo "No packaged app found."
echo "Run this once from project root: npm run dist"
read -k 1 "reply?Press any key to close..."
echo
