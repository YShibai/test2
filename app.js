// fs
var fs = require('fs');

// 検索するディレクトリ
//var _dir = __dirname + '\\dtree';
var _dir ='C:\\Users\\Public\\Documents\\a';
//var _dir ='D:\\';
var res = "";
var FolderInfo = new Array();
var FolderPath = "";
var exec = require('child_process').exec;
var result ="";


//Gitが導入されているかの確認
exec('git --version' , function (error, stdout, stderr) {
        if(stdout){
          result = stdout + "がインストールされています.";
        }
        if(stderr){
        }
        if (error !== null) {
          result = 'Gitがインストールされていません.';
        }
        document.getElementById('res0').innerHTML = result;
    });


    //ユーザ名が登録されているかの確認
    exec('git config user.name' , function (error, stdout, stderr) {
            if(stdout){
              document.getElementById('chk_name').innerHTML = "ユーザ名："+ stdout +"<br>";
            }
            if(error){
              document.getElementById('chk_name').innerHTML = "ユーザ名が登録されていません.<br><form name='user'><input type='text' name='username' value=''> <input type='button' value='登録' onClick='Name_su()'> <input type='button' value='消去' onClick='clr_Name()'><br></form>";
              //ユーザネーム登録処理
              function Name_su(){
                  var UserName = document.user.username.value;
                  document.getElementById('chk_name').innerHTML = "ユーザ名："+ UserName +"<br>";
              }
              //ユーザネーム入力欄消去処理
              function clr_Name(){
                document.user.username.value = "";
              }
            }
        });

    //メールアドレスが登録されているかの確認
        exec('git config user.email' , function(error, stdout, stderr){
          if(stdout){
            document.getElementById('chk_address').innerHTML = "E-Mail："+ stdout +"<br>";
          }
          if(error){
            document.getElementById('chk_address').innerHTML = "E-Mailが登録されていません.<br><form name='mail'><input type='text' name='Email' value=''> <input type='button' value='登録' onClick='Email_su()'> <input type='button' value='消去' onClick='clr_Email()'><br></form>";
            //メールアドレス登録処理
            function Email_su(){
              var E_addr = document.mail.Email.value;
              document.getElementById('chk_address').innerHTML = "E-Mail："+ E_addr +"<br>";
            }
            //メールアドレス入力欄消去処理
            function clr_Email(){
              document.mail.Email.value = "";
            }
          }
        });


//GitHubアカウントの新規登録画面の処理
fs.readFile(__dirname + "\\" + 'chk_acount.txt', 'utf8', function(err, text){
  var str = text;
   str = str.replace(/\r\n/g, "<br />");
   str = str.replace(/(\n|\r)/g, "<br />");
  if(str == 0){
   document.getElementById('chk_hub').innerHTML = "GitHub未登録の場合," + "<a href='javascript:void(0)' onClick='SignUpGH()'>ココ</a>から登録しよう！";
  }
  if(err == null){
  document.getElementById('footer').innerHTML = err;
 }
});




// 指定ディレクトリを検索して一覧を表示
fs.readdir(_dir, function(err, files){

    // filesの中身を繰り替えして出力
    files.forEach(function(file){
        var _type = "";
        if(fs.statSync(_dir + "\\" + file).isFile()){
            _type = "<img src='./file1/ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
            res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + "<br>";
        //    _type + "<a href='javascript:void(0)' onClick='OpenFile()'>" + file + "<br>";
        }else{
            _type = "<img src='./folder4/ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
            res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "･･･<a href='javascript:void(0)' onClick='GitInit("+ "\"" + file + "\"" + ")'>このフォルダ以下をGitの管轄下に置く</a>" + "<br>";
        }
    });
    //Gitの管轄下であるかをチェック
    exec('git status ' + _dir , function (error, stdout, stderr) {
            if (error !== null) {
              result = 'カレントディレクトリはGitの管轄下に属していません';
            }else{
              result = 'カレントディレクトリはGitの管轄下にあります';
            }
            document.getElementById('footer').innerHTML = result;
        });
      document.getElementById('res1').innerHTML = _dir　+ "";
      document.getElementById('res2').innerHTML = res;
});



//ファイルをアプリ内に読み込んで表示させる.
function OpenFile(F_Name){
 result ="";
 fs.readFile(_dir + "\\" + F_Name, 'utf8', function(err, text){
   /*var str = text;
    str = str.replace(/\r\n/g, "<br />");
    str = str.replace(/(\n|\r)/g, "<br />");*/
   document.getElementById('title').innerHTML = "　　<b>＜" + F_Name + "＞</b>" + "<br>";
   document.getElementById('det_zone').innerText = text;
   if(err == null){
     document.getElementById('footer').innerHTML = "\'"+ F_Name +"\' の読み込みに成功しました.";
  }
 });
}


//ファイルを既定のアプリで開かせる
/*
function OpenFile(F_Name){
 result ="";
  exec(_dir  + "\\" + F_Name, function (error, stdout, stderr) {
          if(stdout){
              result += 'stdout: ' + stdout +'<br>';
          }
          if(stderr){
              result += 'stderr: ' + stderr +'<br>';
          }
          if (error !== null) {
            result += 'Exec error: ' + error +'<br>';
          }else{
            result += 'Success.';
          }
          document.getElementById('res5').innerHTML = result;
      });
}
*/


//git init の実行処理
function GitInit(F_Name){
  result ="";
   exec('git init ' + _dir  + "\\" + F_Name + "\\", function (error, stdout, stderr) {
           if(stdout){
               result = 'stdout: ' + stdout +'<br>';
           }
           if(stderr){
               result = 'stderr: ' + stderr +'<br>';
           }
           if (error !== null) {
             result = 'Exec error: ' + error +'<br>';
           }else{
             result = 'Success.' + "フォルダ「" + F_Name + "」をGitの管理下に置きました";
           }
           document.getElementById('footer').innerHTML = result;
       });
}

