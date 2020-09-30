<!--
 * @Author: xiongqianqian
 * @Date: 2020-09-28 11:35:51
 * @LastEditTime: 2020-09-29 10:58:57
 * @LastEditors: xiongqianqian
 * @Description: 加载wcs（网络影像服务）
 * @FilePath: \vue-openlayers\src\components\OGCResources\loadWCSMap.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="menu">
      <el-radio-group v-model="loadType" @change="handleChange">
        <el-radio label="imageWcs">image WCS(geoserver WCS)</el-radio>
        <el-radio label="tileWCS">tile WCS(geoserver WCS)</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import Map from '../map'
import {Image as ImageLayer} from 'ol/layer'
import { ImageWMS, ImageStatic } from 'ol/source'

export default {
  components: {
    Map
  },
  data () {
    return {
      loadType: 'imageWcs',
      layer: null
    }
  },
  mounted () {
    this.loadByImageWcs()
    // this.loadByImageStatic()
  },
  methods: {
    /**
     * @description: ImageLayer + ImageWMS 加载栅格地图
     * @param {type} 
     * @return {type} 
     */
    loadByImageWcs () {
      this.layer = new ImageLayer({
        source: new ImageWMS({
          url: 'http://117.159.25.220:8081/geoserver/districts/wms',
          params: { 'layers': 'districts:basemap' }
        })
      })
      this.$children[0].map.addLayer(this.layer)
      this.$children[0].map.getView().setCenter([113.76, 34.80])
      this.$children[0].map.getView().setZoom(13)
    },
    /**
     * @description: ImageLayer + ImageStatic 加载栅格地图
     * @param {type} 
     * @return {type} 
     */
    loadByImageStatic () {
      this.layer = new ImageLayer({
        source: new ImageStatic({
          url: 'http://117.159.25.220:8081/geoserver/districts/wms?service=WMS&version=1.1.0&request=GetMap&layers=districts:basemap&bbox=113.747281347,34.789613373,113.780459318,34.808183326&width=768&height=429&srs=EPSG:4326&format=image/png',
          projection: 'EPSG:4326',
          imageExtent: [113.747281347,34.789613373,113.780459318,34.808183326]
        })
      })
      this.$children[0].map.addLayer(this.layer)
      this.$children[0].map.getView().setCenter([113.76, 34.80])
      this.$children[0].map.getView().setZoom(13)
    },
    handleChange () {
      const map = this.$children[0].map
      let layers = map.getLayers().getArray()
      layers.forEach(item => {
        if (item.getClassName() !== 'osm') {
          item.setVisible(false)
        }
      })
      let selectLayer = layers.find(item => item.getClassName() === this.loadType)
      if (selectLayer) {
        selectLayer.setVisible(true)
        return
      }
      if (this.loadType === 'imageWcs') {
        this.loadByImageWcs()
      } else if (this.loadType === 'tileWCS') {
        this.loadByImageStatic()
      }
    }
  }
}
</script>

<style scoped>
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>