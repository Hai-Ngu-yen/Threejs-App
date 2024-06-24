import * as THREE from "three";

export default class Rack {
  constructor(length, width, number) {
    this.length = length;
    this.width = width;
    this.height = number * 10 + 2;
    this.number = number;
  }

  createRack() {
    const rack = new THREE.Group();

    const blackMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.8,
      color: 0x000000,
    });
    // const whiteMaterial = new THREE.MeshBasicMaterial({
    //   transparent: true,
    //   opacity: 0.9,
    //   color: 0xffffff,
    // });

    // Tạo các hình khối lập phương cho kệ sách
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("ServerU.png");
    const materialsU = [
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a }), // Mặt 0
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a }), // Mặt 1
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a }), // Mặt 2
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a }), // Mặt 3
      new THREE.MeshLambertMaterial({ map: texture }), // Mặt 4
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a }), // Mặt 5
    ];

    const shelfGeometry = new THREE.BoxGeometry(this.length, 5, this.width);
    const baseGeometry = new THREE.BoxGeometry(this.height, 5, this.width);
    const backGeometry = new THREE.BoxGeometry(this.length, 5, this.height);

    // Tạo đáy và đỉnh màu đen
    const bottom = new THREE.Mesh(shelfGeometry, blackMaterial);
    bottom.position.y = 2;
    rack.add(bottom);

    const top = new THREE.Mesh(shelfGeometry, blackMaterial);
    top.position.y = this.number * 10;
    rack.add(top);

    // Tạo InstancedMesh cho các kệ ở giữa
    const shelfCount = this.number - 1; // Số kệ ở giữa
    if (shelfCount > 0) {
      const shelfInstancedMesh = new THREE.InstancedMesh(
        shelfGeometry,
        materialsU,
        shelfCount
      );

      // Ma trận để thiết lập vị trí cho mỗi instance
      const matrix = new THREE.Matrix4();

      // Thiết lập vị trí cho mỗi kệ ở giữa
      for (let i = 0; i < shelfCount; i++) {
        matrix.setPosition(0, (i + 1) * 10, 0);
        shelfInstancedMesh.setMatrixAt(i, matrix);
      }

      rack.add(shelfInstancedMesh);
    }

    // Tạo các phần đứng
    const base1 = new THREE.Mesh(baseGeometry, blackMaterial);
    const base2 = new THREE.Mesh(baseGeometry, blackMaterial);

    base1.rotateZ(THREE.Math.degToRad(90));
    base2.rotateZ(THREE.Math.degToRad(90));

    base1.position.set(-this.length / 2, this.height / 2, 0);
    base2.position.set(this.length / 2, this.height / 2, 0);

    rack.add(base1, base2);

    // Tạo phần sau
    const back = new THREE.Mesh(backGeometry, blackMaterial);
    back.rotateX(THREE.Math.degToRad(90));
    back.position.set(0, this.height / 2, -this.width / 2);
    rack.add(back);

    return rack;
  }
}
