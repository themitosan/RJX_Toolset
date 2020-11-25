/*
	RJX_Toolset
	boot.js

	Variables
*/
var APP_LOG = '', APP_CONGRATZ = 0, APP_FS, APP_PATH, APP_VERSION = '1.3.0',
	MAIN_exludeFileFormats = [
		'.xci',
		'.nsp',
		'.keys',
		'.exe',
		'.zip'
	],
	RJX_LAST_UPDATE = 'N/A', RJX_DECOMP_SHARE = false, RJX_CURRENT_DOTVER = '3.1', RJX_logonText = 'RJX_Toolset - Ver. ' + APP_VERSION,
	RJX_7Z_PATH, RJX_APPV_XML, RJX_LATEST_BCK, EXTERNAL_APP_PID, RJX_TEMP_INTERVAL, EXTERNAL_APP_RUNNING, EXTERNAL_APP_EXITCODE, RJX_INTERNAL_INTERVAL,
	RJX_NOTIFIED = false, RJX_SHOW_NOTIFY = false, DOWNLOAD_PG = 0, DOWNLOAD_LENGTH, DOWNLOAD_RUNNING, DOWNLOAD_REQUEST, DOWNLOAD_RESPONSE, DOWNLOAD_COMPLETE, DOWNLOAD_STATUSCODE,
	RJX_NAND_PATH = '', RJX_EMUPATH = 'N/A', RJX_DOTPATH = 'N/A', RJX_BUILD_METHOD = 0, RJX_RUN_METHOD = 0, RJX_UPDATING = false, RJX_BRANCH = 'master';
