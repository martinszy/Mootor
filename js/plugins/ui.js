/**
 * @summary User Interface Mootor plugin
 * @author Emilio Mariscal (emi420 [at] gmail.com)
 */
  
(function ($) {

    "use strict";
var _templates = {
    radio: '<div moo-template="foreach: input"><div class="moo-ui-radio"><label><span class="moo-ui-radio-label" moo-template="text: this.label"></span><span class="moo-ui-radio-icon"> &nbsp;</span></label></div></div>',

    checkbox: '<div moo-template="foreach: input"><div class="moo-ui-checkbox"><label><span class="moo-ui-checkbox-label" moo-template="html: this.label"></span><span class="moo-ui-checkbox-icon"> &nbsp;</span></label></div></div>',
    
    overlay: "<div class='moo-overlay'></div>",
    
    loading: "<div class='moo-ui-loading'><div class='moo-ui-loading-block moo-loading-01'></div><div class='moo-ui-loading-block moo-loading-02'></div><div class='moo-ui-loading-block moo-loading-03'></div><div class='moo-ui-loading-block moo-loading-04'></div><div class='moo-ui-loading-block moo-loading-05'></div><div class='moo-ui-loading-block moo-loading-06'></div><div class='moo-ui-loading-block moo-loading-07'></div><div class='moo-ui-loading-block moo-loading-08'></div></div>",
    
    modal: "<div class='moo-ui-modal-container'><div class='moo-ui-modal-panel' moo-template='html: this.html'></div></div>",
    
    toggleswitch: "<div class='moo-ui-switch'><b><span class='moo-before'>I</span><span class='moo-button'>&nbsp;</span><span class='moo-after'>O</span></b></div>",
    
    text: '<span class="cleanbox">&times</span>',
    
    select: '<div class="moo-ui-select-container"><span class="moo-ui-select-text"></span><span class="moo-ui-select-link"> &#9660;</span><div class="moo-ui-select-menu" style="height:217px;display:none"><div class="moo-ui-select-wrapper"></div></div></div>',
    
    camera: "<div class='moo-ui-image-container'><header><a class='moo-ui-add-new' href='#takepic'>Take a picture</a><a class='moo-ui-add-filed' href='#choosepic'>Choose a picture</a><a class='moo-ui-delete' href='#delete'></a><a class='moo-ui-add-comment' href='#addcomment'></a></header><div class='moo-ui-image-panel'><ul class='moo-image-list'><li class='moo-image-wrapper'><div class='moo-image'></div></li></ul></div></div>"

},

/**
 * Remove spaces from a string
 * @private
 * @param {string} string String for remove spaces
 * @return {string} string String without spaces
 */
_removeSpaces = function(string) {
    return string.split(" ").join("");
},


// Mootor UI internal template system

 /**
 * Mootor UI template parser
 * @private
 * @param {object} options Options
 * @return {string} parsedHTML Parsed HTML template
 */
_templateParse = function(options) {
    var template = options.template,
        self = options.self,        
        elements = [],
        parsedHTML = document.createElement("div"),
        tmpElements = [],
        i = 0,
        attr = [],
        index;
    
    parsedHTML.innerHTML = template;        
    tmpElements = parsedHTML.getElementsByTagName("*");     

    for (i = tmpElements.length; i--;) {

        if (tmpElements[i].getAttribute("moo-template") !== null) {

            attr = _removeSpaces(tmpElements[i].getAttribute("moo-template"))
                  .split(":");
                  
            elements.push({
                el: tmpElements[i],
                key: attr[0],
                value: attr[1]
            });
            
        }
        
        if ((index = tmpElements[i].getAttribute("moo-foreach-index")) !== null) {
            elements[i].index = index;
        }
        
    }

    if(_templateArrayHasForeach(elements) === true) {       
        for (i = elements.length; i--;) {
            if (elements[i].key === "foreach") {
                _templateForEach(elements[i], self);            
            } 
        }
    } else {
        for (i = elements.length; i--;) {
            switch (elements[i].key) {
                case "text":
                    _templateText(elements[i], self);
                    break;
                case "html":
                    _templateHTML(elements[i], self);
                    break;
            }
        }
    }
    
    return parsedHTML.innerHTML;
    
},


 /**
 * Check if any element of a Mootor template array has a "foreach" attribute
 * @private
 * @param {object} options Options
 * @return {boolean}
 */
_templateArrayHasForeach = function(elements) {
    var i;
    
    for (i = elements.length; i--;) {        
        if(elements[i].key === "foreach") {
            return true;
        }                
    }

    return false;
},

 /**
 * Parse a "foreach" Mootor template
 * @private
 * @param {object} element Mootor template object to parse
 * @param {object} self Mootor object instance (scope)
 */
 _templateForEach = function(element, self) {
    var tag = element.value,
        collection = self.input.getElementsByTagName(tag),
        i = 0,
        tmpDiv = {},
        html = element.el.innerHTML,
        items = [],
        item,
        labels = [],
        tmpElement = document.createElement("div");
                    
    self.items = [];
    
    items = $(self.input).find(tag);
            
    if(tag === "input") {
        labels = $(self.input).find("label");
    }
            
    for (i = 0; i < items.length; i++) {
        
        self.items.push({
            el: items[i],
            text: items[i].innerText
        });
        
        item = self.items[self.items.length-1];
        
        if(tag === "input") {
            item.label = labels[i];
        }
        if (item.el.value !== undefined) {
            item.value = item.el.value;
        }
    }
                    
    element.el.innerHTML = "";
    
    for (i = 0; i < collection.length; i++) {
        tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = html;
        tmpDiv.firstChild.setAttribute("moo-foreach-index", i);
        
        tmpDiv.firstChild.setAttribute("moo-foreach-value", self.items[i].value);
                
        tmpDiv.innerHTML = _templateParse({
            template: tmpDiv.innerHTML,
            self: self
        });

        tmpElement.appendChild(tmpDiv.firstChild);       

    }        
    
    element.el.innerHTML = tmpElement.innerHTML;

},

 /**
 * Parse a "text" Mootor template
 * @private
 * @param {object} element Mootor template object to parse
 * @param {object} self Mootor object instance (scope)
 */
_templateText = function(element, self) {
    var index = element.index,
        value = "",
        valueToLoad = "";
                    
    if(element.value.indexOf("this.") > -1) {
        value = element.value.replace("this.","");
        valueToLoad = self.items[index][value];
        if (valueToLoad !== undefined) {
            if (typeof valueToLoad === "string") {
                element.el.innerText = valueToLoad;
            } else {
                element.el.innerText = valueToLoad.innerText;                        
            }
        }
    }
},


 /**
 * Parse a "html" Mootor template
 * @private
 * @param {object} element Mootor template object to parse
 * @param {object} self Mootor object instance (scope)
 */
_templateHTML = function(element, self) {
    var index = element.index,
        value = "",
        valueToLoad = "";
                    
    if(element.value.indexOf("this.") > -1) {
        value = element.value.replace("this.","");
        valueToLoad = self.items[index][value];
        if (typeof valueToLoad === "string") {
            element.el.innerHTML = valueToLoad;
        } else {
            element.el.innerHTML = valueToLoad.innerHTML;                        
        }
        
        // FIXME CHECK
        valueToLoad.parentElement.removeChild(valueToLoad);
    }
};
/**
 * Overlay
 * @return {object} Overlay Mootor UI Overlay object
 */
var Overlay = function() {
    if (Overlay.el === undefined) {
        Overlay._makeHTML({
            type: "overlay",
            object: Overlay
        });    
    }
    this.el = Overlay.el;
    return this;
},


/**
 * Modal * @return {object} Modal Mootor UI Modal object
 */
Modal = function() {
    if (Modal.el === undefined) {
        Overlay._makeHTML({
            type: "modal",
            object: Modal
        });    
    }
    this.el = Modal.el;
    return this;
},

/**
 * Loading
 * @return {object} Loading Mootor UI Loading object
 */
Loading = function() {
    if (Loading.el === undefined) {
        Overlay._makeHTML({
            type: "loading",
            object: Loading
        });    
    }
    this.el = Loading.el;
    return this;
};

/*
 * Overlay prototype
 */
Loading.prototype = Overlay.prototype = {        
    
    show: function() {
        $(this.el).removeClass("moo-hidden");
    },
    
    hide: function() {
        $(this.el).setClass("moo-hidden");
    }
};

// Modal prototype
Modal.prototype = {
    html: function(html) {
        this.html = html;
        this.el.innerHTML = _templateParse({
            template: this.el.innerHTML,
            self: this
        });
    }
};

$.extend(Overlay.prototype, Modal.prototype);


// Static properties

$.extend({
    el: undefined,
    _makeHTML: function(options) {
        var type = options.type,
            object = options.object,
            el = document.createElement("div");
        el.innerHTML = _templates[type];
        object.el = el.firstChild;
        $(object.el).setClass("moo-hidden");
        $(document.body).el.appendChild(object.el);
    }
}, Overlay);

var Input = function() {
};
/**
 * ToggleSwitch
 */
var ToggleSwitch = function(options) {               
    this.input = options.el;                   
    $(this.input).hide();
    this._makeHTML();
    this._setTouchEvents();

    
    if (options.value) {
        this.input.value = options.value;
    }
    
    this.toggle(this.input.value);       
    
    return this;
};

ToggleSwitch.prototype = {

    _makeHTML: function() {
        var el;
        el = document.createElement("div");
        el.innerHTML = _templates.toggleswitch;            
        this.el = el.firstChild;
        this.input.parentElement.appendChild(this.el);                        
    },
    
    _setTouchEvents: function() {
        var self = this,
            el = $(self.el).find("b")[0],

            // FIXME CHECK: 32? 3?
            limit = self.el.offsetWidth - 32,
            swipe = 0;
        
        self.x = 0;
        self.isDragging = 0;

        // On TapEnd: toggle
        $(this.el).onTapEnd(function(gesture) {
            self.toggle();
        });  
        
        // On Swipe: update _swipe flag
        $(this.el).onSwipeRight(function(gesture) {
            self._swipe = 1;

        });   
        $(this.el).onSwipeLeft(function(gesture) {
            self._swipe = -1;
        });         

        // On DragMove: translate container element
        $(this.el).onDragMove(function(gesture) {
            var newX = self.x + (gesture.x - gesture.lastX);  
            
            self.isDragging = 1;                              
            $(self.el).removeClass("moo-on");
            $(self.el).removeClass("moo-off");

            gesture.e.stopPropagation();
            if ((newX <= limit) && (newX > -4)) {
                self.x = newX;
                $(el).translateFx({x: self.x, y: 0}, {transitionDuration: 0});
            }
                                      
        });

        // On DragEnd: check gesture time
        //             and toggle by swipe
        //             or drag
        $(this.el).onDragEnd(function(gesture) {
                            
            gesture.e.stopPropagation();                
            $(el).cleanFx();
            
            if (self._swipe !== 0 && gesture.time < 400) {
                if (self._swipe === 1) {
                    self.toggle(1);                        
                } else {
                    self.toggle(0);                                                
                }
            } else if (self.isDragging === 1) {
                self.isDragging = 0;    

                if (self.x < (limit / 2)) {
                    self.toggle(0);                            
                } else {
                    self.toggle(1);                            
                }                    
            }                    
                                      
        });
    },

    /**
    * Toggle control
    *
    * @example myCheck.toggle();
    */
    toggle: function (value) {
        var el = $(this.el);

        if (value !== undefined) {
            this.value = +value;
        } else {
            if (this.value === 0) {
                this.value = 1;
            } else {
                this.value = 0;
            }                                
        }
        
        if (this.value === 0) {
            el.removeClass("moo-on");
            el.setClass("moo-off");                
        } else {
            el.removeClass("moo-off");
            el.setClass("moo-on");                
        }

        this.input.value = this.value;
        
        if (typeof this.onChange === "function") {
            this.onChange();
        }
    },
    
    on: function(event, callback) {
        if (event === "change") {
            this.onChange = callback;
        }
    }
};
/**
 * Checkbox
 * @param {object} options Options
 * @return {object} Radio Mootor UI Checkbox object
 */
var Checkbox = function(options) {
    var i = 0,
        pseudoItems = this.pseudoItems = [];
        
    this.input = options.el;        
    this.value = [];
    $(this.input).hide();
    this._makeHTML();    

    // Create "pseudo" items collection
    pseudoItems = $(this.container).find("div");
    for(i = 0; i < pseudoItems.length; i++) {
        this.pseudoItems.push({
            el: pseudoItems[i],
            value: pseudoItems[i].value,
            mooSelectIndex: i
        });            
    }
    
    this._setTouchEvents();               

    // Init value
    if (options.value !== undefined) {
        this.selectByValue(options.value);
    }
    
    return this;
            
};

/*
 * Checkbox prototype
 */   
Checkbox.prototype = {

    // Make HTML
    _makeHTML: function() {
        this.el = document.createElement("div");
        this.el.innerHTML = _templateParse({
            template: _templates.checkbox,
            self: this
        });        
        this.container = $(this.el).find("div")[0];
        this.input.parentElement.appendChild(this.el);  
    },
    
    // Set touch events
    _setTouchEvents: function() {
       var self = this,
            i = 0;
        
       for(i = 0; i < this.pseudoItems.length; i++) {
       
           $(this.pseudoItems[i].el).onTapEnd(function(gesture) {
                var $el = $(gesture.el);
                
                _stopEventPropagationAndPreventDefault(gesture); 

                if ($el.hasClass("moo-active")) {
                    self.unselect(gesture.el.getAttribute("moo-foreach-index"));
                } else {
                    self.select(gesture.el.getAttribute("moo-foreach-index"));
                }
                              
           });

       }
        
        
    },

    /**
    * Select an item from the list
    * @param {integer} index Index of element to select
    */
    select: function(index) {
        if (this.value.indexOf(index) < 0) {
            this.value.push(index.toString());
            this.items[index].el.setAttribute("checked", "checked");
            $(this.pseudoItems[index].el).setClass("moo-active");
        } 
    },

    /**
    * Unselect an item from the list
    * @param {integer} index Index of element to select
    */
    unselect: function(index) {
        this.value.splice(this.value.indexOf(index) , 1);
        this.items[index].el.removeAttribute("checked", "");
        $(this.pseudoItems[index].el).removeClass("moo-active");
    },


    /**
    * Unselect all items from the list
    */
    unselectAll: function() {
        var i = 0;        
        
        for (i = this.items.length;i--;) {            
            this.unselect(i);
        }        

    },

    selectByValue: function(value) {
        var i,
            j;
            
        if( Object.prototype.toString.call( value ) !== '[object Array]' ) {
            value = [value];
        }
        for (i = this.items.length; i--;) {
            for (j = value.length; j--;) {
                if (this.items[i].value === value[j]) {
                    $(this.pseudoItems[i].el).setClass("moo-active");
                    this.select(i);
                }                
            }
        }
    }    
    
};

/**
 * Radio
 * @param {object} options Options
 * @return {object} Radio Mootor UI Radio object
 */
var Radio = function(options) {
    var i = 0,
        pseudoItems = this.pseudoItems = [];
        
    this.input = options.el;        
    $(this.input).hide();
    this._makeHTML();    

    // Create "pseudo" items collection
    pseudoItems = $(this.container).find("div");
    for(i = 0; i < pseudoItems.length; i++) {
        this.pseudoItems.push({
            el: pseudoItems[i],
            value: pseudoItems[i].value,
            mooSelectIndex: i
        });            
    }
    
    this._setTouchEvents();               

    // Init value
    if (options.value !== undefined) {
        this.selectByValue(options.value);
    }
    
    return this;
            
};

/*
 * Radio prototype
 */   
Radio.prototype = {

    // Make HTML
    _makeHTML: function() {
        this.el = document.createElement("div");
        this.el.innerHTML = _templateParse({
            template: _templates.radio,
            self: this
        });        
        this.container = $(this.el).find("div")[0];
        this.input.parentElement.appendChild(this.el);  
    },
    
    // Set touch events
    _setTouchEvents: function() {
        var self = this,
            i = 0;
            
       for(i = 0; i < this.pseudoItems.length; i++) {
       
           $(this.pseudoItems[i].el).onTapEnd(function(gesture) {
                _stopEventPropagationAndPreventDefault(gesture); 
                self.select(gesture.el.getAttribute("moo-foreach-index"));              
           });

       }
        
        
    },

    /**
    * Select an item from the list
    * @param {integer} index Index of element to select
    */
    select: function(index) {
        var self = this,
            i;
        
        for(i = 0; i < self.pseudoItems.length; i++) {
            $(self.pseudoItems[i].el).removeClass("moo-active"); 
            self.pseudoItems[i].el.removeAttribute("checked", "checked");               
        }
        $(self.pseudoItems[index].el).setClass("moo-active");

        // Get value
        this.value = this.items[index].value;
        
        // Update selected index
        this.selectedIndex = index;
        this.input.selectedIndex = index;
        
        this.items[this.selectedIndex].el.setAttribute("checked", "checked");
        
    },
    
    selectByValue: function(value) {
        var i;
        for (i = this.items.length; i--;) {
            if (this.items[i].value === value) {
                this.select(i);
            }
        }
    }
    
};


/**
 * Select
 * @param {object} options Options
 * @return {object} Select Mootor UI Select object
 */
var Select = function(options) {
    var i = 0,
        pseudoItems = this.pseudoItems = [];
        
    this.y = 0;
    this.input = options.el;        
    this._visibility = "hidden";
    this._makeHTML();       
    this._setTouchEvents();               

    // Create "pseudo" items collection
    pseudoItems = $(this.input).find("option");        
    for(i = 0; i < pseudoItems.length; i++) {
        this.pseudoItems.push({
            el: pseudoItems[i],
            mooSelectIndex: i
        });            
    }
    
    // Init value
    if (options.value !== undefined) {
        this.selectByValue(options.value);
    }
    
    // FIXME CHECK: initial value
    this.select(0);     
    
    return this;
            
};

/*
 * Select prototype
 */   
Select.prototype = {

    // Make HTML
    _makeHTML: function() {
        var el = document.createElement("div"),
            template = _templates.select,
            container = this.input.parentElement;

        el.innerHTML = _templateParse({
            template: template,
            self: this
        });           
        
        this.el = el.firstChild;                      
        this.el.parentElement.insertBefore(this.input);
        
        // FIXME CHECK
        container.appendChild(el);
        
        this.box = $(this.el).find(".moo-ui-select-menu")[0];
        this.textspan = $(this.el).find(".moo-ui-select-text")[0];
        
    },
    
    // Set touch events
    _setTouchEvents: function() {
        var self = this;
                
        // Show selection box
        $(this.el).on("touchend", function(gesture) {
            if (self._visibility !== "visible") {
                self.input.focus();                
                self._visibility = "visible";
            }
        });
        
        $(this.input).on("blur", function() {
            self._visibility = "hidden";
        });

        $(this.input).on("change", function() {
            self.select(self.input.selectedIndex);
        });
        
        // Prevents default on DragStart
        $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);        

    },

    /**
    * Select an item from the list
    * @param {integer} index Index of element to select
    */
    select: function(index) {
        var self = this;
            
        window.setTimeout(function() { 
            $(self.box).hide();
            self._visibility = "hidden";
        }, 100);
        
        // Get value
        this.value = this.pseudoItems[index].el.value;
        
        // Update selected index
        this.selectedIndex = index;
        this.input.selectedIndex = index;
        
        // Update text with selected value
        $(this.textspan).html(this.pseudoItems[index].el.innerText);
    },
    
    selectByValue: function(value) {
        var i;
        for (i = this.items.length; i--;) {
            if (this.items[i].value === value) {
                this.select(i);
            }
        }
    }
    
};


 /**
 * Text
 * @param {object} options Options
 * @return {object} Text Mootor UI Text object
 */

var _focused = false,
 
Text = function(options) {
    var self = this;
                    
    // Input element
    this.el = this.input = options.el;                               
    
    // Value
    if (options.value !== undefined) {
        this.el.value = options.value;
    } 
    this.value = self.el.value;
    
    // Make HTML
    this._makeHTML();
                
    // Set gesture events    
    $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);      
    $(this.el).onTapEnd(function(gesture) {
        gesture.el.focus();
        _stopEventPropagationAndPreventDefault(gesture);
    });        
    $(this.cleanbox).onTapEnd(function() {
        self.clean();
    });

    // Do something to prevents keyboard scroll here
    // FIXME
    this.el.onblur = function() {
    //    _focused = false;
    //    window.setTimeout(function() {
        //    console.log(Text.focused);
    //        if (_focused === false) {
                window.scrollTo(0,0); 
    //        }                
    //    }, 50);
    };
    /*this.el.onfocus = function() {
        _focused = true;
    };*/
    
    return this;
};

