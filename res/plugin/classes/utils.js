/**
 * Класс для ajax вызовов
 * @example
 * HAjax.contrName = 'action/';
 * HAjax.create({
 *    loadActionData: action.loadActionData
 * });
 * 
 * HAjax.loadActionData({id:24,set:data}, 'POST', 'anotherController');
 */
var HAjax = {
    functListSuccess: [],
    contrName: '',
    typeName: '',
    setContr: function(pContr){
        this.contrName = pContr;
    }, 
    setType: function(pType){
        this.type = pType;
    },    
    create: function(functList){
        // Бегаем по имена функций
        for(var functName in functList ){
            // Добавляем в список callback функций, функцию которая будет вызвана
            // после ajax
            this.functListSuccess[functName] = functList[functName]
            this[functName] = function(pOptions){
                var methodName = arguments.callee.callName;
                var iniData = {
                        query: '',
                        methodType: 'GET', 
                        data: '', 
                        type: this.type, 
                        contr: this.contrName, 
                        dataType: 'json'};
                for( var key in iniData ){
                    iniData[key] = pOptions[key] ? pOptions[key] : iniData[key];
                }
                if ( iniData.query ){
                    iniData.query = utils.queryToString(iniData.query);
                }
                var url = utils.url({
                        type: iniData.type, 
                        contr: iniData.contr, 
                        method: methodName, 
                        query: iniData.query
                    });
                $.ajax({
                    type: iniData.methodType,
                    dataType: iniData.dataType,
                    url: url,
                    data: iniData.data,
                    success: this.functListSuccess[methodName]
                }); // $.ajax
            }; // this[functName]
            this[functName].callName = functName;
        } // for(functName)
    } // func. create
}

utils = new function(){
    this.type = '';
    this.contr = '';
    
    /** 
     * pParam = {<br/>
     *  <b>type</b> - $t<br/>
     *  <b>contr</b> - $c<br/>
     *  <b>method</b> - $m<br/>
     * }
     */
    this.url = function(pParam){
        var type = pParam.type ? pParam.type : this.type;
        var result = '?$t=' + type + '&$c=';
        result += pParam.contr ? pParam.contr : this.contr;
        result += pParam.method ? '&$m=' + pParam.method : '';
        //result += pParam.query ? '&' + pParam.query : '';
        /*if ( pParam.query ){
            if ( typeof(pParam.query)=='string' ){
                result += '&' + pParam.query; 
            }else{
                for( var key in pParam.query ){
                    result += '&' + key+'='+ pParam.query[key];
                }
            }
        }*/
        if ( pParam.query ){
            result += this.queryToString(pParam.query);
        }
        
        return result; 
    },
    
    this.queryToString = function(pQuery){
        var result = '';
        if ( pQuery ){
            if ( typeof(pQuery)=='string' ){
                result += '&' + pQuery; 
            }else{
                for( var key in pQuery ){
                    result += '&' + key+'='+ pQuery[key];
                }
            }
        }
        return result;
    },

    this.setType = function(pType){
        this.type = pType;
    },
    
    this.setContr = function(pContr){
        this.contr = pContr;
    }
    
    this.getTreeUrl = function(pTreeObj, pTreeId){
        var id = pTreeId;
        var arr = [];
        while(id!=0){
            var text = pTreeObj.getItemText(id);
            if ( text == 0 ){
                break;
            }
            arr.push(text);
            id = pTreeObj.getParentId(id);
        }
        return arr.length > 0 ? ( '/' + arr.reverse().join('/') ) : '';
    }

    this.getTreeUrlTpl = function(pTreeObj, pTreeId){
        var id = pTreeId;
        var arr = [];
        while(id != 0){
            if ( pTreeObj.getUserData(id, 'propType') == '1' ){
                var text = '%s';
            }else{
                var text = pTreeObj.getItemText(id);
            }
            if ( text == 0 ){
                break;
            }
            arr.push(text);
            id = pTreeObj.getParentId(id);
        }
        return arr.length > 0 ? ( '/' + arr.reverse().join('/')+'/' ) : '';
    }
    
    this.getTreeVar = function(pTreeObj, pTreeId){
        var id = pTreeId;
        while(id!=0){
            var text = pTreeObj.getItemText(id);
            if ( text == 0 ){
                break;
            }
            if ( text.substr(0,1) == '$'){
                return text;
            }
            
            id = pTreeObj.getParentId(id);
        }
        return '';
        // func. getTreeVar
    }
    
    this.go = function(pUrl){
        window.location.href = pUrl;
        // func. go
    }
// class HAjax
}

