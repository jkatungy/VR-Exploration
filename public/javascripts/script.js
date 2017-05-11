
// three.js objects
var camera, scene, renderer;
var effect, controls;
var element, container;
var clock = new THREE.Clock();

//camera position variables
var horizMov = false;
var currentCameraPos = new THREE.Vector3(27, 4, 0);
var newCameraPos = new THREE.Vector3(130, -30, -10);

var alpha = 0;

// cursor
var raycaster = new THREE.Raycaster(), intersected;
var cursor;
var CursorX = 0;
var CursorY = 0;
var CursorZ = -3;

// geometry
var worldSphere;
var meshes = [];
var selectableObjects = [];

//new geometry
var Building = [];
var Bridge;

// stats
var stats;

// begin the scene
init();
animate();


// MAIN FUNCTIONS ==========

function init() {

	// SCENE ==========
	renderer = new THREE.WebGLRenderer(); // sets up the renderer for the browser
	
	renderer.setClearColor(0x00036f); // sets the color of "clear", uncolored pixels
	renderer.setPixelRatio(window.devicePixelRatio) // sets the pixel ratio to the device's pixel ratio
	
	element = renderer.domElement; // grabs the DOM from the renderer
	container = document.getElementById('container'); // grabs the container element from the browser DOM
	container.appendChild(element); // puts the renderer element in the browser

	effect = new THREE.StereoEffect(renderer); // initializes stereoscopic effect
	effect.separation = 1; // constant for eye separation


	scene = new THREE.Scene(); // creates a new Scene, the base world for which all 3d elements will be added
	
	raycaster = new THREE.Raycaster(); // creates a new raycaster for cursor/selection purposes


	// CAMERA ==========
	camera = new THREE.PerspectiveCamera(135, 1, 0.001, 500); // creates a new global camera
	camera.position.set(27, 4, 0); // positions the camera
	
	scene.add(camera); // adds the camera to the scene


	// CONTROLS ==========
	controls = new THREE.OrbitControls(camera, element); // allow the camera to be moved
	controls.rotateUp(Math.PI / 4); // set the up direction of the camera
	controls.target.set( // set the camera's target
		camera.position.x + 0.00001,
		camera.position.y,
		camera.position.z
	);
	controls.noZoom = true; // don't allow the camera to zoom
	controls.noPan = true; // don't allow the camera to pan


	// !!IMPORTANT!! BEGIN -- Do not edit the next few lines
	// attaches rotation controls to the phone's accelerometer, or to a mouse when using a computer
	function setOrientationControls(e) {
		if (!e.alpha) {
			return;
		}

		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();

		element.addEventListener('click', function() {
			if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen();
			}
		}, false);

		window.removeEventListener('deviceorientation', setOrientationControls, true);
	}
	window.addEventListener('deviceorientation', setOrientationControls, true);
	// !!IMPORTANT!! END


	// LIGHTING ==========
	var ambientLight = new THREE.AmbientLight(0xeeeeee); // create new ambient light
	scene.add(ambientLight); // add the light to the scene


	// OBJECTS ==========
	worldSphere = new THREE.Mesh( // create new background sphere
		new THREE.SphereGeometry(450, 32, 32), // size it
		new THREE.MeshBasicMaterial({ // skin it
			map: THREE.ImageUtils.loadTexture('3D/textures/birdview.jpg'),
			side: THREE.DoubleSide
		})
	);
	worldSphere.rotation.set(0, Math.PI / 2, 0) // position it
	scene.add(worldSphere); // add it to the scene
	meshes.push(worldSphere); // add it to the list of meshes

	cursor = new THREE.Mesh( // create the cursor
		new THREE.RingGeometry(0.08, 0.1, 32),
		new THREE.MeshBasicMaterial({
			color: 0xffffff,
			opacity: 0.5
		})
	);
	camera.add(cursor);
	// cursor.position.set(0, 0, -3);

	//makeCubeGrid(50, 50, 0xff00ff); // make a demo grid of cubes

	loadAssets(); // load all other 3D assets

//Buildings================================================
	for (var i = 0; i < 2; i++){
			Building[i] = new THREE.Mesh(
			new THREE.CubeGeometry((50/(i + 1)), 300, ((i + 1) * 30)),
			new THREE.MeshBasicMaterial({ // skin it
				map: THREE.ImageUtils.loadTexture('3D/textures/Marble.png'),
				side: THREE.DoubleSide
			})
		);
		Building[i].position.set(i * 120, -180, 0);
		scene.add(Building[i]);
		meshes.push(Building[i]);
	}

//Bridge=========================================================
	Bridge = new THREE.Mesh(
		new THREE.CubeGeometry(120, 1, 6),
		new THREE.MeshBasicMaterial({ // skin it
			map: THREE.ImageUtils.loadTexture('3D/textures/Sandstone.png'),
			side: THREE.DoubleSide
		})
	);
	Bridge.position.set(50, -40, 0);
	scene.add(Bridge);
	meshes.push(Bridge);


	// EXTRAS
	window.addEventListener('resize', resize, false); // add a listener for if the browser window changes size
	setTimeout(resize, 1);

	// STATS
	stats = new Stats(); // create an object that tracks stats
	container.appendChild(stats.domElement) // and add it to the DOM
}

