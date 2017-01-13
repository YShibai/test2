'use strict';

// アプリケーションをコントロールするモジュール
//var app = require('app');
// ウィンドウを作成するモジュール
//var BrowserWindow = require('browser-window');

//変数(var)ではなく定数(const)で宣言。尚以下の3行は決まり文句の模様
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;
let editWindows;

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
  // メイン画面の表示。ウィンドウの幅、高さを指定できる
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  //Developツール表示
//  mainWindow.webContents.openDevTools();
  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
