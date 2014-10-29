var PlayerModel = function() {

	var player_material = GameobjectUtils.createMaterial('scratched_metal', 1, 1);

	var height = 10;
	var size = 5;

	var playerModel = new THREE.Mesh(
		new THREE.BoxGeometry(size, height, size),
		player_material
	);
	playerModel.castShadow = true;
	playerModel.receiveShadow = true;
	playerModel.goblin = new Goblin.RigidBody(
		new Goblin.BoxShape(size/2, height/2, size/2),
		250
	);


	playerModel.goblin.position.y = 1;

	playerModel.goblin.restitution = 0.0;

	playerModel.goblin.angular_factor.set(0, 0, 0);


	//goblinObjects.push(playerModel);
	scene.add(playerModel);
	goblinWorld.addRigidBody(playerModel.goblin);

	return playerModel;

}