import * as Cesium from "cesium";
import "../Widgets/widgets.css";
// 设置cesium的token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzNkNTE5Zi1mMjY4LTRiN2QtOTRlZC1lOTUyM2NhNDYzNWYiLCJpZCI6NTU0OTYsImlhdCI6MTYyNTAyNjMyOX0.a2PEM4hQGpeuMfeB9-rPp6_Gkm6O-02Dm4apNbv_Dlk";
// cesium默认资源路径
window.CESIUM_BASE_URL = "/Cesium/";
// 设置默认的视角为中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);
// 设置全局cesium对象
let cesium = {
  viewer: null,
};
function initCesium(minWGS84, maxWGS84, cesiumContainerid) {
  var cesiumContainer = cesiumContainerid;
  // 设置cesium容器
  var cesiumContainer = document.getElementById("cesiumContainer");
  // 初始化cesium渲染器
  cesium.viewer = new Cesium.Viewer(cesiumContainer, {
    useDefaultRenderLoop: false,
    selectionIndicator: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    baseLayerPicker: false,
    clock: false,
    geocoder: false,
    //     天地图矢量路径图
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
      layer: "tdtBasicLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }),
    //cesium中webgl选项
    contextOptions: {
      webgl: {
        //透明度
        alpha: false,
        // 抗锯齿
        antialias: true,
        //深度检测
        depth: true,
      },
    },
  });
  //设置隐藏logo
  cesium.viewer.cesiumWidget.creditContainer.style.display = "none";
  // 设置抗锯齿
  cesium.viewer.scene.postProcessStages.fxaa.enabled = true;
  // 地图叠加
  var imageryLayers = cesium.viewer.imageryLayers;
  //console.log(imageryLayers);
  var layer = imageryLayers.addImageryProvider(
    new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
      layer: "tdtBasicLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    })
  );
  layer.alpha = 0.5;
  // 设置前往地点
  let center = Cesium.Cartesian3.fromDegrees(
    (minWGS84[0] + maxWGS84[0]) / 2,
    (minWGS84[1] + maxWGS84[1]) / 2,
    20000
  );

  // 设置相机飞往该区域
  cesium.viewer.camera.flyTo({
    destination: center,
    duration: 2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });
}
function renderCesium() {
  cesium.viewer.render();
}
function exportCesium() {
    let cesiumdone = cesium;
    return cesiumdone;
}
export  { exportCesium,initCesium, renderCesium };
