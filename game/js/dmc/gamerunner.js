window.Game = {

	fpsStats: null,

	player: null,

	gameWorld: null,

	initGame: function() {

		console.log("loading game");



		scene = new THREE.Scene();

		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);



		//goblinObjects = [];
		goblinWorld = new Goblin.World(new Goblin.BasicBroadphase(), new Goblin.NarrowPhase(), new Goblin.IterativeSolver());
		goblinWorld.gravity = new THREE.Vector3(0, -40, 0);
		this.gameWorld = new GameWorld();
		this.gameWorld.loadWorld();

		this.player = new Player();
		this.player.loadPlayer();


		this.loadStats();
		this.runGame();

	},


	runGame: function() {

		requestAnimationFrame(Game.runGame);

		Game.fpsStats.begin();
		goblinWorld.step(1 / 60);
		Game.fpsStats.end();

		Game.syncGoblin();

		Game.player.updatePlayer();

		renderer.render(scene, Game.player.camera);

	},

	// sync the three.js values to be equal with the goblin values
	syncGoblin: function() {
		var i, object;
		for (i = 0; i < scene.children.length; i++) {
			object = scene.children[i];
			if (object.goblin) {
				object.position.set(
					object.goblin.position.x,
					object.goblin.position.y,
					object.goblin.position.z
				);
				object.quaternion.set(
					object.goblin.rotation.x,
					object.goblin.rotation.y,
					object.goblin.rotation.z,
					object.goblin.rotation.w
				);
			}
		}
	},

	loadStats: function() {


		this.fpsStats = new Stats();
		this.fpsStats.setMode(0); // ms
		this.fpsStats.domElement.style.position = 'absolute';
		this.fpsStats.domElement.style.left = '0px';
		this.fpsStats.domElement.style.top = '0px';
		document.body.appendChild(this.fpsStats.domElement);
	}



}