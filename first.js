// fs
var fs = require('fs');
const { remote } = require('electron');
const { BrowserWindow } = remote;
const {dialog} = require('electron').remote;
const {Menu} = require('electron').remote;

const template = [
  {label: 'すべて選択'},
  {type: 'separator'},
  {label: 'Copy', accelerator: 'CmdOrCtrl+C'},
  {label: 'Paste', accelerator: 'CmdOrCtrl+V'}
];
const menu = Menu.buildFromTemplate(template);

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);


// 検索するディレクトリ
//var _dir = __dirname + '\\dtree';
var _dir ='C:\\Users\\Public\\Documents\\a';
//var _dir ='D:\\';
var res = "";
var FolderInfo = new Array();
var FolderPath = "";
var exec = require('child_process').exec;
var result ="";
