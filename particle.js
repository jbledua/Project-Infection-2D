class Particle {

    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r + Math.random() * 5;
        // Convert 1.0, 1.0, 1.0 rgb data to 255, 255, 255
        this.color = "rgba(" + Math.round((1*color[0]) * 255) + "," + Math.round((1*color[1]) * 255) + "," + Math.round((1*color[2]) * 255) + "," + Math.random()*0.85 + ")";
        this.speed = {
            x: -1 + Math.random() * 3,
            y: -1 + Math.random() * 3
        }
        this.life = 30 + Math.random() * 10;
        // Will be used to clean out particle array at certain times.
        //this.deltaStart = Date.now();
    }

    draw(_pCtx) {
        this.pCtx = _pCtx;

        // Draw if it hasn't reached it's lifespan or if its not too small
        if(this.life > 0 && this.r > 0) {
            this.pCtx.beginPath();
            this.pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.pCtx.fillStyle = this.color;
            this.pCtx.fill();

            // Update data
            this.life--;
            this.r -= 0.25;
            this.x += this.speed.x;
            this.y += this.speed.y;
        }
    }
} // End of Particle Class