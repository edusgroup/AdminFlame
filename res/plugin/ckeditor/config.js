/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';

    //config.enterMode = CKEDITOR.ENTER_BR;            // p | div | br
    //config.shiftEnterMode = CKEDITOR.ENTER_P;    // p | div | br

    config.toolbar = 'Full';

    config.toolbar_Full =
        [
            {
                name:'document',
                items:[ 'Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates' ]
            },
            {
                name:'clipboard',
                items:[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
            },
            {
                name:'editing',
                items:[ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt' ]
            },
            {
                name:'forms',
                items:[ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                    'HiddenField' ]
            },
            '/',
            {
                name:'basicstyles',
                items:[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
            },
            {
                name:'paragraph',
                items:[ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ]
            },
            {
                name:'links',
                items:[ 'Link', 'Unlink', 'Anchor' ]
            },
            {
                name:'insert',
                items:[ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ]
            },
            '/',
            {
                name:'styles',
                items:[ 'Styles', 'Format', 'Font', 'FontSize' ]
            },
            {
                name:'colors',
                items:[ 'TextColor', 'BGColor' ]
            },
            {
                name:'tools',
                items:[ 'Maximize', 'ShowBlocks', '-', 'About' ]
            }
        ];

    config.toolbar_Article =
        [
            {
                name:'document',
                items:[ 'Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates' ]
            },
            {
                name:'clipboard',
                items:[ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
            },
            {
                name:'editing',
                items:[ 'Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt' ]
            },
            '/',
            {
                name:'basicstyles',
                items:[ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
            },
            {
                name:'paragraph',
                items:[ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ]
            },
            {
                name:'links',
                items:[ 'Link', 'Unlink', 'Anchor' ]
            },
            {
                name:'insert',
                items:[ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak' ]
            },
            '/',
            {
                name:'styles',
                items:[ 'Styles', 'Format', 'Font', 'FontSize' ]
            },
            {
                name:'colors',
                items:[ 'TextColor', 'BGColor' ]
            },
            {
                name:'tools',
                items:[ 'Maximize', 'ShowBlocks' ]
            }
        ];

    config.toolbar_Basic =
        [
            ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', '-', 'About']
        ];

    /*config.filebrowserBrowseUrl = '/?cmd=fileManager&a1=ckedit&type=file';
     config.filebrowserImageBrowseUrl = '/?cmd=fileManager&a1=ckedit&type=img';
     config.filebrowserFlashBrowseUrl = '/?cmd=fileManager&a1=ckedit&type=flash';
     config.filebrowserUploadUrl = 'res/plugin/kcfinder/upload.php?type=files';
     config.filebrowserImageUploadUrl = 'res/plugin/kcfinder/upload.php?type=images';
     config.filebrowserFlashUploadUrl = 'res/plugin/kcfinder/upload.php?type=flash';*/


};