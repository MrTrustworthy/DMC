var TreeGenerator = function() {

	this.generateTree = function(mat) {
		var height = 33;
		var size = 3;

		var material = mat.clone();
		material.opacity = 0.7;

		var tree = new THREE.Mesh(
			new THREE.BoxGeometry(size, height, size),
			material
		);
		tree.castShadow = true;
		tree.receiveShadow = true;
		
		tree.goblin = new Goblin.RigidBody(
			new Goblin.BoxShape(size / 2, height / 2, size / 2),
			Infinity
		);


		tree.goblin.restitution = 0.0;

		tree.goblin.position.y = height / 2;
		tree.goblin.position.x = GameobjectUtils.randomSign() * Math.random() * 200;
		tree.goblin.position.z = GameobjectUtils.randomSign() * Math.random() * 200;

		// game relevant properties
		tree.goblin.isGameObject = true;

		tree.goblin.isHittable = true;
		tree.goblin.healthbar = GameobjectUtils.generateHealthbar(75);


		//add to different scenes

		scene.add(tree);
		goblinWorld.addRigidBody(tree.goblin);


		tree.goblin.highlight = function() {
			
			tree.material.transparent = true;
		}

		tree.goblin.removeHighlight = function() {
			tree.material.transparent = false;
		}


		/**
		 * The hit-function
		 */
		tree.goblin.hit = function(amount) {
			console.log("Tree hit", tree, "for", amount);

			var alive = tree.goblin.healthbar.subtractHP(amount);

			//kill the tree
			if (!alive) {
				tree.goblin.kill();
			} else {
				console.log("HP left:", tree.goblin.healthbar.currentHP);
			}

		}

		/**
		 * kills the object
		 */
		tree.goblin.kill = function() {

			var dyingPosition = tree.position.clone();

			goblinWorld.removeRigidBody(tree.goblin);
			scene.remove(tree);
			// GameobjectUtils.doIn(function() {
			// 	tree.goblin.spawnLootObject(dyingPosition);
			// }, 20, 4);

			for (var i = 0; i < 33; i += 3) {
				dyingPosition.y = i;
				tree.goblin.spawnLootObject(dyingPosition);
			}


		}

		/**
		 * Spawns the loot
		 */
		tree.goblin.spawnLootObject = function(position) {

			var material = GameobjectUtils.createMaterial('tree', 1, 1);

			var lootObj = new THREE.Mesh(
				new THREE.BoxGeometry(3, 3, 3),
				material
			);
			lootObj.castShadow = true;
			lootObj.receiveShadow = true;
			lootObj.goblin = new Goblin.RigidBody(
				new Goblin.BoxShape(1.5, 1.5, 1.5),
				50
			);


			lootObj.goblin.restitution = 0.2;

			lootObj.goblin.position.x = position.x;
			lootObj.goblin.position.y = position.y + 0.75;
			lootObj.goblin.position.z = position.z;

			// lootObj.goblin.position.x = dyingPosition.x + (Math.random() * 2);
			// lootObj.goblin.position.y = 6;
			// lootObj.goblin.position.z = dyingPosition.z + (Math.random() * 2);

			lootObj.goblin.linear_velocity.x = Math.random() * 2;
			//lootObj.goblin.linear_velocity.y = 10;
			lootObj.goblin.linear_velocity.z = Math.random() * 2;

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



		return tree;
	}
}