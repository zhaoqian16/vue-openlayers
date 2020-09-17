
<template>
  <div>
    <div id="map"></div>
    <div id="mouse-position" class="custom-mouse-position"></div>
    <div id="scaleline" class="custom-scaleline"></div>
  </div>
</template>

<script>
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import ScaleLine from 'ol/control/ScaleLine';
import OverviewMap from 'ol/control/OverviewMap';
let ol = require('ol')
import View from 'ol/View'
import { OSM } from 'ol/source'
import { Tile as TileLayer } from 'ol/layer'
import FullScreen from 'ol/control/FullScreen';

export default {
  data () {
    return {
      map: null,
      mousePosition: null,
      scaleline: null,
      overview: null
    }
  },
  mounted () {
    this.initMap()
    this.initMousePosition()
    this.initScaleline()
    this.initOverview()
    this.initFullscreen()
  },
  methods: {
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(), 
            className: '世界地图（OSM瓦片）'
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      }),
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    /**
     * @description: 初始化鼠标位置空间
     * @param {type} 
     * @return {type} 
     */
    initMousePosition () {
      this.mousePosition = new MousePosition({
        className: 'custom-mouse-position',
        target: 'mouse-position',
        projection: 'EPSG:4326',
        coordinateFormat: createStringXY(4),
        undefinedHTML: '&nbsp;'
      })
      this.map.addControl(this.mousePosition)
    },
    /**
     * @description: 初始化比例尺
     * @param {type} 
     * @return {type} 
     */
    initScaleline () {
      this.scaleline = new ScaleLine({
        target: 'scaleline',
        minWidth: '160',
        unit: 'metric'
      })
      this.map.addControl(this.scaleline)
    },
    /**
     * @description: 初始化鹰眼
     * @param {type} 
     * @return {type} 
     */
    initOverview () {
      this.overview = new OverviewMap({
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: this.map.getLayers(),
        collapseLabel: '\u00BB',
        label: '\u00BB',
        collapsed: false,
      })
      this.map.addControl(this.overview)
    },
    /**
     * @description: 初始化全屏控件
     * @param {type} 
     * @return {type} 
     */
    initFullscreen () {
      this.fullscreen = new FullScreen()
      this.map.addControl(this.fullscreen)
    }

  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}
/* 鼠标坐标 */
#mouse-position {
  height: 35px;
  width: 200px;
  position: absolute;
  right: 5px;
  bottom: 5px;
  background-color: rgba(0,60,136,0.5);
  line-height: 35px;
  text-align: center;
}
.custom-mouse-position {
  color: #fafafa;
  font-size: 16px;
  font-family: '微软雅黑';
}
/* 比例尺 */
#scaleline {
  position: absolute;
  width: 200px;
  height: 35px;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 5px;
}
/* 鹰眼 */
.map .ol-overviewmap {
  right: 0;
  top: 0;
}
.map .ol-custom-overviewmap,
.map .ol-custom-overviewmap.ol-uncollapsible {
  bottom: auto;
  left: auto;
  right: 0;
  top: 0;
}
.map .ol-custom-overviewmap:not(.ol-collapsed)  {
  border: 1px solid black;
}
.ol-custom-overviewmap .ol-overviewmap-map {
  border: none;
  width: 300px;
}
.ol-custom-overviewmap .ol-overviewmap-box {
  border: 2px solid red;
}
.ol-custom-overviewmap:not(.ol-collapsed) button{
  bottom: auto;
  left: auto;
  right: 1px;
  top: 1px;
}
.ol-rotate {
  top: 170px;
  right: 0;
}
</style>