var gl;
var points = [];
var colors = [];

var axis = 0;
var theta = [0, 0, 0];
var thetaLoc;    //uniform으로 보내기위해
var disp1 = [0,0,0];
var disp1loc;

var rotation = false;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateColorCube();
    generateHexaPyramid();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    //enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);   //4차원 FLOAT로 보냄
    gl.enableVertexAttribArray(vPosition);

    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");
    //gl.uniform3fv(thetaLoc, theta);
    disp1loc = gl.getUniformLocation(program, "disp1");
    //gl.uniform3fv(disp1Loc, disp1)p;

    // Event listeners for buttons
    document.getElementById("xButton").onclick = function () {
        axis = 0;
    };
    document.getElementById("yButton").onclick = function () {
        axis = 1;
    };
    document.getElementById("zButton").onclick = function () {
        axis = 2;
    };
    document.getElementById("toggleButton").onclick = function () {
        rotation = !rotation;
    };

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);         /////

    if( rotation ) {
        theta[axis] += 2.0;
    }
    gl.uniform3fv(thetaLoc, theta)

    //gl.drawArrays(gl.LINES, 0, 6);
    disp1[1] = -0.5;
    gl.uniform3fv(disp1loc, disp1);
    gl.drawArrays(gl.TRIANGLES, 0, 36);    //위에서 line6개 그렸음으로 6부터 시작

    disp1[1] = -0.5;
    gl.uniform3fv(disp1loc, disp1);
    gl.drawArrays(gl.TRIANGLES, 36, 36);    //위에서 line6개 그렸음으로 6부터 시작

    window.requestAnimationFrame(render);
}

function generateColorCube() {
    quad(1, 0, 3, 2);       //6면체 면 중 한 면
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);
}

function quad(a, b, c, d) {
    vertexPos = [
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0)
    ];

    vertexColor = [
        vec4(0.0, 0.0, 0.0, 1.0),   // black
        vec4(1.0, 0.0, 0.0, 1.0),   // red
        vec4(1.0, 1.0, 0.0, 1.0),   // yellow
        vec4(0.0, 1.0, 0.0, 1.0),   // green
        vec4(0.0, 0.0, 1.0, 1.0),   // blue
        vec4(1.0, 0.0, 1.0, 1.0),   // magenta
        vec4(0.5, 0.5, 0.5, 1.0),   // gray
        vec4(0.0, 1.0, 1.0, 1.0)    // cyan
    ];

    // We need to partition the quad into two triangles in order for WebGL
    // to be able to render it. In this case, we create two triangles from
    // the quad indices. 
    var index = [ a, b, c, a, c, d ];
    for(var i=0; i<index.length; i++) {
        points.push(vertexPos[index[i]]);
        //colors.push(vertexColor[a]);
        colors.push(vertexColor[index[i]]);
    }
}

function generateHexaPyramid() {
    vertexPos = [
        vec4( 0.0, 0.5, 0.0, 1.0),
        vec4( 1.0, 0.5, 0.0, 1.0),
        vec4( 0.5, 0.5, -0.866, 1.0),
        vec4(-0.5, 0.5, -0.866, 1.0),
        vec4(-1.0, 0.5, 0.0, 1.0),
        vec4(-0.5, 0.5, 0.866, 1.0),
        vec4( 0.5,  0.5, 0.866, 1.0),
        vec4( 0.0, -1.0, 0.0, 1.0)
    ];

    vertexColor = [
        vec4(0.5, 0.5, 0.5, 1.0),   // gray
        vec4(1.0, 0.0, 0.0, 1.0),   // red
        vec4(1.0, 1.0, 0.0, 1.0),   // yellow
        vec4(0.0, 1.0, 0.0, 1.0),   // green
        vec4(0.0, 1.0, 1.0, 1.0),    // cyan
        vec4(0.0, 0.0, 1.0, 1.0),   // blue
        vec4(1.0, 0.0, 1.0, 1.0),   // magenta
        vec4(0.0, 0.0, 0.0, 1.0)   // black
    ];

for(var i = 1; i<6; i++){
    points.push(vertexPos[0]);
    colors.push(vertexColor[0]);
    points.push(vertexPos[i]);
    colors.push(vertexColor[i]);
    points.push(vertexPos[i+1]);
    colors.push(vertexColor[i+1]);
}
points.push(vertexPos[0]);
colors.push(vertexColor[0]);
points.push(vertexPos[6]);
colors.push(vertexColor[6]);
points.push(vertexPos[1]);
colors.push(vertexColor[1]);
for(var i = 1; i<6; i++){
    points.push(vertexPos[7]);
    colors.push(vertexColor[7]);
    points.push(vertexPos[i+1]);
    colors.push(vertexColor[i+1]);
    points.push(vertexPos[i]);
    colors.push(vertexColor[i]);
}
points.push(vertexPos[7]);
colors.push(vertexColor[7]);
points.push(vertexPos[1]);
colors.push(vertexColor[1]);
points.push(vertexPos[6]);
colors.push(vertexColor[6]);

}
