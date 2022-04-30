var gl;
var points = [];
var colors = [];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye = vec3(2.0, 2.0, 2.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var cameraVec = vec3(-0.57735, -0.57737, -0.57735); // 0.57735 == 1/루트3

var trballMatrix = mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if( !gl ) {
        alert("WebGL isn't available!");
    }

    generateColorCube();
    generateGround();

    // virtual trackball
    var trball = trackball(canvas.width, canvas.height);
    var mouseDown = false;

    canvas.addEventListener("mousedown", function(event) {
        trball.start(event.clientX, event.clientY);

        mouseDown = true;
    });

    canvas.addEventListener("mouseup", function(event) {
        mouseDown = false;
    });

    canvas.addEventListener("mousemove", function(event) {
        if (mouseDown) {
            trball.end(event.clientX, event.clientY);

            trballMatrix = mat4(trball.rotationMatrix);
        }
    });

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);

    // Enable hidden-surface removal
    gl.enable(gl.DEPTH_TEST);   //시험 나옴

    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(0.01, 1);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Create a buffer object, initialize it, and associate it with 
    // the associated attribute variable in our vertex shader
    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    modelViewMatrix = lookAt(eye, at, up);
    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    
    //3D orthographic viewing
    //projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
    var viewLength = 2.0;   //보이는공간 설정. 커질수록 보이는공간이 넓어져 오브젝트가 작아보인다@@@
    if(canvas.width > canvas.height){  //landscape view
        var aspectRatio = viewLength * canvas.width / canvas.height;   //보이는 영역을 ortho로 비율을 맞춰서 잘라낸다
        projectionMatrix = ortho(-aspectRatio, aspectRatio, -viewLength, viewLength, -viewLength, 1000);  //left, right, bottom, top, near, far //오른손좌표계!
    }
    else { //portrait view
        var aspectRatio = viewLength * canvas.height / canvas.width;
        projectionMatrix = ortho(-viewLength, viewLength, -aspectRatio, aspectRatio, -viewLength, 1000);
    }
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    
    // Event listeners for buttons
    var sinTheta = Math.sin(0.1);
    var cosTheta = Math.cos(0.1);
    document.getElementById("left").onclick = function () {
        var newVecX = cosTheta*cameraVec[0] + sinTheta*cameraVec[2];
        var newVecZ = -sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
        cameraVec[0] = newVecX;
        cameraVec[2] = newVecZ;  
    };
    document.getElementById("right").onclick = function () {
        var newVecX = cosTheta*cameraVec[0] - sinTheta*cameraVec[2];
        var newVecZ = sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
        cameraVec[0] = newVecX;
        cameraVec[2] = newVecZ;
    };
    document.getElementById("up").onclick = function () {
        var newPosX = eye[0] + 0.5 * cameraVec[0];
        var newPosZ = eye[2] + 0.5 * cameraVec[2];
        if(newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10) {
            eye[0] = newPosX;
            eye[2] = newPosZ;
        }
    };
    document.getElementById("down").onclick = function () {
        var newPosX = eye[0] - 0.5 * cameraVec[0];
        var newPosZ = eye[2] - 0.5 * cameraVec[2];
        if(newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10) {
            eye[0] = newPosX;
            eye[2] = newPosZ;
        }
    };
    render();

    document.getElementById("change").onclick = function () {
        if(document.getElementById("ortho").checked) {
            //3D orthographic viewing
            //projectionMatrix = ortho(-1, 1, -1, 1, -1, 1);
            var viewLength = 2.0;   //보이는공간 설정. 커질수록 보이는공간이 넓어져 오브젝트가 작아보인다@@@
            if(canvas.width > canvas.height){  //landscape view
                var aspectRatio = viewLength * canvas.width / canvas.height;   //보이는 영역을 ortho로 비율을 맞춰서 잘라낸다
                projectionMatrix = ortho(-aspectRatio, aspectRatio, -viewLength, viewLength, -viewLength, 1000);  //left, right, bottom, top, near, far //오른손좌표계!
            }
            else { //portrait view
                var aspectRatio = viewLength * canvas.height / canvas.width;
                projectionMatrix = ortho(-viewLength, viewLength, -aspectRatio, aspectRatio, -viewLength, 1000);
            }
        }
        else{
            //3D perspective viewing
            var aspectRatio = canvas.width / canvas.height;
            projectionMatrix = perspective(90, aspectRatio, 0.1, 1000);//(세로 시야각, 가로시야각, near, far) //세로 시야각의 값이 커지면 오브젝트가 작아보인다@@@
            //원근투영은 절대로 음수가 들어갈 수 없다
        }
        projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        render();
    };
};

