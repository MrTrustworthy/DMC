var GameWorld = function() {


	this.loadWorld = function() {
		var ambient_light = new THREE.AmbientLight(new THREE.Color(0xFFFFFF));
		scene.add(ambient_light);

		var ground = new GameFloor();



		// drop in some trees
		var treeMaterial = GameobjectUtils.createMaterial('tree', 1, 11);
		var chestMaterial = GameobjectUtils.createMaterial('box', 1, 1);

		var treeGenerator = new TreeGenerator();
		var chestGenerator = new ChestGenerator();

		for (var i = 0; i <= 100; i++) {
			treeGenerator.generateTree(treeMaterial);
		}

		for (var i = 0; i <= 5; i++) {
			chestGenerator.generateChest(chestMaterial);
		}

	};



}