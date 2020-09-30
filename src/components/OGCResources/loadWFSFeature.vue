<!--
 * @Author: your name
 * @Date: 2020-09-28 11:35:32
 * @LastEditTime: 2020-09-29 10:48:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\OGCResources\loadWFSFeature.vue
-->
<template>
  <div id="map">
    <div class="menu">
    </div>
  </div>
</template>

<script>
const ol = require('ol')
import { Vector as VectorLayer, Tile as TileLayer} from 'ol/layer';
import { Vector as VectorSource, OSM } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import {Style, Stroke} from 'ol/style'
import * as prj from 'ol/proj'
import View from 'ol/view'

const jsonp = require('jsonp')

export default {
  components: {
    Map
  },
  data () {
    return {
      map: null,
      wfsLayer: null
    }
  },
  mounted () {
    this.initMap()
    this.loadWFSLayer1()
    // this.loadWFSLayer2()
  },
  methods: {
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
            name: '世界矢量图（OSM瓦片）'
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      })
    },
    /**
     * @description: VectorLayer + VectorSource(设置loader，get方式请求数据)加载要素
     * @param {type} 
     * @return {type} 
     */
    loadWFSLayer1 () {
      let vectorSource = new VectorSource({
        loader: (extent, resolution, projection) =>  {
          let format = new GeoJSON()
          let url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
                    'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
                    'outputFormat=application/json&srsname=' + 'EPSG:3857' + '&' +
                    'bbox=' + extent.join(',') +
                    ',' + 'EPSG:3857'
          this.$get(url, {})
          .then(res => {
            if (res) {
              let features = format.readFeatures(res)
              vectorSource.addFeatures(features)
            }
          })
        },
        strategy: bboxStrategy
      })
      this.wfsLayer = new VectorLayer({
        className: 'wfs',
        source: vectorSource,
        style: new Style({stroke: new Stroke({color: 'rgba(0, 0, 255, 1.0)', width: 2 })})
      })
      this.map.addLayer(this.wfsLayer)
      this.map.getView().setCenter([-8908887.277395891, 5381918.072437216])
      this.map.getView().setZoom(12)
    },
    /**
     * @description: VectorLayer + VectorSource(设置url)加载要素
     * @param {type} 
     * @return {type} 
     */
    loadWFSLayer2 () {
      let vectorSource = new VectorSource({
        format: new GeoJSON(),
        url: extent => {
          return ('https://ahocevar.com/geoserver/wfs?service=WFS&' +
                  'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
                  'outputFormat=application/json&srsname=' + 'EPSG:3857' + '&' +
                  'bbox=' + extent.join(',') +
                  ',' + 'EPSG:3857')
        },
        strategy: bboxStrategy,
      })
      this.wfsLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({color: 'rgba(0,0,255,1.0)', width:2})
        })
      })
      this.map.addLayer(this.wfsLayer)
      this.map.getView().setCenter([-8908887.277395891, 5381918.072437216])
      this.map.getView().setZoom(12)
    }
  },
  
}
</script>
<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>