var gl;

window.onload = function init()  //처음에 한번만 실행
{
    var canvas = document.getElementById("gl-canvas"); 

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    var vertices = [    //2차원 벡터값
        vec2(-0.5, -0.5),
        vec2(-0.5, 0.5),
        vec2(0.5, 0.5),
        vec2(0.5, -0.5),
        vec2(0,-1)
    ];   //vertices.length == 4

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);  //0,0부터 canvas.width, canvas.height까지 뷰포트 생성
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);   //벡터값을 알아서 gpu메모리에 맏게 변환

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, 5);   //TRIANGLE_FAN//첫 번째 점이 부채의 중심, 무조건 부채의 중심부터 시작, 1,2,3 --> 1,3,4 --> 1,..., TRIANGLES//3개씩 끝어서 삼각형을 만들어라, TRIANGLE_STRIP//1,2,3좌표로 삼각형 그린 후 2,3,4좌표로 다음 삼각형 그린다.  차이 무조건 시험
}