var $dialog = {
    list:{},
    open: function(pId){
        if ( !this.list[pId] ){
            this.list[pId] = $('#'+pId).dialog({
                height: 240,
                window: 150,
                modal: true,
                autoOpen: false
            });
        }
        this.list[pId].dialog('open');
    },
    close: function(pId){
        this.list[pId].dialog('close');
    }
}

if ( window.dhtmlXGridObject ){

    /*dhtmlXGridObject.prototype.clearChangedState=function(){
        var count = this.rowsCol.length;
        for (var i = 0; i < count; i++){
            var row = this.rowsCol[i];
            for (var j = 0; j < row.childNodes.length; j++){
                row.childNodes[j].wasChanged = false;
            }
        }
    };*/
            
    dhtmlXGridObject.prototype.serializeToJSON = function(){
        //TODO: Сделать UserData
        //TODO: Сделать Config
        this.editStop();
        var obj = {
            pos:0, 
            rows:[], 
            total_count:0
        };
        if(this.isTreeGrid()){
        // isTreeGrid
        }else {
            var rowCount = this.rowsBuffer.length;
            // Бегаем по строчкам
            for(var rowNum = 0; rowNum < rowCount; rowNum++){
                // Если такой элемент и есть ли у него имя
                if(this.rowsBuffer[rowNum]){
                    // start serializeRow
                    var row = {
                        id: this.render_row(rowNum).idd, 
                        data:{}
                    }
                    var change = false;
                    for(var colNum = 0; colNum < this._cCount; colNum++){
                        // Если у этой колонки имя
                        if ( !this.colsName[colNum] ){
                            continue;
                        }
                        var cellType = this.cellType[colNum];
                        if ( cellType != 'ed' && 
                            cellType != 'price' && 
                            cellType != 'stree' && 
                            cellType != 'co' &&
                            cellType != 'ch'){
                            continue;
                        }
                        var cell = this.cellByIndex(rowNum, colNum);
                        if ( cell.wasChanged() ){
                            row.data[this.colsName[colNum]] = cell.getValue();
                            change = true;
                        }
                    //row.data.push(cells);
                    }
                    if ( change ){
                        obj.rows.push(row);
                    }
                // stop serializeRow
                }
            }
            obj.total_count = obj.rows.length;
        }
        return obj
    }

} // if dhtmlXGridObject




