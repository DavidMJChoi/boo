# boo

Just for personal use.

A VS Code extension for quick LeetCode problem setup. Creates problem directories with Go 
templates.

## Usage

Open Command Palette → `boo: New LeetCode` → Enter problem number.

Creates directory `l{num}/` with `l{num}.go` template file and switches terminal directory.

## Requirements

- VS Code 1.107.0+
- Workspace directory must be named `leetcode`

## Installation

```bash
npm install -g vsce
vsce package
code --install-extension boo-<version>.vsix
```

## License

MIT License
