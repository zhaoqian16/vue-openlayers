<template>
  <div>
    <div id="map" @mousemove="handleMove"></div>
  </div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css'
import { Tile as TileLayer } from 'ol/layer'
import View from 'ol/View'
import BingMaps from 'ol/source/BingMaps';
import * as prj from 'ol/proj'
import {getRenderPixel} from 'ol/render'

export default {
  data () {
    return {
      map: null,
      sitellite: null,
      roads: null,
      radius: 75,
      mousePosition: null,
    }
  },
  mounted () {
    this.initMap()
    this.addDownEvent()
    this.addListener()
  },
  methods: {
    /**
     * @description: 初始化地图-添加必应影像图、矢量图
     * @param {type} 
     * @return {type} 
     */
    initMap () {
      this.sitellite = new TileLayer({
        source: new BingMaps({
          key: 'AvEW30yRAk5b06vbFuBmUePb1bMSlXGry6B-jah_jtZNh0aixHUoQ_u1VjfHhFJD',
          imagerySet: 'AerialWithLabelsOnDemand',
          culture: 'zh-cn'
        })
      })
     this.roads = new TileLayer({
        source: new BingMaps({
          key: 'AvEW30yRAk5b06vbFuBmUePb1bMSlXGry6B-jah_jtZNh0aixHUoQ_u1VjfHhFJD',
          imagerySet: 'RoadOnDemand',
          culture: 'zh-cn'
        })
      })
      this.map = new ol.Map({
        target: 'map',
        layers: [this.roads, this.sitellite],
        view: new View({
          center: new prj.fromLonLat([-109, 46.5]),
          zoom: 6
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    /**
     * @description: 处理鼠标在地图上移动的函数
     * @param {type} 
     * @return {type} 
     */
    handleMove (e) {
      this.mousePosition = this.map.getEventPixel(e)
      this.map.render()
    },
    /**
     * @description: 处理鼠标移出地图的函数
     * @param {type} 
     * @return {type} 
     */
    handleOut(e) {
      this.mousePosition = null
      this.map.render()
    },
    addListener () {
      this.sitellite.on('prerender', e => {
        let ctx = e.context
        ctx.save()
        ctx.beginPath()
        if (this.mousePosition) {
          let pixel = getRenderPixel(e, this.mousePosition)
          let offset = getRenderPixel(e, [this.mousePosition[0]+this.radius, this.mousePosition[1]])
          let canvasRadius = Math.sqrt(Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2))
          ctx.arc(pixel[0], pixel[1], canvasRadius, 0, 2 * Math.PI)
          ctx.lineWidth = (5 * canvasRadius) / this.radius
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.stroke()
        }
        ctx.clip()
      })
      this.sitellite.on('postrender', e => {
        let ctx = e.context
        ctx.restore()
      })
    },
    addDownEvent () {
      document.addEventListener('keydown', e => {
        if (e.which === 38) {
          this.radius = Math.min(this.radius + 5, 150)
          this.map.render()
        } else if (e.which === 40) {
          this.radius = Math.max(this.radius - 5, 25)
          this.map.render()
        }
      })
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
</style>