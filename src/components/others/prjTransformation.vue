<template>
  <div class="all">
    <div class="menu">
      <label>地图投影转换演示：</label>
      <el-button size="mini" type="primary" @click="transformation()">动态投影转换</el-button>
    </div>
    <div class="main">
      <div class="container">
        <label>投影坐标系(EPSG:4326)</label>
        <div id="map1" class="map"></div>
      </div>
      <div class="container">
        <label>投影坐标系(ESRI:53009)</label>
        <div id="map2" class="map"></div>
      </div>
    </div>
    
  </div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer, Graticule } from 'ol/layer'
import View from 'ol/View'
import { GeoJSON } from 'ol/format'
import * as proj from 'ol/proj'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4';

export default {
  mounted () {

  },
  data () {
    return {
      map1: null,
      map2: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.map1 = new ol.Map({
        target: 'map1',
        layers: [
          new TileLayer({
            source: new OSM(),
            name: '世界矢量图（OSM瓦片）'
          }),
          new VectorLayer({
            source: new VectorSource({
              url: '../../../static/data/geojson/countries.geojson',
              format: new GeoJSON()
            })
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 0,
          projection: 'EPSG:4326'
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    transformation () {
      // 定义球型摩尔威特投影坐标系（注意安装pro4, 否则会报错，npm install proj4）, 具体信息可在 http://epsg.io/53009 查看
      // 开始投影转换
      proj4.defs("ESRI:53009","+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs");
      register(proj4)
      let sphereMollweideProjection = new proj.Projection({
        code: 'ESRI:53009',
        extent: [-9009954.605703328, -9009954.605703328, 9009954.605703328, 9009954.605703328],
        worldExtent: [-179, -90, 179, 90]
      })
      if (this.map2 === null || this.map2 === undefined) {
        this.map2 = new ol.Map({
          target: 'map2',
          layers: [
            new VectorLayer({
              source: new VectorSource({
                url: '../../../static/data/geojson/countries.geojson',
                format: new GeoJSON()
              })
            })
          ],
          view: new View({
            center: [0, 0],
            zoom: 0,
            projection: sphereMollweideProjection
          })
        })
      }
      let graticule = new Graticule({
        map: this.map2
      })
    }
  }
}
</script>

<style scoped>
.all {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
}
.main {
  display: -webkit-flex; /* Safari */
  display: flex;
  height: 100%;
}
.main label {
  margin-bottom: 5px;
}
.container {
  width: 50%;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
}
.map {
  display: inline-block;
  background: #f8f4f0;
  width: 100%;
  height: 90%;
  border: 1px dashed #888;
  margin-top: 5px;
}
.menu {
  margin: 0 10px;
}
</style>