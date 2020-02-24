class Bact extends Circle {
    constructor(_gl,_disk,_startRadius,_fColor) 
    {
       
        var startRadius = 0.1;
        if(typeof _startRadius !== "undefined") 
        {
            startRadius = _startRadius;
        }


        var angle = Math.random() * Math.PI * 2;
        var x = _disk.r * Math.cos(angle);
        var y = _disk.r * Math.sin(angle);

        var color = [Math.random() * (0.65), Math.random() * (0.65), Math.random() * (0.65), 0.75];

        //this.startRadius = 0.1;

        super(_gl, x, y, startRadius,_fColor, color);

        this.maxRadius = 0.3;
        this.growRate = 0.0005;

        //this.gl = _gl;
        //this.fcolor = _color;

    }
    //-----------------------------------------------------
    // Method: setMaxRadius & getMaxRadius
    // Descritption: Get set methods the maxRadius
    //-----------------------------------------------------
    setStartRadius(__startR)
    {
        this.startRadius = _startR;
    } // End setStartRadius

    setMaxRadius(_maxR)
    {
        this.maxRadius = _maxR;
    } // End setMaxRadius

    getMaxRadius(){
        return this.maxRadius;
    } // End getMaxRadius

    //-----------------------------------------------------
    // Method: setMaxRadius & getMaxRadius
    // Descritption: Get set methods the maxRadius
    //-----------------------------------------------------

    setGrowRate(_growRate){
        this.growRate = _growRate;
    } // End setGrowRate

    getGrowRate(){
        return this.growRate;
    } // getGrowRate

    
    //-----------------------------------------------------
    // Method: draw
    // Descritption: Get set methods the maxRadius
    //-----------------------------------------------------

    draw()//draws the cicle with specific colour
    {
        //this.gl = _gl;
        //this.fColor = _fColor;

        // For storing the produces vertices
        var vertices = [];

        // Prepare vertices
        for (let i = 1; i <= 360; i++) {
            var y1 = this.r * Math.sin(i) + this.y;
            var x1 = this.r * Math.cos(i) + this.x;

            var y2 = this.r * Math.sin(i + 1) + this.y;
            var x2 = this.r * Math.cos(i + 1) + this.x;

            vertices.push(this.x);
            vertices.push(this.y);
            vertices.push(0);

            vertices.push(x1);
            vertices.push(y1);
            vertices.push(0);

            vertices.push(x2);
            vertices.push(y2);
            vertices.push(0);
        }

        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        // Pass color data to uniform fColor
        this.gl.uniform4f(this.fColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        // Drawing triangles
        this.gl.clearColor(0, 1, 0, 0.9);

        // Draw the triangle 360*3, 3 layers of vertices (disk)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 360 * 3);
    }

    update(_destroyMethod) {
        if (this.r < this.maxRadius) 
        {
            this.r = this.r + this.growRate;
            
        }

        this.draw(this.gl, this.fColor);
        
    }

    clicked(_cood)
    {
        var xDist = this.x - _cood[0];
        var yDist = this.y - _cood[1];

        var totalDist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if ((totalDist - this.r) < 0) {
            return true;
        }

        return false;
    }

    explode(_partArr)
    {
        //partArr = 
        // Convert Bacteria(WebGL) data into canvas data
		let bacX = (this.x + 2/75 + 1) * 300;
		let bacY = -1 * (this.y-1) * 300 - 8;
		let r = (((this.x + this.r) + 2/75 + 1) * 300) - bacX;
		let num = 0;
		let pColor = this.color;

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
					let particle = new Particle(ppX, ppY, 5, this.color);
					_partArr.push(particle);
					particle = new Particle(npX, npY, 5, this.color);
					_partArr.push(particle);
					particle = new Particle(ppX, npY, 5, this.color);
					_partArr.push(particle);
					particle = new Particle(npX, ppY, 5, this.color);
					_partArr.push(particle);

				}
				num++;
			}
		}
    }

    hasCollided(_bact)
    {

        var xDist = this.x - _bact.getX();
        var yDist = this.y - _bact.getY();
        var rad = this.r + _bact.getRadius();

        var totalDist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if ((totalDist - rad) < 0) {
            return true;
        }

        return false;
    }


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
}