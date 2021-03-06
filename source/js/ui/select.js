
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
        this.el.appendChild(this.input);
        container.appendChild(this.el);
        $(container).setClass("moo-ui-select-wrapper");
        
        this.box = $(this.el).find(".moo-ui-select-menu")[0];
        this.textspan = $(this.el).find(".moo-ui-select-text")[0];
        
    },
    
    _refresh: function() {
        var self = this,
            items = $(this.input).find("option"),
            itemsCount = items.length,
            i;
            
        self.pseudoItems = [];

        for (i = 0; i < itemsCount; i++) {
            self.pseudoItems.push({
                el: items[i.toString()],
                mooSelectIndex: i
            });                                          
        }

    },
    
    // Set touch events
    _setTouchEvents: function() {
        var self = this;
                
        // Show selection box
        $(this.input).onTapEnd(function(gesture) {
            if (self._visibility !== "visible") {
                self.input.focus();                
                self._visibility = "visible";
            }
        });
        
        $(this.input).on("blur", function() {
            self._visibility = "hidden";
            window.scrollTo(0,0);
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
        for (i = this.pseudoItems.length; i--;) {
            if (this.pseudoItems[i].el.value === value) {
                this.select(i);
            }
        }
    },

    onChange: function(callback) {
        if (_onChangeCallbacks[this.input.id] === undefined) {
            _onChangeCallbacks[this.input.id] = [];
        }
        _onChangeCallbacks[this.input.id].push(callback);
    },

};

var _onChangeCallbacks = {};
