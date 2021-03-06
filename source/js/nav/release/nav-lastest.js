/**
 * @summary Mootor Navigation plugin
 * @author Emilio Mariscal (emi420 [at] gmail.com)
 */

(function ($) {

    "use strict";
    

/**
 * Nav
 * @class Nav
 * @constructor
 * @param {NavOptions} options Options
 */ 
var Nav,
    Item;
    
Nav = function (options) {
    
    var self = this;

    if (options.noInit !== true) {

        // Initialize instance & navigation items
        Nav.init(options, this);

        // Initialize header & footer
        this.header = new Header(this);
        this.footer = new Footer(this);

    } else {
        this.init = function() {
            Nav.init(options, self);                
        }
    }
};

// Public instance prototypes

/**
 * Nav
 */  
Nav.prototype = {

        /**
         * Original DOM lement
         * @property el
         * @type HTMLElement
         */
        el: undefined,
        
        /**
         * Set current navigation item
         * @extends Nav
         * @method set
         * @param {string} id Navigation item id
         * @return {object} Item Navigation item instance
         */
        set: function (id) {
            
            var item = this.get(id);
                        
            if (item !== null) {
                
                // If no transition is happening..
                if (this._config.isMoving === false) {
    
                    this._config.isMoving = true;
                    
                    if (this.current !== item.index) {
        
                        // Save current index
                        this._config.back = this.current;
        
                        // Add item to navigation history
                        if (this._config.direction === 0) {
                            this.history.push(this.current);
                        }
        
                        // Update current index
                        this.current = item.index;
    
                        // Load this Item
                        Nav.load(this);                    
        
                    }
    
                }
            
            }
            
            return item;

        },

        /**
         * Get Item object by id
         * @method get
         * @param {string} id Navigation item id
         * @return {object} Item Navigation Item instance
         */
        get: function (id) {
            var i;
            for (i = this._config.count; i--;) {
                if (this.items[i].el.id === id) {
                    return this.items[i];
                }
            }
            return null;
        },

        /**
         * Go back on navigation history
         * @method goBack
         * @param {string} id Navigation item id
         * @return {integer} index Current navigation item index
         */
        goBack: function () {
        
            // If not in the begin of navigation history
            // and not doing transitions
            if (this.history.length > 0) {
                if(this._config.isMoving === false) {

                    // Set direction for transitions
                    this._config.direction = -1;

                    // Update history
                    this._config.back = this.history.pop();
                    
                    // Load Item
                    this.set(this.items[this._config.back].el.id);
                }
            }
            return this.items[this.current].index;
        },

        /**
         * Gesture handler
         * @private
         * TODO: move this property off of prototype
         */
        handleGesture: function (gesture) {
            Nav.handleGesture(gesture, this);
        }
        
    };


/**
 * Item
 * @param {object} options Options
 * @return {object} Item Navigation Item instance
 */
Item = function(options) {
    
        // Cache element
        this.el = options.el;        
        
        // Initialize properties
        this.id = this.el.id;
        this.index = options.index;
        this.height = options.height;

        // Item 2D position
        this.x = options.x;
        this.y = options.y;
        
        return this;  
    };
    
// Private static methods

/**
 * Item
 */     
$.extend({
    
        getLinks: function(self, navInstance) {
            var links,
                i,
                navigationItems = [];
                
            links = $(self.el).find("." + navInstance._config.navClass);
            for (i = 0; i < links.length; i++) {
                if (links[i].getAttribute("href").replace("#","") !== "") {
                    navigationItems.push(links[i]);
                }
            }
            
            return navigationItems;
        },
        
        loadNavigationItem: function (gesture, self, navInstance) {
            var i = 0,
                href = "";
                
            // Clear navigation items styles
            for (i = self.navigationItemsCount; i--;) {
                $(self.navigationItems[i]).removeClass("active");
            }
            
            // Default load transition direction
            navInstance._config.direction = 0;
            
            // If not doing a transition 
            if (navInstance._config.isMoving === false) {                
                // Set & load navigation Item
                href = gesture.el.getAttribute("href");
                if (href && href !== "") {
                    gesture.e.stopPropagation();
                    gesture.e.preventDefault();
                    navInstance.set(href.replace("#",""));
                }
            }
        },
        
        initNavigationItems: function(self, navInstance) {
        
            var navigationItem,
                i;
                
            // Get navigation links
            self.navigationItems = Item.getLinks(self, navInstance);            
            self.navigationItemsCount = self.navigationItems.length;
            
            // Setup navigation links            
            for (i = self.navigationItemsCount; i--;) {
                navigationItem = self.navigationItems[i];
                
                // External links    
                if ($(navigationItem).hasClass(navInstance._config.navClass) === false) {
                    $(navigationItem).onTapEnd( function(gesture) {
                        window.location = gesture.el.href;
                    });

                // Internal navigation links    
                } else {
                    if (navigationItem.getAttribute("href").replace("#","") !== "") {

                        $(navigationItem).onTapStart(
                            function(gesture) {
                                $(gesture.el).setClass("active");
                            }
                        );                        

                        $(navigationItem).onTapEnd(
                            function(gesture) {                                
                                Item.loadNavigationItem(gesture, self, navInstance);
                            }
                        );

                    }                    
                }
            }
            
            // FIXME CHECK
            self.initNavigation = function() {
                Item.initNavigationItems(self, navInstance);
            }    
            
            return self;                        
        }    
        
    }, Item);



// Public constructors

/** 
 * @class $.prototype.nav
 * @param {NavOptions} options Navigation configuration options
 * @constructor
 * @return {Nav} Nav instance
 */
$.extend({
    nav: function (options) {
            var nav;
            if (typeof options !== "object") {
                options = {};
            }
            options.el = this.el;
            options._query = this.query;
            
            nav = Nav.get(this.query);
            
            if(nav === undefined) {
                return new Nav(options);
            } else {
                return nav;
            }
            
    }
});

/**
 * Nav
 */    
$.extend({
    
        _collection: [],

        /**
         * Initialize Nav instance
         * @method init
         */
        init: function(options, self) {

            // Container element
            self.el = options.el;

            // Cache options for later use
            self._options = options;
            
            // Initialize instance properties
            Nav.initProperties(self, options);     
            
            // Set class name for main container
            $(self.el).setClass(self._config.containerClassName);                                               
            
            // Initialize items
            Nav.initItems(self);
                        
            // Map touch events to event handler
            $(self.el).onDragMove(self);
            $(self.el).onDragEnd(self);
            
            // Initialize events on window resize
            Nav.initResizeEvents(self);
            
            return self;
        },
        
        /**
         * Translate Nav instance properties
         */
        initProperties: function(self, options) {
        
            var navObject;
        
            // Private properties

            self._config = {
            
                // Item 2D positions
                x: 0,
                y: 0,
                
                // Index of previous item in navigation history
                back: 0,
                
                // Flag for items transitions
                isMoving: false,
                
                // Direction of moving for items transitions
                direction: 0,
                
                // Sizes of items container
                width: $.view.clientW,
                height: $.view.clientH,

                // Enable or disable transitions
                transitions: options.transitions,

                // Enable or disable boosting
                boosting: options.boosting,

                // Header container class name
                headerClassName: options.headerClassName ? 
                          options.headerClassName : "moo-header",

                // Footer container class name
                footerClassName: options.footerClassName ? 
                          options.footerClassName : "moo-footer",

                // Navigation links container class name
                navClass: options.navLinksClassName ? 
                          options.navLinksClassName : "moo-nav",

                // Hidden content when isMoving class name
                hiddenClassName: options.hiddenClassName ?
                              options.hiddenClassName : "moo-hidden",
                              
                // Margin between items
                margin: options.margin ?
                              options.margin : 5,


                // Main container class name
                containerClassName: options.containerClassName ? 
                          options.containerClassName : "moo-panels",

                // Navigation item class name
                itemClass: options.itemsClassName ?
                           options.itemsClassName : "moo-panel",

                // Navigation type
                type: options.type ?
                              options.type : "Panels"                                                

            };

            // Enable or disable transitions
            if (self._config.transitions === undefined) {
                self._config.transitionDuration = .25
            } else {
                self._config.transitionDuration = 0                
            }
            
            // Access to navigation object by type, ex: self.Panel
            if (self._config.type === "Panels") {
                navObject = Panel;
            }
            self._config.navItem = navObject;

            
            // Public properties
            
            // Array of navigation items
            self.items = [];
            
            // Current item index
            self.current = 0;                
            
            // Navigation index (array of items indexes)
            self.history = [];           
            
            self.id = options.id ? options.id : options._query;

            if (Nav.get(self.id) === undefined) {
                Nav._collection.push(self);
            }
      
        },    
        
        /**
         * Gesture handler
         */
        handleGesture: function (gesture, self) {
            gesture.e.preventDefault();
            switch (gesture.type) {
                case "dragMove":
                    Nav.move(gesture, self);
                    break;
                case "dragEnd":
                    self._config.navItem.checkMove(gesture, self);
                    break;
            }
        },
        
        /**
         * Initialize navigation area
         */
        nav: function (navElement, self) {
            navElement._anchors = self.el.getElementsByClassName(self._options.navClass);
        },

        /**
         * Move item
         */
        move: function (gesture, self) {
            var item =  self.items[self.current];
            
            if (gesture.isDraggingY !== 0 && item.movable !== false) {                
                self._config.navItem.move(self, item, gesture);
            }

        },

        /**
         * Load item
         */
        load: function (self) {      
            self._config.navItem.load(self);            
        },
        
        /**
         * Setup events onResize
         */
        initResizeEvents: function(self) {

            // Update cached window sizes on window resize
            $(window).bind("resize", function(){
                setTimeout( function() {
                    if (self.header !== undefined) {
                        self._config.height = $.view.clientH - self.header.height;
                    } else {
                        self._config.height = $.view.clientH;                        
                    }
                }, 1);
            });

        },

        /**
         * Initialize navigation items
         */
        initItems: function(self) {
            var i,
                item,
                elements = self.el.getElementsByClassName(self._config.itemClass);     
                
            // Initialize items 
            self.items = [];
            for (i = 0; i < elements.length; i++) {
    
                item = new Item({
                    el: elements[i],
                    index: i,
                    x: 0,
                    y: 0
                });
    
                // Initialize navigation items
                Item.initNavigationItems(item, self);
                
                self.items.push(item);
            }
            
            // Items count
            self._config.count = i;
            
            // Initialize navigation items CSS styles
            Nav.initNavItemStyles(self);
            
        },

        /**
         * Initialize navigation items CSS Styles
         */
        initNavItemStyles: function(self) {
            self._config.navItem.initStyles(self);
        },
                
        /**
         * Prevent native browser scrolling 
         */
        preventNativeScrolling: function() {
            $(document).ready(function() {
                $(document.body).bind("touchmove", function(event) {
                    event.preventDefault();
                    event.stopPropagation();                        
                });    
            });
        },
        
        get: function(id) {
            return Nav._collection.map(function(x) {
                if (x.id === id) { return x; }
            })[0];
        },
        
        _scrollBar: function(options) {
            // TODO
        } 
            
}, Nav);

window._navCollection = Nav._collection;

/*
 * Prevent native scrolling
 */
Nav.preventNativeScrolling();

/**
 * Navigation link
 */
var NavLink = function(el) {
    this.$el = $(el);
    this.id = el.id;
    return this;
}

NavLink.prototype = {
    hide: function() {
        this.$el.removeClass("moo-visible");
    },
    show: function() {
        this.$el.setClass("moo-visible");;
    }
}

// When ready...
window.addEventListener("load",function() {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(1, 0);
	}, 300);
});



