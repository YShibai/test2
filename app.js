exec('git --version' , function (error, stdout, stderr) {
        if(stdout){
          SysInfo = stdout;
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
            function (respnse) {
              /* OKボタン(ボタン配列の0番目がOK)*/
              if (respnse == 0) {
                InstallGit();
              }
            }
          );
        }
    });

    function InstallGit(){
          alert("途中の\n「Configuring the terminal emulator to use with Git Bash」では\n「Use Windows'default console window」を選択してください.\nその他はnextで何も変更はありません.");
      exec(__dirname +"\\Gittt.exe", function(error, stdout, stderr){
        if(error == null){
          alert("インストールが終了したらPCを再起動してください.");
　　　　　　alert("再起動後，再びアプリケーションを起動してください．");
        }
      });
    }
FsFirst();

//GitHubアカウントの新規登録画面処理
fs.readFile(__dirname + "\\" + 'chk_acount.txt', 'utf8', function(err, text){
  if(text == 0){
   document.getElementById('chk_hub').innerHTML = "準備その４．リモートリポジトリの準備<br>GitHub未登録の場合，" + "<a href='javascript:void(0)' onClick='SignUpGH()'>ココ</a>から登録しよう！";
 }else{
   document.getElementById('res0').innerHTML = "";
   document.getElementById('chk_name').innerHTML = "";
   document.getElementById('chk_address').innerHTML = "";
   document.getElementById('chk_hub').innerHTML = "<br><br>";
   FirstPull();
 }
  if(err == null){
  document.getElementById('footer').innerHTML = err;
 }
});

//GitHubアカウントの登録画面
function SignUpGH(){
  document.getElementById('det_zone').innerHTML = "ステップその１．GitHubの登録（既にリモートリポジトリを持ってる人はスキップ可）<br>複数人でプロジェクトファイルを共有・編集するにはGitHubの登録が必要です。<br>必要事項を入力してアカウントを作りましょう。<br>仮登録のメールが届くので、メール内のhttpsから始まるURLを<br>別のブラウザで開いてください。<br>開いたら「Start a Project」を選択してください.<br>「Create a new repository」において「Repository name」を任意の半角英数字で入力してください.他の項目はいじらず、下部の「Create repository」ボタンを押してください.<br>するとリモートリポジトリの完成です。<br>次に「Quick setup — if you’ve done（省略）」と表示されている下にあるhttpsから始まるURLをコピーしてください。<br>URLのコピーはステップその２で使います<br><webview id='githubSighUp' src='https://github.com/join' style='height:57%;'></webview><br><br>ステップその２．リモートリポジトリの登録<br>下の入力欄にSTEP1でコピーしたURLを貼りつけて登録ボタンを押してください<br>また，ステップ１をスキップしたリモートリポジトリ持ちの人は、登録したいリポジトリURLを入力して登録してください<br><form name='repo'><input type='text' name='Reposit' value=''> <input type='button' value='リモートリポジトリ登録' onClick='SetRepo()'><br></form>";
}
//リモートリポジトリのセット
function SetRepo(){
  var RepoURI = document.repo.Reposit.value;
  exec('git -C '+ _dir +' remote add test2 ' + RepoURI , function (error, stdout, stderr) {
          if(error == null){
            fs.writeFileSync(__dirname+"\\"+"chk_acount.txt", "1");
            document.getElementById('footer').innerHTML = "リモートリポジトリ："+ RepoURI +"を登録しました";
            alert("リモートリポジトリ\n"+ RepoURI +"\nを登録しました");
            alert("さあ準備が整いました. Gitを活用しましょう");
            alert("最後に、アプリケーションが再読み込みされます\nその後，画面左上のコミットの注意点をよく読んでください");
            location.reload();
          }
      });
}
function FirstPull(){
  exec('git -C '+ _dir +' checkout master',function(error, etdout, stderr){
    if(error ==null){
      FirstPull2();
    }
  });
}
function FirstPull2(){
  exec('git -C '+ _dir +' pull test2 master',function(error, etdout, stderr){
    if(error ==null){
      FirstPull3();
    }
  });
}
function FirstPull3() {
  exec('git -C '+ _dir +' checkout beta',function(error, etdout, stderr){
    if(error ==null){
      FirstPull4();
    }
  });
}
function FirstPull4() {
  exec('git -C '+ _dir +' merge master',function(error, etdout, stderr){
  });
}

