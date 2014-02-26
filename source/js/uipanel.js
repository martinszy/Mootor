/**
* A Panel to show views
*
* @class UIPanel
* @extends UI
* @module UI
* @author Emilio Mariscal (emi420 [at] gmail.com)
* @author Martín Szyszlican (martinsz [at] gmail.com)
*/

(function ($, Mootor) {

    "use strict";

    var UI,
        UIPanel,
        Event,
        View;
        
    // Dependences 
    
    UI = Mootor.UI;    
    Event = Mootor.Event; 
    View = Mootor.View;   

    // Event handlers
    
    Event.on("UIApp:init", function(self) {
        var width = self.el.offsetWidth,
            uiapp = self;
        self.$el.css("width", width * 2);

        self.$el.css("-webkit-transform","translateX(0)");
        self.$el.css("-moz-transform","translateX(0)");

        self.$el.addClass("m-transition-slide");

        Event.on("View:load", function(self) {
            var width = uiapp.el.offsetWidth;

            uiapp.$el.addClass("m-transition-slide");

            uiapp.$el.css("-webkit-transform","translateX(-100%)");
            uiapp.$el.css("-moz-transform","translateX(-100%)");

            window.setTimeout(function() {
                uiapp.$el.removeClass("m-transition-slide");

                uiapp.$el.css("-webkit-transform", "translateX(0)");
                uiapp.$el.css("-moz-transform", "translateX(0)");

                self.ui.$el.css("left", "0px");
            }, 500);
        }); 

    });


    // Private constructors

    UIPanel = function(uiview) {
        UIPanel._init(uiview, this);
    };

    // Event handlers
    
    Event.on("UIView:init", function(self) {
        
        // Initialize panels on UIView init
        
        $.extend(self, {
            panel: new UIPanel(self)
        })

        self.panel.el.innerHTML = Mootor.View._getHtmlPath(self.view);

        var width = m.app.ui.el.offsetWidth;
        m.app.ui.$el.css("width", width + "px");

        $("head").append(View._get(self.view.id).script);
        
        Event.dispatch("View:getScript:" + self.view.id, self.view)
        Event.dispatch("View:init:" + self.view.id, self.view)

        // on m.app.go

        Event.on("View:unload:" + self.view.id, function(self) {
            self.ui.panel.$el.css("left", 0);
            setTimeout(function() {
                if (Mootor.App._currentView !== self) {
                    self.ui.panel.hide();
                }
                m.app.ui.$el.css("width", width + "px");
            },500);
        }); 
        
        Event.on("View:load:" + self.view.id, function(self) {
            self.ui.panel.$el.css("left", width);
            self.ui.panel.show();
        }); 
    });
    

    // Prototypal inheritance

    $.extend(UIPanel.prototype, UI.prototype);

    // Private static methods and properties
        
    $.extend(UIPanel, {
        
        //Initialize panel

        /**
        * Initialize  a panel
        *
        * @method _init
        * @private
        */
        _init: function(uiview, self) {

            var $el,
                el,
                width;
            
            el = self.el = uiview.el = document.createElement("div");
            $el = uiview.$el = self.$el = $(el);
            $el.addClass("m-panel");

            el.setAttribute("class", "m-panel");

            // Fixed panel width
            width = document.body.offsetWidth;
            $el.width(width + "px");
            
            m.app.ui.$el.append(el);            
            
            self.hide();
            
        }

    });

    // Public prototype    
    
    $.extend(UIPanel.prototype, {

        /**
        * Move the element to the specified coordinates. 
        * If coordinates are not specified, it returns coordinates object with the current position.
        *
        * @method position
        * @param {object} [coordinates] Object with coordinates. Example: {x: 0, y: 0}
        * @return {object} Object with coordinates. Example: {x: 0, y: 0}
        */
        position: function(coordinates) {
            
        },

        /**
        * Block/Unblock or return block status.
        *
        * @method blocked
        * @param {Boolean} [blocked] Whether the panel is blocked
        * @return {Boolean} Whether the panel is blocked
        */
        blocked: function(blocked) {
            
        },

        /**
        * Set or get transition type
        *
        * @method transition
        * @param {String} [transition] Transition type. MUST be one of: slide-left, slide-right, none
        * @return {String} Transition type
        */
        transition: function() {
            
        }

    });

}(window.$, window.Mootor));