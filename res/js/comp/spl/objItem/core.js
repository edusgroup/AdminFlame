var imgGalleryMvc = (function () {
    var options = {};
    var tree = {};

    // Клик по кноке Сохранить
    function saveBtnClick() {
        var $idSizeListForm = $('#idSizeListForm');
        var data = {};
        $.extend( data, imgGalleryManager.changeList);
        data['prevSize'] = $idSizeListForm.find('select[name="imgPrevSize"]').val();
        data['origSize'] = $idSizeListForm.find('select[name="imgOrigSize"]').val();

        // Бегаем по настройкам checkbox, и сохраняем только выставленные
        $idSizeListForm.find('input:checked').each(function(index, obj){
            data[obj.name] = obj.value;
        });

        // бегаем по файлам
        $('#'+options.folderBox + ' input.caption').each(function(index, obj){
            data[obj.name] = obj.value;
        });

        HAjax.saveData({
            data: data,
            query: 'objItemId='+imgGalleryData.objItemId,
            methodType:'POST'
        });
        return false;
        // func. saveBtnClick
    }

    // callback сохранения данных
    function saveDataSuccess(pData) {
        if (pData['error']) {
            alert(pData['error']['msg']);
            return;
        }
        imgGalleryManager.saveDataSuccess(pData);
        alert('Данные успешно сохранены');
        // func. saveDataSuccess
    }

    function init(pOptions) {
        options = pOptions;
        // Кнопка Назад
        /*$('#'+options.backBtn).attr('href', utils.url({
         type:'manager',
         contr:'complist'
         }));*/
        $('#'+options.backBtn).attr('href', utils.url({}));
        // Кнопка Сохранить
        $('#'+options.saveBtn).click(saveBtnClick);
        HAjax.create({
            saveData:saveDataSuccess
        });
        // func. init
    }

    return {
        init: init
    }
    // func. imgGalleryMvc
})();

$(document).ready(function () {
    var contrName = imgGalleryData.contid;
    var callType = 'comp';
    utils.setType(callType);
    utils.setContr(contrName);
    HAjax.setContr(contrName);

    imgGalleryMvc.init({
        backBtn:'backBtn',
        saveBtn:'saveBtn',
        folderBox: 'folder'
    });

    file.userQuery = '&objItemId='+imgGalleryData.objItemId;
}); // $(document).ready