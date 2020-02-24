class Disk extends Circle
{
  constructor(_gl, _x, _y, _r,_fColor ,_color)
  {
    // Set Defaults
    if(typeof _x == "undefined") _x = 0
    if(typeof _y == "undefined") _y = 0
    if(typeof _r == "undefined") _r = 0.8
    if(typeof _color == "undefined") _color = [0.1, 0.1, 0.1, 0.5]
    super(_gl, _x, _y, _r,_fColor ,_color);
  }

  // Moved from circle class
  draw()
  {
      //this.gl = _gl;
      //this.fColor = _fColor;

    // For storing the produces vertices
    var vertices = [];

    // Prepare vertices
    for (let i = 1; i <= 360; i++) 
    {
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
}