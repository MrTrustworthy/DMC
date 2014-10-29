var gameController = function() {



    mouseclickPosition: null;

    mouseclickPositionDiffers: false;


    this.loadConnections = function() {
        _self = this;

        console.log("Connecting controller to the DOM");

        // MOUSE HANDLERS!!!!
        document.onmousedown = function(evt) {
            _self.mouseclickPosition = {
                x: evt.clientX,
                y: evt.clientY
            }
            _self.mouseclickPositionDiffers = true;
            //console.log("Clicked on:", _self.mouseclickPosition);
        };
    };



    this.getNewFloorPosition = function(camera) {

        if (!this.mouseclickPosition || !this.mouseclickPositionDiffers) {
            return null;
        }

        this.mouseclickPositionDiffers = false;

        var vector = new THREE.Vector3(
            (this.mouseclickPosition.x / window.innerWidth) * 2 - 1, -(this.mouseclickPosition.y / window.innerHeight) * 2 + 1,
            0.5
        );
        vector.unproject(camera);

        var ray = new THREE.Raycaster(camera.position,
            vector.sub(camera.position).normalize(), 0, 1000);



        var floorIntersectionPoint = null;
        var targetedGameObjects = [];

        // determine legit collisions
        ray.intersectObjects(scene.children).forEach(function(element, index) {
            if(!element.object.goblin){return;}

            if (element.object.goblin.isGameFloor) {

                floorIntersectionPoint = element.point;

            } else if (element.object.goblin.isGameObject) {
                targetedGameObjects.push(element.object)
            }
        });

        return {
            floorPoint: floorIntersectionPoint,
            gameobjects: targetedGameObjects
        };



    };



}