var dhtmlxInit = new function(){
    this.tree = [];
    this.data = {};
    
    this.treeBoxClick = function(){
        // Убераем выделение, если кликнули в пустоте и выбераем родителя
        
        // Получаем имя дерева
        var treeName = $(this).attr('treeName');
        // Получаем объект дерева
        var tree = dhtmlxInit.tree[treeName];
        
        if ( !tree.isClickOnFolder ){
            tree._unselectItems();
        }
        tree.isClickOnFolder = false;
        if ( dhtmlxInit.data[treeName].clickPanel ){
            dhtmlxInit.data[treeName].clickPanel();
        }
        // func. treeBoxClick
    },
    
    this.rmItemSuccess = function(data){
        if ( data['error']){
            alert(data['error']['msg']);
            return;
        }
        var treeName = data['treeName'];
        var tree = dhtmlxInit.tree[treeName];
        tree.deleteItem(data['id']);
        alert('Данные успешно удалены');
        // func. rmItemSuccess
    },
    
    this.rmItem = function(){
        // Спрашиваем а реально ли они хотят удалить
        if (!confirm('Уверены что хотите удалить?')){
            return false;
        }
        var treeName = $(this).attr('treeName');
        // Настройки
        var settings = dhtmlxInit.data[treeName];
        var tree = dhtmlxInit.tree[treeName];
        var userUrl = '';
        // Если есть функция которая расширяет данные, вызываем её
        if ( settings.rmObj.userUrl ){
            userUrl = '&'+settings.rmObj.userUrl();
        }
        var treeId = tree.getSelectedItemId();
        $.ajax({
            type:'POST',
            dataType: 'json',
            url: utils.url(settings.rmObj.url),
            data: 'id='+treeId+'&treeName='+treeName+userUrl,
            success: dhtmlxInit.rmItemSuccess
        });
                    
        return false;
        // func. rmItem
    },
    
    // ====================== Результат добавления папки =======================
    this.dirAddSuccess = function(data){
        var treeName = data['treeName'];
        var tree = dhtmlxInit.tree[treeName];
        var settings = dhtmlxInit.data[treeName];
        if ( settings.autoLoad){
            // Если дети уже загруженны(в этом случае возвращается число)
            var hasChildren = tree.hasChildren(data['treeId']);
            if ( (typeof hasChildren == 'boolean') && (hasChildren)){
                // Иначе просто открываем, что ведёт к дозагрузке и показу
                // нового элемента
                tree.openItem(data['treeId']);
            }else{
                // Мы просто обновляем данные
                tree.refreshItem(data['treeId']);
            } // if(hasChildren)
        }else{ // if ( settings.autoLoad )
            tree.insertNewItem(
                data['treeId'],
                data['objId'],
                data['name'],
                0, "folderNew.gif",0,0,'SELECT');
            tree.setUserData(data['objId'], 'type', 0);
        } // if ( settings.autoLoad )
        // func. dirAddSuccess
    },
    // ========================== Добавление папки =============================
    this.dirAdd = function(){
        // Вводим название папки
        var name = prompt('Введите название', '');
        if (!name){
            return false;
        }
        var treeName = $(this).attr('treeName');
        dhtmlxInit.dirAddObj({
                name: name
            }, treeName);
        return false;
        // func. dirAdd
    },
    
    this.dirAddObj = function(pParam, pTreeName){
        // Имя дерева
        //var treeName = pTreeName ? pTreeName : $(this).attr('treeName');
        // Настройки дерева
        var settings = dhtmlxInit.data[pTreeName];
        var userUrl = '';
        if ( settings.dirAdd.userUrl ){
            userUrl = '&'+settings.dirAdd.userUrl();
        }
        var tree = dhtmlxInit.tree[pTreeName];
        var itemId = tree.getSelectedItemId();
        
        var data = utils.queryToString(pParam);
        
        $.ajax({
            type:'POST',
            dataType: 'json',
            url: utils.url(settings.dirAdd.url),
            data: data +'&treeid='+itemId+'&treeName='+pTreeName+userUrl,
            success: dhtmlxInit.dirAddSuccess
        });
        // func. dirAddObj
    },
    
    this.fileAddSuccess = function(data){
        if ( data['error']){
            alert(data['error']['msg']);
            return;
        }
        var treeName = data['treeName'];
        var tree = dhtmlxInit.tree[treeName];
        // Если включена функцию автолоада
        //var isAutoLoad = dhtmlxInit.data[treeName].autoLoad;
        if ( dhtmlxInit.data[treeName].autoLoad ){
            // Если дети уже загруженны(в этом случае возвращается число)
            var hasChildren = tree.hasChildren(data['treeId']);
            if ( (typeof hasChildren == 'boolean') && (hasChildren)){
                // Иначе просто открываем, что ведёт к дозагрузке и показу
                // нового элемента
                tree.openItem(data['treeId']);
            }else{ 
                // Мы просто обновляем данные
                tree.refreshItem(data['treeId']);
            } // if (hasChildre)
        // Если же автолоад отключён
        }else{ // if ( isAutoLoad )
            // Просто добавляем новый элемент
            tree.insertNewItem(data['treeId'], data['objId'],data['name'], 0, null,0,0,'SELECT'); 
            // Выставляем его как файл
            tree.setUserData(data['objId'], 'type', 1);
        } // END if ( isAutoLoad )
        // func. fileAddSuccess
    },
    
    this.fileAddObj = function(pParam, pTreeName){
        // Получаем ключ к дереву
        //var treeName = pTreeName ? pTreeName : $(this).attr('treeName');
        // Получаем дерево
        var tree = dhtmlxInit.tree[pTreeName];
        // Если это файл
        var treeIdSelect = tree.getSelectedItemId();
        // TODO: Убрать проверку на файл, сделать всё на стороне сервера
        if ( tree.getUserData(treeIdSelect, 'type') == 1 ){
            // Получаем ID его родителя
            treeIdSelect = tree.getParentId(treeIdSelect);
        }
        // Настройки
        var settings = dhtmlxInit.data[pTreeName];
        var userUrl = '';
        // Если есть функция которая расширяет данные, вызываем её
        if ( settings.fileAdd.userUrl ){
            userUrl = '&'+settings.fileAdd.userUrl();
        }
        
        var data = utils.queryToString(pParam);
        // Начинаем формировать запрос
        $.ajax({
            type:'POST',
            dataType: 'json',
            url: utils.url(settings.fileAdd.url),
            data: data+'&treeid='+treeIdSelect+'&treeName='+pTreeName+userUrl,
            success: this.fileAddSuccess
        });
        return false;
        // func. fileAddObj
    },
    
    this.fileAdd = function(){
        var name = prompt('Введите название', '');
        if ( name){
            var treeName = $(this).attr('treeName');
            dhtmlxInit.fileAddObj({
                name: name
            }, treeName);
        } // if(name)
        return false;
        // func. fileAdd
    },
    
    this.rename = function(){
        var treeName = $(this).attr('treeName');
        var tree = dhtmlxInit.tree[treeName];
        var treeId = tree.getSelectedItemId();
        var name = tree.getItemText(treeId);
        alert('Переделать');
        return false;
        var newName = prompt('Введите новое название', name);
        if ( newName ){
            // Настройки
            var settings = dhtmlxInit.data[treeName];
            var userUrl = '';
            if ( settings.renameObj.userUrl ){
                userUrl = '&'+settings.renameObj.userUrl();
            }
                        
            $.ajax({
                type:'POST',
                dataType: 'json',
                url: utils.url(dhtmlxInit.data[treeName].renameObj.url),
                data: 'name='+newName+'&id='+treeId+'&treeName='+treeName+userUrl,
                success: function(data){
                    var treeName = data['treeName'];
                    dhtmlxInit.tree[treeName].setItemText(data['objId'], data['name']);
                }
            });
        } // if (name)
        return false;
        // func. rename
    },

    this.init = function(pInitData){
        $.extend(this.data, pInitData);

        for( var treeName in pInitData ){
            var initData = pInitData[treeName];


            if ( !initData.tree.id ){
                //alert('ID дерева не задан');
                continue;
            }
            var tree = this.tree[treeName] = new dhtmlXTreeObject(initData.tree.id, "100%", "100%", 0);
            if ( initData.init ){
                initData.init(tree);
            }

            if ( initData.checkbox ){
                tree.enableCheckBoxes(1);
                tree.enableThreeStateCheckboxes(true);
                tree.uncheckAll = function(){
                    var rootsAr = this.getSubItems(0).split(",")
                    for(var i=0;i<rootsAr.length;i++){
                        this.setCheck(rootsAr[i], 0);
                        this.closeAllItems(rootsAr[i]);
                    }
                } // uncheckAll
                
                tree.setItemsCheckList = function(pList){
                    this.uncheckAll();
                    for(var i in pList){
                        this.setCheck(pList[i], 1);
                    }
                } // end setCheckList
            }
            tree.setSkin("dhx_skyblue");
            tree.setImagePath("res/plugin/dhtmlxTree/codebase/imgs/csh_vista/");

            if ( initData.enableDragAndDrop ){
                tree.enableDragAndDrop(true);
            }

            if ( initData.tree.json ){
                tree.loadJSONObject(initData.tree.json);
            }

            tree.num = treeName;
            tree.isClickOnFolder = false;
            //tree.treeId = 0;

            tree.setOnClickHandler(initData.click || function(pTreeId){
                this.treeId = pTreeId;
                this.isClickOnFolder = true;
                if ( dhtmlxInit.data[this.num].clickEnd ){
                    dhtmlxInit.data[this.num].clickEnd(pTreeId, this);
                }
            });

            
            /*if ( initData.autoLoad ){
                tree.setXMLAutoLoading(utils.url(initData.autoLoad.url));
                tree.setDataMode("json");
                if ( initData.autoLoad.userUrl ){
                    tree.setOnOpenHandler(function(){
                        var initData = dhtmlxInit.data[this.num];
                        var userUrl = initData.autoLoad.userUrl();
                        this.setXMLAutoLoading(utils.url(initData.autoLoad.url) + userUrl );
                        return true;
                    });
                }
            }*/

            if ( initData.dbClick ){
                tree.setOnDblClickHandler(initData.dbClick);
            }

            // ================ Переименование объекта =======================
            if ( initData.renameObj ){
                $(initData.renameObj.id).attr('treeName', treeName).click(this.rename);// function
            }//if ( initData.renameObj )

            // ========================= Добавление папки ==============================
            if ( initData.dirAdd ){
                //$(initData.dirAdd.id).attr('treeName', treeName).click(this.dirAdd);
                var btnId = initData.dirAdd.id;
                if ( $.fancybox && $(btnId).attr('href')){
                    var fancyboxConf = {};
                    if ( initData.dirAdd.beforeShow ){
                        fancyboxConf['beforeShow'] = initData.dirAdd.beforeShow;
                    }
                    fancyboxConf['itemType'] = $(btnId).attr('itemType');
                    $(btnId).fancybox(fancyboxConf);
                }else{
                    $(btnId).attr('treeName', treeName).click(this.dirAdd);
                }
            } // if(initData.dirAdd)
            
            // ================== Клик по панели с деревом =====================
            $('#'+initData.tree.id).attr('treeName', treeName).click(this.treeBoxClick);
            
            // ======================= Удаление объекта ================================
            if ( initData.rmObj ){
                $(initData.rmObj.id).attr('treeName', treeName).click(this.rmItem);
            } // if ( initData.rmObj )

            // ======================= Добавление файла ================================
            if (initData.fileAdd){
                var btnId = initData.fileAdd.id;
                if ( $.fancybox && $(btnId).attr('href')){
                    var fancyboxConf = {};
                    if ( initData.fileAdd.beforeShow ){
                        fancyboxConf['beforeShow'] = initData.fileAdd.beforeShow;
                    }
                    fancyboxConf['itemType'] = $(btnId).attr('itemType');
                    $(btnId).fancybox(fancyboxConf);
                }else{
                    $(btnId).attr('treeName', treeName).click(this.fileAdd);
                }
            } // if (initData.fileAdd) 

        } // for

    } // this.init = function 

/*this.jsonAutoLoadSuccess = function(){
        console.log('jsonAutoLoadSuccess');
        var tree = dhtmlxInit.tree[0];
        tree.isCallAutoLoad = false;
        tree.insertNewItem(1, 522,'ddd', 0, null,0,0,'CHILD');
        tree.isCallAutoLoad = true;
    //tree.callEvent("onOpenStart",[1,-1, true]);
    }*/
        
}



