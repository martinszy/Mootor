(function($) {

    var view_name = "ui_map",
    
        nav = $("#main").nav(),
        app = $("main").app(),
        view = {},
        navCurrent = nav.get(view_name);

    if( app.settings.debug === true ) {
        console.log("Load " + view_name + ".js");
    }
    
    var ui = {};
    
    view = {
       
        init: function() {
            
            // >> Put view init code here <<
            
            // Set onLoad callbacks
            navCurrent.onLoad = view.onLoad;
            if(app.views[nav.current].id === view_name) {
                view.onLoad();               
            }
            
        },
        
        onLoad: function() {
            // Set header title
            nav.header.setTitle("UI Map");        
                                                   
        },        

            
    }
    
    // Initialize view

    view.init()


    // Initialize UI
    
    ui.map = $("#myMap").ui({
        type: "Map",
        onLoad: function() {
            ui.map.addMarker({
                lat: -34.599567,
                lon: -58.372553,
                html: "Test"                
            });
        }
    });                

        
}(Mootor));