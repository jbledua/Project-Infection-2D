class Circle
{
    constructor(gl,x, y, r,fColor, color){
        this.gl = gl;
        this.x = x;
        this.y = y;
        this.r = r;
        this.fColor = fColor;
		this.color = color;
    }

    setColor(r, g, b, a){
        this.color[0]=r;
        this.color[1]=g;
        this.color[2]=b;
        this.color[3]=a;
    }

    setCoordinate(x, y){
        this.x = x;
        this.y = y;
    }

    setRadius(r){
        this.r = r;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getRadius(){
        return this.r;
    }

    getColor(){
        return this.color;
    }
}
