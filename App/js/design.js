/*
	RJX_Toolset
	design.js
*/
var DESIGN_LASTMENU = 0;
var DESIGN_MENU_HISTORY = [];
var DESIGN_PROG_BAR_INTERVAL;
/*
	Includes
*/
var INCLUDE_HTML_0 = '<div class="PB_MINI" id="PROGRESSBAR_0"></div>';
/*
	Log
*/
function RJX_scrollLog(){
	document.getElementById('APP_LOG').scrollTop = document.getElementById('APP_LOG').scrollHeight;
}
function RJX_addLog(text){
	if (text !== undefined && text !== ''){
		var HTML_LOG = '<div class="LOG_ITEM">' + text + '</div>';
		$('#APP_LOG').append(HTML_LOG);
		APP_LOG = APP_LOG + '\n' + text;
		RJX_scrollLog();
	}
}
function RJX_logSeparator(){
	var HTML_LOG = '<div class="LOG_SEPARATOR"></div>';
	$('#APP_LOG').append(HTML_LOG);
	RJX_scrollLog();
}
/*
	General
*/
function RJX_MENU(menu){
	if (menu !== DESIGN_LASTMENU){
		// console.info('Call menu: ' + menu);
		// About thing
		if (menu === 0){
			if (APP_CONGRATZ === 0){
				RJX_logSeparator();
				RJX_addLog('Hooray - You are a blessed person!');
			}
			APP_CONGRATZ++;
			$('#LOGO_FUNDO').fadeOut({duration: 200, queue: false});
			document.getElementById('BTN_CLOSE_ABOUT').onclick = function(){
				RJX_MENU(DESIGN_MENU_HISTORY[(DESIGN_MENU_HISTORY.length - 2)]);
			}
		} else {
			$('#LOGO_FUNDO').fadeIn({duration: 200, queue: false});
		}
		if (menu !== 2){
			RJX_UPDATING = true;
		} else {
			RJX_UPDATING = false;
		}
		$('#DIV_ID_' + DESIGN_LASTMENU).slideUp({duration: 300, queue: false});
		DESIGN_LASTMENU = menu;
		DESIGN_MENU_HISTORY.push(menu);
		$('#DIV_ID_' + DESIGN_LASTMENU).slideDown({duration: 300, queue: false});
		$('#DIV_INFOS').fadeIn({duration: 310, queue: false});
	}
}
function RJX_UPDATE_PROGRESSBAR(percentage, mode){
	if (mode === 0){
		$('#PB_PERCENTAGE').addClass('PERCENTAGE');
		$('#Tab_PROGRESSBAR').css({'width': '102px'});
		$('#PB_PERCENTAGE').removeClass('PERCENTAGE_OK');
		document.getElementById('PB_PERCENTAGE').innerHTML = percentage;
		$('#PB_PERCENTAGE').css({'width': 'calc(' + percentage + ' - 14px)'});
		document.getElementById('LBL_PROGRESSBAR_PERCENTAGE').innerHTML = percentage;
	} else {
		$('#PB_PERCENTAGE').addClass('PERCENTAGE_OK');
		$('#PB_PERCENTAGE').removeClass('PERCENTAGE');
		$('#Tab_PROGRESSBAR').css({'width': '111px'});
		$('#PB_PERCENTAGE').css({'width': 'calc(100% - 14px)'});
		document.getElementById('PB_PERCENTAGE').innerHTML = 'Process Complete!';
		document.getElementById('LBL_PROGRESSBAR_PERCENTAGE').innerHTML = '100%';
	}
}
function RJX_DESIGN_UPDATEBUILDINFO(showLog){
	document.title = RJX_logonText;
	var winStats = BUILD_JSON.build.jobs[0].status;
	if (winStats === 'running'){
		$('#LBL_BUILD_STATUS').addClass('LBL_RUNNING');
		$('#LBL_BUILD_STATUS').removeClass('LBL_FAIL');
		$('#LBL_BUILD_STATUS').removeClass('LBL_SUCCESS');
	}
	if (winStats === 'success'){
		$('#LBL_BUILD_STATUS').addClass('LBL_SUCCESS');
		$('#LBL_BUILD_STATUS').removeClass('LBL_FAIL');
		$('#LBL_BUILD_STATUS').removeClass('LBL_RUNNING');
		$('#BTN_BIG_UPDATE').css({'display': 'inline'});
	} else {
		$('#BTN_BIG_UPDATE').css({'display': 'none'});
	}
	if (RJX_LAST_UPDATE !== 'N/A' && BUILD_JSON.build.version !== RJX_LAST_UPDATE && RJX_NOTIFIED === false){
		if (RJX_SHOW_NOTIFY === true){
			RJX_showNotify('RJX_Toolset', 'There is a new update!\nNew Build: ' + BUILD_JSON.build.version + '\n' + BUILD_JSON.build.message, 10000);
			RJX_NOTIFIED = true;
			RJX_SAVE_CONFS();
		}
	}
	if (showLog === true){
		RJX_addLog('INFO - Current build: ' + BUILD_JSON.build.version);
	}
	if (RYU_TRUSTED_DEVS.indexOf(BUILD_JSON.build.authorName) !== -1){
		document.getElementById('LBL_BUILD_AUT').innerHTML = BUILD_JSON.build.authorName + ' (Ryujinx Official Developer)';
	} else {
		document.getElementById('LBL_BUILD_AUT').innerHTML = BUILD_JSON.build.authorName;
	}
	winStats = winStats.slice(0, 1).toUpperCase() + winStats.slice(1, winStats.length);
	document.getElementById('LBL_BUILD_NUMBER').innerHTML = BUILD_JSON.build.buildNumber;
	document.getElementById('LBL_BUILD_OS').innerHTML = BUILD_JSON.build.jobs[0].osType;
	document.getElementById('LBL_BUILD_COMPNUM').innerHTML = BUILD_JSON.build.version;
	document.getElementById('LBL_BUILD_DESC').innerHTML = BUILD_JSON.build.message;
	document.getElementById('LBL_BUILD_ID').innerHTML = BUILD_JSON.build.buildId;
	document.getElementById('LBL_BUILD_LOCVER').innerHTML = RJX_LAST_UPDATE;
	document.getElementById('LBL_BUILD_STATUS').innerHTML = winStats;
	document.getElementById('LBL_BUILD_BRX').innerHTML = RJX_BRANCH;
	$('#DIV_TOP_MENU').fadeIn({duration: 500, queue: false});
	$('#LOGO_FUNDO').css({'filter': 'blur(4px)'});
	RJX_MENU(2);
}
/*
	Wait
*/
function RJX_CALL_WAIT(firstMessage){
	RJX_MENU(3);
	$('#DIV_INFOS').css({'top': '32px'});
	$('#LOGO_FUNDO').css({'top': '-2px'});
	$('#DIV_TOP_MENU').css({'display': 'none'});
	document.getElementById('LBL_WAIT_STATUS').innerHTML = firstMessage;
}
function RJX_UPDATE_WAIT(message){
	document.getElementById('LBL_WAIT_STATUS').innerHTML = message;
}
function RJX_CLOSE_WAIT(){
	$('#DIV_INFOS').css({'top': '52px'});
	$('#LOGO_FUNDO').css({'top': '6px'});
	$('#DIV_TOP_MENU').css({'display': 'block'});
}
function RJX_SET_COMP_METHOD(){
	RJX_BUILD_METHOD = document.getElementById('SET_UPDATE_METHOD').value;
	localStorage.setItem('RJX_BUILD_METHOD', RJX_BUILD_METHOD);
}
function DESIGN_CHECKBOX(eName){
	var chk = JSON.parse(document.getElementById(eName).checked);
	if (chk === false){
		document.getElementById(eName).checked = true;
	} else {
		document.getElementById(eName).checked = false;
	}
	RJX_SAVE_CONFS();
}
/*
	Calc Percentage
*/
function DESIGN_calcPercentage(current, maximum){
	if (current !== undefined && maximum !== undefined && current !== '' && maximum !== ''){
		if (parseInt(current) === 0 && parseInt(maximum) === 0){
			return 0;
		} else {
			return (parseInt(current) / parseInt(maximum)) * 100;
		}
	} else {
		return 0;
	}
}
function RJX_UPDATE_DOWNLOAD_PROGRESSBAR(eName, eLabel, offset){
	clearInterval(DESIGN_PROG_BAR_INTERVAL);
	DESIGN_PROG_BAR_INTERVAL = setInterval(function(){
		if (DOWNLOAD_COMPLETE !== true){
			var perc = DESIGN_calcPercentage(DOWNLOAD_PG, DOWNLOAD_LENGTH);
			$('#' + eName).css({'width': 'calc(' + perc + '% - ' + offset + 'px)'});
			if (eName !== undefined){
				var parse = parseInt(perc);
				if (parse !== NaN && parse !== 'NaN'){
					document.getElementById(eLabel).innerHTML = parse + '%';
				}
			}
		} else {
			clearInterval(DESIGN_PROG_BAR_INTERVAL);
		}
	}, 50);
}