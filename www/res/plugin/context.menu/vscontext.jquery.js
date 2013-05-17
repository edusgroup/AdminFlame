(function($){
    jQuery.fn.vscontext = function(options){
        var defaults = {
            menuBlock: null,
            offsetX : 8,
            offsetY : 8,
            onShow: function(){}
            //,onClose: function(){}
        };
        var options = $.extend(defaults, options);
        var menuItem = '#' + options.menuBlock;

        $(this).bind("contextmenu", function(e){
            return false;
        });
        
        $(this).mousedown(function(event){
            var offsetX = event.pageX  + options.offsetX;
            var offsetY = event.pageY + options.offsetY;
            if(event.button == "2"){
                options.onShow();
                $(menuItem).show();
                $(menuItem).css('display','block');
                $(menuItem).css('top',offsetY);
                $(menuItem).css('left',offsetX);
            }else {
                //options.onClose();
                $(menuItem).hide();
            }
        });
        
        $(menuItem).hover(function(){}, function(){
            $(menuItem).hide();
        })
        
        $(menuItem + ' a').click(function(){
            $(menuItem).hide();
        });
    };
})(jQuery);
