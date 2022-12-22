import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
var pi = Math.PI;
/**
 * Light
 */

var col_light = 0xffffff; // set

var ambientLight = new THREE.AmbientLight(0xEEE3CB, 0.5);

var keyLight = new THREE.DirectionalLight(col_light, 0.6);
keyLight.position.set(20, 30, 10);
keyLight.castShadow = true;
keyLight.shadow.camera.top = 20;

var fillLight = new THREE.DirectionalLight(col_light, 0.3);
fillLight.position.set(-20, 20, 20);

var backLight = new THREE.DirectionalLight(0xEEE3CB, 0.3);
backLight.position.set(10, 3, -20);

scene.add(ambientLight);
scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

/**
 * Helper
 */
const keyLightHelper = new THREE.DirectionalLightHelper(keyLight, 10, 0xFF0000)
const fillLightHelper = new THREE.DirectionalLightHelper(fillLight, 10, 0xFF0000)
const backLightHelper = new THREE.DirectionalLightHelper(backLight, 10, 0xFF0000)

// scene.add(keyLightHelper)
// scene.add(fillLightHelper)
// scene.add(backLightHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const snowTexture = textureLoader.load('/textures/circle_05.png')

/**
 * Object
 */
//materials
var mat_orange = new THREE.MeshStandardMaterial({ color: 0xff8c75 });
var mat_grey = new THREE.MeshStandardMaterial({ color: 0xf3f2f7 });
var mat_yellow = new THREE.MeshStandardMaterial({ color: 0xfeb42b });
var mat_dark = new THREE.MeshStandardMaterial({ color: 0x5a6e6c });
var mat_brown = new THREE.MeshStandardMaterial({ color: 0xa3785f });
var mat_stone = new THREE.MeshStandardMaterial({ color: 0x9eaeac });
var mat_green = new THREE.MeshStandardMaterial({ color: 0xF7A4A4 });
var mat_greenL = new THREE.MeshStandardMaterial({ color: 0x76BA99 });
var mat_snow = new THREE.MeshStandardMaterial({ color: 0xE6FFFB });

/**
 * Particles
 */
// Geometry
const snowGeometry = new THREE.BufferGeometry()
const count = 1000

const positions = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++) 
{
  positions[i] = (Math.random() - 0.5) * 100
}

snowGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)
// Material
const snowMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: true,
    color: 0xffffff,
    transparent: true,
    alphaMap: snowTexture,
    depthWrite: false
    
})

// Particles
const snow = new THREE.Points(snowGeometry, snowMaterial)
scene.add(snow)


//-------------------------------------ground-------------------------------------
var layers = [];
var ground = new THREE.Group();
for (var i = 0; i < 5; i++) {
  var h = 0.1;
  var geometry = new THREE.CylinderGeometry(8 - i - 0.01, 8 - i, h, 9);
  layers.push(new THREE.Mesh(geometry, mat_snow));
  layers[i].position.y = h * i;
  layers[i].receiveShadow = true;
  ground.add(layers[i]);
}
layers[0].scale.x = 0.8;
layers[1].scale.set(0.77, 1, 0.91);
layers[1].rotation.y = ((2 * pi) / 9) * 0.6;
layers[2].scale.set(0.8, 1, 0.91);
layers[2].rotation.y = ((2 * pi) / 9) * 0.3;
layers[3].scale.set(0.75, 1, 0.92);
layers[3].rotation.y = ((2 * pi) / 9) * 0.7;
layers[4].scale.set(0.7, 1, 0.93);
layers[4].rotation.y = ((2 * pi) / 9) * 0.9;

var geo_base = new THREE.CylinderGeometry(8, 1, 10, 9);
var base = new THREE.Mesh(geo_base, mat_dark);
base.scale.x = layers[0].scale.x;
base.position.y = -5;
ground.add(base);
ground.position.y = -3

scene.add(ground);
//-------------------------------------trees-------------------------------------
var tree = new THREE.Group();

//trunk
var geo_trunk = new THREE.IcosahedronGeometry(9, 0);
var trunk = new THREE.Mesh(geo_trunk, mat_brown);
var a = new THREE.Vector3(1, 0, 10);
trunk.rotation.x = pi / 2;
trunk.position.y = 5;
trunk.scale.set(0.03, 0.03, 1);
trunk.castShadow = true;
trunk.receiveShadow = true;
tree.add(trunk);

//crown
var geo_crown = new THREE.IcosahedronGeometry(2.5, 0);
var crown = new THREE.Mesh(geo_crown, mat_green);
crown.scale.y = 0;
crown.scale.x = 0;
crown.scale.z = 0;
crown.rotation.z = -0.5;
crown.rotation.x = -0.2;
crown.position.set(trunk.position.x, 12, trunk.position.z);
crown.castShadow = true;
tree.add(crown);

//leaf
var leaf = new THREE.Group();
var mainStem = new THREE.Mesh(geo_trunk, mat_brown);
mainStem.scale.set(0.007, 0.007, 0.16);
mainStem.rotation.x = pi / 2;
mainStem.castShadow = true;
leaf.add(mainStem);

