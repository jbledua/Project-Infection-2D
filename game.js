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



        //obj.appendChild(node);

        //var x = document.createElement("CANVAS");
    //document.body.appendChild(x);
        //*/


        
        //this.canvas  = document.getElementById('gameSurface');
        

	    
	    //this.textCanvas = document.getElementById('text');
        //this.txtCTX = this.textCanvas.getContext('2d')
    
	    
	    //this.particlesCanvas = document.getElementById('particles');
	    //this.partCTX = this.particlesCanvas.getContext('2d');


        this.frameUpdateHndlr = _frameUpdateHndlr;
        this.clickEventHndlr = _clickEventHndlr;

        this.startingLives = 4;
        this.startingBact = 9;
        this.startingScore = 0;

        this.bactArr = [];
        this.partArr = [];

        this.running = false;

        /*
        <canvas id="gameSurface" width="600" height="600"></canvas>
        <canvas id="particles" width="600" height="600"></canvas>
        <canvas id="text" width="600" height="600"></canvas>
        //*/




        //Creating a WebGL Context Canvas
        //this.canvas = _canvas;
        //this.gl = _gl;

        //_canvas, _gl,_txtCTX,_partCTX

        // Creating a 2D Canvas for displaying text
        //this.txtCTX = _txtCTX;
       
        // Creating a 2D Canvas for particles
        //this.partCTX = _partCTX;

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

        //mainGameObj.update();

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
                if (this.collision(tempBact, this.bactArr[j])) {
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

        //this.disk.draw();
        //var x = function(){this.disk.draw();};

        
        //x();

        //g_frameUpdateEventHndlr.addCallback(this.disk.draw);



        g_frameUpdateEventHndlr.running = true;

        /*
        this.txtCTX.font = "40px Verdana";
        this.txtCTX.textAlign = "center";
        this.txtCTX.textBaseline = "middle";
        this.txtCTX.fillText("+", (this.canvas.width/2), (this.canvas.height/2));
        //*/

        //console.log(this.canvas.width + this.canvas.offsetLeft,this.canvas.height + this.canvas.offsetTop)
        //debugger
        //this.particle = new Particle(300, 300, 5, [0,1,0,0.5]);
        //this.particle.draw(this.partCTX);
        //debugger
        

        //this.createExplosionAtBacteria(this.bactArr[0]);

    }

    end()
    {

    }

    createExplosionAtBacteria(bac){
		// Convert Bacteria(WebGL) data into canvas data
		let bacX = (bac.x + 2/75 + 1) * 300;
		let bacY = -1 * (bac.y-1) * 300 - 8;
		let r = (((bac.x + bac.r) + 2/75 + 1) * 300) - bacX;
		let num = 0;
		let pColor = bac.color;

        var reduceVariable = 90;

		// Loops through the bacteria's x and y and spawn particles there
		for(let x = 0; x < r; x++){
			for(let y = 0; y < r; y++){
				//Helps decrease amount of particles
				if(num % reduceVariable == 0) {

					let ppX = bacX + x;
					let ppY = bacY + y;
					let npX = bacX - x;
					let npY = bacY - y;

					// Create a corresponding particle for each "quandrant" of the bacteria
					let particle = new Particle(ppX, ppY, 5, bac.color);
					this.partArr.push(particle);
					particle = new Particle(npX, npY, 5, bac.color);
					this.partArr.push(particle);
					particle = new Particle(ppX, npY, 5, bac.color);
					this.partArr.push(particle);
					particle = new Particle(npX, ppY, 5, bac.color);
					this.partArr.push(particle);

				}
				num++;
			}
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

        /*
        // Update Bacteria
        for (let i = 0; i < this.bactArr.length; i++) 
        {
            var fnPtr = function(){alert("hello");}
            //this.bactArr[i].update(function(){alert("hello");})
        }
        */

        //function destroyCal

        //*
        this.bactArr.forEach(tempBact => {
            tempBact.update()
        });
        //*/

        // Update disk
        this.disk.draw(this.gl, this.fColor);
 
        if (this.running) 
        //if (false) 
        {
            // --------------------checking for collision and collide
            for (let i = 0; i < this.bactArr.length; i++) {

                //check threshold, destroy bacteria
                if (this.bactArr[i].getRadius() > 0.3) {
                    // if (!this.lose()) {
                    //this.loseScore();
                    //this.loseLive();
                    this.destroy(i);
                    // }
                }
                else {
                    //check collision
                    for (let j = 0; j < i; j++) {
                        if (this.bactArr[i] != this.bactArr[j]) {
                            if (this.collision(this.bactArr[i], this.bactArr[j])) {
                                //if there is collision, larger one consume it
                                if (this.bactArr[i].getRadius() >= this.bactArr[j].getRadius()) {
                                    this.bactArr[i].setRadius(this.bactArr[i].getRadius() + 0.01);
                                    this.loseScore();
                                    this.destroy(j);
                                    break;
                                }
                                else {
                                    this.bactArr[j].setRadius(this.bactArr[j].getRadius() + 0.01);
                                    this.loseScore();
                                    this.destroy(i);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            /*
            if (this.lose()) {
                this.running = false;
            }
            
            if (this.win()) {
                this.running = false;
            }
            */
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

        this.createExplosionAtBacteria(this.bactArr[index]);
        // Remove destroyed bacteria from the bacteria array
        this.bactArr.splice(index, 1);
    }

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

    //-----------------------------------------------------
    // Method: loseLive() 
    // Descritption: Decrease live
    //-----------------------------------------------------
    loseLive() {
        if (this.lives > 0) {
            this.lives--;
            //document.getElementById("live").innerHTML = this.lives;
        }
    }

    //-----------------------------------------------------
    // Method: loseScore() 
    // Descritption: Deduct three points from the score
    //-----------------------------------------------------
    loseScore() {
        if (this.score > 3) {
            this.score -= 3;
            //document.getElementById("score").innerHTML = this.score;
        }
    }

    //-----------------------------------------------------
    // Method: gainScore() 
    // Descritption: Add three points from the score
    //-----------------------------------------------------
    gainScore() {
        this.score += 100;
        //document.getElementById("score").innerHTML = this.score;
    }


    /*
    //-----------------------------------------------------
    // Method: win() 
    // Descritption: Checking if the user win the game
    //-----------------------------------------------------
    win() {
        if (this.bactArr.length == 0 && this.lives >= 1) {
            // debugger;
            //alert("YOU WIN!");
            
            this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);


            this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.txtCTX.fillStyle = "rgba(0, 255, 0, 1.0)";
            this.txtCTX.font = "80px Verdana";
            this.txtCTX.textAlign = "center";
            this.txtCTX.textBaseline = "middle";
            this.txtCTX.fillText("You win!", (this.canvas.width/2), (this.canvas.height/2));

			//this.txtCTX.fillText("You win!", 300, 300);

            

			//this.txtCTX.font = "80px Verdana";
            //this.txtCTX.fillText("Game over", 300, 300);

            //this.txtCTX.font = "40px Verdana";
            //this.txtCTX.textAlign = "center";
            //this.txtCTX.textBaseline = "middle";
			///this.txtCTX.fillText("+", 300, 300);

            return true;
        }
        return false;
    }

    //-----------------------------------------------------
    // Method: lose() 
    // Descritption: Checking if the user lose the game
    //-----------------------------------------------------
    lose() {
        if (this.lives == 0) {
            for (let i = 0; i < this.bactArr.length; i++) {
                this.destroy(i);
            }
            this.txtCTX.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.txtCTX.font = "80px Verdana";
			this.txtCTX.fillStyle = "red";
			this.txtCTX.fillText("Game over", 300, 300);
			this.txtCTX.font = "40px Verdana";
			this.txtCTX.fillText("You lose...", 310, 355);

            //alert("YOU LOSE!");
            //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//this.ctx.font = "80px Verdana";
			//this.ctx.fillStyle = "red";
			//this.ctx.fillText("Game over", 300, 300);
            return true;
        }
        return false;
    }
    //*/
}