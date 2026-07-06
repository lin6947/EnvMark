<p align="center">
  <img src="assets/icons/icon-128-display.png" alt="EnvMark logo" width="96" height="96">
</p>

<h1 align="center">EnvMark</h1>

<p align="center">
  A Manifest V3 Chrome extension for making dev, test, staging, and production environments instantly recognizable.
</p>

<p align="center">
  EnvMark adds visible page markers, keeps test accounts nearby, and reduces mistakes in systems that look almost identical across environments.
</p>

## What It Does

- Detects environments with URL rules.
- Shows a floating badge, repeated watermark, or both on matched pages.
- Optionally prefixes the browser tab title with the environment label.
- Shows the current matched environment in the extension popup.
- Provides Quick Access links for environment homepages, grouped by product or team.
- Stores multiple test accounts per environment for one-click filling.
- Captures login-page values into the current environment as a new account.
- Supports custom account fields for extra login inputs such as tenant, merchant, or company IDs.
- Manages groups, environments, rules, marker styles, account panel settings, and accounts from the options page.
- Imports and exports selected groups/environments as JSON.
- Supports English and Simplified Chinese UI text.

## Why EnvMark

Internal systems often share the same layout across dev, test, staging, and production. A small visual cue can prevent a very real mistake.

EnvMark is built for teams that frequently switch between similar environments and need three things close at hand:

- clear visual context before editing or submitting data
- fast access to related environment homepages
- safer, repeatable filling of shared QA or staging accounts

## URL Rules

Each environment can contain one or more rules. The most specific matching rule wins when multiple environments match the current page.

- `wildcard`: supports `*`, for example `https://test.example.com/*`
- `prefix`: matches URL prefixes, for example `https://pre.example.com/`
- `regex`: uses JavaScript regular expressions

Keep rules as narrow as practical. For example, prefer a production host rule over a broad company-wide wildcard.

## Markers

Each environment can enable a badge, a watermark, or both.

Badge settings include:

- text and colors
- corner ribbon or pill style
- position
- scale, font size, and opacity
- title prefix toggle

Watermark settings include:

- text and color
- opacity
- angle
- font size
- spacing

The options page includes live previews so marker changes can be checked before saving.

## Test Accounts

Each environment can store multiple accounts. Accounts can be reordered, marked as the default fill target, and filled from the popup or the in-page account panel.

Account support includes:

- username and password fields
- optional account labels
- default fill target
- custom fields for extra login inputs
- password visibility toggles in the options page
- capture from matched login pages

EnvMark fills input fields only. It does not submit forms or click login buttons.

If an account is marked as the default fill target, EnvMark can fill it automatically on pages that look like login forms. This behavior is controlled by the account configuration and still never submits the form.

## Options Page

Use the options page to:

- create, rename, delete, and reorder groups
- add, clone, move, enable, or disable environments
- search environments by name, URL, badge, or rule
- collapse groups to keep large configurations readable
- bulk-enable or bulk-disable environments within a group
- configure URL rules
- customize badge and watermark appearance
- configure the in-page account panel
- add, reorder, capture, and manage test accounts
- import or export selected configuration subsets

## Popup

The popup shows the active tab's matched environment and provides quick actions:

- enable or disable the matched environment
- fill a configured test account
- add the current site as a draft environment rule
- open grouped Quick Access links for configured environment homepages

## Import, Export, And Passwords

Exports are JSON files and can include account values. Passwords and custom field values are lightly obfuscated in exported files so they are not plain text at a glance.

This obfuscation is not strong encryption. Treat exported configuration files as sensitive team data and share them only through trusted channels.

## Install Locally

1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select this project folder.

## Permissions

EnvMark uses:

- `storage`: save environment and account configuration locally
- `tabs`: read the active tab URL and open configured environment links
- `<all_urls>` host access: detect configured environments and draw markers on matched pages

## Build Release Artifacts

- `make zip`: create `dist/envmark-<version>.zip`
- `make crx`: build a `.crx` package with Chrome
- `make crx KEY=path/to/key.pem`: reuse an existing signing key

If `KEY` is not provided, Chrome creates a new private key in `.keys/`, which changes the extension identity. Do not commit files in `.keys/`.