// var geo_blade = new THREE.CylinderGeometry(0.7, 0.7, 0.05, 12);
// var blade = new THREE.Mesh(geo_blade, mat_green);
// blade.rotation.z = pi / 2;
// blade.scale.x = 1.4;
// blade.position.set(-0.05, 0.4, 0);
// blade.castShadow = true;
// leaf.add(blade);

var subStems = [];
for (var i = 0; i < 8; i++) {
  subStems[i] = mainStem.clone();
  subStems[i].scale.set(0.0055, 0.0055, 0.01);
  subStems[i].castShadow = true;
  leaf.add(subStems[i]);
}
subStems[0].rotation.x = -pi / 4;
subStems[0].scale.z = 0.04;
subStems[0].position.set(0, 0.8, 0.2);

subStems[2].rotation.x = -pi / 6;
subStems[2].scale.z = 0.05;
subStems[2].position.set(0, 0.5, 0.25);

subStems[4].rotation.x = -pi / 8;
subStems[4].scale.z = 0.055;
subStems[4].position.set(0, 0.2, 0.3);

subStems[6].rotation.x = -pi / 10;
subStems[6].scale.z = 0.045;
subStems[6].position.set(0, -0.1, 0.26);

for (var i = 1; i < 8; i += 2) {
  subStems[i].rotation.x = -subStems[i - 1].rotation.x;
  subStems[i].scale.z = subStems[i - 1].scale.z;
  subStems[i].position.set(
    0,
    subStems[i - 1].position.y,
    -subStems[i - 1].position.z
  );
}
leaf.rotation.x = pi / 3;
leaf.rotation.z = 0.2;
leaf.position.set(trunk.position.x - 0.2, 5, trunk.position.z + 1);
tree.add(leaf);

var leaf_1 = leaf.clone();
leaf_1.rotation.x = -pi / 3;
leaf_1.position.set(trunk.position.x - 0.2, 6, trunk.position.z - 1);
tree.add(leaf_1);
tree.rotation.y = -pi / 12;
tree.position.set(-2, -3, -2);
scene.add(tree);

var tree_1 = tree.clone();
tree_1.scale.set(0.8, 0.8, 0.8);
tree_1.position.set(-1, -3, -5);
tree_1.rotation.y = -pi / 5;
scene.add(tree_1);

var tree_2 = tree.clone();
tree_2.scale.set(0.7, 0.7, 0.7);
tree_2.position.set(-2, -3, 0.5);
tree_2.rotation.y = -pi / 12;
tree_2.children[2].rotation.x = -pi / 3;
tree_2.children[2].position.z = trunk.position.z - 1;
tree_2.children[3].rotation.x = pi / 3;
tree_2.children[3].position.z = trunk.position.z + 1;
scene.add(tree_2);

//-------------------------------------stone-------------------------------------
var geo_stone = new THREE.DodecahedronGeometry(1, 0);
var stone = [];
for (var i = 0; i < 2; i++) {
  stone[i] = new THREE.Mesh(geo_stone, mat_snow);
  scene.add(stone[i]);
  stone[i].castShadow = true;
}
stone[0].rotation.set(0, 12, pi / 2);
stone[0].scale.set(3, 1, 1);
stone[0].position.set(-1, -2, 4.6);

stone[1].rotation.set(0, 0, pi / 2);
stone[1].scale.set(1, 1, 1);
stone[1].position.set(0, -2.8, 5.3);




//-------------------------------------sheep-------------------------------------
//sheep body
var sheep = new THREE.Group();
// var geo_sheepHead=new THREE.SphereGeometry(.5,8,6);
var geo_sheepHead = new THREE.IcosahedronGeometry(1, 0);
var sheepHead = new THREE.Mesh(geo_sheepHead, mat_dark);
sheepHead.scale.z = 0.6;
sheepHead.scale.y = 1.1;
sheepHead.position.y = 2.5;
sheepHead.rotation.x = -0.2;
sheepHead.castShadow = true;
sheep.add(sheepHead);

var geo_sheepBody = new THREE.IcosahedronGeometry(3.5, 0);
var sheepBody = new THREE.Mesh(geo_sheepBody, mat_grey);
sheepBody.position.set(0, sheepHead.position.y, -2.2);
sheepBody.scale.set(0.5, 0.5, 0.6);
sheepBody.rotation.set(0, 0, pi / 3);
sheepBody.castShadow = true;
sheep.add(sheepBody);

var geo_tail = new THREE.IcosahedronGeometry(0.5, 0);
var tail = new THREE.Mesh(geo_tail, mat_grey);
tail.position.set(sheepHead.position.x, sheepHead.position.y + 1.2, -3.8);
tail.castShadow = true;
sheep.add(tail);

var hair = [];
var geo_hair = new THREE.IcosahedronGeometry(0.4, 0);
for (var i = 0; i < 5; i++) {
  hair[i] = new THREE.Mesh(geo_hair, mat_grey);
  hair[i].castShadow = true;
  sheep.add(hair[i]);
}

