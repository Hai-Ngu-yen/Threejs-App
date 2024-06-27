import "../css/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/examples/jsm/controls/DragControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
// import Paint from "./paint.js";
import Rack from "./Rack.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
const orbitControls = new OrbitControls(camera, renderer.domElement);
const endButton = document.getElementById("endButton");
const clearButton = document.getElementById("clearButton");
const moveButton = document.getElementById("moveButton");
const addButton = document.getElementById("addButton");
const tooltip = document.getElementById("tooltip");

clearButton.addEventListener("click", clearPlanes);
// endButton.addEventListener("click", drawPlane);
// moveButton.addEventListener("click", moveObjects);
addButton.addEventListener("click", addRacks);

let movable = false;
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

  // while (scene.children.length) {
  //   const child = scene.children[0];
  //   // Check if the child has material(s) and dispose of it/them
  //   if (child.material) {
  //     if (Array.isArray(child.material)) {
  //       child.material.forEach((material) => {
  //         material.dispose();
  //       });
  //     } else {
  //       child.material.dispose();
  //     }
  //   }

  //   // If the child has a texture, dispose of it
  //   if (child.texture) child.texture.dispose();
  //   scene.remove(child);
  // }

  // dragControls.dispose();

  for (let rack of racks) {
    // transformControls.detach(rack);
    scene.remove(rack);
    // rack = null;
  }
  console.log(scene);
  tmpPositionX = -100;
  // tmpPositionZ = -10;
  scene.add(lightHelper, gridHelper);

  drawedPlanes.length = 0;
  points = [];
  racks = [];
  draggableServerU = [];

  dragControls.dispose();
  dragControls = new DragControls(
    draggableServerU,
    camera,
    renderer.domElement
  );
  snapPostions = [];
  dragControls.addEventListener("dragstart", disableOrbitControls);
  dragControls.addEventListener("dragend", enableOrbitControls);
  dragControls.addEventListener("drag", snapToRack);
  dragControls.addEventListener("hoveron", displayBox);
  dragControls.addEventListener("hoveroff", hideBox);
}

// function drawPlane() {
//   points = Paint();
//   const extrudeSettings = {
//     steps: 1,
//     depth: 70,
//     bevelEnabled: false,
//   };
//   for (let j = 0; j < points.length; j++) {
//     for (let i = 0; i < points[j].length - 1; i++) {
//       const shape = new THREE.Shape();

//       shape.moveTo((points[j][i].x - 500) / 2, (points[j][i].y - 250) / 2);
//       shape.lineTo(
//         (points[j][i + 1].x - 500) / 2,
//         (points[j][i + 1].y - 250) / 2
//       );

//       const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
//       // const material = new THREE.MeshBasicMaterial({
//       //   color: 0x00ff00,
//       // });
//       // const mesh = new THREE.Mesh(geometry, material);
//       const edges3 = new THREE.EdgesGeometry(geometry);
//       const line3 = new THREE.LineSegments(
//         edges3,
//         new THREE.LineBasicMaterial({ color: 0xffffff })
//       );
//       line3.rotateX(THREE.Math.degToRad(90));
//       line3.position.y = 70;
//       // objects.push(line3);
//       drawedPlanes.push(line3);
//       scene.add(line3);
//     }
//   }
// }

// function moveObjects() {
//   movable = !movable;
//   transformControls.showX = movable;
//   transformControls.showY = movable;
//   transformControls.showZ = movable;
// }

let tmpPositionX = -100;
// let tmpPositionZ = -10;
let draggableServerU = [];
let racks = [];
let snapPostions = [];
function addRacks() {
  const rackMesh = new Rack(
    document.getElementById("length").value,
    document.getElementById("width").value,
    document.getElementById("number").value
  );
  const rackTmp = rackMesh.createRack();
  rackTmp.position.x = tmpPositionX;
  // rackTmp.position.z = tmpPositionZ;
  tmpPositionX -= document.getElementById("length").value * 2;
  // tmpPositionZ -= document.getElementById("width").value;
  scene.add(rackTmp);
  racks.push(rackTmp);
  draggableServerU.push(...Array.from(rackTmp.children).slice(1));

  for (let i = 0; i < rackTmp.children.length; i++) {
    const p = rackTmp.children[i];
    if (p.name.includes("serverU")) {
      snapPostions.push(
        new THREE.Vector3(p.position.x, p.position.y, p.position.z)
      );
    }
  }

  //console.log(rackMesh.getPositionList());
  // const dragControls = new DragControls(
  //   Array.from(rackTmp.children).slice(1),
  //   camera,
  //   renderer.domElement
  // );
  // dragControls2.transformGroup = true;

  // dragControls2.addEventListener("hoveron", function (event) {
  //   transformControls.attach(rackTmp);
  //   if (event.object.name == "serverU") {
  //     dragControls2.enabled = true;
  //     dragControls2.transformGroup = false;
  //   } else {
  //     dragControls2.enabled = false;
  //   }
  // });

  // let previousPosition;

  // dragControls2.addEventListener("dragstart", function () {
  //   disableOrbitControls();
  //   previousPosition = rackTmp.position.clone(); // Lưu lại vị trí ban đầu của rack
  // });

  // dragControls2.addEventListener("dragend", function () {
  //   enableOrbitControls();
  //   if (checkRackCollisions(rackTmp)) {
  //     rackTmp.position.copy(previousPosition); // Hoàn tác vị trí của rack về vị trí cuối cùng trước khi có va chạm
  //   }
  // });
}

