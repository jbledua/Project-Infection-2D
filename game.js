class Game {
    //-----------------------------------------------------
    // Method: constructor() 
    // Descritption: Init the game enviromend 
    //-----------------------------------------------------
    constructor(_gameDIV, _frameUpdateHndlr,_clickEventHndlr) 
    {

        // Creating a WebGL Context Canvas
        this.canvas  = document.createElement("CANVAS");
        this.canvas .setAttribute("id","gameSurface");
        this.canvas .setAttribute("height","600");
        this.canvas .setAttribute("width","600");
        _gameDIV.appendChild(this.canvas);

        this.gl = this.canvas.getContext('webgl');

        // Creating a 2D Canvas for displaying text
        this.textCanvas = document.createElement("CANVAS");
        this.textCanvas.setAttribute("id","text");
        this.textCanvas.setAttribute("height","600");
        this.textCanvas.setAttribute("width","600");
        _gameDIV.appendChild(this.textCanvas);

        this.txtCTX = this.textCanvas.getContext('2d')

        // Creating a 2D Canvas for particles
        this.particlesCanvas = document.createElement("CANVAS");
        this.particlesCanvas.setAttribute("id","particles");
        this.particlesCanvas.setAttribute("height","600");
        this.particlesCanvas.setAttribute("width","600");
        _gameDIV.appendChild(this.particlesCanvas);

        this.partCTX = this.particlesCanvas.getContext('2d');



        this.frameUpdateHndlr = _frameUpdateHndlr;
        this.clickEventHndlr = _clickEventHndlr;

        // Difine starting 
        this.startingLives = 4;
        this.startingBact = 9;
        this.startingScore = 0;

        this.bactArr = [];
        this.partArr = [];

        this.running = false;

        // Vertex and fragement shader source
        var vertCode = [
            'attribute vec3 coordinates;',
            '',
            'void main() {',
            '	gl_Position = vec4(coordinates, 1.0);',
            '}'
        ].join('\n');

        var fragCode = [
            'precision mediump float;',
            'uniform vec4 fColor;',
            '',
            'void main()',
            '{',
            ' gl_FragColor = fColor;',
            '}'
        ].join('\n');

        // Create an empty buffer object
        var vertex_buffer = this.gl.createBuffer();

        // Set the view port
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);

        // Enable the depth test
        this.gl.enable(this.gl.DEPTH_TEST);

        // Create vertex and fragment shader objects
        var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        // Shaders
        // Attach vertex shader source code and compile
        this.gl.shaderSource(vertShader, vertCode);
        this.gl.compileShader(vertShader);

        // Attach fragment shader source code and compile
        this.gl.shaderSource(fragShader, fragCode);
        this.gl.compileShader(fragShader);

        // Create shader program
        var shaderProgram = this.gl.createProgram();

        // Attach the vertex and fragment shader
        this.gl.attachShader(shaderProgram, vertShader);
        this.gl.attachShader(shaderProgram, fragShader);

        // Link and use
        this.gl.linkProgram(shaderProgram);
        this.gl.useProgram(shaderProgram);

        // Get the attribute and uniform location
        var coord = this.gl.getAttribLocation(shaderProgram, "coordinates");
        this.fColor = this.gl.getUniformLocation(shaderProgram, "fColor");

        // Point an attribute to the currently bound VBO and enable the attribute
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(coord);

    }

    //-----------------------------------------------------
    // Method: getBactArr() 
    // Descritption: Return bactArr 
    //-----------------------------------------------------
    getCanvas() 
    {
        return this.canvas;
    }

    //-----------------------------------------------------
    // Method: getBactArr() 
    // Descritption: Return bactArr 
    //-----------------------------------------------------
    getBactArr() 
    {
        return this.bactArr;
    }

    //-----------------------------------------------------
    // Method: getBactArr() 
    // Descritption: Return bactArr 
    //-----------------------------------------------------
    getBactRemaining() 
    {
        return this.bactArr.length;
    } // End getBactRemaining()

    //-----------------------------------------------------
    // Method: getBactArr() 
    // Descritption: Return bactArr 
    //-----------------------------------------------------
    setStartingBact(_startingBact) 
    {
        this.startingBact = _startingBact;
    } // End setStartingBact()

    //-----------------------------------------------------
    // Method: getBactArr() 
    // Descritption: Return Lives 
    //-----------------------------------------------------
    getLives() 
    {
        return this.lives;
    } // End getLives()

    //-----------------------------------------------------
    // Method: getScore() 
    // Descritption: Return score 
    //-----------------------------------------------------
    getScore() 
    {
        return this.score;
    } // End getScore()

    //-----------------------------------------------------
    // Method: isRunning() 
    // Descritption: Returns true or false if game running 
    //-----------------------------------------------------
    isRunning()
    {
        return this.running;
    }

    //-----------------------------------------------------
    // Method: start() 
    // Descritption: Start the game
    //-----------------------------------------------------
    start()
    {

        this.running = true;

        this.lives = this.startingLives;
        this.score = this.startingScore;

        // Use default disk position and colour
        this.disk = new Disk(this.gl,0,0,0.8, this.fColor,[0.1, 0.1, 0.1, 0.5]);

        var tempBact = new Bact(this.gl,this.disk,0.01, this.fColor)
        this.bactArr.push(tempBact);

        // Creating bact array
        for (let i = 0; i < this.startingBact;) {
            var collFlag = false;
            tempBact = new Bact(this.gl,this.disk, 0.01, this.fColor);
            //tempBact.r = 0.05; 
            // check if coll
            for (let j = 0; j <= i; j++) {
                //if (this.collision(tempBact, this.bactArr[j])) 
                if(tempBact.hasCollided(this.bactArr[j]))
                {
                    collFlag = true;
                    break;
                }
            }

            if (collFlag == false) {
                this.bactArr.push(tempBact);
                i++;
            }
        }

        for (let i = 0; i < this.bactArr.length; i++) {
            this.bactArr[i].draw();
        }
        this.disk.draw();

        // Start Frame Event Handler
        g_frameUpdateEventHndlr.running = true;

    }

    //-----------------------------------------------------
    // Method: end() 
    // Descritption: Ends the game
    //-----------------------------------------------------
    end()
    {
        // Check If game is running
        if(this.running){

            if(this.isWin())
            {   
                // Display win massage
                this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.txtCTX.fillStyle = "rgba(0, 255, 0, 1.0)";
                this.txtCTX.font = "80px Verdana";
                this.txtCTX.textAlign = "center";
                this.txtCTX.textBaseline = "middle";
                this.txtCTX.fillText("You win!", (this.canvas.width/2), (this.canvas.height/2));
                
            }
            else
            {
                // Empty Bact array
                for (let i = 0; i < this.bactArr.length; i++) {
                    this.destroy(i);
                }

                 // Display win massage
                this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.txtCTX.textAlign = "center";
                this.txtCTX.textBaseline = "middle";
                this.txtCTX.font = "80px Verdana";
                this.txtCTX.fillStyle = "red";
                this.txtCTX.fillText("Game over",(this.canvas.width/2), (this.canvas.height/2));
                this.txtCTX.font = "40px Verdana";
                this.txtCTX.fillText("You lose...",(this.canvas.width/2), (this.canvas.height/2)+50);
            }

            // Reset Running flag
            this.running = false;           
        }    
        
    }

    //-----------------------------------------------------
    // Method: update() 
    // Descritption: Update each of the bacteria
    //-----------------------------------------------------
    update() 
    {
        // Update Particles
        this.partCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.partArr.forEach(element => {
                element.draw(this.partCTX);
            });

       
        this.bactArr.forEach(tempBact => {
            tempBact.update()
        });

        // Update disk
        this.disk.draw(this.gl, this.fColor);
 
        if (this.running) 
        //if (false) 
        {
            // --------------------checking for collision and collide
            for (let i = 0; i < this.bactArr.length; i++) {

                //check threshold, destroy bacteria
                if (this.bactArr[i].getRadius() > 0.3) {
                    this.loseScore();
                    this.loseLive();
                    this.destroy(i);
                }
                else {
                    //check collision
                    for (let j = 0; j < i; j++) {
                        if (this.bactArr[i] != this.bactArr[j]) {
                            //if (this.collision(this.bactArr[i], this.bactArr[j]))
                            if (this.bactArr[i].hasCollided(this.bactArr[j]))
                            {
                                //if there is collision, larger one consume it
                                if (this.bactArr[i].getRadius() >= this.bactArr[j].getRadius()) {
                                    this.bactArr[i].setRadius(this.bactArr[i].getRadius() + 0.01);
                                    //this.loseScore();
                                    this.bactArr.splice(j,1);
                                    //this.destroy(j);
                                    break;
                                }
                                else {
                                    this.bactArr[j].setRadius(this.bactArr[j].getRadius() + 0.01);
                                    //this.loseScore();
                                    //this.destroy(i);
                                    this.bactArr.splice(i,1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }


            if (this.isWin()) this.end()
            
            if (this.isLose())  this.end();

        }

		//document.getElementById('bacRemaining').innerHTML=bacRemaining;
		
    }

    //-----------------------------------------------------
    // Method: destroy() 
    // Descritption: Destroy the bacteria by its index
    //-----------------------------------------------------
    destroy(index) {
        this.r = 0;
        this.x = 0;
        this.y = 0;
        this.alive = false;

        this.bactArr[index].explode(this.partArr);
        this.bactArr.splice(index, 1);
    }
    /*
    //-----------------------------------------------------
    // Method: destroy() 
    // Descritption: Destroy the bacteria by its index
    //-----------------------------------------------------

    collision(bact1, bact2) {
        var xDist = bact2.getX() - bact1.getX();
        var yDist = bact2.getY() - bact1.getY();
        var rad = bact1.getRadius() + bact2.getRadius();
    
        var totalDist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    
        if ((totalDist - rad) < 0) {
            return true;
        }
    
        return false;
    }
    //*/

    //-----------------------------------------------------
    // Method: loseLive() 
    // Descritption: Decrease live
    //-----------------------------------------------------
    loseLive() {
        if (this.lives > 0) {
            this.lives--;
        }
    }

    //-----------------------------------------------------
    // Method: loseScore() 
    // Descritption: Deduct three points from the score
    //-----------------------------------------------------
    loseScore() {
        if (this.score > 3) {
            this.score -= 3;
        }
    }

    //-----------------------------------------------------
    // Method: gainScore() 
    // Descritption: Add three points from the score
    //-----------------------------------------------------
    gainScore() {
        this.score += 100;
    }
    //-----------------------------------------------------
    // Method: isWin() 
    // Descritption: Checking if the user win the game
    //-----------------------------------------------------

    isWin()
    {
        return (this.bactArr.length == 0 && this.lives >= 1)
    } // isWin()

    //-----------------------------------------------------
    // Method: lose() 
    // Descritption: Checking if the user lose the game
    //-----------------------------------------------------

    isLose()
    {    
        return (this.lives == 0)
    } // End isLose()
}