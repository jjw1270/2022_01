var gl;

window.onload = function init()  //이벤트를 처리할 콜벡함수
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    var vertices = new Float32Array([-0.5, -0.5, 0, 0.5, 0.5, -0.5]);   //좌표 (-1,-1) (0,1) (1,-1)

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);   //화면의 비율 설정
    gl.clearColor(0.7, 0.3, 0.9, 1.0);     //배경색 설정 RGB + 투명도

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);  //vertices를 두개씩 끊어 읽어라
    gl.enableVertexAttribArray(vPosition);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);      //배경색 초기화
    gl.drawArrays(gl.TRIANGLES, 0, 3);  //삼각형 그리기
}
