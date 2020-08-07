/*
	RJX_Toolset
	updateAppVeyor.js
*/
var BUILD_JSON;
var RJX_UPFILE;
var RJX_FETCH_TICK;
var RJX_GOODLINK = '';
var RJX_APPV_DOWN_URL = '';
var RYU_TRUSTED_DEVS = [
	'Ac_K', 'gdkchan'
];
/*
	Functions
*/
function RJX_getLastBuildInfo(showLog){
	try{
		if (showLog === true){
			RJX_UPDATE_PROGRESSBAR('50%', 0);
			document.title = RJX_logonText + ' - Please Wait...';
			RJX_addLog('INFO - Getting latest build info, please wait...');
		} else {
			document.title = RJX_logonText + ' - Updating build infos...';
		}
		fetch(RJX_APPV_XML).then(resp => resp.json()).then(dat => BUILD_JSON = dat);
		RJX_FETCH_TICK = setInterval(function(){
			if (BUILD_JSON !== undefined){
				if (showLog === true){
					RJX_addLog('INFO - Getting latest build info: done!');
				}
				RJX_UPDATE_PROGRESSBAR('Process Complete!', 1);
				RJX_DESIGN_UPDATEBUILDINFO(showLog);
				clearInterval(RJX_FETCH_TICK);
			}
		}, 500);
	} catch (err){
		RJX_addLog('ERROR - Unable to get latest build info!');
		RJX_addLog('Reason: ' + err);
	}
}
/*
	Update From AppVeyor
	END - RJX_doneUpdate();
*/
function RJX_updateFromAppVeyor(){
	RJX_logSeparator();
	var APPV_CANUPDATE = true;
	var APPV_CANT_REASON = '';
	// Checks
	if (BUILD_JSON.build.jobs[0].status !== 'success'){
		APPV_CANUPDATE = false;
		APPV_CANT_REASON = APPV_CANT_REASON + 'The current build failed to compile on AppVeyor!';
	}
	if (RJX_EMUPATH === 'N/A' || RJX_EMUPATH === ''){
		APPV_CANUPDATE = false;
		APPV_CANT_REASON = APPV_CANT_REASON + 'You need to set Ryujinx path on Settings!';
	}
	if (navigator.onLine === false){
		APPV_CANUPDATE = false;
		APPV_CANT_REASON = APPV_CANT_REASON + 'You are offline!';
	}
	// End
	if (APPV_CANUPDATE === true){
		RJX_APPV_getFirstDown();
	} else {
		RJX_addLog('ERROR - Unable to download update!');
		RJX_addLog('Reason: ' + APPV_CANT_REASON);
	}
}
function RJX_APPV_getFirstDown(){
	RJX_UPDATING = true;
	document.title = RJX_logonText + ' - Updating...';
	RJX_UPDATE_PROGRESSBAR('20%', 0);
	var jobVer = BUILD_JSON.build.version;
	RJX_CALL_WAIT('Getting download link');
	var jobId = BUILD_JSON.build.jobs[0].jobId;
	RJX_addLog('INFO - Generating download link...');
	RJX_UPDATE_WAIT('Getting the first link to download the latest version');
	RJX_APPV_DOWN_URL = 'https://ci.appveyor.com/api/buildjobs/' + jobId + '/artifacts/ryujinx-' + jobVer + '-win_x64.zip';
	RJX_downloadFile(RJX_APPV_DOWN_URL, APP_PATH + '\\Update\\' + RJX_UPFILE, false);
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (DOWNLOAD_STATUSCODE === 302){
			// By some reason, it fails with Ryujinx download link :v
			RJX_APPV_downloadAppVeyor();
		} else {
			console.log('APPV - Waiting getting link...');
		}
	}, 100);
}
function RJX_APPV_downloadAppVeyor(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('40%', 0);
	RJX_UPDATE_WAIT('Downloading latest version (' + BUILD_JSON.build.version + ')<br><font id="LBL_DOWN_PERCENT" class="LBL_UP_DOWN">0%</font><br><br>INFO: This process depends of your <i>internet connection speed</i>.<br><br>' + INCLUDE_HTML_0);
	$('#DIV_WAIT_MID').css({'margin-top': '100px'});
	setTimeout(function(){
		RJX_downloadFile(RJX_GOODLINK, APP_PATH + '\\Update\\' + RJX_UPFILE);
		RJX_UPDATE_DOWNLOAD_PROGRESSBAR('PROGRESSBAR_0', 'LBL_DOWN_PERCENT', 20, 40, 60);
		RJX_TEMP_INTERVAL = setInterval(function(){
			if (DOWNLOAD_COMPLETE === true){
				RJX_APPV_decompressEmu();
			} else {
				//console.log('APPV - Waiting downloading file...');
			}
		}, 100);
	}, 1000);
}
function RJX_APPV_decompressEmu(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('60%', 0);
	$('#DIV_WAIT_MID').css({'margin-top': '122px'});
	RJX_logSeparator();
	// Decompress Share Folder
	if (RJX_DECOMP_SHARE === true){
		RJX_addLog('Extracting emulator files (with share folder)');
		RJX_UPDATE_WAIT('Decompressing files<br>This <i>may</i> take a while...');
		RJX_runExternalSoftware(RJX_7Z_PATH, ['x', APP_PATH + '\\Update\\' + RJX_UPFILE, '-o' + APP_PATH + '\\Update']);
	} else {
		RJX_addLog('Extracting emulator files (without share folder)');
		RJX_UPDATE_WAIT('Decompressing files<br>This <i>probably</i> gonna be faster than usual...');
		RJX_runExternalSoftware(RJX_7Z_PATH, ['x', APP_PATH + '\\Update\\' + RJX_UPFILE, '-o' + APP_PATH + '\\Update', '-xr!publish\\share\\*']);
	}
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_APPV_moveEmu();
		} else {
			console.log('Waiting extract...');
		}
	}, 100);
}
function RJX_APPV_moveEmu(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('80%', 0);
	RJX_UPDATE_WAIT('Moving emulator files');
	RJX_addLog('Moving emulator files...');
	RJX_runExternalSoftware('cmd', ['/C', 'xcopy', APP_PATH + '\\Update\\publish\\', RJX_EMUPATH, '/E', '/H', '/C', '/I', '/Y']);
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_APPV_removeLeftOver();
		} else {
			console.log('Waiting moving new emu...');
		}
	}, 100);
}
function RJX_APPV_removeLeftOver(){
	clearInterval(RJX_TEMP_INTERVAL);
	RJX_UPDATE_PROGRESSBAR('90%', 0);
	RJX_addLog('Removing leftover files...');
	RJX_UPDATE_WAIT('Removing leftover files');
	APP_FS.unlinkSync(APP_PATH + '\\Update\\' + RJX_UPFILE);
	RJX_deleteFolderRecursive(APP_PATH + '\\Update\\publish');
	RJX_TEMP_INTERVAL = setInterval(function(){
		if (EXTERNAL_APP_RUNNING === false){
			RJX_LAST_UPDATE = BUILD_JSON.build.version;
			document.getElementById('LBL_BUILD_LOCVER').innerHTML = RJX_LAST_UPDATE;
			RJX_doneUpdate();
		} else {
			console.log('Waiting cleaning files...');
		}
	}, 100);
}