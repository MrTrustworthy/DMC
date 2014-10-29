window.GameobjectUtils = {

	materials: {

		grass: {
			diffuse: 'grass.png',
			normal: 'grass.png',
			//specular: 'grass.png',
			shininess: 30,
			normal_scale: 2
		},
		tree: {
			diffuse: 'tree.jpg',
			normal: 'tree.jpg',
			normal_scale: 7
		},
		box: {
			diffuse: 'Box.jpg',
			normal: 'Box.jpg',
			normal_scale: 2
		},
		wood: {
			diffuse: '228_diffuse.png',
			//normal: '228_normal.png',
			normal_scale: 7
		},
		pebbles: {
			diffuse: '254_diffuse.png',
			normal: '254_normal.png',
			normal_scale: 4
		},
		rusted_metal: {
			diffuse: '210_diffuse.png',
			normal: '210_normal.png',
			specular: '210_specular.png',
			shininess: 200,
			normal_scale: 4,
			metal: true
		},
		scratched_metal: {
			diffuse: '213_diffuse.png',
			normal: '213_normal.png',
			specular: '213_specular.png',
			shininess: 300,
			normal_scale: 3,
			metal: true
		},
		cement: {
			diffuse: '173_diffuse.png',
			normal: '173_normal.png',
			specular: '173_specular.png',
			shininess: 30,
			normal_scale: 2
		}
	},

	createMaterial: function(name, repeat_x, repeat_y) {
		var def = this.materials[name],
			map = THREE.ImageUtils.loadTexture('graphics/' + def.diffuse),
			normalMap, specularMap,
			material_def = {
				shininess: 0
			};

		map.repeat.x = repeat_x;
		map.repeat.y = repeat_y;
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.anisotropy = renderer.getMaxAnisotropy();
		material_def.map = map;

		if (def.normal) {
			normalMap = THREE.ImageUtils.loadTexture('graphics/' + def.normal, THREE.RepeatWrapping);
			normalMap.repeat.x = repeat_x;
			normalMap.repeat.y = repeat_y;
			normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
			normalMap.anisotropy = renderer.getMaxAnisotropy();
			material_def.normalMap = normalMap;
		}

		if (def.specular) {
			specularMap = THREE.ImageUtils.loadTexture('graphics/' + def.specular, THREE.RepeatWrapping);
			specularMap.repeat.x = repeat_x;
			specularMap.repeat.y = repeat_y;
			specularMap.wrapS = specularMap.wrapT = THREE.RepeatWrapping;
			specularMap.anisotropy = renderer.getMaxAnisotropy();
			material_def.specularMap = specularMap;
			material_def.shininess = def.shininess;
		}

		var material = new THREE.MeshPhongMaterial(material_def);

		if (def.normal_scale) {
			material.normalScale.set(def.normal_scale, def.normal_scale);
		}

		if (def.metal) {
			material.metal = true;
		}

		return material;
	},

	randomSign: function() {

		return (Math.random() <= 0.5) ? -1 : +1;
	},

	generateHealthbar: function(maxHP) {
		var healthbar = {
			maxHP: maxHP,
			currentHP: maxHP,
			subtractHP: function(amount) {
				this.currentHP -= amount;
				return this.currentHP <= 0 ? false : true;
			}
		}
		return healthbar;
	},

	/**
	 * func: function you want executed
	 * inTicks: amount of ticks which will be
	 *			waited before executing the function
	 * repeat: amount of times to repeat the func
	 *			optional. default value is 1
	 */
	doIn: function(func, inTicks, repeat) {
		repeat = (repeat || 1);
		var ticksStart = goblinWorld.ticks;
		var wrapFunc = function(tick) {
			if (tick === ticksStart + inTicks) {
				func();
				repeat--;
				if (repeat <= 0) {
					goblinWorld.removeListener("stepStart", wrapFunc);
				} else {
					ticksStart = goblinWorld.ticks;
				}
			}
		}
		goblinWorld.addListener("stepStart", wrapFunc);
	},

	/**
	 * fades out an object
	 */
	fadeOut: function(obj) {
		return null;



	}


}