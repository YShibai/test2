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

//ユーザ名が登録されているかの確認
exec('git config user.name' , function (error, stdout, stderr) {
        if(stdout){
          document.getElementById('chk_name').innerHTML = "ユーザ名："+ stdout +"<br>";
        }
        if(error){
          document.getElementById('chk_name').innerHTML = "ユーザ名が登録されていません.<br><form name='user'><input type='text' name='username' value=''> <input type='button' value='登録' onClick='Name_su()'> <input type='button' value='消去' onClick='clr_Name()'><br></form>";
        }
    });

//メールアドレスが登録されているかの確認
    exec('git config user.email' , function(error, stdout, stderr){
      if(stdout){
        document.getElementById('chk_address').innerHTML = "E-Mail："+ stdout +"<br>";
      }
      if(error){
        document.getElementById('chk_address').innerHTML = "E-Mailが登録されていません.<br><form name='mail'><input type='text' name='Email' value=''> <input type='button' value='登録' onClick='Email_su()'> <input type='button' value='消去' onClick='clr_Email()'><br></form>";
      }
    });

    //ユーザネーム登録処理
    function Name_su(){
        var UserName = document.user.username.value;
        exec('git config --global user.name "' + UserName +'"' , function (error, stdout, stderr) {
                if(error == null){
                  document.getElementById('chk_name').innerHTML = "ユーザ名："+ UserName +"<br>";
                  //location.reload();
                }
            });
    }
    //ユーザネーム入力欄消去処理
    function clr_Name(){
      document.user.username.value = "";
    }

    //メールアドレス登録処理
    function Email_su(){
      var E_addr = document.mail.Email.value;
      exec('git config --global user.email "' + E_addr +'"' , function (error, stdout, stderr) {
              if(error == null){
                document.getElementById('chk_address').innerHTML = "E-mail："+ E_addr +"<br>";
                //location.reload();
              }
          });
    }
    //メールアドレス入力欄消去処理
    function clr_Email(){
      document.mail.Email.value = "";
    }
