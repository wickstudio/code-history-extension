const vscode = require('vscode');
const databaseManager = require('../database/databaseManager');

/**
 * Saves the current state of the code in the active editor.
 */
async function saveCurrentState() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showInformationMessage('No active editor detected. Open a file to save its state.');
        return;
    }

    const document = activeEditor.document;

    if (document.isUntitled) {
        vscode.window.showInformationMessage('The current document has not been saved. Please save the file before saving its state.');
        return;
    }

    const codeContent = document.getText();
    const filePath = document.fileName;
    const timestamp = new Date().toISOString();

    try {
        await databaseManager.saveCodeSnapshot(filePath, codeContent, timestamp);
        vscode.window.showInformationMessage('Code state saved successfully!');
    } catch (error) {
        console.error('Failed to save code state:', error);
        vscode.window.showErrorMessage('An error occurred while saving the code state.');
    }
}

module.exports = {
    saveCurrentState
};
