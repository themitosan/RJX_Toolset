/*
	RJX_Toolset
	buildEmu.js
*/
function RJX_updateCheck(){
	RJX_BTNS(0, 'Checking previous infos - Please Wait...', 274, false);
	RJX_UPDATE_PROGRESSBAR('8%', 0, '80');
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
		RJX_BTNS(0, 'Downloading Source Code - Please Wait...', 270, false);
		RJX_UPDATE_PROGRESSBAR('10%', 0, '100');
		RJX_addLog('Update: Downloading Raw code from GitHub');
		RJX_addLog('GitHub Branch: ' + RJX_BRANCH);
		RJX_addLog('URL: https://codeload.github.com/Ryujinx/Ryujinx/zip/' + RJX_BRANCH);
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
		RJX_addLog('WARN - Unable to find dotnet!');
		RJX_CHANGE_DOT();
	}
}
function RJX_extractEmuRawFiles(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_BTNS(0, 'Extracting code files - Please Wait...', 286, false);
	RJX_UPDATE_PROGRESSBAR('20%', 0, '220');
	RJX_addLog('Update: Extracting code files...');
	RJX_addLog('(This may take a while)');
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
	RJX_UPDATE_PROGRESSBAR('50%', 0, '389');
	RJX_addLog('Update: Extracting code files...');
	RJX_addLog('<br>(If this is the first time using dotnet sdk on your system, this <i>will</i> take a while...)<br>');
	RJX_BTNS(0, 'Compiling new version - Please Wait...', 280, false);
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
	RJX_UPDATE_PROGRESSBAR('80%', 0, '500');
	RJX_addLog('Update: Removing old version...');
	RJX_BTNS(0, 'Removing old version - Please Wait...', 282, false);
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
	RJX_UPDATE_PROGRESSBAR('90%', 0, '600');
	RJX_addLog('Update: Moving compiled version...');
	RJX_BTNS(0, 'Moving new version - Please Wait...', 288, false);
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
	RJX_UPDATE_PROGRESSBAR('96%', 0, '740');
	RJX_addLog('Update: Moving compiled version...');
	RJX_BTNS(0, 'Removing unused files - Please Wait...', 280, false);
	RJX_deleteFolderRecursive(APP_PATH + '\\Update');
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_finishUpdate();
		} else {
			console.log('Waiting Removing leftover...');
		}
	}, 100);
}
function RJX_finishUpdate(){
	clearInterval(RJX_TEMP_INTERVAL);
	process.chdir(APP_PATH);
	RJX_UPDATE_PROGRESSBAR('98%', 0, '750');
	RJX_addLog('Update: Finishing update...');
	RJX_BTNS(0, 'Finishing update - Please Wait...', 280, false);
	APP_FS.mkdirSync(APP_PATH + '\\Update');
	setTimeout(function(){
		RJX_doneUpdate();
	}, 1100);
}
function RJX_doneUpdate(){
	process.chdir(APP_PATH);
	RJX_UPDATE_PROGRESSBAR('100%', 1, '778');
	RJX_addLog('Update: Process Complete!');
	RJX_BTNS(1);
}