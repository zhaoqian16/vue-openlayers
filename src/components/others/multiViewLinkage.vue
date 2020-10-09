<template>
  <div class="outer">
    <div class="container">
      <label>Canvas</label>
      <div id="canvasMap" class="map"></div>
    </div>
    <div class="container">
      <label>WebGL</label>
      <div id="webglMap" class="map"></div>
    </div>
  </div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css'
import { Tile as TileLayer} from 'ol/layer';
import { XYZ } from 'ol/source'
import View from 'ol/view'

export default {
  mounted () {
    this.initCanvasMap()
    this.initWebglMap()
  },
  data () {
    return {
      canvasMap: null,
      webglMap: null
    }
  },
  methods: {
    initCanvasMap () {
      this.canvasMap = new ol.Map({
        target: 'canvasMap',
        layers: [
          new TileLayer({
            title: '天地图矢量图层',
            source: new XYZ({
              url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=76892c38deab957e65556e5824ca53e9',
              wrapX: false
            })
          }),
          new TileLayer({
            title: '天地图矢量图层注记',
            source: new XYZ({
              url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=76892c38deab957e65556e5824ca53e9',
              wrapX: false
            })
          })
        ],
        view: new View({
          center: [116.3333, 39.95],
          minZoom: 2,
          zoom: 6,
          projection: 'EPSG:4326'
        })
      })
    },
    initWebglMap () {
      this.webglMap = new ol.Map({
        target: 'webglMap',
        layers: [
          new TileLayer({
            title: '天地图影像图层',
            source: new XYZ({
              url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=76892c38deab957e65556e5824ca53e9',
              crossOrigin: "anonymous",
              wrapX: false
            })
          }),
          new TileLayer({
            title: '天地图矢量图层注记',
            source: new XYZ({
              url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=76892c38deab957e65556e5824ca53e9',
              crossOrigin: "anonymous",
              wrapX: false
            })
          })
        ],
        view: this.canvasMap.getView()
      })
    }
  }
}
</script>

<style scoped>
.outer {
  width: 100%;
  height: 100%;
  display: -webkit-flex; /* Safari */
  display: flex;
}
.outer .container {
  width: 50%;
  height: 90%;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}
.outer .map {
  background: #f8f4f0;
  width: 100%;
  height: 100%;
  border: 1px dashed #888;
  margin-top: 5px;
}
</style>