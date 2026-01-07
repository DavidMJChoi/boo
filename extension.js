// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const newLeetcode = vscode.commands.registerCommand('boo.newLeetcode', async function () {
		// Ask user for input
		const input = await vscode.window.showInputBox({
			prompt: 'Enter LeetCode problem number',
			placeHolder: '1',
			validateInput: (value) => {
				if (!value.trim()) {
					return 'Input cannot be empty';
				}
				const num = parseInt(value);
				if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
					return 'Please enter a valid positive integer';
				}
				return null;
			}
		});

		if (!input) {
			return;
		}

		const num = parseInt(input);
		const dirName = `l${num}`;
		const fileName = `${dirName}.go`;

		// Check if current workspace folder exists
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			vscode.window.showErrorMessage('No workspace folder opened');
			return;
		}

		const workspacePath = workspaceFolders[0].uri.fsPath;
		const workspaceBasename = path.basename(workspacePath);

		// Check if workspace is in a valid leetcode directory
		let isInLeetCode = workspaceBasename.toLowerCase() === 'leetcode';

		let isInLeetCodeSubdir = workspaceBasename.match(/^l\d+$/) !== null;

		if (!isInLeetCode) {
			vscode.window.showErrorMessage(`Current workspace "${workspaceBasename}" is not valid. Please run this command in a "leetcode" directory.`);
			return;
		}

		// Determine parent path for directory creation
		let targetDirPath = workspacePath;

		const dirPath = path.join(targetDirPath, dirName);
		const filePath = path.join(dirPath, fileName);

		// Check if directory already exists
		if (fs.existsSync(dirPath)) {
			vscode.window.showWarningMessage(`Problem directory ${dirName} already exists`);
			return;
		}

		// Create directory and file
		try {
			fs.mkdirSync(dirPath, { recursive: true });

			const fileContent = `// LeetCode L${num}

package main

func main() {

}
`;

			fs.writeFileSync(filePath, fileContent, 'utf8');

			vscode.window.showInformationMessage(`Created ${dirPath}/${fileName}`);

			// Change directory in integrated terminal
			const terminal = vscode.window.activeTerminal || vscode.window.createTerminal();

			// Try cd l<num> first, if it fails, try cd ../l<num>
			terminal.sendText(`cd "${dirName}" || cd "../${dirName}"`);

			// Open file in editor
			const doc = await vscode.workspace.openTextDocument(filePath);
			await vscode.window.showTextDocument(doc);


		} catch (error) {
			vscode.window.showErrorMessage(`Error creating files: ${error.message}`);
		}
	});

	context.subscriptions.push(newLeetcode);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
