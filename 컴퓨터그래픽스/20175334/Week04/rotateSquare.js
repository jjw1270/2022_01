var gl;
var theta = 0;
var direction = true;
var stop = false;
var delay = 100;
var length = 1.0;
var lengthLoc;

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
            case 'Fast':
                delay *= 0.5;
                break;
            case 'Slow':
                delay *= 2.0;
                break;
            case 'Big':
                length *= 1.1;
                break;
            case 'Small':
                length *= 0.9;
                break;
        }
    };
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
    gl.clearColor(1.0, 1.0, 1.0, 1.0);    //����

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");   //�ΰ��� ���̴��� �о�鿩�� ������
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();  //���۸� ����
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);  //32��Ʈ float�� �ٲٴ� �Լ� flatten

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);   //2���� FLOAT 
    gl.enableVertexAttribArray(vPosition);   //vposition ��� �����̶�� ����
//�� 6�� �߿�!

    thetaLoc = gl.getUniformLocation(program, "theta");
    gl.uniform1f(thetaLoc, theta);

    render();  //�׷���
};

function render()
{
    setTimeout(function(){
        gl.clear(gl.COLOR_BUFFER_BIT);   //���� ���� ���� �ʱ�ȭ-->����clearColor�� �ʱ�ȭ

        theta += (stop ? 0 : (direction ? 0.1 : -0.1));
        gl.uniform1f(thetaLoc, theta);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);  //�׷���

        window.requestAnimationFrame(render);
    }, delay);    //delay �и������� �������� ������
}