hair[0].position.set(-0.4, sheepHead.position.y + 0.9, -0.1);
hair[1].position.set(0, sheepHead.position.y + 1, -0.1);
hair[2].position.set(0.4, sheepHead.position.y + 0.9, -0.1);
hair[3].position.set(-0.1, sheepHead.position.y + 0.9, -0.4);
hair[4].position.set(0.12, sheepHead.position.y + 0.9, -0.4);

hair[0].rotation.set(pi / 12, 0, pi / 3);
hair[1].rotation.set(pi / 12, pi / 6, pi / 3);
hair[2].rotation.set(pi / 12, 0, pi / 3);
hair[3].rotation.set(pi / 12, 0, pi / 3);
hair[4].rotation.set(pi / 12, pi / 6, pi / 3);

hair[0].scale.set(0.6, 0.6, 0.6);
hair[2].scale.set(0.8, 0.8, 0.8);
hair[3].scale.set(0.7, 0.7, 0.7);
hair[4].scale.set(0.6, 0.6, 0.6);

var legs = [];
var geo_leg = new THREE.CylinderGeometry(0.15, 0.1, 1, 5);
for (var i = 0; i < 4; i++) {
  legs[i] = new THREE.Mesh(geo_leg, mat_dark);
  legs[i].castShadow = true;
  legs[i].receiveShadow = true;
  sheep.add(legs[i]);
}
legs[0].position.set(0.5, 1.1, -1.5);
legs[1].position.set(-0.5, 1.1, -1.5);
legs[2].position.set(0.8, 1.1, -3);
legs[3].position.set(-0.8, 1.1, -3);

var feet = [];
var geo_foot = new THREE.DodecahedronGeometry(0.2, 0);
for (var i = 0; i < legs.length; i++) {
  feet[i] = new THREE.Mesh(geo_foot, mat_dark);
  sheep.add(feet[i]);
  feet[i].scale.set(1, 0.8, 1);
  feet[i].castShadow = true;
  feet[i].receiveShadow = true;
  feet[i].position.set(legs[i].position.x, 0, legs[i].position.z + 0.09);
}
feet[0].position.y = 0.56;
feet[1].position.y = 0.66;
feet[2].position.y = 0.7;
feet[3].position.y = 0.7;

//eyes
var geo_eye = new THREE.CylinderGeometry(0.3, 0.2, 0.05, 8);
var eyes = [];
for (var i = 0; i < 2; i++) {
  eyes[i] = new THREE.Mesh(geo_eye, mat_grey);
  sheep.add(eyes[i]);
  eyes[i].castShadow = true;
  eyes[i].position.set(0, sheepHead.position.y + 0.1, 0.5);
  eyes[i].rotation.x = pi / 2 - pi / 15;
}
eyes[0].position.x = 0.3;
eyes[1].position.x = -eyes[0].position.x;

eyes[0].rotation.z = -pi / 15;
eyes[1].rotation.z = -eyes[0].rotation.z;

//eyeballs
var geo_eyeball = new THREE.SphereGeometry(0.11, 8, 8);
var eyeballs = [];
for (var i = 0; i < 2; i++) {
  eyeballs[i] = new THREE.Mesh(geo_eyeball, mat_dark);
  sheep.add(eyeballs[i]);
  eyeballs[i].castShadow = true;
  eyeballs[i].position.set(
    eyes[i].position.x,
    eyes[i].position.y,
    eyes[i].position.z + 0.02
  );
}

sheep.position.set(4.8, -3.2, -1);
sheep.scale.set(0.8, 0.8, 0.8);
sheep.rotation.set(0, pi / 4, 0);
scene.add(sheep);

/**
 * Fence
 */
var fence = new THREE.Group();
var wood = [];
var geo_wood = new THREE.BoxGeometry(1, 1, 1);
for (var i = 0; i < 4; i++) {
  wood[i] = new THREE.Mesh(geo_wood, mat_brown);
  fence.add(wood[i]);
  wood[i].castShadow = true;
  wood[i].receiveShadow = true;
}
wood[0].scale.set(0.15, 1.7, 0.4);
wood[1].scale.set(0.15, 1.8, 0.4);
wood[2].scale.set(0.1, 0.3, 3.2);
wood[3].scale.set(0.1, 0.3, 3.2);

wood[0].position.set(0, 1.2, -1);
wood[1].position.set(0, 1, 1);
// wood[2].position.set(.12,1.5,0);
wood[2].position.set(0, 1.5, 0);
wood[3].position.set(0.12, 0.9, 0);

wood[3].rotation.x = pi / 32;
wood[2].rotation.x = -pi / 32;
wood[2].rotation.y = pi / 32;

fence.position.set(3, -3, 2);
fence.rotation.y = pi / 5;
scene.add(fence);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 20 
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: false,
    antialias: true
})

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor('#D6E4E5')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// document.body.appendChild(renderer.domElement);


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    snow.position.y -= elapsedTime  * 0.01
    snow.position.y = -(elapsedTime % 20)
    // console.log(elapsedTime % 10)
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()