// #include "nav.js"

/**
 * Header
 * @param {object} self Nav instance
 * @return {object} Header Header instance
 */
var Header = function(self) {

    // Cache element
    this.el = $("header")[0];
    
    if (this.el !== undefined) {
        
        this.height = this.el.offsetHeight;       
        //this.el.style.height = this.height + "px";      

        // Set styles when header active on navigation items
        _setStylesWhenHeaderIsActive(this.height, self);         

        $(this.el).setClass(self._config.headerClassName);

        // Initialize back button
        Header.initAnchorBack(this, self);           
        
        // Initialize nav links
        Header.initNavigationLinks(this, self); 
        
        // Prevent native scrolling
        Header.preventNativeScrolling(this)
        
        return this;
    } else {
        return undefined;
    }
    
};

Header.prototype = {
    setTitle: function(title) {
        $(this.el).find("h1")[0].innerText = title;
    }
}

/**
 * Header
 */
$.extend({

    initAnchorBack: function(self, navInstance) {
        
        var $anchorBack =
            navInstance._config.anchorBack =
            $($(self.el).find(".moo-nav-back")[0]);
            
        navInstance._config.anchorBack.show = function() {
            this.setClass("moo-visible");
        }

        navInstance._config.anchorBack.hide = function() {
            this.removeClass("moo-visible");
        }
        
        $anchorBack.onTapStart(function() {
            $anchorBack.setClass("moo-hover");
        });
        $anchorBack.onTapEnd(function() {
            $anchorBack.removeClass("moo-hover");
        });
            
        if ($anchorBack.el !== undefined) {
            $anchorBack.hide();
            
            $anchorBack.el.onclick = function() {
                return false;
            };
    
            $anchorBack.onTapEnd(function(gesture) {
                navInstance.goBack();
            });        
        }
        
    },
    
    preventNativeScrolling: function(self) {
        $(self.el).on("touchmove", function(event) {
            event.preventDefault();
        });
    },
    
    initNavigationLinks: function(self, navInstance) {
        var navigationItems = $(self.el).find(".moo-nav"),
            $navigationItem,
            i,
            navLink;
            
        self.navLinks = {};
        
        for (i = navigationItems.length; i--;) {
            $navigationItem = $(navigationItems[i]);
            $navigationItem.onTapEnd(function(gesture) {
                Item.loadNavigationItem(gesture, self, navInstance);                    
            });
            navLink = new NavLink(navigationItems[i]);
            self.navLinks[navLink.id] = navLink;
            $navigationItem.onTapStart(function(gesture){
                $(gesture.el).setClass("moo-hover");
            });
            $navigationItem.onTapEnd(function(gesture){
                $(gesture.el).removeClass("moo-hover");                
            });            
        }
    }

}, Header);


