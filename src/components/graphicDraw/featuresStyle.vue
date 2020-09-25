<template>
  <div id="map">
    <div class="menu">
      <el-tabs v-model="type" @tab-click="handleClick">
        <el-tab-pane label="点要素样式" name="pointStyle">
          <StyleSetting :styleType="type" @update="update" :currentStyle="currentStyle"></StyleSetting>
        </el-tab-pane>
        <el-tab-pane label="线要素样式" name="lineStyle">
          <StyleSetting :styleType="type" @update="update" :currentStyle="currentStyle"> </StyleSetting>
        </el-tab-pane>
        <el-tab-pane label="区要素样式" name="polygonStyle">
          <StyleSetting :styleType="type" @update="update" :currentStyle="currentStyle"></StyleSetting>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
let ol = require('ol')
import { Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import View from 'ol/View'
import { OSM, Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature';
import { Polygon, Point, LineString } from 'ol/geom';
import {Fill, Stroke, Circle, Style, Text } from 'ol/style';

import StyleSetting from './styleSetting'

export default {
  components: {
    StyleSetting
  },
  data () {
    return {
      map: null,
      type: 'pointStyle',
      vectorPoint: null,
      vectorLine: null,
      vectorPolygon: null,
      activeNames: [],
      pointFeature: null,
      polygonFeature: null,
      lineFeature: null,
      styleType: this.type,
      currentStyle: null
    }
  },
  mounted () {
    this.initMap()
    this.initVerctorLayer()
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
          center: [0, 0],
          zoom: 2
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    initVerctorLayer () {
      this.pointFeature = new Feature({
        geometry: new Point([0, 0]),
        name: 'Point Feature'
      })
      this.lineFeature = new Feature({
        geometry: new LineString([[1e7, 1e6], [1e6, 3e6]]),
        name: 'Line Feature'
      })
      this.polygonFeature = new Feature({
        geometry: new Polygon([[[1e6, -1e6], [1e6, 1e6], [3e6, -1e6], [1e6, -1e6]]]),
        name: 'Polygon Feature'
      })
      this.vectorPoint = new VectorLayer({
        source: new VectorSource({
          features: [ this.pointFeature ],
          style: this.createPointStyleFeature(this.pointFeature)
        })
      })
      this.vectorLine = new VectorLayer({
        source: new VectorSource({
          features: [ this.lineFeature ],
          style: this.createLineStyleFeature(this.lineFeature)
        })
      })
      this.vectorPolygon = new VectorLayer({
        source: new VectorSource({
          features: [ this.polygonFeature ],
          style: this.createPolygonStyleFeature(this.polygonFeature)
        })
      })
      this.map.addLayer(this.vectorPoint)
      this.map.addLayer(this.vectorLine)
      this.map.addLayer(this.vectorPolygon)
      this.handleClick()
    },
    createPointStyleFeature (feature) {
      console.log(feature)
      return (feature) => {
        let style = new Style({
          image: new Circle({
            radius: this.currentStyle.size,
            fill: new Fill({ color: this.currentStyle.fillColor }),
            stroke: new Stroke({
              color: this.currentStyle.strokeColor,
              width: this.currentStyle.strokeWidth
            })
          }),
          text: this.createTextStyle(feature)
        })
        return [style]
      }
    },
    createLineStyleFeature (feature) {
      console.log(feature)
      return (feature) => {
        let style = new Style({
          stroke: new Stroke({
            color: this.currentStyle.strokeColor,
            width: parseInt(this.currentStyle.strokeWidth)
          }),
          text: this.createTextStyle(feature)
        })
        return [style]
      }
    },
    createPolygonStyleFeature (feature) {
      console.log(feature)
      return (feature) => {
        let style = new Style({
          stroke: new Stroke({
            color: this.currentStyle.strokeColor,
            width: parseInt(this.currentStyle.strokeWidth)
          }),
          fill: new Fill({ color: this.currentStyle.fillColor }),
          text: this.createTextStyle(feature)
        })
        return [style]
      }
    },
    createTextStyle (feature) {
      console.log(feature)
      let text = new Text({
        textAlign: this.currentStyle.textAligin,
        textBaseline: this.currentStyle.textBaseline,
        font: `${this.currentStyle.textWeight} ${this.currentStyle.textSize} ${this.currentStyle.textFont}`,
        text: feature.get('name'),
        fill: new Fill({ color: this.currentStyle.textColor }),
        stroke: new Stroke({
          color: this.currentStyle.textOutlineColor,
          width: parseInt(this.currentStyle.textOutlineWidth)
        }),
        offsetX: parseInt(this.currentStyle.textOffsetX),
        offsetY: parseInt(this.currentStyle.textOffsetY),
        rotation: Math.PI / 180 * parseInt(this.currentStyle.rotation)
      })
      return text
    },
    update (type, style) {
      this.currentStyle = style
      if (type === 'pointStyle') {
        this.vectorPoint.setStyle(this.createPointStyleFeature(this.pointFeature))
      } else if (type === 'lineStyle') {
        this.vectorLine.setStyle(this.createLineStyleFeature(this.lineFeature))
      } else if (type === 'polygonStyle') {
        this.vectorPolygon.setStyle(this.createPolygonStyleFeature(this.polygonFeature))
      }
    },
    handleClick () {
      console.log('1')
      if (this.type === 'pointStyle') {
        this.getCurrentStyle(this.vectorPoint)
      } else if (this.type === 'lineStyle') {
        this.getCurrentStyle(this.vectorLine)
      } else if (this.type === 'polygonStyle') {
        this.getCurrentStyle(this.vectorPolygon)
      }
    },
    getCurrentStyle (layer) {
      console.log('2')
      let style = layer.getStyleFunction()()[0]
      console.log(style)
      if (style) {
        const image = style.getImage()
        const text = style.getText()
        let currentStyle = {
          size: image.getRadius(),
          fillColor: image.getFill().getColor(),
          strokeColor: image.getStroke().getColor(),
          strokeWidth: image.getStroke().getWidth(),
          textAlign: text ? text.getTextAlign() : undefined,
          baseline: text ? text.getTextBaseline() : undefined,
          rotation: text ? text.getRotation() : undefined,
          textFont: text ? text.getFont().split(' ')[2] : '',
          textWeight: text ? text.getFont().split(' ')[0] : '',
          textSize:  text ? text.getFont().split(' ')[1] : '',
          textOffsetX: text ? text.getOffsetX() : 0,
          textOffsetY: text ? text.getOffsetY() : 0,
          textColor: text ? text.getFill().getColor() : undefined,
          textOutlineColor: text ? text.getStroke().getColor() : undefined,
          textOutlineWidth: text ? text.getStroke().getWidth() : undefined
        }
        this.currentStyle = currentStyle
      }
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
.menu {
  position: absolute;
  top: 100px;
  left: 5px;
  z-index: 999;
  padding: 10px;
  background-color: rgba(255, 255, 255);
}
/* .menu .style-list {
  font-size: 14px;
}
.el-row {
  margin-bottom: 5px;
}
.el-input {
  width: auto;
}
label {
  display: inline-block;
  width: 141px;
} */

</style>