const vscode = require('vscode');
const { saveCurrentState } = require('./commands/saveCode');
const { viewHistory } = require('./commands/viewHistory');

/**
 * This method is called when your extension is activated.
 * Your extension is activated the very first time the command is executed.
 *
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "code-history-extension" is now active!');

    // Registering the command that saves the current state of the code.
    let saveStateDisposable = vscode.commands.registerCommand('codeHistory.saveCurrentState', function () {
        // The code you place here will be executed every time your command is executed.
        saveCurrentState(vscode);
    });

    // Registering the command to view code history.
    let viewHistoryDisposable = vscode.commands.registerCommand('codeHistory.viewHistory', function () {
        // The code you place here will be executed every time your command is executed.
        viewHistory(vscode);
    });

    context.subscriptions.push(saveStateDisposable, viewHistoryDisposable);
}

/**
 * This method is called when your extension is deactivated.
 */
function deactivate() {}

// Exports to make the `activate` and `deactivate` methods accessible to VS Code.
module.exports = {
    activate,
    deactivate
};
