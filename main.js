let mainGameObj;
//let somethingCount;
let g_frameUpdateEventHndlr;
//let g_clickEventHndlr;


function _init() 
{
    //var x = document.createElement("CANVAS");
    //document.body.appendChild(x);
    /*
    var node = document.createElement("CANVAS")
    node.setAttribute("id","gameSurface");
    node.setAttribute("height","600");
    node.setAttribute("width","600");

    document.getElementById("test").appendChild(node);
    //*/

    // Creating a WebGL Context Canvas
    //var canvas = document.getElementById('gameSurface');

    
    /*
    var gl = canvas.getContext('webgl');

	// Creating a 2D Canvas for displaying text
	var textCanvas = document.getElementById('text');
    var txtCTX = textCanvas.getContext('2d')
    
	// Creating a 2D Canvas for particles
	var particlesCanvas = document.getElementById('particles');
    var partCTX = particlesCanvas.getContext('2d');
    */

    //-----------------------------------------------------------------------
    // Update EventHndlr
    //-----------------------------------------------------------------------

    // Create Frame EventHndlr
    g_frameUpdateEventHndlr = new EventHndlr();

    // Add HTML Callbacks
    g_frameUpdateEventHndlr.addCallback(function(){document.getElementById('score').innerHTML=mainGameObj.getScore();});
    g_frameUpdateEventHndlr.addCallback(function(){document.getElementById('lives').innerHTML=mainGameObj.getLives();});
    g_frameUpdateEventHndlr.addCallback(function(){document.getElementById('bacteria').innerHTML=mainGameObj.getBactRemaining();});

    // Temp
    g_frameUpdateEventHndlr.addCallback(function(){mainGameObj.update();});


    //-----------------------------------------------------------------------
    // Click EventHndlr
    //-----------------------------------------------------------------------

    // Create Click Event Handler 
    clickEventHndlr = new EventHndlr();

    // Define Game Location
    var gameDiv = document.getElementById("game");

    // Create Game Object
    mainGameObj = new Game(gameDiv,g_frameUpdateEventHndlr,clickEventHndlr);

    // Set Starting Values
    mainGameObj.setStartingBact(20);

    // Start Game
    mainGameObj.start();

    // Start UpdateEventHndlr
    //g_frameUpdateEventHndlr.running = true;
    window.requestAnimationFrame(g_frameUpdateInterupt);


    /*
    g_clickEventHndlr = new EventHndlr();

    mainGameObj.bactArr.forEach(tempBact => {
        g_frameUpdateEventHndlr.addCallback(tempBact.click);
    });
    */
    

//*
    let canvas = mainGameObj.getCanvas();
    mainGameObj.getCanvas().onmousedown = function (e, _canvas) {
        var scaleCood = [];
        scaleCood[1] = scaleInRange(e.clientY, 0, canvas.height, -1, 1);
        scaleCood[0] = scaleInRange((canvas.width - e.clientX), 0, canvas.width, -1, 1)

        // scaledY = scaleInRange(e.clientY, 0, canvas.height, -1, 1);
        // scaledX = scaleInRange((canvas.width - e.clientX), 0, canvas.width, -1, 1)

        //g_frameUpdateEventHndlr.handle(scaleCood)
        //g_clickEventHndlr(scaledX, scaledY);
        g_clickEventHndlr(scaleCood);
    };
    //*/

}

//-----------------------------------------------------
// Method: g_frameUpdateInterupt() 
// Descritption: Calls Frame Update Event Handler if it is runnning 
//-----------------------------------------------------

function g_frameUpdateInterupt() 
{
    // Is g_frameUpdateEventHndlr Running? 
    if(g_frameUpdateEventHndlr.running) g_frameUpdateEventHndlr.handle();

    window.requestAnimationFrame(g_frameUpdateInterupt);
} // End g_frameUpdateInterupt

//-----------------------------------------------------
// Method: g_clickEventInterupt() 
// Descritption: Calls Frame Update Event Handler if it is runnning 
//-----------------------------------------------------
//*
function g_clickEventHndlr(_x, _y) {
    var tempArr = mainGameObj.getBactArr()
    for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].clicked(_x, _y) == true) {
            mainGameObj.gainScore();
            mainGameObj.destroy(i)
        }
    }
}
//*/

//---------------------------------------------------------
// scaleInRange
//---------------------------------------------------------

function scaleInRange(_x, _minIn, _maxIn, _minOut, _maxOut) {
    return Math.round((((_maxIn - _minIn) / (_maxOut - _minOut)) - _x) * (_maxOut - _minOut) / (_maxIn - _minIn) * 100) / 100
}
 
//---------------------------------------------------------
// EventHndlr
//---------------------------------------------------------

class EventHndlr
{
    constructor(_listener)
    {
        this.callbacks = [];
        this.running = false;
    }
    addCallback(_callback)
    {
        // Adds callback to list 
        this.callbacks.push(_callback);

        // Ensures Event Handler is running
        this.running = true;
    }
    removeUpdateCallback(_callback)
    {
        // Loop through callback array
        for (let i = 0; i < this.callbacks.length; i++)
        {
            // was call back found?
            if(this.callbacks[i] == _callback) 
            {
                // Yes: Remove callback
                this.callbacks.splice(i,1);

                // Is callback array empty. Yes: stop running
                if (this.callbacks.length == 0) this.running = false;
            }
        }
    }
    handle(parameters)
    {
        // Loop through callback array and runs them with parameters
        for (let i = 0; i < this.callbacks.length; i++) 
            this.callbacks[i](parameters);
        
    }
}


