/*
	RJX_Toolset
	buildEmu.js
*/
function RJX_updateFromCompiler(){
	RJX_BTNS(0, 'Checking previous infos - Please Wait...', 274, false);
	RJX_UPDATE_PROGRESSBAR('8%', 0);
	RJX_logSeparator();
	RJX_addLog('Update: Checking previous infos...');
	if (APP_FS.existsSync(APP_PATH + '\\Update') === true){
		RJX_deleteFolderRecursive(APP_PATH + '\\Update');
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (EXTERNAL_APP_RUNNING === true){
				RJX_downloadEmu();
			} else {
				console.log('Waiting previous...');
			}
		}, 100);
	} else {
		APP_FS.mkdirSync(APP_PATH + '\\Update');
		setTimeout(function(){
			RJX_downloadEmu();
		}, 1000);
	}
}
function RJX_downloadEmu(){
	if (APP_FS.existsSync(RJX_DOTPATH) !== false){
		RJX_UPDATE_PROGRESSBAR('10%', 0);
		RJX_addLog('Update - Downloading Raw code from GitHub');
		RJX_addLog('GitHub Branch: ' + RJX_BRANCH);
		RJX_addLog('URL: https://codeload.github.com/Ryujinx/Ryujinx/zip/' + RJX_BRANCH);
		RJX_UPDATE_WAIT('Downloading code from GitHub');
		process.chdir(APP_PATH + '\\Update');
		RJX_downloadFile('https://codeload.github.com/Ryujinx/Ryujinx/zip/' + RJX_BRANCH, 'RJX_CODE.zip');
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (DOWNLOAD_COMPLETE === true){
				RJX_extractEmuRawFiles();
			} else {
				console.log('Waiting Downloading file...');
			}
		}, 100);
	} else {
		RJX_addLog('WARN - Unable to find DotNet!');
		RJX_CHANGE_DOT();
	}
}
function RJX_extractEmuRawFiles(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('20%', 0);
	RJX_addLog('Update - Extracting code files');
	RJX_addLog('(This <i>may</i> take a while)');
	RJX_UPDATE_WAIT('Extracting code files...<br><i>(This may take a while)</i>');
	RJX_runExternalSoftware(RJX_7Z_PATH, ['x', 'RJX_CODE.zip', '-ocode', '-aoa']);
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_compileNewVersion();
		} else {
			console.log('Waiting extract...');
		}
	}, 100);
}
function RJX_compileNewVersion(){
	clearInterval(RJX_TEMP_INTERVAL);
	process.chdir(APP_PATH);
	RJX_UPDATE_PROGRESSBAR('50%', 0);
	RJX_UPDATE_WAIT('Extracting code files');
	RJX_addLog('Update - Extracting code files...');
	RJX_addLog('<br>(If this is the first time using dotnet sdk on your system, this <i>will</i> take a while...)<br>');
	RJX_runExternalSoftware(RJX_DOTPATH, ['publish', '"' + APP_PATH + '\\Update\\code\\Ryujinx-master"', '-c', 'Release', '-r', 'win10-x64']);
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_deleteOldEmu();
		} else {
			console.log('Waiting compiling...');
		}
	}, 100);
}
function RJX_deleteOldEmu(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('80%', 0);
	RJX_UPDATE_WAIT('Removing old version...');
	RJX_addLog('Update - Removing old version...');
	if (APP_FS.existsSync(RJX_EMUPATH) !== false){
		RJX_deleteFolderRecursive(RJX_EMUPATH);
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (EXTERNAL_APP_RUNNING === false){
				RJX_moveCompiledVersion();
			} else {
				console.log('Waiting deleting old emu...');
			}
		}, 100);
	} else {
		APP_FS.mkdirSync(RJX_EMUPATH);
		setTimeout(function(){
			RJX_moveCompiledVersion();
		}, 1000);
	}
}
function RJX_moveCompiledVersion(){
	clearInterval(RJX_TEMP_INTERVAL);
	APP_FS.mkdirSync(RJX_EMUPATH);
	RJX_UPDATE_PROGRESSBAR('90%', 0);
	RJX_addLog('Update - Moving compiled version...');
	RJX_UPDATE_WAIT('Moving compiled version');
	RJX_runExternalSoftware('cmd', ['/C', 'move', APP_PATH + '\\Update\\code\\Ryujinx-master\\Ryujinx\\bin\\Release\\netcoreapp3.1\\win10-x64\\publish\\*', RJX_EMUPATH]);
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_removeLeftOver();
		} else {
			console.log('Waiting moving new emu...');
		}
	}, 100);
}
function RJX_removeLeftOver(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('96%', 0);
	RJX_UPDATE_WAIT('Removing leftover files');
	RJX_addLog('Update - Removing leftover files...');
	RJX_deleteFolderRecursive(APP_PATH + '\\Update');
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_finishUpdate();
		} else {
			console.log('Waiting Removing leftover files...');
		}
	}, 100);
}
function RJX_finishUpdate(){
	clearInterval(RJX_TEMP_INTERVAL);
	process.chdir(APP_PATH);
	RJX_UPDATE_PROGRESSBAR('98%', 0);
	RJX_UPDATE_WAIT('Finishing update');
	RJX_addLog('Update - Finishing update...');
	APP_FS.mkdirSync(APP_PATH + '\\Update');
	setTimeout(function(){
		RJX_doneUpdate();
	}, 1100);
}
function RJX_doneUpdate(){
	if (APP_FS.existsSync(APP_PATH + '\\Update\\' + RJX_UPFILE) === true){
		APP_FS.unlinkSync(APP_PATH + '\\Update\\' + RJX_UPFILE);
	}
	document.title = RJX_logonText;
	clearInterval(RJX_TEMP_INTERVAL);
	process.chdir(APP_PATH);
	RJX_logSeparator();
	RJX_UPDATE_PROGRESSBAR('Process Complete!', 1);
	RJX_addLog('Update - Process Complete!');
	RJX_CLOSE_WAIT();
	RJX_MENU(2);
}