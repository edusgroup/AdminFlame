var fileUpload = {};

fileUpload.queueError = function(file, errorCode, message) {
    try {
        var imageName = "error.gif";
        var errorName = "";
        if (errorCode === SWFUpload.errorCode_QUEUE_LIMIT_EXCEEDED) {
            errorName = "You have attempted to queue too many files.";
        }

        if (errorName !== "") {
            alert(errorName);
            return;
        }

        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                imageName = "zerobyte.gif";
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                imageName = "toobig.gif";
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            default:
                alert(message);
                break;
        }

        addImage("images/" + imageName);

    } catch (ex) {
        this.debug(ex);
    }

}

// Событие перед загрузкой модуля SWF
fileUpload.swfUploadPreLoad = function() {
    }

// SWF модуль загрузился удачно 
fileUpload.swfUploadLoaded = function() {
    // Выставляем на кнопк отмену, отмену всех загрузок
    $("#"+this.customSettings.btnCancel).click(function(){
        // Отмена всех загрузок
        self.cancelQueue();
    });
}

// SWF модуль загрузился не удачно 
fileUpload.swfUploadLoadFailed = function() {
    clearTimeout(this.customSettings.loadingTimeout);
    $("#divLoadingContent").hide();
    $("#divLongLoading").hide();
    $("#divAlternateContent").hide();
}



// Окно с выбором файла закрыто
fileUpload.dialogComplite = function(numFilesSelected, numFilesQueued) {
    try {
        this.startUpload();
    } catch (ex) {
        this.debug(ex);
    }
}

fileUpload.uploadProgress = function(file, bytesLoaded) {

    try {
        var percent = Math.ceil((bytesLoaded / file.size) * 100);

        var progress = new FileProgress(file,  this.customSettings.upload_target);
        progress.setProgress(percent);
        if (percent === 100) {
            progress.setStatus("Создание превью");
            progress.toggleCancel(false, this);
        } else {
            progress.setStatus("Загрузка...");
            progress.toggleCancel(true, this);
        }
    } catch (ex) {
        this.debug(ex);
    }
}

fileUpload.onUploadSuccess = function(file, data) {
    }

/**
 * Загрузка завершина
 */
fileUpload.uploadSuccess = function(file, serverData) {
    try {
        // Получаем fileProgress
        var progress = new FileProgress(file,  this.customSettings.upload_target);
        var data = $.parseJSON(serverData);
        
        if (!data['error']) {
            
            /*this.fileList.push(data['file']);
            var imgUrl = 'upload/image/comp/' + data['compid'] + '/' + data['contid'] + '/' + data['file'];
            $('#thumbnails').html('<img src="'+imgUrl+'"/>');*/
            fileUpload.onUploadSuccess(file, data);
            
            progress.setStatus("Превью создано.");
            progress.toggleCancel(false);
        } else {
            $('#thumbnails').html('<img src="res/plugin/SWFUpload-2.2.0.1/images/error.gif"/>');
            progress.setStatus("Error.");
            progress.toggleCancel(false);
            alert(data['error']['msg']);
        }
    } catch (ex) {
        this.debug(ex);
    }
}

fileUpload.uploadComplete = function(file) {
    try {
        /*  I want the next upload to continue automatically so I'll call startUpload here */
        if (this.getStats().files_queued > 0) {
            this.startUpload();
        } else {
            var progress = new FileProgress(file,  this.customSettings.upload_target);
            progress.setComplete();
            progress.setStatus("Все изображения получены.");
            progress.toggleCancel(false);
        }
    } catch (ex) {
        this.debug(ex);
    }
}

fileUpload.uploadError = function(file, errorCode, message) {
    var imageName =  "error.gif";
    var progress;
    try {
        switch (errorCode) {
            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                try {
                    progress = new FileProgress(file,  this.customSettings.upload_target);
                    progress.setCancelled();
                    progress.setStatus("Отменено");
                    progress.toggleCancel(false);
                }
                catch (ex1) {
                    this.debug(ex1);
                }
                break;
            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                try {
                    progress = new FileProgress(file,  this.customSettings.upload_target);
                    progress.setCancelled();
                    progress.setStatus("Остановленно");
                    progress.toggleCancel(true);
                }
                catch (ex2) {
                    this.debug(ex2);
                }
            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                imageName = "uploadlimit.gif";
                break;
            default:
                alert(message);
                break;
        }

        addImage("images/" + imageName);

    } catch (ex3) {
        this.debug(ex3);
    }

}



/* ******************************************
 *	FileProgress Object
 *	Control object for displaying file info
 * ****************************************** */

