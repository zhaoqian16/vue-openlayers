<template>
  <div id="map">
    <div class="menu">  
      <el-select v-model="type" @change="handleChange">
        <el-option v-for="item in typeList" :label="item.label" :value="item.type" :key="item.type"></el-option>
      </el-select>
      <el-button size="mini" @click="drawChange()">{{ drawStatus ? '停止编辑' : '开始编辑' }}</el-button>
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
import Select from 'ol/interaction/Select';


export default {
  data () {
    return {
      map: null,
      source: null,
      vectorLayer: null,
      modify: null,
      draw: null,
      snap: null,
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
      drawStatus: true,
      select: null,
      selectStyle: null
    }
  },
  mounted () {
    this.initMap()
    this.initVectorLayer()
    this.initModify()
    this.initDraw()
    this.initSnap()
  },
  methods: {
    /**
     * @description: 初始化地图
     * @param {type} 
     * @return {type} 
     */
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
    /**
     * @description: 初始化绘制图层---设置矢量源、待绘制的矢量图形的样式
     * @param {type} 
     * @return {type} 
     */
    initVectorLayer () {
      this.source = new VectorSource({
        wrapX: false
      })
      this.vectorLayer = new VectorLayer({
        title: 'vectorLayer',
        source: this.source,
        style: (() => {
          var styles = {}
          var image = new Circle({
            radius: 5,
            fill: null,
            stroke: new Stroke({ color: 'orange', width: 2 })
          })
          styles['Point'] = new Style({
            image: image
          });
          styles['Polygon'] = new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(1, 0, 255, 0.1)'
            })
          });
          styles['LineString'] = new Style({
            stroke: new Stroke({
              color: 'green',
              width:3
            })
          }),
          styles['default'] = new Style({
            stroke: new Stroke({
              color: 'red',
              width: 3
            }),
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.1)'
            }),
            iamge: image
          })

          return (feature) => {
            return styles[feature.getGeometry().getType()] || styles['default']
          }
        })()
      })
      this.map.addLayer(this.vectorLayer)
    },
    /**
     * @description: 初始化select控件---设置选择时不同矢量图形的样式
     * @param {type} 
     * @return {type} 
     */
    initSelect () {
      this.selectStyle =  (() => {
        var styles = {}
        styles['Polygon'] = [
          new Style({fill: new Fill({color:[255, 255, 255, 0.5]})}),
          new Style({stroke: new Stroke({color:[255, 255, 255, 1], width: 5})}),
          new Style({stroke: new Stroke({color: [0, 153, 255, 1], width: 3})})
        ];
        styles['LineString'] = [
          new Style({stroke: new Stroke({color:[255, 255, 255, 1], width: 5})}),
          new Style({stroke: new Stroke({color:[0, 153, 255, 1], width: 3})})
        ];
        styles['Point'] = [
          new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({color: [0, 153, 255, 1]}),
              stroke: new Stroke({color: [255, 255, 255, 0.75], width: 1.5})
            }),
            zIndex: 9999
          })
        ];
        styles['Circle'] = [
          new Style({
            stroke: new Stroke({ color: [0, 153, 255, 1], width: 3 }),
            fill: new Fill({ color: [255, 255, 255, 0.75] }),
          })
        ]
        return (feature) => {
          return styles[feature.getGeometry().getType()]
        }
      })()
      this.select = new Select({
        style: this.selectStyle
      })
      this.map.addInteraction(this.select)
    },
    /**
     * @description: 初始化modify控件---分为两种情况：选择编辑、绘制编辑，分别进行不同的设置
     * @param {type} 
     * @return {type} 
     */
    initModify () {
      if (this.modify) {
        this.map.removeInteraction(this.modify)
      }
      if (this.drawStatus) { // 绘制编辑
        this.modify = new Modify({
          source: this.source
        })
      } else { // 选择编辑
        this.modify = new Modify({
          features: this.select.getFeatures(),
          style: this.selectStyle,
          insertVertexCondition: () => {
            return this.select.getFeatures().getArray().every(feature => {
              return feature.getGeometry().getType().match(/Polygon | Point | LineString | Circle/)
            })
          }
        })
      }      
      this.map.addInteraction(this.modify)
    },
    /**
     * @description: 初始化draw控件
     * @param {type} 
     * @return {type} 
     */
    initDraw () {
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
    },
    /**
     * @description: 初始化snap控件（追踪）
     * @param {type} 
     * @return {type} 
     */
    initSnap () {
      this.snap = new Snap({ source: this.source })
      this.map.addInteraction(this.snap)
    },
    /**
     * @description: 处理绘制图形类型变化的函数
     * @param {type} 
     * @return {type} 
     */
    handleChange () {
      this.map.removeInteraction(this.draw)
      this.initDraw()
      if (!this.drawStatus) {
        this.drawStatus = true
        this.map.removeInteraction(this.select)
        this.initModify()
      }
    },
    /**
     * @description: 处理绘制状态变化的函数
     * @param {type} 
     * @return {type} 
     */
    drawChange () {
      this.drawStatus = !this.drawStatus
      console.log(this.drawStatus)
      if (!this.drawStatus) { // 选择编辑状态
        this.map.removeInteraction(this.draw)
        this.initSelect()
      } else { // 绘制编辑状态
        this.map.removeInteraction(this.select)
        this.initDraw()
      }
      this.initModify()
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