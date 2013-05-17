$(document).ready(function(){
    dhtmlXGridObject.prototype.setColsName = function(pColsName){
        this.colsName = pColsName;
    }


    /*dhtmlXGridObject.prototype.loadJSONEx = function(pName, pOption, pFunc){
        var query = 'name='+pName;
        for(var key in pOption ){
            query += '&v['+key+']='+pOption[key];
        }
        var url = utils.url({type: 'plugin', contr:'dhtmlx', method: 'loadGrid', query: query});
        if ( !pFunc ){
            this.load(url, null, 'xml');
        }else{
            $.ajax({
                dataType: 'xml',
                url: url,
                success: pFunc
            });
        }
    }*/
    
    /*dhtmlXGridObject.prototype.saveJSONEx = function(pName, pInsertField, pFunc){
        var json = this.serializeToJSON();
        if ( json.total_count == 0 ){
            return;
        }
        var data = $.toJSON(json.rows);
        var url = utils.url({type: 'plugin', contr: 'dhtmlx', method: 'saveGrid', query: {name: pName}});
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: 'data='+data+'&'+pInsertField,
            url: url,
            success: pFunc
        });
    }*/
    
    
    /*dhtmlXGridObject.prototype.removeJSONEx = function(pName, pRowsId, pFunc){
        var url = utils.url({type: 'plugin', contr: 'dhtmlx', method: 'rmGrid', query: {name: pName}});
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: 'row='+pRowsId,
            url: url,
            success: pFunc
        });
    }*/
});