//git add の実行処理
function Add(){
    // 内容が書き込まれている場合はコミット処理実行
      result ="";
       exec('git add --all ' + _dir + "\\", function (error, stdout, stderr) {
               if(stdout){
                   result = 'stdout: ' + stdout +'<br>';
               }
               if(stderr){
                   result = 'stderr: ' + stderr +'<br>';
               }
               if (error !== null) {
                 result = 'Exec error: ' + error +'<br>';
               }else{
                 //Commit();
                 document.getElementById('footer').innerHTML = "Add完了.";
               }

               // 入力ダイアログを表示 ＋ 入力内容を detail に代入
             var detail = prompt("[必須] 以前との変更点を入力してください.", "変更内容");
                 // 入力内容が一致しない場合は警告ダイアログを表示
                 if(detail == "" && detail == null){
                   alert('キャンセルされました');
                 }
                 else{
                   exec('git commit -m "' + detail + '" ' + _dir + "\\", function (error, stdout, stderr) {
                           if(stdout){
                               result = 'stdout: ' + stdout +'<br>';
                           }
                           if(stderr){
                               result = 'stderr: ' + stderr +'<br>';
                           }
                           if (error !== null) {
                             result = 'Exec error: ' + error +'<br>';
                           }else{
                             result = 'Success.' + "フォルダ「" + F_Name + "」以下にファイルの以前からの差分を保存しました.";
                           }
                           document.getElementById('footer').innerHTML = result;
                       });
                 }
           });
}

//git commit の実行処理
function Commit(){
  // 入力ダイアログを表示 ＋ 入力内容を detail に代入
var detail = prompt("[必須] 以前との変更点を入力してください.", "変更内容");
    // 入力内容が一致しない場合は警告ダイアログを表示
    if(detail == "" && detail == null){
      alert('キャンセルされました');
    }
    else{
      exec('git commit -m "' + detail + '" ' + _dir + "\\", function (error, stdout, stderr) {
              if(stdout){
                  result = 'stdout: ' + stdout +'<br>';
              }
              if(stderr){
                  result = 'stderr: ' + stderr +'<br>';
              }
              if (error !== null) {
                result = 'Exec error: ' + error +'<br>';
              }else{
                result = 'Success.' + "フォルダ「" + F_Name + "」以下にファイルの以前からの差分を保存しました.";
              }
              document.getElementById('footer').innerHTML = result;
          });
    }
}

//下の階層のディレクトリを検索・一覧表示
function SubDir(currentD){
  //前のカレントディレクトディレクトリに掘り下げたディレクトリを追加
    _dir += "\\"+ currentD;
    document.getElementById('res1').innerHTML = _dir;
    res = "";

    //1つ上のフォルダに戻る
    //初期化
     FolderInfo = new Array();
     FolderPath = "";
         //1つ上の階層のパスを取得
    　　FolderInfo = _dir.split('\\');
    　　for (i = 0; i < FolderInfo.length - 2; i++) {
    　　　　FolderPath += FolderInfo[i] + "\\";
    　　}
      FolderPath += FolderInfo[FolderInfo.length - 2];
      res += "<a href='#' onClick='UpDir()'>上のフォルダへ戻る</a><br><br>";

    fs.readdir(_dir, function(err, files){
        // filesの中身を繰り替えして出力
        files.forEach(function(file){
            var _type = "";
            if(fs.statSync(_dir + "\\" + file).isFile()){
              _type = "<img src='./file1/ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
              res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + "<br>";
              _type + "<a href='javascript:void(0)' onClick='OpenFile()'>" + file + "<br>";
            }else{
              _type = "<img src='./folder4/ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
              res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "･･･<a href='javascript:void(0)' onClick='GitInit("+ "\"" + file + "\"" + ")'>このフォルダ以下をGitの管轄下に置く</a>" + "<br>";
            }
        });
            document.getElementById('res1').innerHTML = _dir　+ "   <input type='button' name='commit' value='ファイルの差分保存を実行する' onClick='Add()'>";
            document.getElementById('res2').innerHTML = res;
            document.getElementById('footer').innerHTML = "Load Success.";
    });

}

//上の階層のディレクトリを検索・一覧表示
function UpDir(){

      _dir = FolderPath;
      res = "";
              document.getElementById('res1').innerHTML = _dir;
      //1つ上のフォルダに戻る
      //1つ上の階層のパスを取得
       FolderInfo = new Array();
       FolderPath = "";
      　　FolderInfo = _dir.split('\\');
      　　for (i = 0; i < FolderInfo.length - 2; i++) {
      　　　　FolderPath += FolderInfo[i] + '\\';
      　　}
        FolderPath += FolderInfo[FolderInfo.length - 2];
        res += "<a href='#' onClick='UpDir()'>上のフォルダへ戻る</a><br><br>";

      fs.readdir(_dir, function(err, files){
          // filesの中身を繰り替えして出力
          files.forEach(function(file){
              var _type = "";
              if(fs.statSync(_dir + "\\" + file).isFile()){
                _type = "<img src='./file1/ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
                res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + "<br>";
                _type + "<a href='javascript:void(0)' onClick='OpenFile()'>" + file + "<br>";
              }else{
                _type = "<img src='./folder4/ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
                res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "･･･<a href='javascript:void(0)' onClick='GitInit("+ "\"" + file + "\"" + ")'>このフォルダ以下をGitの管轄下に置く</a>" + "<br>";
              }
          });
              document.getElementById('res1').innerHTML = _dir　+ "";
              document.getElementById('res2').innerHTML = res;
              document.getElementById('footer').innerHTML = "Load Success.";
      });
}
