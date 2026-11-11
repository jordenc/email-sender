# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Note: `../CLAUDE.md` describes a different Homey app (Slide curtains). Only its Homey CLI commands apply here; this file wins for everything else.

## Project

Homey app "Email sender" (`email.sender`, Athom Homey SDK v3, `compatibility >=12.9.0` - the first firmware that runs apps on Node.js 22 on all Homey models) that sends e-mail over SMTP from Homey flows. Plain CommonJS JavaScript, no build step, no tests, no linter.

The only dependency is `nodemailer` (10.x, needs Node.js 20+), declared in `package.json`. Run `npm install` before `homey app run`; `node_modules/` is not committed. Do not add the `homey` npm package: `require('homey')` is provided by the Homey runtime.

## Commands

Everything goes through the Homey CLI (`npm i -g homey`):

- `homey app run` - run the app on a Homey on your network with live logs (`homey app run --remote` for Homey Pro 2023)
- `homey app validate` - validate the app (use `--level publish` before a store release)
- `homey app version <patch|minor|major> --changelog "..."` - bump the version in `.homeycompose/app.json` and `app.json` and add a `.homeychangelog.json` entry. Also update `version` in `package.json` by hand.
- `homey app publish` - publish to the Homey App Store

`.homeybuild/` is CLI output and is ignored.

## Structure

- `.homeycompose/` - the manifest source. `.homeycompose/app.json` holds the app metadata and the `testmail` and `logs` API routes, `.homeycompose/flow/actions/<id>.json` holds one action card each. The root `app.json` is generated from it by the CLI: never edit `app.json` by hand. User-facing strings are given in `en` and `nl`.
- `lib/mailer.js` - all mail logic: reading the settings, checking required settings, creating the nodemailer transport, sending, `text_to_html` / `html_to_text` conversion and building an inline image mail from an image token.
- `app.js` - registers a run listener per action card and calls `lib/mailer.js`:
  - `sendmail` - body as `text`, and as `html` with line breaks turned into `<br>` (HTML in the body is not escaped)
  - `sendascii` - body as `text` only
  - `sendhtml` - body as `html`, with a plain text version made by `html_to_text`
  - `sendimage` - image tag (droptoken), plus the optional args `body` and `image_mode` (`required: false`, so older flows without them keep working). `image_mode` is `inline` (shown in the body via a `cid:` reference), `attachment` (plain attachment only, the behaviour before 1.2.0) or `both`; an empty value means `both`. For `both` the stream is read into a buffer, because the image is added twice and a stream can only be read once.
- `settings/index.html` - the app settings page (plain JavaScript, Homey settings API). Reads and writes the settings with `Homey.get` / `Homey.set` and calls `POST /testmail` for the test button and `GET /logs` for the log at the bottom.
- `api.js` - the `logs` handler (`GET /logs`, returns the in-memory log lines) and the `testmail` handler. It gets the SMTP settings from the request body (not from stored settings), so the user can test before saving, and sends a test mail to the sender address.
- `locales/*.json` - strings for the settings page only.
- `README.txt` is the App Store description, `README.md` is for GitHub.

## Settings

All configuration lives in app-wide `homey.settings`: `use_credentials`, `mail_user`, `mail_password`, `mail_host`, `mail_port`, `mail_from`, `sendername` (falls back to `Homey`), `mail_secure`, `allow_invalid_certificates`. The keys are listed in the `fields` object in `settings/index.html`, in `get_settings()` in `lib/mailer.js` and as body fields in `api.js`, so a new setting has to be added in all three.

## Things that are not obvious

- Settings are read from `homey.settings` on every send, never cached, so saving on the settings page applies right away without an app restart.
- `homey.settings.get()` returns `null` for unset keys. For backwards compatibility an unset `use_credentials` or `allow_invalid_certificates` counts as `true`.
- `allow_invalid_certificates` maps to `tls.rejectUnauthorized` (inverted). Earlier versions always accepted invalid certificates, which is why it defaults to on.
- An image token's `contentType` and `filename` are on the stream returned by `getStream()`, not on the token itself.
- `app.js` overrides `log()` and `error()` to also keep the last 25 lines in memory for the log on the settings page. The buffer is lost when the app restarts. Failing cards and testmails are logged with `this.error()` before the error is thrown back.
- Changing the args of an existing flow card can break users' flows. New args on existing cards must be `required: false`.
