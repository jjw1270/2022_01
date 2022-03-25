var gl;
var theta = 0;
var direction = true;
var stop = false;
var delay = 100;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    // Initialize event handlers
    document.getElementById("directionButton").onclick = function() {
        direction = !direction;
    };
    document.getElementById("myMenu").onclick = function(event){
        switch(event.target.value){
            case '0':
                delay *= 0.5;
                break;
            case '1':
                delay *= 2.0;
                break;
        }
    };
    document.getElementById("speedSlider").onchange = function(event){
        delay = event.target.value;
    }

    document.getElementById("stopButton").onclick = function(event){
        stop = !stop;
        if(stop){
            event.target.innerText = "Start Rotation";
        }
    }

    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(0, -1),
        vec2(1, 0)
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);    //배경색

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");   //두개의 쉐이더를 읽어들여서 컴파일
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();  //버퍼를 생성
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);  //32비트 float로 바꾸는 함수 flatten

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);   //2차원 FLOAT 
    gl.enableVertexAttribArray(vPosition);   //vposition 사용 가능이라고 선언
//위 6줄 중요!

    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform1f(thetaLoc, theta);

    render();  //그려라
};

function render()
{
    setTimeout(function(){
        gl.clear(gl.COLOR_BUFFER_BIT);   //색상 관여 버퍼 초기화-->배경색clearColor로 초기화

        theta += (stop ? 0 : (direction ? 0.1 : -0.1));
        gl.uniform1f(thetaLoc, theta);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);  //그려라

        window.requestAnimationFrame(render);
    }, delay);
}