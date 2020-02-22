class Bact extends Circle {
    constructor(_disk) {
        var angle = Math.random() * Math.PI * 2;
        var x = _disk.r * Math.cos(angle);
        var y = _disk.r * Math.sin(angle);

        var color = [Math.random() * (0.65), Math.random() * (0.65), Math.random() * (0.65), 0.75];

        super(x, y, 0.1, color);

        this.maxRadius = 0.3;
        this.growRate = 0.0005;
    }

    setMaxRadius(x){
        this.maxRadius = x;
    }

    setGrowRate(x){
        this.growRate = x;
    }

    getMaxRadius(){
        return this.maxRadius;
    }

    getGrowRate(){
        return this.growRate;
    }

    // Moved from circle class
    draw(_gl,_fColor)//draws the cicle with specific colour
    {
        this.gl = _gl;
        this.fColor = _fColor;

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

    update() {
        if (this.r < this.maxRadius) {
            this.r = this.r + this.growRate;
        }

        this.draw(this.gl, this.fColor);
    }

    clicked(_x,_y)
    {
        var xDist = this.x - _x;
        var yDist = this.y - _y;

        var totalDist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if ((totalDist - this.r) < 0) {
            return true;
        }

        return false;
    }
}