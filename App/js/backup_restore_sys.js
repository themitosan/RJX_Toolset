/*
	RJX_Toolset
	backup_restore_sys.js
*/
/*
	Functions
*/
function RJX_backupSys(){
	if (RJX_RUN_METHOD === 0){
		RJX_NAND_PATH = nw.App.dataPath.replace('Local\\RJX_Toolset\\User Data\\Default', 'Roaming\\Ryujinx\\');
	}
	if (RJX_RUN_METHOD === 1){
		RJX_NAND_PATH = APP_PATH + '\\EmuAppData';
	}
	if (APP_FS.existsSync(RJX_NAND_PATH) !== false && APP_FS.readdirSync(RJX_NAND_PATH).length !== 0){
		RJX_UPDATING = true;
		RJX_logSeparator();
		RJX_CALL_WAIT('Compressing EMU Settings<br><i>(This may take a while)</i>');
		document.getElementById('LBL_NAND_EXISTS').innerHTML = 'Yes';
		process.chdir(APP_PATH + '\\Backup');
		RJX_UPDATE_PROGRESSBAR('50%', 0);
		var nameFile = 'BACKUP_RJX_' + RJX_currentTime() + '.zip';
		RJX_LATEST_BCK = nameFile;
		RJX_addLog('Backup - Compressing files...');
		RJX_runExternalSoftware(RJX_7Z_PATH, ['a', nameFile, RJX_NAND_PATH]);
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (EXTERNAL_APP_RUNNING !== false){
				console.log('Process - Waiting 7z...');
			} else {
				if (EXTERNAL_APP_EXITCODE === 0){
					$('#BTN_EMU_RES').css({'display': 'inline'});
					localStorage.setItem('RJX_BCK_FILE', RJX_LATEST_BCK);
					document.getElementById('LBL_LAST_BCK').innerHTML = RJX_LATEST_BCK;
				}
				RJX_logSeparator();
				process.chdir(APP_PATH);
				RJX_UPDATE_PROGRESSBAR('100%', 1);
				RJX_addLog('Backup - Process Complete!');
				RJX_addLog('Backup - File Name: ' + RJX_LATEST_BCK);
				clearInterval(RJX_TEMP_INTERVAL);
				RJX_UPDATING = false;
				RJX_CLOSE_WAIT();
				RJX_MENU(1);
			}
		}, 100);
	} else {
		document.getElementById('LBL_NAND_EXISTS').innerHTML = 'No';
		RJX_addLog('WARN - There is no EMU settings on this machine - Open EMU first and then run this application!');
	}
}
function RJX_restoreSys(){
	var bckFile = APP_PATH + '\\Backup\\' + RJX_LATEST_BCK;
	if (APP_FS.existsSync(bckFile) !== false){
		RJX_UPDATING = true;
		RJX_UPDATE_PROGRESSBAR('50%', 0);
		RJX_CALL_WAIT('Restoring EMU Settings<br><i>(This may take a while)</i>');
		RJX_addLog('Restore - Decompressing Files...');
		process.chdir(APP_PATH + '\\Backup');
		if (RJX_RUN_METHOD === 0){
			RJX_runExternalSoftware(RJX_7Z_PATH, ['x', bckFile, '-o' + RJX_NAND_PATH.replace('Ryujinx\\', ''), '-aoa']);
		}
		if (RJX_RUN_METHOD === 1){
			RJX_runExternalSoftware(RJX_7Z_PATH, ['x', bckFile, '-o' + APP_PATH + '\\EmuAppData', '-aoa']);
		}
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (EXTERNAL_APP_RUNNING !== false){
				console.log('Process - Waiting 7z...');
			} else {
				process.chdir(APP_PATH);
				RJX_UPDATE_PROGRESSBAR('100%', 1);
				RJX_addLog('Restore - Process Complete!');
				clearInterval(RJX_TEMP_INTERVAL);
				RJX_UPDATING = false;
				RJX_CLOSE_WAIT();
				RJX_MENU(1);
			}
		}, 100);
	}
}
function RJX_setBackupFile(){
	RJX_FILE_LOAD('.zip', function(ask){
		if (ask !== null && ask !== ''){
			if (APP_FS.existsSync(ask) !== false){
				$('#BTN_EMU_RES').css({'display': 'inline'});
				document.getElementById('LBL_LAST_BCK').title = ask;
				RJX_LATEST_BCK = RJX_getFileName(ask).toUpperCase() + '.zip';
				localStorage.setItem('RJX_BCK_FILE', RJX_LATEST_BCK);
				document.getElementById('LBL_LAST_BCK').innerHTML = RJX_LATEST_BCK;
			}
		}
	});
}