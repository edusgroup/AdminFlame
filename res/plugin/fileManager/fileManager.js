if ( !console ){
    console = {
        log:function(){}
    };
}
            
var fileManager = {
    button: {
        select: 'Выбрать',
        view: 'Просмотр',
        rename: 'Переименовать'
    },
    funcNameCallBack: null,
    $item: null,
    itemSelectList:{}
}; 
   
   /*
fileManager.initCkEditor = function(pUrlParam){
    CKEDITOR.config.filebrowserBrowseUrl = utils.url('fileManager/ckedit', 'type=file'+pUrlParam);
    CKEDITOR.config.filebrowserImageBrowseUrl = utils.url('fileManager/ckedit', 'type=img'+pUrlParam);
    CKEDITOR.config.filebrowserFlashBrowseUrl = '/?cmd=fileManager&a1=ckedit&type=flash'+pUrlParam;
    CKEDITOR.config.filebrowserUploadUrl = 'res/plugin/kcfinder/upload.php?type=files';
    CKEDITOR.config.filebrowserImageUploadUrl = 'res/plugin/kcfinder/upload.php?type=images';
    CKEDITOR.config.filebrowserFlashUploadUrl = 'res/plugin/kcfinder/upload.php?type=flash';
}*/
            
fileManager._convertButton = function(pName, pImgPath){
    var text = this.button[pName];
    return '<IMG'
    +' SRC="'+pImgPath+'button/'+pName+'.png"'
    +' TITLE="'+text+'" ALT="'+text+'"'
    +' CLASS="'+pName+'"'
    +'/>';
    return '';
};


            
fileManager.select = function(){
    var $item = $(this).parents('div.item:first');
    var title = $item.attr('name');
    var type = $item.attr('type');
    var fileUrl = $item.attr('file');
    if (type == 'img'){
        fileManager.selectItem = { 'name': title, 'file': fileUrl };
        
        var imgsize = $item.attr('imgsize');
        $('#imgSize').find('div.imgsize:first').html(imgsize);
        
        var filesize = $item.attr('filesize');
        $('#imgSize').find('div.filesize:first').html(filesize);
        
        $.fancybox( {href: '#imgSize', title: title} );
    }else{
        fileManager.returnInEditor(fileManager.funcNameCallBack, fileUrl);
    }
};

fileManager.checkClick = function(){
    var $item = $(this).parents('div.item:first');
    var id = $item.attr('id');
    id = 'f['+id+']';
    if ( this.checked ){
        var name = $item.attr('name');
        fileManager.itemSelectList[id] = name;
    }else{
        delete fileManager.itemSelectList[id];
    }
}
            
fileManager.returnInEditor = function(pFuncNum, pUrl){
    //window.top.opener['CKEDITOR'].tools.callFunction(pFuncNum, pUrl);
    window.top.opener.fileManagerCallBack(pFuncNum, pUrl);
    window.top.close();
    window.top.opener.focus();
}
            
fileManager.view = function(){
    var $item = $(this).parents('div.item:first');
    var fileUrl = $item.attr('file');
    var title = $item.attr('name');
    
    var type = $item.attr('type');
    
    if (type == 'img'){
        $.fancybox( {
            href: fileUrl,
            title: title,
            width: 200
            
        } );
    }else{
        //window.location.href = fileUrl;
        window.open(fileUrl);
    }
};

            
(function($) {
    var options;
    $.fn.folderProp = function(pOptions){
        var defaults = {
            imgPath: null
        };
        options = $.extend(defaults, pOptions);
                
    };
    
    $('.item input.check').live('click', fileManager.checkClick);
    
    $.fn.addFile = function(pConf){
        
        var itemName = pConf.name ? pConf.name : '';
        var itemId = pConf.id ? pConf.id : '';
        var itemUrlPreview = pConf.preview ? pConf.preview : '';

        var item = '<div class="item" id="'+itemId+'" imgsize="'+pConf.imgsize+'" filesize="'+pConf.filesize+'">'
        +'<div class="name"><label><input type="checkbox" class="check"/> '+itemName+'</label></div>'
        +'<div class="preloader"><div class="file">'
        +'<div class="action">';

        var buttonName;
        for (buttonName in pConf.button ){
            item += fileManager._convertButton(buttonName, options.imgPath);
        }
        var param = '' + pConf.filesize;
        item += '</div></div></div><div class="panel">'+param+'</div></div>';
        this.append(item);
             
        var $item = this.find('#'+itemId);
        for (buttonName in pConf.button ){
            var func = fileManager[buttonName];
            if ( typeof pConf.button[buttonName] == 'function' ){
                func = pConf.button[buttonName];
            }
            $item.find(' .'+buttonName+':first').click(func);
        }
        
        $item.find('.file:first').css("background-image", "url('"+itemUrlPreview+"')");  
        $item.attr('name', itemName);  
        $item.attr('type', pConf.type); 
                    
        if ( pConf.button['view']){
            //var $view = $item.find('.view:first');
            $item.attr('file', pConf.file);  
        }
                
        $item.find('.check').change(function(){
            $item = $(this).parents('.item:first');
            if ( this.checked ){
                $item.css('border-color', '#4b65d4');
                $item.css('background-color', '#4b65d4');
            }else{
                $item.css('border-color', '#a3a3a3');
                $item.css('background-color', '#a3a3a3');
            }
        });
    };
})(jQuery);