Text.focused = false;

 /*
* Text prototype
*/  
Text.prototype = {
    // Make HTML
    _makeHTML: function() {
        var el,
            parent = this.el.parentElement,
            self = this;
        
        this.cleanbox = document.createElement("div");
        this.cleanbox.innerHTML = _templates.text;

        el = document.createElement("div");
        $(el).setClass("moo-ui-text");
        el.appendChild(this.cleanbox);         
        el.appendChild(this.input);
        
        // Update on text change
        $(this.input).on("keyup", function(gesture) {
            
            self.value = self.input.value;
            if (typeof self.onChange === "function") {
                self.onChange();               
            }

        });
        
        parent.appendChild(el);         
    },
    
    clean: function() {
        this.input.value = "";
        this.input.focus();
    },
    
    on: function(event, callback) {
        if (event === "change") {
            this.onChange = callback;
        }
    }
};/**
 * TextArea
 * @param {object} options Options
 * @return {object} TextArea Mootor UI TextArea object
 */
var TextArea = function(options) {
    var self = this;
                
    this.el = this.input = options.el;  
    
    // Value
    if (options.value !== undefined) {
        this.el.innerHTML = options.value;
    } 
    this.value = self.el.innerHTML; 
    
    this._makeHTML();

    $(this.el).onDragStart(_stopEventPropagationAndPreventDefault);                
    $(this.el).onTapEnd(function(gesture) {
        gesture.el.focus();
        _stopEventPropagationAndPreventDefault(gesture);
    });        
    
    return this;      
};

 /*
* TextArea prototype
*/  
TextArea.prototype = {
    // Make HTML
    _makeHTML: function() {
        var el,
            parent = this.el.parentElement,
            self = this;

        $(this.input).on("keyup", function(gesture) {
            self.value = self.input.value;
        });
        
        el = document.createElement("div");
        $(el).setClass("moo-ui-textarea");
        el.appendChild(this.input);
        parent.appendChild(el);         
    }

};
/**
 * Camera
 * @return {object} Camera Mootor UI Camera object
 */