function loadAssets() {

	var objMtlLoader = new THREE.OBJMTLLoader(); // create the OBJ loader

	// SELECTABLE OBJs ==========
	var filenames = ["stool"] // a list of all the filenames to load as selectable OBJs
	for (var i = 0; i < filenames.length; i++) {
		objMtlLoader.load("3D/" + filenames[i] + ".obj", "3D/" + filenames[i] + ".mtl", function(object, url) { // load the OBJ and companion MTL
			scene.add(object); // add it to the scene
			meshes.push(object); // add it to the meshes list

			selectableObjects.push(object); // add it to the selectable objects list

			var filename = (url.split('.')[0]).split('/')[1]
			object.name = filename // add a property to the new object that is its filename
			object.scale.set(0.8, 0.8, 0.8);
			if (filename = "stool"){
				object.position.x += 130;
				object.position.y -= 30;
				object.position.z -= 10;
			}
		});
	}
}


// has the effect of moving the camera to destination
// destination is a `new THREE.Vector3(x, y, z)`
function goTo(destination, delayTime) {

	var goalVector = destination.clone();
	var currentPos = worldSphere.position;
	var travelDir = goalVector.negate().sub(currentPos);

	for (var i = 0; i < meshes.length; i++) {
		meshes[i].originalPosition = new THREE.Vector3(meshes[i].position.x, meshes[i].position.y, meshes[i].position.z);
	}

	isCrouching = false;

	var tween = new TWEEN.Tween({x: 0, y: 0, z: 0})
		.to({x: travelDir.x, y: travelDir.y, z: travelDir.z}, delayTime * 0.5)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {

			for (var i = 0; i < meshes.length; i++) {
				meshes[i].position.set(meshes[i].originalPosition.x + this.x, meshes[i].originalPosition.y + this.y, meshes[i].originalPosition.z + this.z);
			}

		})
		.start();
}

// Slides and object along a vector
function slideObject(object, vector, delayTime) {

	object.originalPosition = new THREE.Vector3(object.position.x, object.position.y, object.position.z);

	var tween = new TWEEN.Tween({x: 0, y: 0, z: 0})
		.to({x: vector.x, y: vector.y, z: vector.z}, delayTime / 2)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {

			object.position.set(object.originalPosition.x + this.x, object.originalPosition.y + this.y, object.originalPosition.z + this.z);

		})
		.start();
}

// Rotates an object along an axis
function rotateObject(object, axis, radians, delayTime) {

	object.originalRotation = new THREE.Vector3(object.rotation.x, object.rotation.y, object.rotation.z);

	var tween = new TWEEN.Tween({r: 0})
		.to({r: radians}, delayTime)
		.easing(TWEEN.Easing.Quadratic.InOut)
		.onUpdate(function() {
			
			object.rotation.x = object.originalRotation.x + this.r * axis.x;
			object.rotation.y = object.originalRotation.y + this.r * axis.y;
			object.rotation.z = object.originalRotation.z + this.r * axis.z;

		})
		.start();
}

// checks for intersections with the cursor
function picker() {

	raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);	// sets the endpoint of the raycaster

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects(selectableObjects, true);

	if (intersects.length > 0) {
		if (intersected != intersects[0].object) {
			if (intersected) {
				intersected.material.emissive.setHex(intersected.currentHex);
				
			}

			intersected = intersects[0].object;
			intersected.currentHex = intersected.material.emissive.getHex();
			intersected.material.emissive.setHex(0x405060);
			horizMov = true;
			socket.emit('Watchout');
			console.log(horizMov);

			
		}
	} //else {
	// 	if (intersected) {
	// 		intersected.material.emissive.setHex(intersected.currentHex);
	// 		intersected = null;
	// 		horizMov = false;
	// 		console.log(horizMov);
	// 	}
	// }
}

// MAKE IT RUN ==========

function animate() {
	socket.emit('EnjoyView');
	
	cursor.position.set(CursorX, CursorY, CursorZ);
	//console.log(CursorX);

	

	if (horizMov == true){
		//newCameraPos = camera.getWorldDirection();
		currentCameraPos = currentCameraPos.lerp (newCameraPos, alpha);
		alpha += 0.00001;
		if (alpha > 1){
			alpha = 0;
		}
		camera.position.x = currentCameraPos.x;
		camera.position.y = currentCameraPos.y;
		camera.position.z = currentCameraPos.z;

		CursorX = (parseInt(camera.position.x) + 27);
		CursorY = (parseInt(camera.position.y) - 4);
		CursorZ = (parseInt(camera.position.z) - 3);

		
		
		console.log(CursorX);
		console.log(camera.position.x);
	}

	requestAnimationFrame(animate);
	TWEEN.update();

	THREE.AnimationHandler.update(clock.getDelta());

	update(clock.getDelta());
	render(clock.getDelta());

	stats.update();
}

function update(dt) {
	
	resize();

	picker();

	camera.updateProjectionMatrix();

	controls.update(dt);
}

function resize() {
	var width = container.offsetWidth;
	var height = container.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);
	effect.setSize(width, height);
}

function render(dt) {
	effect.render(scene, camera);
}

