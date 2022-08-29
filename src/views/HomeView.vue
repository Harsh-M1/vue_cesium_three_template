<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import * as Cesium from "cesium";
//import "cesium/Build/Cesium/Widgets/widgets.css";
import "../Widgets/widgets.css";
import * as THREE from "three";
import { exportCesium, initCesium, renderCesium } from "../cesium/cesium_init.js";
import { initThree, createMesh, renderThree } from "../three/three_init.js"

onMounted(() => {
  main();
});

function main() {
  // 设置北京显示模型的渲染范围(用于设置范围)
  var minWGS84 = [115.39, 38.9];
  var maxWGS84 = [117.39, 40.9];
  //初始化Cesium
  initCesium(minWGS84, maxWGS84, cesiumContainer);
  var cesium = exportCesium();
  //初始化Three
  initThree(minWGS84, maxWGS84);
  //创建物体
  createMesh(minWGS84, maxWGS84);
    //循环函数，不断请求动画帧渲染
  function loop() {
    requestAnimationFrame(loop);
    // cesium渲染
    renderCesium();
    // three.js渲染
    renderThree(cesium);
  }
  loop();
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#cesiumContainer {
  width: 100vw;
  height: 100vh;
  position: relative;
}

#cesiumContainer>canvas {
  position: absolute;
  top: 0;
  left: 0;
  /* 设置鼠标事件穿透 */
  pointer-events: none;
}
</style>