/*
 * Styles when Header is active
 */
var _setStylesWhenHeaderIsActive = function(height, navInstance) {
    var i;
    for (i = navInstance._config.count; i--;) {
        navInstance.items[i].el.style.paddingTop = height + "px";
    }
}
// #include "nav.js"

/**
 * Footer
 * @param {object} self Nav instance
 * @return {object} Footer Footer instance
 */
var Footer = function(self) {

    // Cache element
    this.el = $("footer")[0];
    
    if (this.el !== undefined) {
        
        this.height = this.el.offsetHeight;       

        // Set styles when Footer active on navigation items
        _setStylesWhenFooterIsActive(this, self);         
            
        $(this.el).setClass(self._config.footerClassName);

        // Initialize nav links
        Footer.initNavigationLinks(this, self); 
        
        // Prevent native scrolling
        Footer.preventNativeScrolling(this)
        
        return this;
    } else {
        return undefined;
    }
    
};

/**
 * Footer
 */
$.extend({
    
    preventNativeScrolling: function(self) {
        $(self.el).on("touchmove", function(event) {
            event.preventDefault();
        });
    },
    
    initNavigationLinks: function(self, navInstance) {
        var navigationItems = $(self.el).find(".moo-nav"),
            $navigationItem,
            i;
        
        for (i = navigationItems.length; i--;) {
            $navigationItem = $(navigationItems[i]);
            $navigationItem.onTapEnd(function(gesture) {
                var item = navInstance.get(gesture.el.getAttribute("href").replace("#",""));
                if (item.index != navInstance.current) {
                    Item.loadNavigationItem(gesture, self, navInstance);
                }               
            });
            $navigationItem.onTapStart(function(gesture){
                $(gesture.el).setClass("moo-hover");
            });
            $navigationItem.onTapEnd(function(gesture){
                $(gesture.el).removeClass("moo-hover");                
            });            
        }
    }

}, Footer);

