var GameFloor = function() {

	var height = 0.001;
	var size = 500;

	// var map = THREE.ImageUtils.loadTexture("graphics/grass.png")

	// map.repeat.x = 1;
	// map.repeat.y = 1;
	// map.wrapS = map.wrapT = THREE.RepeatWrapping;

	// var material = new THREE.MeshLambertMaterial({
	// 	map: map
	// });
	var material = GameobjectUtils.createMaterial('grass', 25,25);

	var plane = new THREE.Mesh(
		new THREE.BoxGeometry(size, height, size),
		material
	);
	plane.castShadow = true;
	plane.receiveShadow = true;
	plane.goblin = new Goblin.RigidBody(
		new Goblin.BoxShape(size / 2, height / 2, size / 2),
		0
	);


	plane.castShadow = false;
	plane.goblin.isGameFloor = true;

	//goblinObjects.push(plane);
	scene.add(plane);
	goblinWorld.addRigidBody(plane.goblin);

	return plane;
}