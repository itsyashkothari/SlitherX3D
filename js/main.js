function Food(scene, id) {
    this.position = { x: 0, y: 0 };
    this.id = id;
    this.scene = scene;
    this.geometry = new THREE.SphereGeometry(5, 32, 32);
    this.material = new THREE.MeshLambertMaterial({ color: 0xFF000C });
}
Food.prototype = {
    remove: function() {
        this.scene.remove(scene.getObjectByName(this.id));
        //      console.log("it works");
    },
    add: function() {
        var temp = new THREE.Mesh(this.geometry, this.material);
        temp.name = this.id;
        this.position = getEmptyBox();
        //    this.position = {x:5,y:5,z:5};
        temp.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(temp);
        console.log("hello", this.position);
    }
};

function createBoundary(scene) {


    var geometry1 = new THREE.BoxBufferGeometry(200, 200, 200);
    var geometry = new THREE.EdgesGeometry(geometry1); // or WireframeGeometry
    var material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    var edges = new THREE.LineSegments(geometry, material);
    //scene.add( edges );
    var geometry11 = new THREE.BoxBufferGeometry(300, 300, 300);
    var geometry1 = new THREE.EdgesGeometry(geometry11); // or WireframeGeometry
    var material1 = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    var edges1 = new THREE.LineSegments(geometry1, material1);
    scene.add(edges1);
}

function isFoodCollision() {
    //    console.log(snake.body[0].position, food.position);
    if (snake.body[0].position.x == food.position.x && snake.body[0].position.y == food.position.y && snake.body[0].position.z == food.position.z) {
        console.log("whatsup");
        food.remove();
        food.add();
        return true;
    } else
        return false;
}

function createGrid(scene) {
    var grid = new THREE.GridHelper(size, divisions, 0x1711b2, 0x234876);
    grid.position.set(0, 0, 0);
    scene.add(grid);
}





var r = 10,g = 10,b = 10,t=0;
var camRadius = 300;

var size = 200;
var divisions = 20;
var height = window.innerHeight * 0.89,
    width = window.innerWidth;
var snakeMovement = [
    [0, 0, -10],
    [10, 0, 0],
    [0, 0, 10],
    [-10, 0, 0],
    [0, 10, 0],
    [0, -10, 0]
];
var cameraDir = 0;
var cameraPos = [{ x: 0 , z: camRadius } , { x: camRadius , z: 0 } , { x: 0,z: -camRadius } , { x: -camRadius , z: 0 }];

var relativeDirection = {

    w: [0, 3, 2, 1],
    d: [1, 0, 3, 2],
    s: [2, 1, 0, 3],
    a: [3, 2, 1, 0],
    q: [4, 4, 4, 4],
    e: [5, 5, 5, 5]

};

var animation,fps = 12,isPaused = false,id,radius = 300,theta = 0,prevTime = Date.now(),mixer,horsemesh;

//Camera Setup
var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
camera.position.set(0, 0, camRadius);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//Renderer Setup
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.autoClear = false;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Scene Setup
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x00FFFF);

//Keyboard Setup
var keyboard = new THREEx.KeyboardState();

//Light Setup
var light = new THREE.PointLight(0xffffff, 100);
light.position.set(0, 0, 0);
var light2 = new THREE.AmbientLight(0x010101); // soft white light
scene.add(light2);

//Mouse Setup
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();


var snake = new Snake(scene, 200, 15);
var food = new Food(scene, "food");
window.addEventListener('mousedown', onMouseDown, false);
initHome();
animateHome();

function startGame() {
    scene.remove(scene.getObjectByName("horse"));
    scene.remove(scene.getObjectByName("heading"));

    clearInterval(colorC);
    //    createGrid(scene);
    camera.position.y = 80;

    scene.background = new THREE.Color(0xffffff);
    createBoundary(scene);
    snake.init();
    // addSide();
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(400, 32, 32),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('img/tajmahal.jpg')
        })
    );
    sphere.scale.x = -1;
    scene.add(sphere);
    food.add();
    camRadius = 100;
    animation = setInterval(animateGame, 1000 / fps);
}

function addSide() {

    var geometry = new THREE.PlaneGeometry(300, 300, 20);
    var loader = new THREE.TextureLoader();
    loader.load('img/1.png', function(texture) {
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = -150;
        scene.add(mesh);
    });
    var loader = new THREE.TextureLoader();
    loader.load('img/2.png', function(texture) {
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI / 2;
        mesh.position.x = -150;
        scene.add(mesh);
    });
    var loader = new THREE.TextureLoader();
    loader.load('img/3.png', function(texture) {
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = Math.PI;
        mesh.position.z = 150;
        scene.add(mesh);
    });
    var loader = new THREE.TextureLoader();
    loader.load('img/4.jpeg', function(texture) {
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = -Math.PI / 2;
        mesh.position.x = 150;
        scene.add(mesh);
    });
}

