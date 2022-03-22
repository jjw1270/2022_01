var gl;

window.onload = function init()  //처음에 한번만 실행
{
    var canvas = document.getElementById("gl-canvas"); 

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    var vertices = [    //2차원 벡터값
        vec2(-0.7, -1),  //왼발
        vec2(-0.3, -1), 
        vec2(-0.3, -0.8),
        vec2(-0.7, -0.8),
        
        vec2(0.3, -1),   //오른발
        vec2(0.7, -1),
        vec2(0.7, -0.8),
        vec2(0.3, -0.8),

        vec2(-0.4, -0.8),   //왼다리
        vec2(-0.4, -0.2),

        vec2(0.4, -0.8),    //오른다리
        vec2(0.4, -0.2),

        vec2(-0.8, -0.2),   //몸
        vec2(0.8, -0.2),
        vec2(0, 1),

        vec2(0, -0.6),        //몸
        vec2(0.8, 0.6),
        vec2(-0.8, 0.6),

        vec2(-0.3, 0.3),  //왼눈
        vec2(-0.2, 0.3), 
        vec2(-0.2, 0.4),
        vec2(-0.3, 0.4),

        vec2(0.3, 0.3),  //오른눈
        vec2(0.2, 0.3), 
        vec2(0.2, 0.4),
        vec2(0.3, 0.4),

        vec2(-0.2, 0.1),        //입
        vec2(0, 0),
        vec2(0.2, 0.1),

        vec2(-0.2, 0.1),        //입
        vec2(0, 0),
        vec2(0.2, 0.1),

        vec2(-0.8, -0.2),   //몸
        vec2(0.8, -0.2),
        vec2(0, 1),

        vec2(0, -0.6),        //몸
        vec2(0.8, 0.6),
        vec2(-0.8, 0.6)
    ];

    var colors = [
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(1, 1, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(1, 1, 0, 1),

        vec4(1, 1, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(1, 1, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(1, 0, 0, 1),
        vec4(1, 0, 0, 1),
        vec4(1, 0, 0, 1),

        vec4(1, 0, 1, 1),
        vec4(1, 0, 1, 1),
        vec4(1, 0, 1, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),

        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1),
        vec4(0, 0, 0, 1)
    ];

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);  //0,0부터 canvas.width, canvas.height까지 뷰포트 생성
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

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

    //Create a buffer object, initialize it and associate it with
    //the associated attribute variable in our vertex shader
    var cbufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);   //벡터값을 알아서 gpu메모리에 맏게 변환

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);   //TRIANGLE_FAN//첫 번째 점이 부채의 중심, 무조건 부채의 중심부터 시작, 1,2,3 --> 1,3,4 --> 1,..., TRIANGLES//3개씩 끝어서 삼각형을 만들어라, TRIANGLE_STRIP//1,2,3좌표로 삼각형 그린 후 2,3,4좌표로 다음 삼각형 그린다.  차이 무조건 시험
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);
    gl.drawArrays(gl.LINES, 8, 4);
    gl.drawArrays(gl.TRIANGLES, 12, 3);
    gl.drawArrays(gl.TRIANGLES, 15, 3);
    gl.drawArrays(gl.TRIANGLE_FAN, 18, 4);
    gl.drawArrays(gl.TRIANGLE_FAN, 22, 4);
    gl.drawArrays(gl.LINE_LOOP, 26, 3);
    gl.drawArrays(gl.TRIANGLES, 29, 3);
    gl.drawArrays(gl.LINE_LOOP, 32, 3);
    gl.drawArrays(gl.LINE_LOOP, 35, 3);
}
