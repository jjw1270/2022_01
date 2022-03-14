var gl;
var points;
var numPoints = 5000;

window.onload = function init() //처음 시작할 때 발생되는 이벤트
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    // Sierpinski Gasket
    generatePoints();

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);//flatten() : 어떤 구조체던지 32bit로 바꿔줌

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition); //enable을 해야지만 사용

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}

function generatePoints() {
    // Initialize the data for the Sierpinski Gasket
    // First, initialize the corners of a gasket with three points
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Specify a starting point p for iterations
    // p must lie inside any set of three vertices
    var u = add(vertices[0], vertices[1]);  //vertices0번과 1번을 더함.
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v));   // u/2 * v/2 해서 두 점의 중점을 구한다!

    // Add an initial point into the array of points
    points = [p];   //배열 초기화

    // Compute the new points
    // Each new point is located midway between last point and a randomly chosen vertex
    for (var i=0; points.length<numPoints; i++) {
        var j = Math.floor(Math.random() * 3);   //랜덤으로 꼭지점 3중 하나를 받아 버림함수로 정수받음.
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        points.push(p);
    }
}

function drawGasket(){
    numPoints = parseInt(document.getElementById("numPoints").value);  //text로 받은값을 정수형으로 변환

    if(numPoints > 0 && numPoints <= 50000) {
        generatePoints();

        gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);  //중요! 변경한 데이터를 버퍼에 저장. retain mode라서.

        render();
    }
    else{
        alert("점의 개수는 0보다 크고 50,000보다 작거나 같아야 한다.");
    }
}