function initHome() {

    // Background Image
    var loader1 = new THREE.TextureLoader();
    loader1.load('img/bg3.jpg', function(texture) {
        var geometry = new THREE.PlaneGeometry(2400, 1524, 20);
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
        var mesh = new THREE.Mesh(geometry, material);
        //       mesh.position.x = 150;
        mesh.position.z = -400;
        scene.add(mesh);
    });

    // Lights
    var light = new THREE.DirectionalLight(0xefefff, 1.5);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    var light = new THREE.DirectionalLight(0xffefef, 1.5);
    light.position.set(-1, -1, -1).normalize();
    scene.add(light);

    // Horse Animation
    var loader = new THREE.JSONLoader();
    loader.load("js/horse.js", function(geometry) {
        var material=new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            morphTargets: true
        });
        horsemesh = new THREE.Mesh(geometry,material);
        //   mesh.scale.set(1.5, 1.5, 1.5);
        horsemesh.position.set(0, -200, 0);
        horsemesh.name = "horse";
        horsemesh.rotation.y = -Math.PI / 2;
        scene.add(horsemesh);
        mixer = new THREE.AnimationMixer(horsemesh);
        var clip = THREE.AnimationClip.CreateFromMorphTargetSequence('gallop', geometry.morphTargets, 30);
        mixer.clipAction(clip).setDuration(1).play();
    });

    //Don't remember why i did it :P
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    window.addEventListener('resize', onWindowResize, false);
}

function onMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var objects = [];
    objects.push(horsemesh);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        window.removeEventListener("mousedown", onMouseDown);
        cancelAnimationFrame(id);
        startGame();
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function colorChanger() {
    if (r > 250)
        r += Math.random();
    else
        r = 100 * Math.random();
    if (g > 250)
        g += Math.random();
    else
        g = 100 * Math.random();
    if (b > 250)
        b += Math.random();
    else
        b = 100 * Math.random();
    scene.background = new THREE.Color(r / 255, g / 255, b / 255);
}

var colorC = setInterval(colorChanger, 1000);

function animateHome() {


    id = requestAnimationFrame(animateHome);
    /*   
    theta = 0.3;
    if (theta > 50) {
        cancelAnimationFrame(id);
        startGame();
    }
    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));

    camera.lookAt(new THREE.Vector3(0, 0, 0));
    */
    if (mixer) {

        var time = Date.now();

        mixer.update((time - prevTime) * 0.001);

        prevTime = time;

    }

    renderer.render(scene, camera);
}

function gameOver() {
    clearInterval(animation);
    var score = snake.length - 15;
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }
    var loader = new THREE.FontLoader();

    loader.load('fonts/optimer_regular.typeface.json', function(font) {

        var geometry = new THREE.TextGeometry('Your Score : ' + score + '\n Refresh the page to play again :)', {
            font: font,
            size: 25,
            height: 100,
            curveSegments: 12,
        });
        var wrapper = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        var words = new THREE.Mesh(geometry, wrapper);
        scene.add(words);

    });
    window.alert("Your Score is " + score + " .\n" + "Click OK to play again :)");
    window.location.reload(true);
}

function getEmptyBox() {

    var position = {
        x: 10 * Math.floor(Math.random() * 18 - 9) + 5,
        y: (10 * Math.floor(Math.random() * 18 - 9)) + 5,
        z: (10 * Math.floor(Math.random() * 18 - 9)) + 5
    };
    snake.body.forEach(function(part) {
        if (part.position === position)
            return getEmptyBox();
    });
    return position;
}

function keyboardInput() {
    console.log("ki");

    var change = false;
    if (!isPaused) {

        if (keyboard.pressed("w"))
            snake.direction = relativeDirection["w"][cameraDir];
        if (keyboard.pressed("d"))
            snake.direction = relativeDirection["d"][cameraDir];
        if (keyboard.pressed("s"))
            snake.direction = relativeDirection["s"][cameraDir];
        if (keyboard.pressed("a"))
            snake.direction = relativeDirection["a"][cameraDir];
        if (keyboard.pressed("up"))
            snake.direction = relativeDirection["q"][cameraDir];
        if (keyboard.pressed("down"))
            snake.direction = relativeDirection["e"][cameraDir];
        if (keyboard.pressed("right"))
            cameraDir = (4 + cameraDir + 1) % 4;
        if (keyboard.pressed("left")) 
            cameraDir = (4 + cameraDir - 1) % 4;
     }
    
    if (keyboard.pressed("8"))
        isPaused = false;
    if (keyboard.pressed("5"))
        isPaused = true;

    camera.position.x = cameraPos[cameraDir]["x"];
    camera.position.z = cameraPos[cameraDir]["z"];
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function animateGame() {
    keyboardInput();

    if (!isPaused) {
        if (isFoodCollision())
            snake.add();

        if (snake.isSelfCrash()) {
            console.log("selfcrash");
            gameOver();
        }
        if (t % 4 == 0)
            if (!snake.move())
                gameOver();
        renderer.render(scene, camera);
        t++;
    }
}