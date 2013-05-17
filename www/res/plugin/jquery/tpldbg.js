var compData = {
    DELETE: 1,
    ADD: 2,
    // jQuery диалог
    dialog: null,
    // dxhtml дерево
    dhtmlxTree: null,
    // текущий ID view
    actionId: -1,
    // Текущий выбранный блок
    block: null,
    autoinc: 0,
    // Список блоков и их компонентов
    blockCompList: [],
    showComp: function(pData, pBlock){
        var table = $('#compList').find('tr').remove().end();
        for( var id in pData ){
            var name = pData[id].name;
            name = name ? name : '[' + this.dhtmlxTree.getItemText(pData[id].compid) + ']';
            // TODO: заменить тему на переменную
            table.append('<tr id="#cptr'+id+'" block="'+pBlock+'">'
                  +'<td>'+name+'</td>'
                  +'<td>'
                     +'<img src="res/theme/test1/images/del_16.png" class="compDel imgButton"/>'
                     +'<img src="res/theme/test1/images/edit_16.png" class="compRename imgButton"/>'
                  +'</td>'
                +'</tr>');
        }
        if ( !this.blockCompList[pBlock] )
            this.blockCompList[pBlock] = [];
    },
    del: function(pBlock, pId){
        delete this.blockCompList[pBlock][pId];
    },
    add: function(pBlock, pTreeId){
        //var name = this.dhtmlxTree.getItemText(pTreeId);
        var data = {'name':null, 'compid': pTreeId};
        this.autoinc++;
        this.blockCompList[pBlock]['n'+this.autoinc] = data;//name;
        this.showComp(this.blockCompList[pBlock], pBlock);
    }
    
};
$(document).ready(function(){
    // Основной диалог, при клики на блок, при добавлении
    compData.dialog = $( "#compDialog" ).dialog({
        height: 240,
        minWidth: 400,
        modal: true,
        autoOpen: false
    });
    
    // Все кнопки добавить в блоках
    $('.ct_tools').click(function(){
        var block = this.id.substr(3);
        // Очищаем список компонентов и добавляем выбранные
        compData.showComp(compData.blockCompList[block], block)
        // Запоминаем текущий блок
        compData.block = block;
        // Ставит нужный title
        compData.dialog.dialog('option', 'title', 'Блок: ' + this.title);
        compData.dialog.dialog('open'); 
    });

    // Кнопка удаления компонента с блока
    $('.compDel').live('click', function(){
        var tr = $(this).parents('tr:first');
        var id = tr.attr('id').substr(5);
        var block = tr.attr('block');
        tr.remove();
        compData.del(block, id);
        return false;
    });
    
    $('.compRename').live('click', function(){
        var tr = $(this).parents('tr:first');
        var id = tr.attr('id').substr(5);
        var block = tr.attr('block');
        var name = prompt('Введите новое название', compData.blockCompList[block][id].name);
        if ( name ){
            compData.blockCompList[block][id].name = name.trim();
            tr.children('td:first').html(name);
        }
    });
    
    $.ajax({
        url: utils.url('tplview/getData'),
        processData: false,
        dataType: 'json',
        data: 'rid='+compData.actionId,
        success: function(pJson){
            compData.dhtmlxTree.loadJSONObject(pJson['tree']);
            compData.blockCompList = pJson['data'];
        }
    });
    
    compData.dhtmlxTree = new dhtmlXTreeObject('compTree', "100%", "100%", 0);
    compData.dhtmlxTree.setSkin("dhx_skyblue");
    compData.dhtmlxTree.setImagePath("plugin/dhtmlxTree/codebase/imgs/csh_vista/");
    compData.dhtmlxTree.setOnDblClickHandler(function(pTreeId, obj){
        if ( obj.getUserData(pTreeId, 'type') == 1 ){
            compData.add(compData.block, pTreeId);
        }
    });
    
    var body_height = $(window).height() - $('#btPanel').height() - 20;
    $('#btPanel').css('top', body_height);
    $(window).resize(function(){
        var body_height = $(window).height() - $('#btPanel').height() - 20;
        $('#btPanel').css('top', body_height);
    });
    
    
    $('#btSave').click(function(){
        /*var data = []
        for( var block in compData.blockCompList ){
            var blocklist = compData.blockCompList[block];
            for( var id in blocklist ){
                
                data.push({
                        'block': block, 
                        'id': id, 
                        'name': blocklist[id]['name'],
                        'compid', });
            }
        }*/
        
        
        $.ajax({
        url: utils.url('tplview/saveData'),
        type: 'POST',
        processData: false,
        dataType: 'json',
        data: 'rid='+compData.actionId+'&data='+$.toJSON(compData.blockCompList),
        success: function(pJson){
            //compData.dhtmlxTree.loadJSONObject(pJson['tree']);
            //compData.blockCompList = pJson['data'];
            console.log(pJson);
        }
    });
    });
    
    
});