/*
	Functions
*/
window.onload = function(){
	RJX_Toolset_STARTUP();
}
function RJX_getFileName(file){
	if (file !== '' && file !== undefined){
		var c = 0, removePath = file.toLowerCase().split(/(\\|\/)/g).pop();
		while (c < MAIN_exludeFileFormats.length){
			removePath = removePath.replace(MAIN_exludeFileFormats[c], '');
			c++;
		}
		return removePath;
	}
}
function RJX_Toolset_STARTUP(){
	try {
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
		if (APP_FS.existsSync(APP_PATH + '\\EmuAppData') !== true){
			APP_FS.mkdirSync(APP_PATH + '\\EmuAppData');
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
	} catch (err) {
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
		RJX_NOTIFIED = false;
		RJX_SAVE_CONFS();
		RJX_RELOAD();
	} else {
		RJX_EMUPATH = localStorage.getItem('RJX_PATH');
		RJX_BRANCH = localStorage.getItem('RJX_BRANCH');
		RJX_DOTPATH = localStorage.getItem('RJX_DOTPATH');
		RJX_LATEST_BCK = localStorage.getItem('RJX_BCK_FILE');
		RJX_LAST_UPDATE = localStorage.getItem('RJX_LAST_UPDATE');
		RJX_NOTIFIED = JSON.parse(localStorage.getItem('RJX_NOTIFIED'));
		RJX_RUN_METHOD = parseInt(localStorage.getItem('RJX_RUN_METHOD'));
		RJX_BUILD_METHOD = parseInt(localStorage.getItem('RJX_BUILD_METHOD'));
		RJX_SHOW_NOTIFY = JSON.parse(localStorage.getItem('RJX_SHOW_NOTIFY'));
		RJX_DECOMP_SHARE = JSON.parse(localStorage.getItem('RJX_DECOMP_SHARE'));
		// Fix NaN Values
		if (RJX_RUN_METHOD === NaN){
			RJX_RUN_METHOD = 0;
		}
		document.getElementById('LBL_APP_VER').innerHTML = APP_VERSION;
		document.getElementById('LBL_RYU_PATH').innerHTML = RJX_EMUPATH;
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		document.getElementById('SET_RUN_METHOD').value = RJX_RUN_METHOD;
		document.getElementById('LBL_DOTNET_PATH').innerHTML = RJX_DOTPATH;
		document.getElementById('SET_UPDATE_METHOD').value = RJX_BUILD_METHOD;
		document.getElementById('CHECK_NOTIFY_DESK').checked = RJX_SHOW_NOTIFY;
		document.getElementById('CHECK_DECOMP_SHARE').checked = RJX_DECOMP_SHARE;
		if (RJX_RUN_METHOD === 0){
			RJX_NAND_PATH = nw.App.dataPath.replace('Local\\RJX_Toolset\\User Data\\Default', 'Roaming\\Ryujinx\\');
		}
		if (RJX_RUN_METHOD === 1){
			RJX_NAND_PATH = APP_PATH + '\\EmuAppData';
		}
		if (APP_FS.existsSync(RJX_NAND_PATH) !== false){
			$('#BTN_EMU_BCK').css({'display': 'inline'});
			document.getElementById('LBL_NAND_EXISTS').innerHTML = 'Yes';
			document.getElementById('LBL_NAND_PATH').innerHTML = RJX_NAND_PATH;
		} else {
			$('#BTN_EMU_BCK').css({'display': 'none'});
			document.getElementById('LBL_NAND_EXISTS').innerHTML = 'No';
			RJX_addLog('WARN - There is no EMU settings on this machine - Open EMU first and then run this application!');
		}
		if (RJX_LATEST_BCK !== '' && RJX_LATEST_BCK !== null){
			if (APP_FS.existsSync(APP_PATH + '\\Backup\\' + RJX_LATEST_BCK) !== false){
				$('#BTN_EMU_RES').css({'display': 'inline'});
				document.getElementById('LBL_LAST_BCK').innerHTML = RJX_LATEST_BCK;
			} else {
				$('#BTN_EMU_RES').css({'display': 'none'});
				document.getElementById('LBL_LAST_BCK').innerHTML = 'Unable to find last backup! (' + RJX_LATEST_BCK + ')';
				RJX_addLog('WARN - Unable to find ' + RJX_LATEST_BCK);
				RJX_logSeparator();
			}
		} else {
			$('#BTN_EMU_RES').css({'display': 'none'});
		}
		if (APP_FS.existsSync(RJX_EMUPATH) !== false){
			$('#BTN_BIG_RUN').css({'display': 'inline'});
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
			RJX_addLog('INFO - Invalid Branch! Setting GitHub branch \"master\"');
		} else {
			RJX_BRANCH = ask;
		}
		localStorage.setItem('RJX_BRANCH', RJX_BRANCH);
		document.getElementById('LBL_GH_BRANCH').innerHTML = RJX_BRANCH;
		RJX_addLog('INFO - New GitHub branch: ' + RJX_BRANCH);
	}
}
function RJX_CHANGE_DOT(){
	RJX_FILE_LOAD('.exe', function(ask){
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
	});
}
function RJX_CHANGE_EMUPATH(){
	RJX_FILE_LOAD('.exe', function(ask){
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
	});
}
function RJX_UPDATE(){
	if (RJX_BUILD_METHOD === 0){
		RJX_updateFromAppVeyor();
	}
	if (RJX_BUILD_METHOD === 1){
		RJX_updateFromCompiler();
	}
}
/*
	Parse Section
*/
function RJX_parsePositive(num){
	if (parseInt(num) !== NaN && num !== undefined){
		return (num - num - num);
	} else {
		return 0;
	}
}
/*
	Other Things
*/
function RJX_WIP(){
	window.alert('WARN - THIS IS WIP!');
}
function RJX_currentTime(){
	var t = new Date, d = t.getDate(), h = t.getHours(), s = t.getSeconds(), y = t.getFullYear(), mi = t.getMinutes(), m = t.getMonth() + 1;
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
// Desk Notify
function RJX_showNotify(title, text, timeDisplay){
	if (title === ''){
		title = 'RJX_Toolset - Notification';
	}
	if (text === ''){
		text = 'Message';
	}
	if (timeDisplay === null || timeDisplay === undefined || timeDisplay === ''){
		timeDisplay = 4000;
	}
	try{	
		var iconPath = APP_PATH + '\\App\\img\\logo.png';
		var NOTIFY = new Notification(title, {
			icon: iconPath,
			body: text,
		});
		setTimeout(NOTIFY.close.bind(NOTIFY), timeDisplay);
	}
	catch (err) {
		RJX_addLog('(Notification) ERROR: ' + err);
		console.error('(Notification) ERROR - ' + err);
	}
}
// Run Software
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
			RJX_addLog('External Software - File: ' + exe);
			RJX_addLog('Args: ' + tmpArgs);
		}
		ls.stdout.on('data', (data) => {
			console.info(data.toString());
			RJX_addLog(data.replace('\n', '<br>'));
		});
		ls.stderr.on('data', (data) => {
			console.info(data.toString());
			RJX_addLog(data.replace('\n', '<br>'));
		});
		ls.on('close', (code) => {
			EXTERNAL_APP_PID = 0;
			EXTERNAL_APP_RUNNING = false;
			EXTERNAL_APP_EXITCODE = code;
			if (exe !== 'cmd'){
				if (showLog === true){
					RJX_addLog('External App - The application was finished with exit code ' + code + '.');
				}
				console.info('External App - The application was finished with exit code ' + code + '.');
				return code;
			}
		});
	} catch (err) {
		RJX_addLog('ERROR - Something went wrong while running ' + RJX_getFileName(exe) + '!');
		RJX_addLog('Details: ' + err);
	}
}
/*
	Load / Save Files
*/
function RJX_SAVE_CONFS(){
	RJX_SHOW_NOTIFY = JSON.parse(document.getElementById('CHECK_NOTIFY_DESK').checked);
	RJX_DECOMP_SHARE = JSON.parse(document.getElementById('CHECK_DECOMP_SHARE').checked);
	// End
	localStorage.setItem('RJX_BCK_FILE', '');
	localStorage.setItem('RJX_PATH', RJX_EMUPATH);
	localStorage.setItem('RJX_BRANCH', RJX_BRANCH);
	localStorage.setItem('RJX_DOTPATH', RJX_DOTPATH);
	localStorage.setItem('RJX_NOTIFIED', RJX_NOTIFIED);
	localStorage.setItem('RJX_RUN_METHOD', RJX_RUN_METHOD);
	localStorage.setItem('RJX_LAST_UPDATE', RJX_LAST_UPDATE);
	localStorage.setItem('RJX_SHOW_NOTIFY', RJX_SHOW_NOTIFY);
	localStorage.setItem('RJX_BUILD_METHOD', RJX_BUILD_METHOD);
	localStorage.setItem('RJX_DECOMP_SHARE', RJX_DECOMP_SHARE);
	localStorage.setItem('RJX_SETUP', true);
}
function RJX_FILE_LOAD(extension, functionEval){
	if (functionEval !== undefined){
		if (extension === ''){
			extension = '.*';
		}
		document.getElementById('RJX_FILE_LOAD_DOM').accept = extension;
		$('#RJX_FILE_LOAD_DOM').trigger('click');
		document.getElementById('RJX_FILE_LOAD_DOM').onchange = function(){
			var cFile = document.getElementById('RJX_FILE_LOAD_DOM').files[0];
			if (cFile.path !== null && cFile.path !== undefined && cFile.path !== ''){
				functionEval(cFile.path);
				document.getElementById('RJX_FILE_LOAD_DOM').value = '';
				document.getElementById('RJX_FILE_LOAD_DOM').accept = '';
			}
		}
	}
}
/*
	Download Files
*/
function RJX_downloadFile(url, fileName, showLog){
	DOWNLOAD_PG = 0;
	DOWNLOAD_COMPLETE = false;
	const http = require('https');
	const file = APP_FS.createWriteStream(fileName);
	if (showLog !== false){
		RJX_addLog('DOWN - Starting download: <font class="user-can-select">' + url + '</font>');
	}
	console.info('DOWN - Download path: ' + fileName);
	const request = http.get(url, function(response){
		response.pipe(file);
		DOWNLOAD_RUNNING = true;
		DOWNLOAD_REQUEST = request;
		DOWNLOAD_RESPONSE = response;
		RJX_GOODLINK = response.headers.location;
		DOWNLOAD_STATUSCODE = response.statusCode;
		DOWNLOAD_LENGTH = parseInt(response.headers['content-length']);
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
	  			if (showLog !== false){
	     			RJX_addLog('DOWN - (<font class="user-can-select">' + url + '</font>) Download complete!');
	     		}
     		} else {
     			DOWNLOAD_COMPLETE = false;
     		}
    	});
	});
}
function RJX_deleteFolderRecursive(path){
	RJX_runExternalSoftware('cmd', ['/C', 'rd', '/s', '/q', path]);
};
/*
	Run EMU
*/
function RJX_RUN_EMU(){
	if (RJX_RUN_METHOD === 0){
		RJX_runExternalSoftware(RJX_EMUPATH + '\\Ryujinx.exe', [], true);
	} else {
		RJX_runExternalSoftware(RJX_EMUPATH + '\\Ryujinx.exe', ['-r', APP_PATH + '\\EmuAppData'], true);
	}
}
