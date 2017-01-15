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
      exec(__dirname +"\\Gittt.exe", function(error, stdout, stderr){
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
(function(){
  _dir = fs.readFileSync(__dirname+"\\"+"last_dir.txt");
  fs.readdir(_dir, function(err, files){
    files.forEach(function(file){
        var _type = "";
        if(fs.statSync(_dir + "\\" + file).isFile()){
            _type = "<img src='./ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
            res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + " <img src='./compare01.png' onClick='Diff("+ "\"" + file + "\"" + ")' title='前回のコミット時からの差分を比較します'>" + "<br>";
        }else{
            _type = "<img src='./ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
            res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
        }
    });
      //Gitの管轄下であるかをチェック
      exec('git status ' + _dir , function (error, stdout, stderr) {
              if (error != null) {
                document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
              }else{
                document.getElementById('Init_Info').innerHTML = "<img src='./Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
              }
          });
        document.getElementById('res1').innerHTML = _dir　+ "";
        document.getElementById('res2').innerHTML = res;
  });
})();


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
             alert("カレントディレクトリをGitの管理下に置きました");
             AddFirst();
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
                Merge01();
                result = 'Success.' + "カレントディレクトリ以下で更新があったファイルの差分を保存しました.";
              }else{
                result = 'Exec error: ' + error +'<br>';
                alert("画面右下の変更点記入欄を入力してください");
              }
              document.getElementById('footer').innerHTML = result;
          });
}
function Merge01(){
  exec('git checkout master',function(error, stdout, stderr){
    if(error == null){
      Merge02();
    }
  });
}
function Merge02(){
  exec('git merge beta',function(error, stdout, stderr){
    if(error == null){
      Merge03();
    }
  });
}
function Merge03(){
  exec('git checkout beta',function(error, stdout, stderr){
  });
}

//git add の実行処理
function AddTmp(){
    /* 変更を検知した場合コミット処理実行*/
            exec('git add --all ' + _dir + "\\", function (error, stdout, stderr) {
                    if (error == null) {
                      CommitTmp();
                    }
                });
}
function CommitTmp(){
  var d = new Date();
  exec('git commit -m "' + d.toLocaleString() + ' の時点の状態"', function (error, stdout, stderr) {
      });
      alert("差分を保存しました");
}

function AddFirst(){
    /* 変更を検知した場合コミット処理実行*/
            exec('git add --all ' + _dir + "\\", function (error, stdout, stderr) {
                    if (error == null) {
                      CommitFirst();
                    }
                });
}
function CommitFirst(){
  exec('git commit -m "Origin Commit"', function (error, stdout, stderr) {
      if(error == null){
        ChkOut_B_First();
              location.reload();
      }
    });
}
function ChkOut_B_First(){
  exec('git checkout -b beta',function(error, stdout, stderr){
  });
}

//リモートリポジトリのセット
function SetRepo(){
  var RepoURI = document.repo.Reposit.value;
  exec('git remote add test2 ' + RepoURI , function (error, stdout, stderr) {
          if(error == null){
            document.getElementById('footer').innerHTML = "リモートリポジトリ："+ E_addr +"を登録しました";
            alert("リモートリポジトリ\n"+ E_addr +"\nを登録しました");
            //location.reload();
          }
      });
}

//リモートリポジトリへPushする
function Push(){
  alert("リモートリポジトリへアップロードします\nしばらくお待ちください");
  exec('git push test2 master',function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "リモートリポジトリへアップロードしました";
      alert("リモートリポジトリへのアップロードが完了しました");
    }
  });
}

//リモートリポジトリからPullする
function Pull(){
  exec('git pull test2 master', function(error, stdout, stderr){
    if(error == null){
      Pull2();
    }
  });
}
function Pull2(){
  exec('git merge master', function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "リモートリポジトリから同期しました";
      alert("リモートリポジトリから同期しました");
    }
  });
}


//ひとつ前のコミット状態へ戻す（reset）
function Reset(){
  exec('git reset --hard HEAD^', function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "最新のコミット時の状態に戻りました";
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
              _type = "<img src='./ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
              res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + " <img src='./compare01.png' onClick='Diff("+ "\"" + file + "\"" + ")' title='前回のコミット時からの差分を比較します'>" + "<br>";
              //_type + "<a href='javascript:void(0)' onClick='OpenFile()'>" + file + "<br>";
            }else{
              _type = "<img src='./ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
              res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
            }
        });
        //Gitの管轄下であるかをチェック
        exec('git status ' + _dir , function (error, stdout, stderr) {
                if (error != null) {
                  document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
                }else{
                  document.getElementById('Init_Info').innerHTML = "<img src='./Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
                }
            });
            document.getElementById('res1').innerHTML = _dir;
            document.getElementById('res2').innerHTML = res;
            document.getElementById('footer').innerHTML = "Load Success.";
            fs.writeFileSync(__dirname+"\\"+"last_dir.txt", _dir);
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
                _type = "<img src='./ico_file1a_02.gif' onClick='OpenFile("+ "\"" + file + "\"" + ")'>";
                res += _type + "<a href='javascript:void(0)' onClick='OpenFile("+ "\"" + file + "\"" + ")'>" + file +　"</a>" + " <img src='./compare01.png' onClick='Diff("+ "\"" + file + "\"" + ")' title='前回のコミット時からの差分を比較します'>" + "<br>";
                //_type + "<a href='javascript:void(0)' onClick='OpenFile()'>" + file + "<br>";
              }else{
                _type = "<img src='./ico_folder4_1.gif' onClick='SubDir("+ "\"" + file + "\"" + ")'>";
                res += _type + "<a href='javascript:void(0)' onClick='SubDir("+ "\"" + file + "\"" + ")'>" +file + "</a>" + "<br>";
              }
          });
          //Gitの管轄下であるかをチェック
          exec('git status ' + _dir , function (error, stdout, stderr) {
                  if (error != null) {
                    document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
                  }else{
                    document.getElementById('Init_Info').innerHTML = "<img src='./Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
                  }
              });
              document.getElementById('res1').innerHTML = _dir;
              document.getElementById('res2').innerHTML = res;
              document.getElementById('footer').innerHTML = "Load Success.";
              fs.writeFileSync(__dirname+"\\"+"last_dir.txt", _dir);
      });
}