// 指定ディレクトリを検索して一覧を表示
function FsFirst(){
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
      exec('git -C ' + _dir + ' status', function (error, stdout, stderr) {
              if (error != null) {
                document.getElementById('Init_Info').innerHTML = "<span style='background-color: #e598c5;'><strong>このカレントディレクトリはGitで管理されていません</strong></span><br><img src='./Git_Init_32.png' onClick='GitInit()'>" + "<a href='javascript:void(0)' onClick='GitInit()'><b>このフォルダ以下をGitの管轄下に置く</b></a>";
              }else{
                document.getElementById('Init_Info').innerHTML = "<img src='./Git_OK_32.png'><span style='background-color: #47ea7e;'><strong>カレントディレクトリはGitの管轄下にあります</strong></span>";
              }
          });
        document.getElementById('res1').innerHTML = _dir　+ "";
        document.getElementById('res2').innerHTML = res;
  });
}


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
   exec('git -C ' + _dir + ' init', function (error, stdout, stderr) {
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
            exec('git -C '+ _dir +' add --all', function (error, stdout, stderr) {
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
      exec('git -C '+ _dir +' commit -m "' + detail + '"', function (error, stdout, stderr) {
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
  exec('git -C '+ _dir +' checkout master',function(error, stdout, stderr){
    if(error == null){
      Merge02();
    }
  });
}
function Merge02(){
  exec('git -C '+ _dir +' merge beta',function(error, stdout, stderr){
    if(error == null){
      Merge03();
    }
  });
}
function Merge03(){
  exec('git -C '+ _dir +' checkout beta',function(error, stdout, stderr){
    if(error == null){
      alert("ファイルの差分を保存しました.");
      location.reload();
    }
  });
}

//git add の実行処理
function AddTmp(){
    /* 変更を検知した場合コミット処理実行*/
            exec('git -C '+ _dir +' add --all', function (error, stdout, stderr) {
                    if (error == null) {
                      CommitTmp();
                    }
                });
}
function CommitTmp(){
  var d = new Date();
  exec('git -C '+ _dir +' commit -m "' + d.toLocaleString() + ' の時点の状態"', function (error, stdout, stderr) {
      });
      alert("差分を保存しました");
}

function AddFirst(){
    /* 変更を検知した場合コミット処理実行*/
            exec('git -C '+ _dir +' add --all', function (error, stdout, stderr) {
                    if (error == null) {
                      CommitFirst();
                    }
                });
}
function CommitFirst(){
  exec('git -C '+ _dir +' commit -m "Origin Commit"', function (error, stdout, stderr) {
      if(error == null){
        ChkOut_B_First();
              location.reload();
      }
    });
}
function ChkOut_B_First(){
  exec('git -C '+ _dir +' checkout -b beta',function(error, stdout, stderr){
  });
}

//前のコミット段階のデータとの差分比較
function Diff(F_Name){
  exec('git -C '+ _dir +' diff '+ _dir + '\\' + F_Name, function (error, stdout, stderr) {
          if(error == null){
            var re = /[@][@].[-](.*?),(.*?)\+(.*?),(.*?)[@][@]/g;
            var match = stdout.match(re);
            var re2 = /[@][@].[-](.*?),(.*?)\+(.*?),(.*?)[@][@]/;
            var i = 0;
            var match2 = new Array();
            while(i<match.length){
            match2[i] = match[i].match(re2);
            i++;
          }
          var DiffInfo = match.length + "箇所に変更があります。\n";
          var DiffInfo2 = "";
          var j =0;
          while(j<match.length){
            DiffInfo2 +=j+1 +"箇所目は変更前に"+ match2[j][1] + "行目から" + match2[j][2] + "行分あったところが、変更により";
            if(match2[j][4]-match2[j][2] < 0){
              DiffInfo2 += Math.abs(match2[j][4]-match2[j][2]) + "行減少しました。\n";
            }else if (match2[j][4]-match2[j][2] > 0) {
              DiffInfo2 += Math.abs(match2[j][4]-match2[j][2]) + "行増加しました。\n";
            }else{
              DiffInfo2 += "行数の変化はありませんが、中身が書き換わっています。\n";
            }
            j++;
          }
              document.getElementById('title').innerHTML = "<b>＜差分＞</b><br>"
              document.getElementById('edit_zone').innerText = DiffInfo+DiffInfo2+stdout;
              document.getElementById('footer').innerHTML = "Load Success.";
          }
      });
}

//リモートリポジトリへPushする
function Push(){
  alert("リモートリポジトリへアップロードします\nしばらくお待ちください");
  exec('git -C '+ _dir +' push test2 master',function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "リモートリポジトリへアップロードしました";
      alert("リモートリポジトリへのアップロードが完了しました");
    }else{
      alert("リモートリポジトリの登録が行われていません．\nリモートリポジトリの登録を行いましょう");
    }
  });
}

//リモートリポジトリからPullする
function Pull(){
  exec('git -C '+ _dir +' pull test2 master', function(error, stdout, stderr){
    if(error == null){
      Pull2();
    }
  });
}
function Pull2(){
  exec('git -C '+ _dir +' merge master', function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "リモートリポジトリから同期しました";
      alert("リモートリポジトリから同期しました");
    }
  });
}


//ひとつ前のコミット状態へ戻す（reset）
function Reset(){
  exec('git -C '+ _dir +' reset --hard HEAD^', function(error, stdout, stderr){
    if(error == null){
      document.getElementById('footer').innerHTML = "最新のコミット時の状態に戻りました";
      alert("最新のコミット時の状態に戻りました");
      location.reload();
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
        exec('git -C '+ _dir +' status', function (error, stdout, stderr) {
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
          exec('git -C '+ _dir +' status', function (error, stdout, stderr) {
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
