function Snake(scene, boxsize, originalLength) {
    this.body = [];
    this.edges = [];
    this.length = originalLength;
    this.scene = scene;
    this.direction = 4;
    this.geometry = new THREE.BoxGeometry(6, 6, 6);
    this.material = new THREE.MeshLambertMaterial({color:0x00ff00});
    //this.material.color = new THREE.Color(18, 32, 40);
    this.edgeGeometry = new THREE.EdgesGeometry(this.geometry); // or WireframeGeometry
    this.edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
    var edge = new THREE.LineSegments(this.edgeGeometry, this.edgeMaterial);



    this.boxsize = boxsize;
}
Snake.prototype = {
    init: function() {
        var x = 10 * Math.floor(Math.random() * 18 - 9);
        var y = -10 * Math.floor(Math.random() * 6);
        var z = 10 * Math.floor(Math.random() * 18 - 9);

        for (var i = 0; i < this.length; i++) {
            var temp = new THREE.Mesh(this.geometry, this.material);
            //  var tempEdge = new THREE.LineSegments( this.edgeGeometry, this.edgeMaterial );
            temp.position.set(x + 5, y + 5, z + 5);
            //    tempEdge.position.set(x + 5, y + 5, z + 5);

            y -= 10;
            this.body.push(temp);
            //    this.edges.push(tempEdge);
        }
        this.body.forEach(function(part) {
            this.scene.add(part);
        });
        /* this.edges.forEach(function (part) {
            this.scene.add(part);
         });
         */
    },
    move: function() {
        var temp = this.body.pop();
        var firstpos = this.body[0].position;
        temp.position.x = firstpos.x + snakeMovement[this.direction][0];
        temp.position.y = firstpos.y + snakeMovement[this.direction][1];
        temp.position.z = firstpos.z + snakeMovement[this.direction][2];
        //    temp.material.color.setRGB(new THREE.Color(155,0,0));
        // add different color based on height

        this.body.unshift(temp);
        /*
        var tempEdge = this.edges.pop();
        tempEdge.position.set(temp.position);
        this.edges.unshift(tempEdge);
      */
        if (this.isWallImpact())
            return false;
        else
            return true;
    },
    isWallImpact: function() {
        //      console.log(this.body[0].position);
        if (this.body[0].position.x >= this.boxsize || this.body[0].position.x <= -this.boxsize)
            return true;
        if (this.body[0].position.y >= this.boxsize || this.body[0].position.y <= -this.boxsize)
            return true;
        if (this.body[0].position.z >= this.boxsize || this.body[0].position.z <= -this.boxsize)
            return true;
        return false;
    },
    add: function() {
        var temp = new THREE.Mesh(this.geometry, this.material);
        var last = this.body[this.body.length - 1];
        temp.position.set(last.position);
        this.body.push(temp);
        this.scene.add(temp);
        this.length++;
        console.log(this.length);
    },
    isSelfCrash: function() {
        var count = 0;
        var head = this.body[0];
        this.body.forEach(function(part) {
            if (part.position.x == head.position.x && part.position.y == head.position.y && part.position.z == head.position.z)
                count++;
        });
        //     console.log(count);
        if (count > 1)
            return true;
        else
            return false;
    }
}