function changeComp(url, val){
    location.href=url+val;
}

function addErrorBox(id, text){
    $(id).prepend('<div><a href="#" title="Error box" class="box error corners" onclick="$(this).fadeOut(\'slow\'); return false;"><span class="close">&nbsp;</span>'+text+'</a></div>');
}

function addSuccesBox(id, text){
    $(id).prepend('<div><a href="#" title="Succes box" class="box succes corners" onclick="$(this).fadeOut(\'slow\'); return false;"><span class="close">&nbsp;</span>'+text+'</a></div>');
}

function validName(input_sel, success_sel, error_sel){
    $(input_sel).keyup(function(event) {
        var text = $(this).val();
        if ( text.length < 1 || text.search('[\'"<>]')!=-1 ){
            $(error_sel).show();
            $(success_sel).hide();
        }else{
            $(error_sel).hide();
            $(success_sel).show();
        }
    });
}

function fancyConfirm(msg, bt1_text, bt2_text, callback) {
    var ret;
    jQuery.fancybox({
        modal : true,
        content : "<div class='corners' style='margin:1px;width:220px;'>"+msg+
        "<div style='text-align:right;margin-top:10px;'>"+
        "<input id='fancyConfirm_ok' style='margin:3px;padding:0px;' type='button' class='btn_small' value='"+bt1_text+"'>"+
        "<input id='fancyConfirm_cancel' style='margin:3px;padding:0px;' type='button' class='btn_small' value='"+bt2_text+"'>"+
        "</div>"+
        "</div>",
        onComplete : function() {
            jQuery("#fancyConfirm_cancel").click(function() {
                ret = false;
                jQuery.fancybox.close();
            })
            jQuery("#fancyConfirm_ok").click(function() {
                ret = true;
                jQuery.fancybox.close();
            })
        },
        onClosed : function(){
            callback.call(this,ret);
        }
    });
}
       
var fancyForm={};

fancyForm.formText = {
    remove:'Вы уверены что хотите удалить?',
    yes : 'Да',
    no : 'Нет',
    create: 'Создать',
    rename: 'Переименовать'
};

fancyForm.ajaxURL = '';
fancyForm.treeID = -1;
fancyForm.action = {
    rename: -1,
    create: -1 
}


fancyForm.alert = function(msg) {
    $.fancybox({
        'modal' : true,
        'content' : "<div style=\"margin:1px;width:240px;\">"+msg+"<div style=\"text-align:right;margin-top:10px;\"><input style=\"margin:3px;padding:0px;\" type=\"button\" onclick=\"jQuery.fancybox.close();\" value=\"Ok\"></div></div>"
    });
}

fancyForm.confirm = function(msg, obj, func) {
    fancyConfirm(msg, this.formText.yes, this.formText.no, function(ret) {
        if ( ret )
            func(obj);
    });
    return false;
}



fancyForm.treeInputName = function(obj, text){
    $.fancybox({
        'titlePosition'	: 'inside',
        'transitionIn'	: 'none',
        'transitionOut'	: 'none',
        'scrolling'		: 'no',
        'obj' 			: obj, 
        'href'			: '#addFolderForm',
        'titleShow'		: false,
        'onClosed'		: function() {
            $("#addFrmError").hide();
        },
        'onStart' : function(){
            var href = $(obj).attr('href');
            var submit_name = fancyForm.formText.create;
            if ( href=='#rename' ){
                submit_name = fancyForm.formText.rename;
                fancyForm.ajaxURL = '?action=' + fancyForm.action.rename + '&renameid='+$(obj).attr('id')+'&treeid='+fancyForm.treeID;
                $("#folder_name").val(text);
            }else{
                fancyForm.ajaxURL = '?action=' + fancyForm.action.create + '&treeid='+fancyForm.treeID;
            }
            $('#submit').attr('value', submit_name );
        }
    });
    return false;
}

fancyForm.treeOnClick = function(obj){
    var url='ajax.php' + $(obj).attr('href');
    $.getJSON(url, treeAjaxResult);
    //$.preventDefault();
    return false;
};


$.ajaxSetup({
    "error":function(XMLHttpRequest,textStatus, errorThrown) {
        if ( errorThrown == undefined )
            var text = 'Ошибка №' + XMLHttpRequest.status + ': ' + XMLHttpRequest.statusText;
        else
            var text = 'Ошибка: ' + errorThrown;
        addErrorBox('#mainpanel', text );
    }
});

function setStatus(id, data){
    if ( data['succes'] ){
        addSuccesBox(id, data['succes'] );
    }
    if ( data['error'] ){
        addErrorBox(id, 'Ошибка №' + data['error'][0] + ': ' + data['error'][1] );
    }
}
 
 