// function checkRackCollisions(draggedRack) {
//   const draggedRackBox = new THREE.Box3().setFromObject(draggedRack);

//   for (const rack of racks) {
//     if (rack !== draggedRack) {
//       const rackBox = new THREE.Box3().setFromObject(rack);

//       if (draggedRackBox.intersectsBox(rackBox)) {
//         // Xử lý va chạm ở đây
//         // Ví dụ: Ngăn chặn việc di chuyển rack đang kéo
//         return true;
//       }
//     }
//   }

//   return false;
// }
let dragControls = new DragControls(
  draggableServerU,
  camera,
  renderer.domElement
);

const enableOrbitControls = function () {
  orbitControls.enabled = true;
};

const disableOrbitControls = function () {
  orbitControls.enabled = false;
};

const snapToRack = function (event) {
  snapPostions.forEach((target) => {
    if (event.object.position.distanceTo(target) < 13) {
      event.object.position.copy(target);
      // if (event.object.position.distanceTo(target) < 1) {
      //   let box = new THREE.BoxHelper(event.object, 0xffff00);
      //   scene.add(box);
      // }
    }
  });
};

var mouse = new THREE.Vector2();
document.addEventListener("mousemove", onMouseMove, false);
function onMouseMove(event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  tooltip.style.left = mouse.x + 10 + "px"; // Thêm một chút offset
  tooltip.style.top = mouse.y + 10 + "px";
}

const displayBox = function (event) {
  const box = new THREE.BoxHelper(event.object, 0xffff00);
  scene.add(box);

  const info = getObjectInfo(event.object);
  tooltip.innerHTML = info;
  // Hiển thị tooltip
  tooltip.style.display = "block";
};

const hideBox = function (event) {
  scene.remove(scene.children[scene.children.length - 1]);
  tooltip.style.display = "none";
};

function getObjectInfo(object) {
  // Hàm này trả về thông tin bạn muốn hiển thị trong tooltip
  // Ví dụ:
  return `
  <strong>Id:</strong> ${object.id}<br><br>
  <strong>Name:</strong> ${object.name}<br><br>
  <strong>Position:</strong> ${object.position.toArray().join(", ")}<br><br>
  <strong>UUID:</strong> ${object.uuid}<br><br>
  <strong>Type:</strong> ${object.type}<br><br>
  <strong>Temperature:</strong> 80ºC<br><br>
`;
}

dragControls.addEventListener("dragstart", disableOrbitControls);
dragControls.addEventListener("dragend", enableOrbitControls);
dragControls.addEventListener("drag", snapToRack);
dragControls.addEventListener("hoveron", displayBox);
dragControls.addEventListener("hoveroff", hideBox);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 100, 100);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(1000, 250);
// Thay đổi tỉ lệ chiều dài và chiều rộng của lưới
gridHelper.scale.set(2, 1, 1);
scene.add(lightHelper, gridHelper);

const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// const transformControls = new TransformControls(camera, renderer.domElement);

// scene.add(transformControls);

// transformControls.addEventListener("dragging-changed", function (event) {
//   orbitControls.enabled = !event.value;
// });

// transformControls.showX = false;
// transformControls.showY = false;
// transformControls.showZ = false;

function animate() {
  requestAnimationFrame(animate);
  for (const rack of racks) {
    rack.children.forEach((child) => {
      if (child.name.includes("serverU")) {
        child.position.clamp(
          new THREE.Vector3(-1000, 0, 0),
          new THREE.Vector3(1000, 1000, 0)
        );
      }
    });
  }
  renderer.render(scene, camera);
}

//Racks

// let positionX = 200;
// let positionZ = 200;
// for (let i = 1; i <= 20; i++) {
//   let rackMesh = new Rack(70, 50, 10);
//   let rackTmp = rackMesh.createRack();
//   rackTmp.position.x = positionX;
//   rackTmp.position.z = positionZ;
//   positionZ -= 100;
//   scene.add(rackTmp);
//   if (i % 5 === 0) {
//     positionX -= 150;
//     positionZ = 200;
//   }
// }

animate();
