'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { env, workspace, window, WorkspaceFolder, StatusBarItem, StatusBarAlignment } from 'vscode';
import * as ncp from "copy-paste";
import { setTimeout } from 'timers';


type PathMode = "absolutePaths" | "relativePaths" | "relativePathsWithoutFolderName"

let appDisplayName = "[CopyReference Advanced]"

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('CopyReference Advanced is now active!');

    let statusBarHelper = new StatusBarHelper()

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    
    /* @watch package.json 34-37 */
    /* @watch package.json 44-47 */
    let disposable = vscode.commands.registerCommand('extension.copyReferenceAdvanced', () => {
        // The code you place here will be executed every time your command is executed
        copyReferenceAdvanced(statusBarHelper, false)

    });

    /* @watch package.json 38-41 */
    /* @watch package.json 48-51 */
    let disposable2 = vscode.commands.registerCommand('extension.copyReferenceAdvancedWithAdditionalText', () => {
        // The code you place here will be executed every time your command is executed
        copyReferenceAdvanced(statusBarHelper, true)
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(disposable2);
    context.subscriptions.push(statusBarHelper);
}

/**
 * main method
 * @param statusBarHelper the status bar helper
 * @param useAppendTexts true: use the append to copied texts if any, false: not (may be used for another shortcut...)
 */
function copyReferenceAdvanced(statusBarHelper: StatusBarHelper, useAppendTexts: boolean) {

    let editor = vscode.window.activeTextEditor

    if (!editor) {
        vscode.window.showWarningMessage(`${appDisplayName} 1. Open a file (in a folder) and execute the command`)
        return
    }

    //get settings before every call else we might get outdated values
    //(if the user changed settings and didn't restart vs code)
    
    let config = vscode.workspace.getConfiguration('copyReferenceAdvanced')

    /* @watch package.json 56-60 */
    let lineOffset: number = config.get('lineOffset')
    /* @watch package.json 61-65 */
    let pathLineNumberDelimiter: string = config.get('pathLineNumberDelimiter')
    /* @watch package.json 66-70 */
    let lineNumberDelimiter: string = config.get('lineNumberDelimiter')
    /* @watch package.json 71-75 */
    let collapseSingleLineNumbers: boolean = config.get('collapseSingleLineNumbers')
    /* @watch package.json 76-80 */
    let prependToPath: string = config.get('prependToPath')
    /* @watch package.json 81-85 */
    let appendToPath: string = config.get('appendToPath')
    /* @watch package.json 86-95 */
    let pathMode: PathMode = config.get('pathMode')
    /* @watch package.json 96-100 */
    let failIfNoFolderIsOpen: boolean = config.get('failIfNoFolderIsOpen')
    /* @watch package.json 101-105 */
    let displayCopiedTimeoutInMs: number =  config.get('displayCopiedTimeoutInMs')
    /* @watch package.json 106-110 */
    let prependToCopiedText: string = config.get('prependToCopiedText')
    /* @watch package.json 111-115 */
    let appendToCopiedText: string = config.get('appendToCopiedText')

    let selection = editor.selection

    let startLine = selection.start.line + lineOffset;
    let endLine = selection.end.line + lineOffset;

    let linesRange = ''

    linesRange = selection.isSingleLine && collapseSingleLineNumbers
        ? `${startLine}`
        : `${startLine}${lineNumberDelimiter}${endLine}`

    let fileAbsolutePath = editor.document.fileName

    if (useAppendTexts === false) {
        prependToCopiedText = ""
        appendToCopiedText = ""
    }

    let resultString = "error occured"

    let rootPathAbsolute: WorkspaceFolder = null
    rootPathAbsolute = workspace.getWorkspaceFolder(editor.document.uri)

    if (pathMode === "absolutePaths") {
        resultString = `${prependToCopiedText}${prependToPath}${fileAbsolutePath}${appendToPath}${pathLineNumberDelimiter}${linesRange}${appendToCopiedText}`
        copyToClipboard(resultString, statusBarHelper, displayCopiedTimeoutInMs)
        return
    }

    if (rootPathAbsolute === undefined) {
        //no folder is open 

        if (failIfNoFolderIsOpen) {
            vscode.window.showWarningMessage(`${appDisplayName} You must open a folder for this action to work (because you specified relative paths and failIfNoFolderIsOpen is set to true).`)
            return
        }
        resultString = `${prependToCopiedText}${prependToPath}${fileAbsolutePath}${appendToPath}${pathLineNumberDelimiter}${linesRange}${appendToCopiedText}`
        copyToClipboard(resultString, statusBarHelper, displayCopiedTimeoutInMs)
        return
    }

    //--- we need to go relative 



    if (pathMode === "relativePaths") {
        let relativePath = workspace.asRelativePath(fileAbsolutePath, true)
        resultString = `${prependToCopiedText}${prependToPath}${relativePath}${appendToPath}${pathLineNumberDelimiter}${linesRange}${appendToCopiedText}`
        copyToClipboard(resultString, statusBarHelper, displayCopiedTimeoutInMs)
        return
    }
    else if (pathMode === "relativePathsWithoutFolderName") {
        let relativePath = workspace.asRelativePath(fileAbsolutePath, false)
        resultString = `${prependToCopiedText}${prependToPath}${relativePath}${appendToPath}${pathLineNumberDelimiter}${linesRange}${appendToCopiedText}`
        copyToClipboard(resultString, statusBarHelper, displayCopiedTimeoutInMs)
        return
    }
    else {
        vscode.window.showWarningMessage(`${appDisplayName} Invalid option for copyReferenceAdvanced.pathMode specified!`)
        return
    }

}

function copyToClipboard(text: string, statusBarHelper: StatusBarHelper, timeoutInMs: number) {
    ncp.copy(text, () => {
        //console.log('copied!')
        statusBarHelper.updateStatusBarItem(`Copied reference: ${text}`, timeoutInMs)
    })
}

class StatusBarHelper {
    private _statusBarItem: StatusBarItem;

    //https://code.visualstudio.com/docs/extensions/example-word-count#_update-the-status-bar

    /**
     * 
     * @param text displays the status bar item
     * @param timeoutInS hide after x seconds, <= 0 to not show status bar item
     */
    public updateStatusBarItem(text: string, timeoutInMs: number) {
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        }

        if (timeoutInMs <= 0) {
            this._statusBarItem.hide();
            return;
        }

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        // Update the status bar
        this._statusBarItem.text = text;
        this._statusBarItem.show();

        setTimeout(() => {
            this._statusBarItem.hide();
        }, timeoutInMs)

    }

    dispose() {
        this._statusBarItem.dispose();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log(`CopyReference Advanced is now deactivated!`);
}