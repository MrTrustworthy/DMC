var ChestGenerator = function() {

	this.generateChest = function(mat) {
		var height = 7;
		var sizeX = 12;
		var sizeZ = 7;

		var material = mat.clone();
		material.opacity = 0.7;

		var chest = new THREE.Mesh(
			new THREE.BoxGeometry(sizeX, height, sizeZ),
			material
		);
		chest.castShadow = true;
		chest.receiveShadow = true;
		chest.goblin = new Goblin.RigidBody(
			new Goblin.BoxShape(sizeX / 2, height / 2, sizeZ / 2),
			Infinity
		);


		chest.goblin.restitution = 0.0;

		chest.goblin.position.y = height / 2;
		chest.goblin.position.x = GameobjectUtils.randomSign() * Math.random() * 200;
		chest.goblin.position.z = GameobjectUtils.randomSign() * Math.random() * 200;

		// game relevant properties
		chest.goblin.isGameObject = true;

		chest.goblin.isInteractable = true;
		chest.goblin.isLootable = true;



		//add to different scenes

		scene.add(chest);
		goblinWorld.addRigidBody(chest.goblin);


		chest.goblin.highlight = function() {
			chest.material.transparent = true;
		}

		chest.goblin.removeHighlight = function() {
			chest.material.transparent = false;
		}

		chest.goblin.interact = function() {
			console.log("interacted with chest");
			if(chest.goblin.isLootable){
				
				GameobjectUtils.doIn(function() {
					chest.goblin.spawnLootObject(chest.position.clone());
				}, 20, 6);
				chest.goblin.isLootable = false;
			}


		}

		/**
		 * Spawns the loot
		 */
		chest.goblin.spawnLootObject = function(position) {

			var material = GameobjectUtils.createMaterial('pebbles', 1, 1);

			var lootObj = new THREE.Mesh(
				new THREE.BoxGeometry(2, 2, 2),
				material
			);
			lootObj.castShadow = true;
			lootObj.receiveShadow = true;
			lootObj.goblin = new Goblin.RigidBody(
				new Goblin.BoxShape(1,1,1),
				50
			);


			lootObj.goblin.restitution = 0.2;

			lootObj.goblin.position.x = position.x;
			lootObj.goblin.position.y = height + 1;
			lootObj.goblin.position.z = position.z;



			lootObj.goblin.linear_velocity.x = Math.random() * 5;
			lootObj.goblin.linear_velocity.y = 30;
			lootObj.goblin.linear_velocity.z = Math.random() * 5;

			// game relevant properties
			lootObj.goblin.isGameObject = true;
			lootObj.goblin.isPassable = true;
			lootObj.goblin.isPickupable = true;

			lootObj.goblin.pickup = function() {
				scene.remove(lootObj);
				goblinWorld.removeRigidBody(lootObj.goblin);
				console.log("pickup!");
				return "wood";
			}

			lootObj.goblin.highlight = function() {
				console.log("wow highlighted rubble");
			}
			lootObj.goblin.removeHighlight = function() {
				console.log("wow highlighted rubble");
			}


			//add to different scenes
			scene.add(lootObj);
			goblinWorld.addRigidBody(lootObj.goblin);
		}



		return chest;
	}
}