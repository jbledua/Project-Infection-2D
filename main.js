let mainGameObj;
let g_frameUpdateEventHndlr;

function _init() 
{

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

    // Start
    window.requestAnimationFrame(g_frameUpdateInterupt);

    let canvas = mainGameObj.getCanvas();
    canvas.onmousedown = function (e, _canvas) {

        var scale = [[0,canvas.width,-1,1], [0, canvas.height,-1,1]];
        var cursorCood = [(canvas.width - e.clientX),e.clientY];
        var scaleCood = transform1(cursorCood,scale)

        //console.log(scaleCood);
        g_clickEventHndlr(scaleCood);
    };

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
// scaleInRange
//---------------------------------------------------------

function transform(_in, _scale1,_scale2) {
    var out = []
    /*
    for (let index = 0; index < _in.length; index++) {
        out[index] =  Math.round((((_maxIn - _minIn) / (_maxOut - _minOut)) - _in[index]) * (_maxOut - _minOut) / (_maxIn - _minIn) * 100) / 100
        
    }
    //*/

    out[0] =  Math.round((((_scale1[1] - _scale1[0]) / (_scale1[3] - _scale1[2])) - _in[0]) * (_scale1[3] - _scale1[2]) / (_scale1[1] - _scale1[0]) * 100) / 100

    out[1] =  Math.round((((_scale2[1] - _scale2[0]) / (_scale2[3] - _scale2[2])) - _in[1]) * (_scale2[3] - _scale2[2]) / (_scale2[1] - _scale2[0]) * 100) / 100

    //out[1] =  Math.round((((_maxIn - _minIn) / (_maxOut - _minOut)) - _in[1]) * (_maxOut - _minOut) / (_maxIn - _minIn) * 100) / 100
    return out;
}

//---------------------------------------------------------
// scaleInRange
//---------------------------------------------------------

function transform1(_in, _scale) {
    var out = []
    for (let i = 0; i < _in.length; i++) 
        out[i] =  Math.round((((_scale[i][1] - _scale[i][0]) / (_scale[i][3] - _scale[i][2])) - _in[i]) * (_scale[i][3] - _scale[i][2]) / (_scale[i][1] - _scale[i][0]) * 100) / 100     
    
   
    return out;
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


