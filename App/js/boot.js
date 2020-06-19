/*
	RJX_Toolset
	boot.js
*/
// Vars
var APP_FS;
var APP_PATH;
var APP_LOG = '';
var APP_CONGRATZ = 0;
var APP_VERSION = '1.0';
var MAIN_exludeFileFormats = [
	'.xci',
	'.nsp',
	'.keys',
	'.exe',
	'.zip'
];

var RJX_7Z_PATH;
var RJX_LATEST_BCK;
var EXTERNAL_APP_PID;
var RJX_EMUPATH = '';
var RJX_DOTPATH = '';
var DOWNLOAD_RUNNING;
var RJX_TEMP_INTERVAL;
var DOWNLOAD_COMPLETE;
var RJX_NAND_PATH = '';
var DOWNLOAD_STATUSCODE;
var EXTERNAL_APP_RUNNING;
var EXTERNAL_APP_EXITCODE;
var RJX_BRANCH = 'master';

// Functions
function getFileName(file){
	if (file !== '' && file !== undefined){
		var c = 0;
		var removePath = file.toLowerCase().split(/(\\|\/)/g).pop();
		while (c < MAIN_exludeFileFormats.length){
			removePath = removePath.replace(MAIN_exludeFileFormats[c], '');
			c++;
		}
		return removePath;
	}
}
function RJX_Toolset_STARTUP(){
	try{
		APP_FS = require('fs');
		var logonText = 'RJX_Toolset - Ver. ' + APP_VERSION;
		document.title = logonText;
		APP_PATH = process.cwd();
		console.info(logonText);
		RJX_addLog(logonText);
		if (nw.process.arch !== 'ia32'){
			RJX_7Z_PATH = APP_PATH + '\\App\\tools\\7z\\64\\7za.exe';
			RJX_addLog('Running on x64 mode');
		} else {
			RJX_7Z_PATH = APP_PATH + '\\App\\tools\\7z\\32\\7z.exe';
			RJX_addLog('Running on x86 mode');
		}
		if (APP_FS.existsSync(APP_PATH + '\\Backup') !== true){
			process.chdir(APP_PATH);
			APP_FS.mkdirSync(APP_PATH + '\\Backup');
		}
		if (APP_FS.existsSync(APP_PATH + '\\Update\\RJX_CODE.zip') === true){
			APP_FS.unlinkSync(APP_PATH + '\\Update\\RJX_CODE.zip');
		}
		if (APP_FS.existsSync(APP_PATH + '\\Update\\Code') === true){
			RJX_deleteFolderRecursive(APP_PATH + '\\Update\\Code');
		}
		RJX_checkVars();
	} catch (err){
		console.error('ERROR ON STARTUP!\nReason: ' + err);
		window.alert('ERROR ON STARTUP!\nReason: ' + err);
	}
}
function RJX_RELOAD(){
	location.reload();
}
function RJX_EXIT(){
	process.exit();
}
function RJX_checkVars(){
	if (JSON.parse(localStorage.getItem('RJX_SETUP')) !== true){
		var CONTINUE = false;
		var ask = prompt('Please insert your emulator path below:');
		if (ask !== null && ask !== ''){
			CONTINUE = true;
			RJX_EMUPATH = ask;
		} else {
			RJX_RELOAD();
		}
		if (CONTINUE === true){
			ask = prompt('Now, insert your dotnet exec path:');
			if (ask !== null && ask !== ''){
				if (APP_FS.existsSync(ask) !== false){
					CONTINUE = true;
					RJX_DOTPATH = ask;
				} else {
					RJX_RELOAD();
				}
			} else {
				RJX_RELOAD();
			}
		}
		if (CONTINUE === true){
			localStorage.setItem('RJX_BCK_FILE', '');
			localStorage.setItem('RJX_BRANCH', 'master');
			localStorage.setItem('RJX_PATH', RJX_EMUPATH);
			localStorage.setItem('RJX_DOTPATH', RJX_DOTPATH);
			localStorage.setItem('RJX_SETUP', true);
			RJX_RELOAD();
		}
	} else {
		RJX_EMUPATH = localStorage.getItem('RJX_PATH');
		RJX_BRANCH = localStorage.getItem('RJX_BRANCH');
		RJX_DOTPATH = localStorage.getItem('RJX_DOTPATH');
		RJX_LATEST_BCK = localStorage.getItem('RJX_BCK_FILE'); 
		document.getElementById('LBL_APP_VER').innerHTML = APP_VERSION;
		document.getElementById('LBL_RYU_PATH').innerHTML = RJX_EMUPATH;
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		document.getElementById('LBL_DOTNET_PATH').innerHTML = RJX_DOTPATH;
		//
		RJX_NAND_PATH = nw.App.dataPath.replace('Local\\RJX_Toolset\\User Data\\Default', 'Roaming\\Ryujinx\\');
		if (APP_FS.existsSync(RJX_NAND_PATH) !== false){
			document.getElementById('LBL_NAND_EXISTS').innerHTML = 'Yes';
			document.getElementById('LBL_NAND_PATH').innerHTML = RJX_NAND_PATH;
			$('#BTN_EMU_BCK').css({'display': 'inline'});
		} else {
			$('#BTN_EMU_BCK').css({'display': 'none'});
			document.getElementById('LBL_NAND_EXISTS').innerHTML = 'No';
			RJX_addLog('WARN: There is no EMU settings on this machine!<br>Open EMU first and then run this application!');
		}
		if (RJX_LATEST_BCK !== '' && RJX_LATEST_BCK !== null){
			if (APP_FS.existsSync(APP_PATH + '\\Backup\\' + RJX_LATEST_BCK) !== false){
				$('#BTN_EMU_RES').css({'display': 'inline'});
				document.getElementById('LBL_LAST_BCK').innerHTML = RJX_LATEST_BCK;
			} else {
				$('#BTN_EMU_RES').css({'display': 'none'});
				document.getElementById('LBL_LAST_BCK').innerHTML = 'Unable to find last backup! (' + RJX_LATEST_BCK + ')';
				RJX_addLog('Unable to find ' + RJX_LATEST_BCK);
			}
		} else {
			$('#BTN_EMU_RES').css({'display': 'none'});
		}
		if (navigator.onLine = false){
			RJX_addLog('INFO - You are offline!');
		}
	}
}
function RJX_CHANGE_BRANCH(){
	var ask = prompt('Please insert new branch name below:\n(Previous: ' + RJX_BRANCH + ')', RJX_BRANCH);
	if (ask !== null){
		if (ask === ''){
			RJX_BRANCH = 'master';
		} else {
			RJX_BRANCH = ask;
		}
		localStorage.setItem('RJX_BRANCH', RJX_BRANCH);
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		RJX_addLog('System: New GitHub branch: ' + RJX_BRANCH);
	}
}
function RJX_CHANGE_DOT(){
	var ask = prompt('Please insert new DotNet exec path below:', RJX_DOTPATH);
	if (ask !== null && ask !== ''){
		if (APP_FS.existsSync(ask) !== false){
			RJX_DOTPATH = ask;
			localStorage.setItem('RJX_DOTPATH', RJX_DOTPATH);
			document.getElementById('LBL_DOTNET_PATH').innerHTML = RJX_DOTPATH;
			RJX_addLog('System: New DotNet path: ' + RJX_DOTPATH);
		} else {
			RJX_addLog('System: Unable to find executable!');
		}
	}
}
function RJX_WIP(){
	window.alert('WARN - THIS IS WIP!');
}
function RJX_currentTime(){
	var t = new Date;
	var d = t.getDate();
	var h = t.getHours();
	var s = t.getSeconds();
	var y = t.getFullYear();
	var mi = t.getMinutes();
	var m = t.getMonth() + 1;
	if (d.toString().length < 2){
		d = '0' + t.getDate();
	}
	if (m.toString().length < 2){
		m = '0' + parseInt(t.getMonth() + 1);
	}
	if (h.toString().length < 2){
		h = '0' + t.getHours(); 
	}
	if (mi.toString().length < 2){
		mi = '0' + t.getMinutes(); 
	}
	if (s.toString().length < 2){
		s = '0' + t.getSeconds();
	}
	return d + '-' + m + '-' + y + '_' + h + '.' + mi + '.' + s;
}
// RUN SOFTWARE
function RJX_runExternalSoftware(exe, args){
	try{
		//var tmpArgs = args;
		EXTERNAL_APP_EXITCODE = 0;
		EXTERNAL_APP_RUNNING = true;
		const { spawn } = require('child_process');
		if (args === undefined || args === null || args === ''){
			//tmpArgs = 'No args was set';
			args = [''];
		}
		const ls = spawn(exe, args);
		EXTERNAL_APP_PID = ls.pid;
		//RJX_addLog('Running external command \\ software: ' + exe);
		//RJX_addLog('Args: ' + tmpArgs);
		ls.stdout.on('data', (data) => {
			RJX_addLog('External App: ' + data.replace(new RegExp('\n', 'g'), '<br>'));
		});
		ls.stderr.on('data', (data) => {
			RJX_addLog('External App: ' + data.replace(new RegExp('\n', 'g'), '<br>'));
		});
		ls.on('close', (code) => {
			EXTERNAL_APP_PID = 0;
			EXTERNAL_APP_RUNNING = false;
			EXTERNAL_APP_EXITCODE = code;
			if (exe !== 'cmd'){
				RJX_addLog('External App - The application was finished with exit code ' + code + '.');
				return code;
			}
		});
	} catch (err){
		RJX_addLog('ERROR - Something went wrong while running ' + getFileName(exe) + '!');
		RJX_addLog('Details: ' + err);
	}
}
// Download Files
function RJX_downloadFile(url, nomedoarquivo){
	DOWNLOAD_COMPLETE = false;
	RJX_addLog('Starting download: ' + url + ' - Download path: ' + nomedoarquivo);
	const http = require('https');
	const file = APP_FS.createWriteStream(nomedoarquivo);
	const request = http.get(url, function(response){
		DOWNLOAD_RUNNING = true;
		response.pipe(file);
		DOWNLOAD_STATUSCODE = response.statusCode;
		file.on('finish', function(){
	  		DOWNLOAD_STATUSCODE = response.statusCode;
     		if (DOWNLOAD_STATUSCODE === 200){
	  			DOWNLOAD_COMPLETE = true;
     			RJX_addLog('(' + url + ') Download complete!', true);
     		} else {
     			DOWNLOAD_COMPLETE = false;
     		}
    	});
	});
}
function RJX_deleteFolderRecursive(path){
	RJX_runExternalSoftware('cmd', ['/C', 'rd', '/s', '/q', path]);
};