function FileProgress(file, targetID) {
    this.fileProgressID = "divFileProgress";

    this.fileProgressWrapper = document.getElementById(this.fileProgressID);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.fileProgressID;

        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";

        var progressCancel = document.createElement("a");
        progressCancel.className = "progressCancel";
        progressCancel.href = "#";
        progressCancel.style.visibility = "hidden";
        progressCancel.appendChild(document.createTextNode(" "));

        var progressText = document.createElement("div");
        progressText.className = "progressName";
        progressText.appendChild(document.createTextNode(file.name));

        var progressBar = document.createElement("div");
        progressBar.className = "progressBarInProgress";

        var progressStatus = document.createElement("div");
        progressStatus.className = "progressBarStatus";
        progressStatus.innerHTML = "&nbsp;";

        this.fileProgressElement.appendChild(progressCancel);
        this.fileProgressElement.appendChild(progressText);
        this.fileProgressElement.appendChild(progressStatus);
        this.fileProgressElement.appendChild(progressBar);

        this.fileProgressWrapper.appendChild(this.fileProgressElement);

        document.getElementById(targetID).appendChild(this.fileProgressWrapper);
    //fadeIn(this.fileProgressWrapper, 0);

    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild;
        this.fileProgressElement.childNodes[1].firstChild.nodeValue = file.name;
    }

    this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setError = function () {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setCancelled = function () {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";

};
FileProgress.prototype.setStatus = function (status) {
    this.fileProgressElement.childNodes[2].innerHTML = status;
};

FileProgress.prototype.toggleCancel = function (show, swfuploadInstance) {
    this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
    if (swfuploadInstance) {
        var fileID = this.fileProgressID;
        this.fileProgressElement.childNodes[0].onclick = function () {
            swfuploadInstance.cancelUpload(fileID);
            return false;
        };
    }
};

/*
SWFUploadSettings = {
    //upload_url : utils.url('menu'),//"res/plugin/SWFUpload-2.2.0.1/upload.php",
    flash_url : "res/plugin/SWFUpload-2.2.0.1/swfupload.swf",

    // File Upload Settings
    file_size_limit : "2 MB",	// 2MB
    file_types : "*.jpg;*.gif;*.png",
    file_types_description : "Image files",
    file_upload_limit : "0",

    // Event Handler Settings - these functions as defined in Handlers.js
    //  The handlers are not part of SWFUpload but are part of my website and control how
    //  my website reacts to the SWFUpload events.
    swfupload_loaded_handler : fileUpload.swfUploadLoaded,
    // Событие перед загрузкой модуля SWF
    swfupload_pre_load_handler : fileUpload.swfUploadPreLoad,
    // Модуль не загрузился
    swfupload_load_failed_handler : fileUpload.swfUploadLoadFailed,
    
    file_queue_error_handler : fileUpload.queueError,
    // Окно с выбором файла закрыто
    file_dialog_complete_handler : fileUpload.dialogComplite,
    upload_progress_handler : fileUpload.uploadProgress,
    upload_error_handler : fileUpload.uploadError,
    upload_success_handler : fileUpload.uploadSuccess,
    upload_complete_handler : fileUpload.uploadComplete,

    // Button Settings
    button_image_url : "res/plugin/SWFUpload-2.2.0.1/images/SmallSpyGlassWithTransperancy_17x18.png",
    button_placeholder_id : "spanButtonPlaceholder",
    button_width: 180,
    button_height: 18,
    button_text : '<span class="button"></span>',
    //button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 12pt; } .buttonSmall { font-size: 10pt; }',
    button_text_top_padding: 0,
    button_text_left_padding: 18,
    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
    button_cursor: SWFUpload.CURSOR.HAND,


    custom_settings : {
        upload_target : "divFileProgressContainer"
    },
				
    // Debug Settings
    debug: false
}*/
SWFUploadSettings = {
    // где лежит флеш
    flash_url : "res/plugin/SWFUpload-2.2.0.1/swfupload.swf",
    // Максимальный размер файла
    file_size_limit : "100 MB",	// 2MB
    // Типы файлов
    file_types : "*.*",
    // Название типов файлов
    file_types_description : "All files",
    // Максимальное количество доступное для загрузки
    file_upload_limit : "0",

    // Event Handler Settings - these functions as defined in Handlers.js
    //  The handlers are not part of SWFUpload but are part of my website and control how
    //  my website reacts to the SWFUpload events.
                    
    // Загрузился ли модуль или нет
    swfupload_loaded_handler : fileUpload.swfUploadLoaded,
    file_queue_error_handler : fileUpload.queueError,
    // Окно с выбором файла закрыто
    file_dialog_complete_handler : fileUpload.dialogComplite,
    upload_progress_handler : fileUpload.uploadProgress,
    upload_error_handler : fileUpload.uploadError,
    upload_success_handler : fileUpload.uploadSuccess,
    upload_complete_handler : fileUpload.uploadComplete,
    // Событие перед загрузкой модуля SWF
    swfupload_pre_load_handler : fileUpload.swfUploadPreLoad,
    // Модуль не загрузился
    swfupload_load_failed_handler : fileUpload.swfUploadLoadFailed,

    // Адрес картинки для загрузки
    button_image_url : "res/plugin/SWFUpload-2.2.0.1/images/XPButtonUploadText_61x22.png",
    // ID элемента куда будет загружен флеш
    button_placeholder_id : "spanButtonPlaceholder",
    button_width: 61,
    button_height: 22,


    custom_settings : {
        // DIV где будет прогресс бар
        upload_target : "uploadProgress",
        // ID кнопки отмены
        btnCancel: 'btnCancel'
    },
				
    // Debug Settings
    debug: false
}