var Camera = function(options) {

    this.input = options.el;
    this.position = options.position;
    this.count = 0;

    Camera._makeHTML(options, this);       
    Camera._setTouchEvents(this);               
    Camera._initProperties(this, options);

    // Init value
    if (options.value !== undefined) { 
        this.value = options.value;
    } else {
        this.value = [];
    }
    
    return this;
            
};

/*
 * Public prototype
 */
Camera.prototype = {        
    
    show: function() {
        if (typeof this.onShowBox === "function") {
            this.onShowBox();
        }
        $(this.el).show();
        this._visibility = "visible";
    },
    
    hide: function() {
        $(this.el).hide();
        this._visibility = "hidden";
    },    

    onShowBox: function(callback) {
        this.onShowBox = callback;  
    },

    onCamera: function(callback) {
        this.onCamera = callback;  
    },

    onSuccess: function(callback) {
        this.onSuccess = callback;  
    },

    onFail: function(callback) {
        this.onFail = callback;  
    },
    
    onChange: function(callback) {
        this.onChange = callback;
    },
    
    push: function(imageElement) {
    
        var tmpDiv = document.createElement("div"),
            imgDiv,
            self = this,
            items;
                    
        tmpDiv.innerHTML = this.imageWrapper.outerHTML;        
        items = $(tmpDiv).find(".moo-image");        
        imgDiv = items[0];
        imgDiv.setAttribute("moo-index", this.count);
        items = $(self.imageList).find("li");

        for (i = items.length; i--;) {
            $(items[i].firstChild).removeClass("moo-active");
        }
        $(imgDiv).setClass("moo-active");
        self.itemSelected = this.count;    

        $(imgDiv).onTapEnd(function(gesture) {
            var $el = $(gesture.el),
                i,
                items = $(self.imageList).find("li");
                
            if ($el.hasClass("moo-active") === false) {

                for (i = items.length; i--;) {
                    $(items[i].firstChild).removeClass("moo-active");
                }

                $(gesture.el).setClass("moo-active");
                self.itemSelected = gesture.el.getAttribute("moo-index");    
                                
            }
        });

        imgDiv.appendChild(imageElement);
        
        this.value.push(imageElement.getAttribute("src"));
        $(tmpDiv.firstChild).show();
        this.imageList.appendChild(tmpDiv.firstChild); 

        $(this.el).removeClass("moo-empty");

        this.count++;
        
    },
    
    clear: function() {
        var items = $(this.imageList).find("li"),
            i = 0;
            
        for (i = items.length; i--;) {
            this.imageList.removeChild(items[i]);
        }
        
        this.count = 0;        
        this.value = [];
        
    },
    
    removeItem: function(index) {
        var items = $(this.imageList).find("li"),
            i = 0;
            
        console.log("remove item!");
            
        this.imageList.removeChild(items[i]);
        this.value.splice(index,1)
        
        this.count = items.length-1;   
        
        if (typeof this.onChange === "function")  {
            this.onChange(this, index);
        }    
        
        // FIXME CHECK
        $(items[this.count]).setClass("moo-active");
        this.itemSelected = this.count;
    }
    
};

