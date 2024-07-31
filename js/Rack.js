import * as THREE from 'three';

export default class Rack {
  constructor(length, width, number) {
    this.length = length;
    this.width = width;
    this.height = number * 15 + 10;
    this.number = number;
  }

  createRack() {
    const rack = new THREE.Group();

    const blackMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.6,
      color: 0x000000,
    });
    // const whiteMaterial = new THREE.MeshBasicMaterial({
    //   transparent: true,
    //   opacity: 0.9,
    //   color: 0xffffff,
    // });

    // Tạo các hình khối lập phương cho kệ sách
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('ServerU.png');
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

    const baseInstancedMesh = new THREE.InstancedMesh(
      baseGeometry,
      blackMaterial,
      15
    );
    const matrix = new THREE.Matrix4();
    const positionVector = new THREE.Vector3();
    const rotationMatrix = new THREE.Matrix4();

    // Đặt ma trận cho instance 0
    positionVector.set(-this.length / 2, this.height / 2, 0);
    rotationMatrix.makeRotationZ(Math.PI / 2);
    matrix.compose(
      positionVector,
      new THREE.Quaternion().setFromRotationMatrix(rotationMatrix),
      new THREE.Vector3(1, 1, 1)
    );
    baseInstancedMesh.setMatrixAt(0, matrix);

    // Đặt ma trận cho instance 1
    positionVector.set(this.length / 2, this.height / 2, 0);
    rotationMatrix.makeRotationZ(Math.PI / 2);
    matrix.compose(
      positionVector,
      new THREE.Quaternion().setFromRotationMatrix(rotationMatrix),
      new THREE.Vector3(1, 1, 1)
    );
    baseInstancedMesh.setMatrixAt(1, matrix);

    // Đặt ma trận cho instance 2
    positionVector.set(0, this.height / 2, -this.width / 2);
    const euler = new THREE.Euler(Math.PI / 2, Math.PI / 2, 0, 'XYZ');
    const rotationMatrix2 = new THREE.Matrix4().makeRotationFromEuler(euler);
    matrix.compose(
      positionVector,
      new THREE.Quaternion().setFromRotationMatrix(rotationMatrix2),
      new THREE.Vector3(1, 1, this.length / this.width)
    );
    baseInstancedMesh.setMatrixAt(2, matrix);

    // Đặt ma trận cho instance 3
    positionVector.set(0, 2, 0);
    matrix.compose(
      positionVector,
      new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4()),
      new THREE.Vector3(this.length / this.height, 1, 1)
    );
    baseInstancedMesh.setMatrixAt(3, matrix);

    // Đặt ma trận cho instance 4
    positionVector.set(0, this.height, 0);
    matrix.compose(
      positionVector,
      new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4()),
      new THREE.Vector3(this.length / this.height, 1, 1)
    );
    baseInstancedMesh.setMatrixAt(4, matrix);

    for (let i = 1; i <= this.number; i++) {
      positionVector.set(0, i * 15 - 3, 0);
      matrix.compose(
        positionVector,
        new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4()),
        new THREE.Vector3(this.length / this.height, 0.3, 1)
      );
      baseInstancedMesh.setMatrixAt(i + 4, matrix);
    }

    // Cập nhật ma trận instance
    baseInstancedMesh.instanceMatrix.needsUpdate = true;
    baseInstancedMesh.name = 'rack';
    rack.add(baseInstancedMesh);

    for (let i = 0; i < this.number; i++) {
      const serverU = new THREE.Mesh(shelfGeometry, materialsU);
      // Tạo đèn LED nhỏ
      const ledGeometry = new THREE.CircleGeometry(1, 32);
      let ledMaterial;
      if (i % 2 === 0) {
        ledMaterial = new THREE.MeshBasicMaterial({ color: 'green' });
      } else {
        ledMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
      }
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      // Đặt đèn LED lên mặt thứ 4 của hộp
      led.position.set(this.length / 2 - 20, 0, this.width / 2 + 1); // Đặt LED hơi ra ngoài để tránh bị che khuất bởi hộp
      serverU.add(led);

      serverU.position.y = (i + 1) * 15;
      serverU.name = 'serverU ' + (i + 1);
      rack.add(serverU);
    }

    // Tạo đáy và đỉnh màu đen
    // const bottom = new THREE.Mesh(shelfGeometry, blackMaterial);
    // bottom.position.y = 2;
    // rack.add(bottom);

    // const top = new THREE.Mesh(shelfGeometry, blackMaterial);
    // top.position.y = this.number * 10;
    // rack.add(top);

    // // Tạo InstancedMesh cho các kệ ở giữa
    // const shelfCount = this.number - 1; // Số kệ ở giữa
    // if (shelfCount > 0) {
    //   const shelfInstancedMesh = new THREE.InstancedMesh(
    //     shelfGeometry,
    //     materialsU,
    //     shelfCount
    //   );

    //   // Ma trận để thiết lập vị trí cho mỗi instance
    //   const matrix = new THREE.Matrix4();

    //   // Thiết lập vị trí cho mỗi kệ ở giữa
    //   for (let i = 0; i < shelfCount; i++) {
    //     matrix.setPosition(0, (i + 1) * 10, 0);
    //     shelfInstancedMesh.setMatrixAt(i, matrix);
    //   }

    //   rack.add(shelfInstancedMesh);
    // }

    // // Tạo các phần đứng
    // const base1 = new THREE.Mesh(baseGeometry, blackMaterial);
    // const base2 = new THREE.Mesh(baseGeometry, blackMaterial);

    // base1.rotateZ(THREE.Math.degToRad(90));
    // base2.rotateZ(THREE.Math.degToRad(90));

    // base1.position.set(-this.length / 2, this.height / 2, 0);
    // base2.position.set(this.length / 2, this.height / 2, 0);

    // rack.add(base1, base2);

    // // Tạo phần sau
    // const back = new THREE.Mesh(backGeometry, blackMaterial);
    // back.rotateX(THREE.Math.degToRad(90));
    // back.position.set(0, this.height / 2, -this.width / 2);
    // rack.add(back);

    return rack;
  }
}
