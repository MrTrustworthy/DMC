var Player = function() {

	this.playerModel = null;

	this.camera = null;

	this.controller = null;

	this.targetPosition = null;

	/**
	 * target element and set-getters
	 */
	this._targetElement = null;

	this.setTargetElement = function(element) {
		if (this._targetElement) {
			this._targetElement.goblin.removeHighlight();
		}
		this._targetElement = element;
		if (element) {
			element.goblin.highlight();
		}
	}

	this.getTargetElement = function() {
		return this._targetElement;
	}


	// TODO: switch those to dynamic values as soon as stuff is implemented
	this.movementspeed = 60;

	this.attackRange = 25;

	this.attackDamage = 30;

	this.inventory = [];

	/**
	 * Main entrance point!
	 */
	this.loadPlayer = function() {
		var _self = this;

		this.playerModel = new PlayerModel();

		this.loadCollisionBehaviour();



		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.playerDiff = new THREE.Vector3(0, 100, 120);


		this.controller = new gameController();
		this.controller.loadConnections();


	};

	/**
	 * The collision func
	 */
	this.loadCollisionBehaviour = function() {
		var _self = this;

		this.playerModel.goblin.addListener("newContact", function(other_object, contact) {


			if (other_object.isPassable) {

				if (other_object.isPickupable) {

					var drop = other_object.pickup();
					_self.inventory.push(drop);

				}
				return false;



				// check for interactions
			} else if (other_object.isInteractable) {

				if (_self.getTargetElement() &&
					_self.getTargetElement().goblin.id === other_object.id) {

					_self.targetPosition = null;
					_self.setTargetElement(null);

					_self.playerModel.goblin.linear_velocity.x = 0;
					_self.playerModel.goblin.linear_velocity.y = 0;
					_self.playerModel.goblin.linear_velocity.z = 0;

					other_object.interact();
				}

			}



			return true;
		});


	};
	// updates the players target position and element
	this.updatePlayer = function() {

		//check for changes of target
		var updatedTarget = this.controller.getNewFloorPosition(this.camera)
		if (updatedTarget) {
			console.log("New Target: ", updatedTarget);
			this.targetPosition = updatedTarget.floorPoint;

			//add new target
			if (updatedTarget.gameobjects.length >= 1) {
				this.setTargetElement(updatedTarget.gameobjects[0]);
			} else {
				this.setTargetElement(null);
			}
		}

		// check for attack opportunities
		if (this.getTargetElement() && this.getTargetElement().goblin.isHittable) {

			var distanceToElement = this.playerModel.position.distanceTo(this.getTargetElement().position);
			if (distanceToElement <= this.attackRange) {



				// drawing line
				var line_material = new THREE.MeshBasicMaterial({
					color: "red",
					transparent: true,
					opacity: 1
				})
				var lineGeometry = new THREE.Geometry();
				lineGeometry.vertices.push(this.playerModel.position);

				lineGeometry.vertices.push(new THREE.Vector3(
					this.getTargetElement().position.x,
					this.playerModel.position.y,
					this.getTargetElement().position.z
				));

				var line = new THREE.Line(lineGeometry, line_material)

				scene.add(line);
				GameobjectUtils.doIn(function() {
					scene.remove(line);
				}, 50);


				// stopping movement
				this.targetPosition = null;
				this.playerModel.goblin.linear_velocity.x = 0;
				this.playerModel.goblin.linear_velocity.z = 0;
				// executing stuff
				this.getTargetElement().goblin.hit(this.attackDamage);

				this.setTargetElement(null);


			}
		}

		// move
		if (this.targetPosition) {

			var movementVector = new THREE.Vector3().subVectors(this.targetPosition, this.playerModel.goblin.position);
			movementVector.normalize().multiplyScalar(this.movementspeed);

			this.playerModel.goblin.linear_velocity.x = movementVector.x;
			//this.playerModel.goblin.linear_velocity.y = movementVector.y;
			this.playerModel.goblin.linear_velocity.z = movementVector.z;

		}


		this.updateCamera();

	};

	this.updateCamera = function() {
		this.camera.position.addVectors(this.playerModel.position, this.camera.playerDiff);
		this.camera.lookAt(this.playerModel.position);

	}



}