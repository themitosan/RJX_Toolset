/*
	RJX_Toolset
	boot.js
*/
// Vars
var APP_FS;
var APP_PATH;
var APP_LOG = '';
var APP_CONGRATZ = 0;
var APP_VERSION = '1.1.2';
var MAIN_exludeFileFormats = [
	'.xci',
	'.nsp',
	'.keys',
	'.exe',
	'.zip'
];
// Download
var DOWNLOAD_PG = 0;
var DOWNLOAD_LENGTH;
var DOWNLOAD_RUNNING;
var DOWNLOAD_REQUEST;
var DOWNLOAD_RESPONSE;
var DOWNLOAD_COMPLETE;
var DOWNLOAD_STATUSCODE;
//
var RJX_7Z_PATH;
var RJX_APPV_XML;
var RJX_LATEST_BCK;
var EXTERNAL_APP_PID;
var RJX_TEMP_INTERVAL;
var RJX_NAND_PATH = '';
var RJX_EMUPATH = 'N/A';
var RJX_DOTPATH = 'N/A';
var RJX_BUILD_METHOD = 0;
var RJX_UPDATING = false;
var EXTERNAL_APP_RUNNING;
var EXTERNAL_APP_EXITCODE;
var RJX_INTERNAL_INTERVAL;
var RJX_BRANCH = 'master';
var RJX_DECOMP_SHARE = false;
var RJX_CURRENT_DOTVER = '3.1';
var RJX_logonText = 'RJX_Toolset - Ver. ' + APP_VERSION;
/*
	Functions
*/
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
		APP_PATH = process.cwd();
		RJX_addLog(RJX_logonText);
		console.info(RJX_logonText);
		document.title = RJX_logonText;
		if (nw.process.arch !== 'ia32'){
			RJX_7Z_PATH = APP_PATH + '\\App\\tools\\7z\\64\\7za.exe';
			RJX_addLog('Running on x64 mode');
		} else {
			RJX_7Z_PATH = APP_PATH + '\\App\\tools\\7z\\32\\7z.exe';
			RJX_addLog('Running on x86 mode');
		}
		var proceed = true;
		RJX_logSeparator();
		RJX_UPFILE = 'UPDATE.zip';
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
		if (APP_FS.existsSync(APP_PATH + '\\Update\\publish') === true){
			proceed = false;
			RJX_addLog('INFO - Removing leftover files from previous update... (publish)');
			RJX_deleteFolderRecursive(APP_PATH + '\\Update\\publish');
			RJX_TEMP_INTERVAL = setInterval(function(){
				if (EXTERNAL_APP_RUNNING === false){
					RJX_RELOAD();
				} else {
					console.info('Waiting Removing leftover files... (publish)');
				}
			}, 100);
		}
		if (APP_FS.existsSync(APP_PATH + '\\Update\\' + RJX_UPFILE) === true){
			APP_FS.unlinkSync(APP_PATH + '\\Update\\' + RJX_UPFILE);
		}
		if (proceed === true){
			RJX_checkVars();
		}
	} catch (err){
		RJX_addLog('ERROR ON STARTUP!');
		RJX_addLog('Reason: ' + err);
		console.error('ERROR ON STARTUP!\nReason: ' + err);
		window.alert('ERROR ON STARTUP!\nReason: ' + err);
	}
}
function RJX_RELOAD(){
	location.reload();
}
function RJX_checkVars(){
	if (JSON.parse(localStorage.getItem('RJX_SETUP')) !== true){
		RJX_addLog('CONFIGS - Saving first values...');
		RJX_SAVE_CONFS();
		RJX_RELOAD();
	} else {
		RJX_EMUPATH = localStorage.getItem('RJX_PATH');
		RJX_BRANCH = localStorage.getItem('RJX_BRANCH');
		RJX_DOTPATH = localStorage.getItem('RJX_DOTPATH');
		RJX_LATEST_BCK = localStorage.getItem('RJX_BCK_FILE');
		RJX_BUILD_METHOD = parseInt(localStorage.getItem('RJX_BUILD_METHOD'));
		RJX_DECOMP_SHARE = JSON.parse(localStorage.getItem('RJX_DECOMP_SHARE'));
		document.getElementById('LBL_APP_VER').innerHTML = APP_VERSION;
		document.getElementById('LBL_RYU_PATH').innerHTML = RJX_EMUPATH;
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		document.getElementById('LBL_DOTNET_PATH').innerHTML = RJX_DOTPATH;
		document.getElementById('SET_UPDATE_METHOD').value = RJX_BUILD_METHOD;
		document.getElementById('CHECK_DECOMP_SHARE').checked = RJX_DECOMP_SHARE;
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
		RJX_APPV_XML = 'https://ci.appveyor.com/api/projects/gdkchan/ryujinx/branch/' + RJX_BRANCH;
		if (navigator.onLine === false){
			RJX_addLog('ERROR - You are offline!');
			setTimeout(function(){
				RJX_RELOAD();
			}, 5000);
		} else {
			RJX_getLastBuildInfo(true);
			RJX_UPDATE_INFOS();
		}
	}
}
function RJX_UPDATE_INFOS(){
	RJX_INTERNAL_INTERVAL = setInterval(function(){
		if (RJX_UPDATING !== true){
			RJX_getLastBuildInfo(false);
		}
	}, 30000);
}
function RJX_CHANGE_BRANCH(){
	var ask = prompt('Please insert new branch name below:\n(Previous: ' + RJX_BRANCH + ')', RJX_BRANCH);
	if (ask !== null){
		if (ask === ''){
			RJX_BRANCH = 'master';
			RJX_addLog('INFO - Invalid Branch! Setting GitHub branch "master"');
		} else {
			RJX_BRANCH = ask;
		}
		localStorage.setItem('RJX_BRANCH', RJX_BRANCH);
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		RJX_addLog('INFO - New GitHub branch: ' + RJX_BRANCH);
	}
}
function RJX_CHANGE_DOT(){
	var ask = prompt('Please insert new DotNet (' + RJX_CURRENT_DOTVER + ') exec path below:');
	if (ask !== null && ask !== ''){
		if (APP_FS.existsSync(ask) !== false){
			RJX_DOTPATH = ask;
			localStorage.setItem('RJX_DOTPATH', RJX_DOTPATH);
			document.getElementById('LBL_DOTNET_PATH').innerHTML = RJX_DOTPATH;
			RJX_addLog('INFO - New DotNet path: ' + RJX_DOTPATH);
		} else {
			RJX_addLog('INFO - Unable to find executable!');
		}
	}
}
function RJX_CHANGE_EMUPATH(){
	var ask = prompt('Please insert new Ryujinx exe path below:');
	if (ask !== null && ask !== ''){
		if (APP_FS.existsSync(ask) !== false){
			RJX_EMUPATH = ask;
			localStorage.setItem('RJX_PATH', RJX_EMUPATH);
			document.getElementById('LBL_RYU_PATH').innerHTML = RJX_EMUPATH;
			RJX_addLog('INFO - New Ryujinx path: ' + RJX_EMUPATH);
		} else {
			RJX_addLog('INFO - Unable to find ryujinx executable!');
		}
	}
}
function RJX_UPDATE(){
	if (RJX_BUILD_METHOD === 0){
		RJX_updateFromAppVeyor();
	}
	if (RJX_BUILD_METHOD === 1){
		RJX_updateFromCompiler();
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
function RJX_runExternalSoftware(exe, args, showLog){
	try{
		var tmpArgs = args;
		EXTERNAL_APP_EXITCODE = 0;
		EXTERNAL_APP_RUNNING = true;
		const { spawn } = require('child_process');
		if (args === undefined || args === null || args === ''){
			tmpArgs = 'No args was set';
			args = [''];
		}
		const ls = spawn(exe, args);
		EXTERNAL_APP_PID = ls.pid;
		if (showLog === true){
			RJX_addLog('Running external command \\ software: ' + exe);
			RJX_addLog('Args: ' + tmpArgs);
		}
		ls.stdout.on('data', (data) => {
			console.info('External App: ' + data);
			RJX_addLog('External App: ' + data.replace('\n', '<br>'));
		});
		ls.stderr.on('data', (data) => {
			console.info('External App: ' + data);
			RJX_addLog('External App: ' + data.replace('\n', '<br>'));
		});
		ls.on('close', (code) => {
			EXTERNAL_APP_PID = 0;
			EXTERNAL_APP_RUNNING = false;
			EXTERNAL_APP_EXITCODE = code;
			if (exe !== 'cmd'){
				RJX_addLog('External App - The application was finished with exit code ' + code + '.');
				console.info('External App - The application was finished with exit code ' + code + '.');
				return code;
			}
		});
	} catch (err){
		RJX_addLog('ERROR - Something went wrong while running ' + getFileName(exe) + '!');
		RJX_addLog('Details: ' + err);
	}
}
/*
	Save Files
*/
function RJX_SAVE_CONFS(){
	RJX_DECOMP_SHARE = JSON.parse(document.getElementById('CHECK_DECOMP_SHARE').checked);
	/*
		End
	*/
	localStorage.setItem('RJX_BCK_FILE', '');
	localStorage.setItem('RJX_BRANCH', 'master');
	localStorage.setItem('RJX_PATH', RJX_EMUPATH);
	localStorage.setItem('RJX_DOTPATH', RJX_DOTPATH);
	localStorage.setItem('RJX_BUILD_METHOD', RJX_BUILD_METHOD);
	localStorage.setItem('RJX_DECOMP_SHARE', RJX_DECOMP_SHARE);
	localStorage.setItem('RJX_SETUP', true);
}
/*
	Download Files
*/
function RJX_downloadFile(url, nomedoarquivo){
	DOWNLOAD_PG = 0;
	DOWNLOAD_COMPLETE = false;
	RJX_addLog('DOWNLOAD - Starting download: <font class="user-can-select">' + url + '</font>');
	console.info('DOWNLOAD - Download path: ' + nomedoarquivo);
	const http = require('https');
	const file = APP_FS.createWriteStream(nomedoarquivo);
	const request = http.get(url, function(response){
		response.pipe(file);
		DOWNLOAD_RUNNING = true;
		DOWNLOAD_REQUEST = request;
		DOWNLOAD_RESPONSE = response;
		RJX_GOODLINK = response.headers.location;
		DOWNLOAD_STATUSCODE = response.statusCode;
		DOWNLOAD_LENGTH = parseInt(response.headers["content-length"]);
		response.on('data', (chunk) => {
			DOWNLOAD_REQUEST = request;
			DOWNLOAD_RESPONSE = response;
        	DOWNLOAD_PG = DOWNLOAD_PG + parseInt(chunk.length);
   		})
		file.on('finish', function(){
	  		DOWNLOAD_STATUSCODE = response.statusCode;
     		if (DOWNLOAD_STATUSCODE === 200){
	  			DOWNLOAD_LENGTH = undefined;
	  			DOWNLOAD_COMPLETE = true;
     			RJX_addLog('DOWNLOAD - (<font class="user-can-select">' + url + '</font>) Download complete!');
     		} else {
     			DOWNLOAD_COMPLETE = false;
     		}
    	});
	});
}
function RJX_deleteFolderRecursive(path){
	RJX_runExternalSoftware('cmd', ['/C', 'rd', '/s', '/q', path]);
};