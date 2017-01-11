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
        if (error != null) {
          var win = remote.getCurrentWindow();
          dialog.showMessageBox(win, {
              title: 'Gitのインストールについて',
              type: 'info',
              buttons: ['はい', 'いいえ'],
              detail: 'Gitがインストールされていません.インストーラを起動しますか？'
            },
            /* メッセージボックスが閉じられた後のコールバック関数*/
            function (respnse) {
              /* OKボタン(ボタン配列の0番目がOK)*/
              if (respnse == 0) {
                InstallGit();
              }
            }
          );
        }
        document.getElementById('res0').innerHTML = result;
    });
    //Gitのインストーラの起動
    function InstallGit(){
      exec(__dirname +"\\git\\Git.exe", function(error, stdout, stderr){
      });
    }


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
            res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
        }
    });
    //Gitの管轄下であるかをチェック
    exec('git status ' + _dir , function (error, stdout, stderr) {
            if (error != null) {
              document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./folder4/Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
            }else{
              document.getElementById('Init_Info').innerHTML = "<img src='./folder4/Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
            }
        });
      document.getElementById('res1').innerHTML = _dir　+ "";
      document.getElementById('res2').innerHTML = res;
});



//ファイルをアプリ内に読み込んで表示させる.
var currentPath = "";
function OpenFile(F_Name){
 result ="";
 fs.readFile(_dir + "\\" + F_Name, 'utf8', function(err, text){
   currentPath = _dir + "\\" + F_Name;
   /*var str = text;
    str = str.replace(/\r\n/g, "<br />");
    str = str.replace(/(\n|\r)/g, "<br />");*/
   document.getElementById('title').innerHTML = "　　<b>＜" + F_Name + "＞</b>" + "<br>"+ currentPath +"<br>";
   document.getElementById('edit_zone').innerText = text;
   if(err == null){
     document.getElementById('footer').innerHTML = "\'"+ F_Name +"\' の読み込みに成功しました.";
  }
 });
}
/**
 * ファイルを保存する
 */
function saveFile() {
	/*　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する*/
	if (currentPath == "") {
		saveNewFile();
		return;
	}
	var win = remote.getCurrentWindow();
	dialog.showMessageBox(win, {
			title: 'ファイルの上書き保存を行います。',
			type: 'info',
			buttons: ['OK', 'Cancel'],
			detail: '本当に保存しますか？'
		},
		/* メッセージボックスが閉じられた後のコールバック関数*/
		function (respnse) {
			/* OKボタン(ボタン配列の0番目がOK)*/
			if (respnse == 0) {
				var data = document.getElementById('edit_zone').value;
				writeFile(data);
			}
		}
	);
}

/**
 * ファイルを書き込む
 */
var tmp_Path = null;
function writeFile(data) {
  if(tmp_Path!=null){
    fs.writeFile(tmp_Path, data, function (error) {
  		if (error != null) {
  			alert('保存しました');
  		}
  	});
    document.getElementById('title').innerText = tmp_Path;
    currentPath = tmp_Path;
    tmp_Path = null;
      return;
  }
	fs.writeFile(currentPath, data, function (error) {
		if (error != null) {
			alert('error : ' + error);
			return;
		}
	});
}

/**
 * 新規ファイルを保存する
 */
function saveNewFile() {
	var win = remote.getCurrentWindow();
	dialog.showSaveDialog(
		win,
		/* どんなダイアログを出すかを指定するプロパティ*/
		{
			properties: ['openFile'],
			filters: [
				{
					name: 'Documents',
					extensions: ['txt', 'text', 'html', 'js']
				}
			]
		},
		/* セーブ用ダイアログが閉じられた後のコールバック関数*/
		function (fileName) {
			if (fileName) {
				var data = document.getElementById('edit_zone').value;
				tmp_Path = fileName;
				writeFile(data);
			}
		}
	);
}


//git init の実行処理
function GitInit(){
  result ="";
   exec('git init ' + _dir, function (error, stdout, stderr) {
           if(stdout){
               result = 'stdout: ' + stdout +'<br>';
           }
           if(stderr){
               result = 'stderr: ' + stderr +'<br>';
           }
           if (error !== null) {
             result = 'Exec error: ' + error +'<br>';
           }else{
             result = 'Success.' + "カレントディレクトリをGitの管理下に置きました";
           }
           document.getElementById('footer').innerHTML = result;
       });
}

//git add の実行処理
function Add(){
    /* 内容が書き込まれている場合はコミット処理実行*/
      result ="";
      var win = remote.getCurrentWindow();
    	dialog.showMessageBox(win, {
    			title: 'カレントディレクトリ内で更新されたファイルの差分を保存します',
    			type: 'info',
    			buttons: ['OK', 'Cancel'],
    			detail: '保存しますか？'
    		},
    		/* メッセージボックスが閉じられた後のコールバック関数*/
    		function (respnse) {
    			/* OKボタン(ボタン配列の0番目がOK)*/
    			if (respnse == 0) {
            exec('git add --all ' + _dir + "\\", function (error, stdout, stderr) {
                    if (error == null) {
                      Commit();
                    }else{
                      result = 'Exec error: ' + error +'<br>';
                      document.getElementById('footer').innerHTML = result;
                    }
                });
    			}
    		}
    	);
}

//git commit の実行処理
function Commit(){
  var detail = document.getElementById('c_det').value;
      exec('git commit -m "' + detail + '" ' + _dir + "\\", function (error, stdout, stderr) {
              if (error == null) {
                result = 'Success.' + "カレントディレクトリ以下で更新があったファイルの差分を保存しました.";
              }else{
                result = 'Exec error: ' + error +'<br>';
              }
              document.getElementById('footer').innerHTML = result;
          });
}


//リモートリポジトリのセット
function SetRepo(){
  var RepoURI = document.repo.Reposit.value;
  exec('git remote add test2 ' + RepoURI , function (error, stdout, stderr) {
          if(error == null){
            document.getElementById('footer').innerHTML = "リモートリポジトリ："+ E_addr +"を登録しました";
            //location.reload();
          }
      });
}

//リモートリポジトリへPush
function Push(){
  exec('git push test2 master',function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "リモートリポジトリへプッシュしました";
    }
  });
}

function Pull(){
  exec('git pull ', function(error, stdout, stderr){

  });
}


//ひとつ前のコミット状態へ戻す（reset）
function Reset(){
  exec('git reset --hard HEAD^', function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "１つ前のコミット時の状態に戻りました";
    }
  });
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
              res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
            }
        });
        //Gitの管轄下であるかをチェック
        exec('git status ' + _dir , function (error, stdout, stderr) {
                if (error != null) {
                  document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./folder4/Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
                }else{
                  document.getElementById('Init_Info').innerHTML = "<img src='./folder4/Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
                }
            });
            document.getElementById('res1').innerHTML = _dir;
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
                res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
              }
          });
          //Gitの管轄下であるかをチェック
          exec('git status ' + _dir , function (error, stdout, stderr) {
                  if (error != null) {
                    document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./folder4/Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
                  }else{
                    document.getElementById('Init_Info').innerHTML = "<img src='./folder4/Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
                  }
              });
              document.getElementById('res1').innerHTML = _dir;
              document.getElementById('res2').innerHTML = res;
              document.getElementById('footer').innerHTML = "Load Success.";
      });
}
