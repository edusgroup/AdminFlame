dhtmlXCombo.prototype.enableOptionAutoPositioning = function(fl) {
    if (!this.ListAutoPosit)
        this.ListAutoPosit = 1;
    this.attachEvent("onOpen", function() {
                this._setOptionAutoPositioning(fl)
            })
};
dhtmlXCombo.prototype._setOptionAutoPositioning = function(fl) {
    if ((typeof(fl) != "undefined") && (!convertStringToBoolean(fl))) {
        this.ListPosition = "Bottom";
        this.ListAutoPosit = 0;
        return true
    };
    var pos = this.getPosition(this.DOMelem);
    var bottom = this._getClientHeight() - pos[1] - this.DOMelem.offsetHeight;
    var height = (this.autoHeight) ? (this.DOMlist.scrollHeight) : parseInt(this.DOMlist.offsetHeight);
    if ((bottom < height) && (pos[1] > height)) {
        this.ListPosition = "Top"
    } else
        this.ListPosition = "Bottom";
    this._positList()
};
dhtmlXCombo.prototype._getClientHeight = function() {
    return ((document.compatMode == 'CSS1Compat') && (!window.opera)) ? document.documentElement.clientHeight : document.body.clientHeight
};
dhtmlXCombo.prototype.setOptionWidth = function(width) {
    if (arguments.length > 0) {
        this.DOMlist.style.width = width + "px";
        if (this.DOMlistF)
            this.DOMlistF.style.width = width + "px"
    }
};
dhtmlXCombo.prototype.setOptionHeight = function(height) {
    if (arguments.length > 0) {
        if (_isIE)
            this.DOMlist.style.height = this.DOMlistF.style.height = height + "px";
        else
            this.DOMlist.style.height = height + "px";
        this._positList()
    }
};
dhtmlXCombo.prototype.enableOptionAutoWidth = function(fl) {
    if (!this._listWidthConf)
        this._listWidthConf = parseInt(this.DOMlist.style.width);
    if (arguments.length == 0) {
        var fl = 1
    };
    if (convertStringToBoolean(fl)) {
        this.autoOptionWidth = 1;
        awOnOpen = this.attachEvent("onOpen", function() {
                    this._setOptionAutoWidth()
                })
    } else {
        if (typeof(awOnOpen) != "undefined") {
            this.autoOptionWidth = 0;
            this.detachEvent(awOnOpen);
            this.setOptionWidth(this._listWidthConf)
        }
    }
};
dhtmlXCombo.prototype._setOptionAutoWidth = function() {
    this.setOptionWidth(1);
    var x = this.DOMlist.offsetWidth;
    for (var i = 0; i < this.optionsArr.length; i++) {
        var optWidth = (_isFF) ? (this.DOMlist.childNodes[i].scrollWidth - 2) : this.DOMlist.childNodes[i].scrollWidth;
        if (optWidth > x) {
            x = this.DOMlist.childNodes[i].scrollWidth
        }
    };
    this.setOptionWidth(x)
};
dhtmlXCombo.prototype.enableOptionAutoHeight = function(fl, maxHeight) {
    if (!this._listHeightConf)
        this._listHeightConf = (this.DOMlist.style.height == "") ? 100 : parseInt(this.DOMlist.style.height);
    if (arguments.length == 0)
        var fl = 1;
    this.autoHeight = convertStringToBoolean(fl);
    if (this.autoHeight) {
        ahOnOpen = this.attachEvent("onOpen", function() {
                    this._setOptionAutoHeight(fl, maxHeight);
                    if (_isIE)
                        this._setOptionAutoHeight(fl, maxHeight)
                })
    } else {
        if (typeof(ahOnOpen) != "undefined") {
            this.detachEvent(ahOnOpen);
            this.setOptionHeight(this._listHeightConf)
        }
    }
};
dhtmlXCombo.prototype._setOptionAutoHeight = function(fl, maxHeight) {
    if (convertStringToBoolean(fl)) {
        this.setOptionHeight(1);
        var height = 0;
        if (this.optionsArr.length > 0) {
            if (this.DOMlist.scrollHeight > this.DOMlist.offsetHeight) {
                height = this.DOMlist.scrollHeight + 2
            } else
                height = this.DOMlist.offsetHeight;
            if ((arguments.length > 1) && (maxHeight)) {
                var maxHeight = parseInt(maxHeight);
                height = (height > maxHeight) ? maxHeight : height
            };
            this.setOptionHeight(height)
        }
    }
};