/*
 * Private static properties
 */
$.extend({

    _makeHTML: function(options, self) {
    
        var el = document.createElement("div"),
            $selfEl;
        el.innerHTML = _templates.camera;

        self.el = el.firstChild;
        $selfEl = $(self.el);
        $selfEl.setClass("moo-empty");

        
        if (self.position === "top") {
            $selfEl.setClass("moo-top");
        } else if (self.position === "bottom") {
            $selfEl.setClass("moo-bottom");            
        }
        
        self.takeButton = $selfEl.find(".moo-ui-add-new")[0];
        self.chooseButton = $selfEl.find(".moo-ui-add-filed")[0];
        
        if (options.labelTakeButton !== undefined) {
            self.takeButton.innerHTML = options.labelTakeButton;
        }
        if (options.labelChooseButton !== undefined) {
            self.chooseButton.innerHTML = options.labelChooseButton;
        }
        
        self.imageWrapper = $selfEl.find(".moo-image-wrapper")[0];
        self.imageList = $selfEl.find(".moo-image-list")[0];

        $selfEl.hide();
        self._visibility = "hidden";

        self.input.appendChild(self.el);

        // FIXME CHECK: remove template element
        $(self.imageWrapper).hide();
    },
    
    _setTouchEvents: function(self) {
    
        // Show/hide box
        $(self.input).onTapEnd(function() {
           if (self._visibility === "hidden") {
               self.show();           
           } else {
               self.hide();                          
           }
        });
        $(self.el).onTapEnd(function() {
           self.hide();
        });
        
        // Take/choose pictures
        $(self.takeButton).onTapEnd(function() {
            Camera.camera(self);
        });
        $(self.chooseButton).onTapEnd(function() {
            Camera.camera(self, "album");
        });
    },
    
    _initProperties: function(self, options) {
        self.quality = self.quality ? self.quality : 50;
        self.width = self.width ? self.width : 1024;
        self.height = self.height ? self.height : 768;
    },
    
    camera: function(self, sourceType) {
        var source,
            onSuccess;

        if (typeof self.onCamera === "function") {
            self.onCamera();
        }        
        
        if (self.disabled !== true) {
            if (window.Camera !== undefined) {
                if (sourceType === "album") {
                    source = window.Camera.PictureSourceType.SAVEDPHOTOALBUM;
                }
        
                onSuccess = function(data) {
                   // TODO: update image list? use callback?
                   self.onSuccess(data);
                };
        
                navigator.camera.getPicture(           
                   onSuccess,
                   self.onFail, 
                   { 
                       quality: self.quality, 
                       destinationType: window.Camera.DestinationType.FILE_URI,
                       sourceType: source,
                       targetWidth: self.width,
                       targetHeight: self.height
                   }
                );
    
            } else {
                console.log("Not camera! using sample pic");
                self.onSuccess("img/temp/samplepic.jpg"); 
            }
        }
    }
}, Camera);

 
var UI = function() {};

