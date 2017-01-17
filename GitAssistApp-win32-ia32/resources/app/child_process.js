var exec = require('child_process').exec;
var result ="";
exec('C:\\Users\\Public\\Documents\\a\\1.txt', function (error, stdout, stderr) {
    if(stdout){
        result += 'stdout: ' + stdout +"<br>";
    }
    if(stderr){
        result += 'stderr: ' + stderr +"<br>";
    }
    if (error !== null) {
      result += 'Exec error: ' + error +"<br>";
    }
    document.getElementById('res5').innerHTML = result;
});