/*
 * Styles when Footer is active
 */
var _setStylesWhenFooterIsActive = function(footer, navInstance) {
    var i;
    for (i = navInstance._config.count; i--;) {
        navInstance.items[i].el.style.paddingBottom = footer.height + "px";
    }
}

var Panel = function(){},

/**
 * Translate element
 */
_translate = function (options) {
        
    options.duration = options.duration ? 
                      options.duration : 0;
                      
    options.callback = options.callback ? 
                       options.callback : function () {};
                       
    options.y = options.y ?
                options.y : 0;
    
    options.x = options.x ?
                options.x : 0;
    
    $(options.el).translateFx(
        {y: options.y, x: options.x},
        {transitionDuration: options.duration, callback: options.callback}
    );
    
};

var _loadCallback = function (self, panel, back) {
    var self_config = self._config;
    
    $(back.el).hide();
    
    self_config.isMoving = false;                 
    
    panel.x = 0;
    self_config.x = 0;
    _translate({el: self.el, x: 0}, self);
    _translate({el: panel.el, x: 0}, self);

    if (typeof panel.onLoad === "function") {
        panel.onLoad();
        panel.height = panel.el.offsetHeight
    }
    
};

$.extend({
    
    /**
     * Load panel
     */
    load: function(navInstance) {
        
            var panel,
                callback,
                back,
                positionX,
                i,
                navInstance_config = navInstance._config,
                block;
                                    
            // Current panel
            panel = navInstance.items[navInstance.current];
            // Back panel 
            back = navInstance.items[navInstance_config.back];
            
            // Display panel
            $(panel.el).show();
            
            if (navInstance_config.anchorBack !== undefined) {
                if (navInstance.current !== 0) {                
                    navInstance_config.anchorBack.show();           
                } else {
                    navInstance_config.anchorBack.hide();
                }
            }

            if (navInstance_config.transitionDuration > 0) {
           
                // Initial position for translate
                positionX = navInstance_config.width + navInstance_config.margin;
                                
                if (navInstance_config.direction === 0 || navInstance_config.back === 0) {
            
                    // Right
                    _translate({el: panel.el, x: positionX}, navInstance);
                    panel.x = positionX;
                    positionX = -positionX;
            
                } else {
            
                    // Left            
                    _translate({el: panel.el, x: -positionX}, navInstance);
                    panel.x = -positionX;
                    positionX = positionX;

                }

                navInstance_config.y = 0;
                
                window.setTimeout(function () {
                    _translate({
                        el: navInstance.el,
                        duration: navInstance_config.transitionDuration,
                        x: positionX,
                        callback: function() {
                            _loadCallback(navInstance, panel, back);
                        }
                    }, navInstance);
                }, 1);                
                
            } else {
                _loadCallback(navInstance, panel, back);
            }

        },
    
    /**
     * Initialize CSS Styles
     */
    initStyles: function(self) {
            var i = 0,
                item = {},
                initPanelSizes;
                
            for (i = self._config.count; i--;) {
    
                item = self.items[i];
                
                if (self._config.transitionDuration > 0) {
                    // Translate all but first panel off of the screen
                    if (i > 0) {
                        _translate({
                            el: item.el, 
                            x:  -((self._config.width + self._config.margin) * 4),
                            y:0
                        }, self);
                    } else {
                        _translate({
                            el: item.el,
                            x:0
                        }, self);
                    }
                }

                if (i > 0) {
                    $(item.el).hide();
                }
                
                // Fill screen vertically
                item.height = item.el.offsetHeight;                
                if (self._config.height > item.height) {
                    item.height = self._config.height;
                }
                
            }
            
            initPanelSizes = function() {
                var clientWidthStyle = $.view.clientW + "px";     
                for (i = self._config.count; i--;) {
                    item.el.style.width = clientWidthStyle;                 
                }           
                self.el.style.width = clientWidthStyle;
                document.body.style.width = clientWidthStyle;
            }
            
            initPanelSizes();
            
            $(window).on("resize", initPanelSizes);
        },
    
    /**
     * Check move
     */
    checkMove: function (gesture, self) {
            var panel = self.items[self.current],
                maxdist = panel.height - self._config.height,
                boostdist,
                boostdistDiscrete,
                boostdistAbs,
                i;

            if (self.header !== undefined) {
                maxdist += self.header.height;
            }
                
            if (gesture.type === "dragEnd") {

                // Bounce back
                if (self._config.y >= 0 || maxdist < -self._config.y) {
             
                    if (self._config.y > 0) {
                        self._config.y = 0;
                    } else {
                        self._config.y = -maxdist;                            
                    }
                    
                    // FIXME CHECK
                    for (i = panel.navigationItems.length; i--;) {
                        $(panel.navigationItems[i]).removeClass("active");
                    }
                                                          
                    _translate({
                        y: self._config.y,
                        el: panel.el,
                        duration: 0.25
                    }, self);
                
                } else {
                    
                    // FIXME NEEDS IMPROVEMENTS
                    
                    if (self._config.boosting !== false) {
                        boostdist = gesture.velocity.y * 1000;
                        boostdistAbs = Math.abs(boostdist);
                    
                        if (boostdistAbs < 25) {
                            boostdistDiscrete = 0;
                        } else if (boostdistAbs < 50) {
                            boostdistDiscrete = 100;
                        } else if (boostdistAbs < 500) {
                            boostdistDiscrete = 500;
                        } else if (boostdistAbs < 1000) {
                            boostdistDiscrete = 1000;
                        } else if (boostdistAbs < 2000) {
                            boostdistDiscrete = 3000;
                        } else {
                            boostdistDiscrete = 5000;                        
                        }
                    
                        boostdist = boostdistDiscrete * (boostdist / boostdistAbs);
                    
                        self._config.y -= boostdist;

                        if (self._config.y >= 0 || maxdist < -self._config.y) {
                            if (self._config.y > 0) {
                                self._config.y = 0;
                            } else {
                                self._config.y = -maxdist;                            
                            }
                        }

                        _translate({
                            y: self._config.y,
                            el: panel.el,
                            duration: 1,
                        }, self);                    
                        
                    }
                       
                }
                
            }

        },
    
    /** 
     * Move panel 
     */
    move: function(self, item, gesture) {
            var isPermitted = false;
            
            item.y = self._config.y = self._config.y + (gesture.y - gesture.lastY);
            
            // FIXME CHECK
            var panel = self.items[self.current],
                maxdist = panel.height - self._config.height,
                i;
            if (self.header !== undefined) {
                maxdist += self.header.height;
            }
            
            if (self._config.transitions === false) {
                if (self._config.y < 0 && maxdist > -self._config.y) {
                    isPermitted = true;
                }
            } else {
                isPermitted = true
            }
            
            // FIXME CHECK
            item.maxdist = maxdist;
            
            if (isPermitted === true) {
                _translate({
                    el: item.el,
                    y: item.y,
                    x: item.x
                }, self);
            }
        },

    /**
     * Set styles when Header or Footer is active
     */
    setStylesWhenHeaderOrFooterIsActive: function(height, navInstance) {
        var i;
        for (i = navInstance._config.count; i--;) {
            navInstance.items[i].el.style.paddingTop = height + "px";
        }
    }

}, Panel);

}(Mootor));

/**
 * @class NavOptions
 * @private
 * @static
 */

/**
 * Margin between panels
 *
 * @property panelsMargin
 * @type number
 */

/**
 * Panels items class
 *
 * @property panelsItemsClassName
 * @type string
 */
 
 /**
 * Navigation links class
 *
 * @property navLinksClassName
 * @type string
 */
 
 /**
 * Hidden content (when transitioning) class
 *
 * @property hiddenContentClassName
 * @type string
 */