// Public constructors

/**
 * User Interface
 * @class $.prototype.ui
 * @constructor 
 * @param {UIOptions} UI Options
 * @return {UIControl} UI Control
 * @example
 *       // ToggleSwitch
 *       $("#moo-ui-switch-1").ui({
 *           type: "ToggleSwitch",
 *           value: 0
 *       });
 *       
 *       // Text
 *       $("#moo-ui-text-1").ui({
 *           type: "Text"
 *       });
 *       
 *       // TextArea
 *       $("#moo-ui-textarea-1").ui({
 *           type: "TextArea"
 *       });
 *       
 *       // Select
 *       $("#moo-ui-select-1").ui({
 *           type: "Select",
 *           position: "bottom"
 *       });
 *           
 *       // Radio
 *       $("#moo-ui-radio-1").ui({
 *           type: "Radio",
 *       });
 *       
 *       // Checkbox
 *       $("#moo-ui-checkbox-1").ui({
 *           type: "Checkbox",
 *       });
 */


$.extend({

     ui: function(options) {
     
         var UIControl = UI.get(this.query);

         if (UIControl === undefined) {

             options.el = this.el;
             switch (options.type) {
                 case "ToggleSwitch":
                    UIControl = new ToggleSwitch(options);
                    break;
                 case "Text":
                    UIControl = new Text(options);
                    break;
                 case "TextArea":
                    UIControl = new TextArea(options);
                    break;
                 case "Select":
                    UIControl = new Select(options);
                    break;
                 case "Radio":
                    UIControl = new Radio(options);
                    break;
                 case "Checkbox":
                    UIControl = new Checkbox(options);
                    break;                 
                 case "Camera":
                    UIControl = new Camera(options);
                    break;                 
             }

             UIControl.id = this.query;
             UIControl.type = options.type;
             UI.push(UIControl);

             return UIControl;

        } else {
             return UI.get(this.query);
        }
     }
});

