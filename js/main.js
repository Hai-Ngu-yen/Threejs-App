import "../css/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import Paint from "./paint.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
const orbitControls = new OrbitControls(camera, renderer.domElement);
const endButton = document.getElementById("endButton");
const clearButton = document.getElementById("clearButton");
const saveButton = document.getElementById("saveButton");
clearButton.addEventListener("click", clearPlanes);
endButton.addEventListener("click", drawPlane);

let drawedPlanes = [];
let points = [];
function clearPlanes() {
  drawedPlanes.forEach((mesh) => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    if (mesh.material instanceof Array) {
      mesh.material.forEach((material) => material.dispose());
    } else {
      mesh.material.dispose();
    }
  });

  drawedPlanes.length = 0;
  points = [];
}

function drawPlane() {
  points = Paint();
  //   console.log(points);
  const extrudeSettings = {
    steps: 1,
    depth: 50,
    bevelEnabled: false,
  };
  for (let j = 0; j < points.length; j++) {
    for (let i = 0; i < points[j].length - 1; i++) {
      const shape = new THREE.Shape();

      shape.moveTo((points[j][i].x - 500) / 2, (points[j][i].y - 250) / 2);
      shape.lineTo(
        (points[j][i + 1].x - 500) / 2,
        (points[j][i + 1].y - 250) / 2
      );

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      //   const edges3 = new THREE.EdgesGeometry(geometry);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      //   const line3 = new THREE.LineSegments(
      //     mesh,
      //     new THREE.LineBasicMaterial({ color: 0xffffff })
      //   );
      mesh.rotateX(THREE.Math.degToRad(90));
      mesh.position.y = 50;
      drawedPlanes.push(mesh);
      scene.add(mesh);
    }
  }
}
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 100, 100);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(300, 25);

gridHelper.scale.set(500 / 250, 1, 1);
scene.add(lightHelper, gridHelper);

const controls = new PointerLockControls(camera, renderer.domElement);

const onKeyDown = function (event) {
  switch (event.code) {
    case "KeyW":
      controls.moveForward(2);
      break;
    case "KeyA":
      controls.moveRight(-2);
      break;
    case "KeyS":
      controls.moveForward(-2);
      break;
    case "KeyD":
      controls.moveRight(2);
      break;
  }
};
document.addEventListener("keydown", onKeyDown, false);

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

function saveString(text, filename) {
  const blob = new Blob([text], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Save the scene
saveButton.addEventListener("click", () => {
  const sceneJSON = scene.toJSON();
  const sceneString = JSON.stringify(sceneJSON);
  saveString(sceneString, "scene.json");
});

function loadFile(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const contents = event.target.result;
    const sceneJSON = JSON.parse(contents);
    const loader = new THREE.ObjectLoader();
    const loadedScene = loader.parse(sceneJSON);
    // console.log(loadedScene);
    // while (scene.children.length) {
    //   scene.remove(scene.children[0]);
    // }

    scene.add(...loadedScene.children);
    animate();
  };

  reader.readAsText(file);
}

document.getElementById("file-input").addEventListener("change", loadFile);
