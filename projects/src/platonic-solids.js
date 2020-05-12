function init(){
    // use the defaults
    var scene = new THREE.Scene();                  // Create main scene
    var stats = initStats();                        // To show FPS information
    var renderer = initRenderer();                  // View function in util/utils
    //renderer.setClearColor("rgb(30, 30, 40)");
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);    //var camera = initCamera(new THREE.Vector3(0, 10, 20));
    camera.lookAt(0, 0, 0);
    camera.position.set(5, 15, 30);
    camera.up.set( 0, 1, 0 );

    var clock = new THREE.Clock();
    var light = initDefaultLighting(scene, new THREE.Vector3(25, 30, 20));  // Use default light

    // Show axes (parameter is size of each axis)
    var axes = new THREE.AxesHelper(12);
    axes.name = "AXES";
    axes.visible = false;
    scene.add(axes);

    var groundPlane = createGroundPlane(30, 30); // width and height
    groundPlane.rotateX(degreesToRadians(-90));
    scene.add(groundPlane);    

    // Enable mouse rotation, pan, zoom etc.
    var trackballControls = initTrackballControls(camera, renderer);

    // Object Material for all objects
    var objectMaterial = new THREE.MeshPhongMaterial({color:"rgb(255, 0, 0)"});

    // Add objects to scene
    var objectArray = new Array();
    scene.add(createTetrahedron(4.0, 0));
    scene.add(createCube(5.0));
    scene.add(createOctahedron(4.0, 0));
    scene.add(createDodecahedron(4.0, 0));
    scene.add(createIcosahedron(4.0, 0));
    
    // Position of the cube
    objectArray[1].position.y = 5;

    /*var controls = new function () {
        this.rotation = 0.02;
        this.mesh;
    };*/
    
    // Controls of sidebar
    var controls = new function () {
        var self = this;

        // Axes
        this.axes = false;
        this.axesSize = 10;

        this.updateAxes = function(){
            scene.remove(axes);                                 //Remove o eixo antigo
            axes = new THREE.AxesHelper(controls.axesSize);
            axes.visible = this.axes;
            scene.add(axes);
        }

        // Inicia a geometria e material de base a serem controlados pelo menu interativo
        //this.appliedMaterial = applyMeshNormalMaterial;
        this.castShadow = true;
        this.groundPlaneVisible = true;

        //Physics
        this.rotation = 0.02;
        this.color = "rgb(255, 0, 0)";

        // Geometry
        this.mesh = objectArray[0];
        this.meshNumber = 0;
        this.radius = 10;
        this.detail = 0;
        this.type = 'Tetrahedron';

        this.choosePoligon = function(){
            objectArray[this.meshNumber].visible = false;
            switch (this.type) {
                case 'Tetrahedron':
                    this.meshNumber = 0;
                    break;
                case 'Cube':
                    this.meshNumber = 1;
                    break;
                case 'Octahedron':
                    this.meshNumber = 2;
                    break;
                case 'Dodecahedron':
                    this.meshNumber = 3;
                    break;
                case 'Icosahedron':
                    this.meshNumber = 4;
                    break;
            }
            objectArray[this.meshNumber].visible = true;
            this.mesh = objectArray[this.meshNumber];
        }

        this.updateColor = function(){
            // removing the objects with the old material color
            for(let i = 0; i < objectArray.length; i++){            
                //scene.remove(scene.getObjectByName("particles1"));
                scene.remove(objectArray[i]);
            }
            objectArray = new Array();
            objectMaterial = new THREE.MeshPhongMaterial({color:controls.color});   // Setting the material with new color
            
            // Recreating those objects
            scene.add(createTetrahedron(4.0, 0));
            scene.add(createCube(5.0));
            scene.add(createOctahedron(4.0, 0));
            scene.add(createDodecahedron(4.0, 0));
            scene.add(createIcosahedron(4.0, 0));
            
            // Position of the cube
            objectArray[1].position.y = 5;

            controls.choosePoligon();
        }
    }

    // GUI de controle e ajuste de valores especificos da geometria do objeto
    var gui = new dat.GUI();

    var guiFolder = gui.addFolder("Properties");
    guiFolder.open();                                       // Open the folder
    guiFolder.add(controls, "axes").listen().onChange(function(e){
        if(controls.axes){
         axes.visible = true;
        }
        else{
         axes.visible = false;
        }
    });
    guiFolder.add(controls, "axesSize", 1, 40).listen().onChange(function(e){
         controls.updateAxes();
    });
    guiFolder.add(controls, 'rotation', 0, 0.5);
    //gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
    //gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
    guiFolder.addColor(controls, 'color').onChange(function(e){
        controls.updateColor();
    });

    guiFolder.add(controls, 'type', ['Tetrahedron','Cube', 'Octahedron', 'Dodecahedron', 'Icosahedron']).onChange(function(e){
        controls.choosePoligon();
    });

    controls.choosePoligon();               // Update de selection of the polygon

    // 4 faces
    function createTetrahedron(radius, detail)
    {
        var geometry = new THREE.TetrahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.castShadow = true;
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Tetrahedron";
        objectArray.push(object);
        return object;
    }

    // 6 faces
    function createCube(s)
    {
        let geometry = new THREE.BoxGeometry(s, s, s);
        let object = new THREE.Mesh(geometry, objectMaterial);
        object.castShadow = true;
        object.position.set(0.0, s/2.0, 0.0);
        object.visible = false;
        object.name = "Cube";
        objectArray.push(object);
        return object;
    }

    // 8 faces
    function createOctahedron(radius, detail)
    {
        var geometry = new THREE.OctahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.castShadow = true;
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Octahedro";
        objectArray.push(object);
        return object;
    }

    // 12 faces
    function createDodecahedron(radius, detail)
    {
        var geometry = new THREE.DodecahedronGeometry(radius, detail);
        var object = new THREE.Mesh(geometry, objectMaterial);
        object.castShadow = true;
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Dodecahedron";
        objectArray.push(object);
        return object;
    }

    // 20 faces
    function createIcosahedron(radius, detail)
    {
        let geometry = new THREE.IcosahedronGeometry(radius, detail);
        let object = new THREE.Mesh(geometry, objectMaterial);
        object.castShadow = true;
        object.position.set(0.0, radius, 0.0);
        object.visible = false;
        object.name = "Icosahedron";
        objectArray.push(object);
        return object;
    }
    

    render();
    function render() {
        stats.update();
        trackballControls.update(clock.getDelta());

        // Rotating the mesh selected
        controls.mesh.rotation.x += controls.rotation;
        controls.mesh.rotation.y += controls.rotation;
        controls.mesh.rotation.z += controls.rotation;
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}