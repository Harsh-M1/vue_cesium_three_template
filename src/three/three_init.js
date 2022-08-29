import * as THREE from "three";
import * as Cesium from "cesium";

// three全局对象
let three = {
  renderer: null,
  camera: null,
  scene: null,
};
// three.js物体
let objects3D = [];
//封装three物体（使three物体具有经纬度）
function Object3D(mesh, minWGS84, maxWGS84) {
  this.threeMesh = mesh; //物体
  this.minWGS84 = minWGS84; //范围
  this.maxWGS84 = maxWGS84; //范围
}
function initThree() {
  //初始化Three
  // 设置相机配置
  let fov = 45; //视角
  let aspect = window.innerWidth / window.innerHeight; //宽高比例
  let near = 0.1;
  let far = 10 * 1000 * 1000; //视域范围

  // 初始化场景
  three.scene = new THREE.Scene();
  three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  three.renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
    alpha: true,
  });
  // 设置渲染器大小
  three.renderer.setSize(window.innerWidth, window.innerHeight);

  // 添加环境光
  let ambientLight = new THREE.AmbientLight(0xffffff, 1);
  three.scene.add(ambientLight);
  // 添加three.jscanvas元素到cesium容器
  cesiumContainer.appendChild(three.renderer.domElement);
}
// 创建three.js物体
function createMesh(minWGS84, maxWGS84) {
  let geometry = new THREE.BoxBufferGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });
  let mesh = new THREE.Mesh(geometry, material);

  // 放大物体
  mesh.scale.set(100, 100, 100); // 放大
  mesh.position.set(0, 0, 50); // 平移

  let meshGroup = new THREE.Group();
  meshGroup.add(mesh);
  // 添加至场景
  three.scene.add(meshGroup);
  // 创建3d物体
  let OB3d = new Object3D(
    meshGroup,
    [minWGS84[0], minWGS84[1]],
    [maxWGS84[0], maxWGS84[1]]
  );

  // 添加到3d物体数组
  objects3D.push(OB3d);
}

function renderThree(cesium) {
  // 设置相机跟cesium保持一致
  
  three.camera.fov = Cesium.Math.toDegrees(cesium.viewer.camera.frustum.fovy);
  //console.log(cesium);
  // 声明一个将cesium框架的cartesian3转换为three.js的vector3（笛卡尔坐标转换为三维向量）
  let cartToVec = function (cart) {
    return new THREE.Vector3(cart.x, cart.y, cart.z);
  };
  // 将3D的物体通过经纬度转换成对应的位置
  objects3D.forEach((item, index) => {
    // 通过经纬度获取中心点的位置
    let center = Cesium.Cartesian3.fromDegrees(
      (item.minWGS84[0] + item.maxWGS84[0]) / 2,
      (item.minWGS84[1] + item.maxWGS84[1]) / 2
    );
    item.threeMesh.position.copy(cartToVec(center));

    //计算朝向（切面方向-切线向量）
    //中心高度点
    let centerHeight = Cesium.Cartesian3.fromDegrees(
      (item.minWGS84[0] + item.maxWGS84[0]) / 2,
      (item.minWGS84[1] + item.maxWGS84[1]) / 2,
      1
    );
    //左下
    let bottomLeft = cartToVec(
      Cesium.Cartesian3.fromDegrees(item.minWGS84[0], item.minWGS84[1])
    );
    //左上
    let topLeft = cartToVec(
      Cesium.Cartesian3.fromDegrees(item.minWGS84[0], item.maxWGS84[1])
    );
    //朝向（）
    let latDir = new THREE.Vector3()
      .subVectors(bottomLeft, topLeft)
      .normalize();

    // console.log(item);
    //设置查看方向
    item.threeMesh.lookAt(centerHeight.x, centerHeight.y, centerHeight.z);
    //设置朝向
    item.threeMesh.up.copy(latDir);
  });

  //设置摄像机矩阵
  // 设置相机跟cesium保持一致
  three.camera.matrixAutoUpdate = false; //自动更新
  //复制cesium相机矩阵
  let cvm = cesium.viewer.camera.viewMatrix;
  let civm = cesium.viewer.camera.inverseViewMatrix;
  // three相机默认朝向0,0,0
  three.camera.lookAt(0, 0, 0);

  // 设置threejs相机矩阵
  three.camera.matrixWorld.set(
    civm[0],
    civm[4],
    civm[8],
    civm[12],
    civm[1],
    civm[5],
    civm[9],
    civm[13],
    civm[2],
    civm[6],
    civm[10],
    civm[14],
    civm[3],
    civm[7],
    civm[11],
    civm[15]
  );

  three.camera.matrixWorldInverse.set(
    cvm[0],
    cvm[4],
    cvm[8],
    cvm[12],
    cvm[1],
    cvm[5],
    cvm[9],
    cvm[13],
    cvm[2],
    cvm[6],
    cvm[10],
    cvm[14],
    cvm[3],
    cvm[7],
    cvm[11],
    cvm[15]
  );
  //设置宽高比例
  let width = cesiumContainer.clientWidth;
  let height = cesiumContainer.clientHeight;
  three.camera.aspect = width / height;
  //更新相机矩阵
  three.camera.updateProjectionMatrix();
  //设置尺寸大小
  three.renderer.setSize(width, height);
  three.renderer.clear();
  three.renderer.render(three.scene, three.camera);
}
export {initThree,createMesh,renderThree};
