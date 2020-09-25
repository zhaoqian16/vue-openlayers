<!--
 * @Author: your name
 * @Date: 2020-09-22 10:20:54
 * @LastEditTime: 2020-09-22 10:29:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\graphicDraw\drawGeometry.vue
-->
<template>
  <div id="map">
    <div class="menu">  
      <el-select v-model="type" @change="handleChange">
        <el-option v-for="item in typeList" :label="item.label" :value="item.type" :key="item.type"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css';
import { Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'
import {Fill, Stroke, Circle, Style} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {createRegularPolygon, createBox} from 'ol/interaction/Draw';
import Polygon from 'ol/geom/Polygon';

export default {
  data () {
    return {
      map: null,
      typeList: [
        { type: 'Point', label: '点'},
        { type: 'LineString', label: '线' },
        { type: 'Polygon', label: '面' },
        { type: 'Circle', label: '圆' },
        { type: 'Square', label: '正方形' },
        { type: 'Box', label: '长方形' },
        { type: 'Star', label: '六角星'}
      ],
      type: 'Point',
      source: null,
      draw: null,
      modify: null,
      snap: null
    }
  },
  components: {

  },
  mounted () {
    this.initMap()
    this.initVectorLayer()
    this.initModify()
    this.addInteractions()
  },
  methods: {
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            title: 'osm',
            source: new OSM()
          })
        ],
        view: new View({
          center: [-11000000, 4600000],
          zoom: 4
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    initVectorLayer () {
      this.source = new VectorSource({
        wrapX: false
      })
      this.vectorLayer = new VectorLayer({
        title: 'vectorLayer',
        source: this.source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          })
        })
      })
      this.map.addLayer(this.vectorLayer)

    },
    initModify () {
      this.modify = new Modify({ source: this.source })
      this.map.addInteraction(this.modify)
    },
    addInteractions () {
      let geomFunc
      let value = this.type
      if (value === 'Square') {
        value = 'Circle'
        geomFunc = createRegularPolygon(4)
      } else if (value === 'Box') {
        value = 'Circle'
        geomFunc = createBox()
      } else if (value === 'Star') {
        value = 'Circle'
        geomFunc = function (coordinates, geometry) {
          let center = coordinates[0]
          let last = coordinates[1]
          let dx = center[0] - last[0]
          let dy = center[1] - last[1]
          let radius = Math.sqrt(dx * dx + dy * dy)
          let rotation = Math.atan2(dy, dx)
          let newCoordinates = []
          let numPoints = 12
          for (let i = 0; i < numPoints; ++i) {
            let angle = rotation + (i * 2 * Math.PI) / numPoints
            let fraction = i % 2 === 0 ? 1 : 0.5
            let offsetX = radius * fraction * Math.cos(angle)
            let offsetY = radius * fraction * Math.sin(angle)
            newCoordinates.push([center[0] + offsetX, center[1] + offsetY])
          }
          newCoordinates.push(newCoordinates[0].slice())
          if (!geometry) {
            geometry = new Polygon([newCoordinates]);
          } else {
            geometry.setCoordinates([newCoordinates]);
          }
          return geometry
        }
      }
      this.draw = new Draw({
        source: this.source,
        type: value,
        geometryFunction: geomFunc
      })
      this.map.addInteraction(this.draw)

      this.snap = new Snap({ source: this.source })
      this.map.addInteraction(this.snap)
    },
    handleChange () {
      this.map.removeInteraction(this.draw)
      this.addInteractions()
    }

  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
}
</style>