window.onkeydown = function(event) {
    var sinTheta = Math.sin(0.1);
    var cosTheta = Math.cos(0.1);
    switch (event.keyCode) {
        case 37:  //왼쪽화살표
            var newVecX = cosTheta*cameraVec[0] + sinTheta*cameraVec[2];
            var newVecZ = -sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case 39:   //오른쪽 화살표
            var newVecX = cosTheta*cameraVec[0] - sinTheta*cameraVec[2];
            var newVecZ = sinTheta*cameraVec[0] + cosTheta*cameraVec[2];
            cameraVec[0] = newVecX;
            cameraVec[2] = newVecZ;
            break;
        case 38:   //위 화살표
            var newPosX = eye[0] + 0.5 * cameraVec[0];
            var newPosZ = eye[2] + 0.5 * cameraVec[2];
            if(newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10) {
                eye[0] = newPosX;
                eye[2] = newPosZ;
            }
            break;
        case 40:    //아래 화살표
            var newPosX = eye[0] - 0.5 * cameraVec[0];
            var newPosZ = eye[2] - 0.5 * cameraVec[2];
            if(newPosX > -10 && newPosX < 10 && newPosZ > -10 && newPosZ < 10) {
                eye[0] = newPosX;
                eye[2] = newPosZ;
            }
            break;
    }
    render();    
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    at[0] = eye[0] + cameraVec[0];
    at[1] = eye[1] + cameraVec[1];
    at[2] = eye[2] + cameraVec[2];
    

    modelViewMatrix = lookAt(eye, at, up);
    var modelView = mult(modelViewMatrix, trballMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView));

    //draw a color cube
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    //draw a ground
    gl.drawArrays(gl.TRIANGLES, 36, 6);
    gl.drawArrays(gl.LINES, 42, 84);   //(21 + 21) * 2 = 84

    requestAnimationFrame(render);
}

function generateColorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);
}

const vertexPos = [
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4( 0.5, -0.5, -0.5, 1.0),
    vec4( 0.5,  0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4( 0.5, -0.5,  0.5, 1.0),
    vec4( 0.5,  0.5,  0.5, 1.0),
    vec4(-0.5,  0.5,  0.5, 1.0)
];

const vertexColor = [
    vec4(0.0, 0.0, 0.0, 1.0),   // black
    vec4(1.0, 0.0, 0.0, 1.0),   // red
    vec4(1.0, 1.0, 0.0, 1.0),   // yellow
    vec4(0.0, 1.0, 0.0, 1.0),   // green
    vec4(0.0, 0.0, 1.0, 1.0),   // blue
    vec4(1.0, 0.0, 1.0, 1.0),   // magenta
    vec4(1.0, 1.0, 1.0, 1.0),   // white
    vec4(0.0, 1.0, 1.0, 1.0)    // cyan
];

function quad(a, b, c, d) {
    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    points.push(vertexPos[b]);
    colors.push(vertexColor[b]);
    points.push(vertexPos[c]);
    colors.push(vertexColor[c]);
    points.push(vertexPos[a]);
    colors.push(vertexColor[a]);
    points.push(vertexPos[c]);
    colors.push(vertexColor[c]);
    points.push(vertexPos[d]);
    colors.push(vertexColor[d]);
}

function generateGround() {
    var scale = 10;
    //two triangles
    points.push(vec4(scale, -1.0, -scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    points.push(vec4(-scale, -1.0, -scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    points.push(vec4(-scale, -1.0, scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    
    points.push(vec4(scale, -1.0, -scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    points.push(vec4(-scale, -1.0, scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    points.push(vec4(scale, -1.0, scale, 1.0));
    colors.push(vec4(0.8, 0.8, 0.8, 1.0));
    
    //grid lines
    for(var x = -scale; x <= scale; x++){
        points.push(vec4(x, -1.0, -scale, 1.0));
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
        points.push(vec4(x, -1.0, scale, 1.0));
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
    }
    for(var z = -scale; z <= scale; z++){
        points.push(vec4(-scale, -1.0, z, 1.0));
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
        points.push(vec4(scale, -1.0, z, 1.0));
        colors.push(vec4(0.0, 0.0, 0.0, 1.0));
    }
}