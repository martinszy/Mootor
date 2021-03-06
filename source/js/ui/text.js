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

    this.el.onblur = function() {
        window.scrollTo(0,0); 
    };
    
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
};