import * as THREE from 'three';

export default class Rack {
  constructor(width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  create() {
    const group = new THREE.Group();

    // Thân máy chính
    //const bodyGeometry = new THREE.BoxGeometry(20, 10, 5);
    const bodyGeometry = new THREE.BoxGeometry(
      this.width,
      this.height,
      this.depth
    );
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Lưới tản nhiệt
    const grillGeometry = new THREE.PlaneGeometry(
      this.width * 0.9,
      this.height * 0.9
    );
    const grillMaterial = new THREE.MeshPhongMaterial({
      color: 'grey',
      side: THREE.DoubleSide,
    });
    const grill = new THREE.Mesh(grillGeometry, grillMaterial);
    grill.position.set(0, 0, this.depth / 2 + 1);
    group.add(grill);

    // Cánh đảo gió
    const finGeometry = new THREE.BoxGeometry(
      this.width * 0.9,
      this.height * 0.1,
      this.depth * 0.1
    );
    const finMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
    const fin = new THREE.Mesh(finGeometry, finMaterial);
    fin.position.set(0, -(this.height / 2) * 0.8, this.depth / 2 + 1);
    group.add(fin);

    // Logo
    const logoGeometry = new THREE.CircleGeometry(this.height * 0.1);
    const logoMaterial = new THREE.MeshPhongMaterial({ color: 'black' });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(
      (-this.width / 2) * 0.7,
      (this.height / 2) * 0.7,
      this.depth / 2 + 2
    );
    group.add(logo);

    // Đèn báo
    const lightGeometry = new THREE.CircleGeometry(this.height * 0.05, 32);
    const lightMaterial = new THREE.MeshPhongMaterial({
      color: 'green',
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.set(
      (this.width / 2) * 0.7,
      (this.height / 2) * 0.7,
      this.depth / 2 + 2
    );
    group.add(light);

    return group;
  }
}
