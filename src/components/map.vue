<!--
 * @Author: your name
 * @Date: 2020-09-10 09:16:53
 * @LastEditTime: 2020-09-27 15:04:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\HelloWorld.vue
-->
<template>
  <div id="map">
    
  </div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css'
import { OSM } from 'ol/source'
import { Tile as TileLayer } from 'ol/layer'
import View from 'ol/View'

export default {
  name: 'Map',
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    /**
     * @description: 初始化openlayers地图
     * @param {type} 
     * @return {type} 
     */
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            className: 'osm',
            source: new OSM(),
            name: '世界矢量图（OSM瓦片）'
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
          projection: 'EPSG:4326'
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
