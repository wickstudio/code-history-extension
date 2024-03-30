const vscode = require('vscode');
const databaseManager = require('../database/databaseManager');

async function viewHistory() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showInformationMessage('No active editor detected. Open a file to view its history.');
        return;
    }

    const document = activeEditor.document;
    if (document.isUntitled) {
        vscode.window.showInformationMessage('The current document has not been saved. Please save the file before viewing its history.');
        return;
    }

    const filePath = document.fileName;

    try {
        const history = await databaseManager.fetchCodeHistory(filePath);
        if (history.length === 0) {
            vscode.window.showInformationMessage('No history found for the current file.');
            return;
        }

        const items = history.map(snapshot => ({
            label: `Snapshot from ${snapshot.timestamp}`,
            description: snapshot.id.toString(),
            snapshot
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a code snapshot to view'
        });

        if (selected) {
            const document = await vscode.workspace.openTextDocument({
                content: selected.snapshot.codeContent,
                language: activeEditor.document.languageId
            });
            vscode.window.showTextDocument(document, { preview: false });
        }
    } catch (error) {
        console.error('Failed to fetch code history:', error);
        vscode.window.showErrorMessage('An error occurred while fetching the code history.');
    }
}

module.exports = {
    viewHistory
};