window.createAssoc = function(pObj, pProperties, pValue){
    if (pProperties.length===0){
        return false;
    }
    var buff = pObj;
    for (i=0; i < pProperties.length-1; i++){
        var key = pProperties[i];
        if ( buff[key] == undefined ){
            buff[key] = {};
        }
        buff = buff[key];
    }
    if ( typeof pValue == 'object' ){
        if ( buff[pProperties[i]] == undefined ){
            buff[pProperties[i]] = {};
        }
        buff = buff[pProperties[i]];
        for( key in pValue ){
            buff[key] = pValue[key];
        }
    }else{
        buff[pProperties[i]] = pValue;
    }
    
}

window.isset = function (pObj, pProperties){
    if (pProperties.length===0){
        return false;
    }
	if ( !pObj ){
		return false;
	}
    var buff = pObj[pProperties[0]];
    for (var i=0; i < pProperties.length; i++){
        if ( buff == undefined){
            return false;
        }
        buff = buff[pProperties[i+1]];
    }
    return true;
}

function array_unshift( array ) {  
    var argc = arguments.length, argv = arguments, i;  
      
    for (i = 1; i < argc; i  ) {  
        array.unshift(argv[i]);  
    }  
      
    return (array.length);  
}

function objToHtmlVar(pObj, pVarName){
    var result = '';
    for( var key in pObj ){
        result += pVarName + '[' + key + ']=' + pObj[key] + '&';
    }
    return result;
}