/**
 * UI Control
 * @class UIControl
 */
var UIControl = {};

/**
 * Original DOM element
 * @property UIControl
 * @type HTMLElement
 */

/**
 * UI
 * @class $.ui
 */
$.extend({
     ui: {
        /**
         * Overlay
         * @method overlay
         * @example
         *      $.ui.overlay()
         */
         overlay: function() {
            return new Overlay();
         },
        /**
         * Loading
         * @method loading
         * @example
         *      $.ui.loading()
         */
         loading: function() {
            return new Loading();
         },
         modal: function(options) {
            return new Modal();
         }
     }
}, $);


// Private static functions

$.extend({
    
    _collection: [],
    
    get: function(id) {
        var i;
        for (i = UI._collection.length; i--;) {
            if (UI._collection[i].id === id) {
                return UI._collection[i];
            }
        }
    },
    
    push: function(obj) {
        this._collection.push(obj);
    }

} ,UI);


// Utilities

 /**
 * Stop event propagation and prevent default
 * @private
 * @param {object} gesture Mootor gesture
 */
var _stopEventPropagationAndPreventDefault = function(gesture) {
    gesture.e.stopPropagation();
    gesture.e.preventDefault();
};


/**
 * @class UIOptions
 * @static
 */
 
/**
 * Control type
 *
 * @property type
 * @type string
 */

/**
 * Original DOM element
 *
 * @property el
 * @type HTMLElement
 */

/**
 * Control position (top, bottom)
 *
 * @property position
 * @optional
 * @type string
 */

/**
 * Value
 *
 * @property value
 * @optional
 * @type string
 */


}(Mootor));

