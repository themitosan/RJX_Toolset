/*
	RJX_Toolset
	design.js
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
function RJX_ABOUT(mode){
	if (mode === 0){
		if (APP_CONGRATZ === 0){
			RJX_addLog('Hooray - You are a blessed person!');
		}
		RJX_BTNS(0, 'About RJX_Toolset', 340);
		$('#LOGO_ABOUT').fadeIn({duration: 200, queue: false});
		$('#LOGO_FUNDO').fadeOut({duration: 200, queue: false});
		$('#INNER_INFOS').slideUp({duration: 500, queue: false});
		$('#DIV_ABOUT').slideDown({duration: 500, queue: false});
	} else {
		RJX_BTNS(1);
		$('#LOGO_FUNDO').fadeIn({duration: 200, queue: false});
		$('#DIV_ABOUT').slideUp({duration: 500, queue: false});
		$('#LOGO_ABOUT').fadeOut({duration: 200, queue: false});
		$('#INNER_INFOS').slideDown({duration: 500, queue: false});
	}
	APP_CONGRATZ++;
}
function RJX_UPDATE_PROGRESSBAR(percentage, mode, px){
	if (mode === 0){
		$('#PB_PERCENTAGE').addClass('PERCENTAGE');
		$('#Tab_PROGRESSBAR').css({'width': '102px'});
		$('#PB_PERCENTAGE').removeClass('PERCENTAGE_OK');
		document.getElementById('PB_PERCENTAGE').innerHTML = percentage;
	} else {
		$('#PB_PERCENTAGE').addClass('PERCENTAGE_OK');
		$('#PB_PERCENTAGE').removeClass('PERCENTAGE');
		$('#Tab_PROGRESSBAR').css({'width': '111px'});
		document.getElementById('PB_PERCENTAGE').innerHTML = 'Process Complete!';
	}
	$('#PB_PERCENTAGE').animate({'width': px + 'px'}, {duration: 500, queue: false});
	document.getElementById('LBL_PROGRESSBAR_PERCENTAGE').innerHTML = percentage;
}
function RJX_BTNS(mode, message, px, useTitle){
	// 0: disable
	if (mode === 0){
		if (useTitle === true){
			document.title = 'RJX_Toolset - Ver. ' + APP_VERSION + ' - ' + message;
		} else {
			document.title = 'RJX_Toolset - Ver. ' + APP_VERSION;
		}
		$('#BTN_RJX_UPD').css({'display': 'none'});
		$('#BTN_RJX_CJX').css({'display': 'none'});
		$('#BTN_EMU_BCK').css({'display': 'none'});
		$('#BTN_EMU_RES').css({'display': 'none'});
		$('#BTN_RJX_DOT').css({'display': 'none'});
		$('#BTN_MISC_REL').css({'display': 'none'});
		$('#BTN_MISC_EXT').css({'display': 'none'});
		$('#BTN_MISC_ABT').css({'display': 'none'});
		$('#DIV_PLZ_WAIT').css({'left': px + 'px'});
		$('#DIV_PLZ_WAIT').fadeIn({duration: 500, queue: false});
		document.getElementById('DIV_PLZ_WAIT').innerHTML = message;
	} else {
		document.title = 'RJX_Toolset - Ver. ' + APP_VERSION;
		$('#BTN_RJX_UPD').css({'display': 'inline'});
		$('#BTN_RJX_CJX').css({'display': 'inline'});
		$('#BTN_EMU_BCK').css({'display': 'inline'});
		$('#BTN_EMU_RES').css({'display': 'inline'});
		$('#BTN_RJX_DOT').css({'display': 'inline'});
		$('#BTN_MISC_REL').css({'display': 'inline'});
		$('#BTN_MISC_EXT').css({'display': 'inline'});
		$('#BTN_MISC_ABT').css({'display': 'inline'});
		$('#DIV_PLZ_WAIT').css({'display': 'none'});
	}
}