<template>
  <div>
    <Map></Map>
    <el-select v-model="type" class="map-switcher" @change="loadMap2">
      <el-option label="矢量" value="vec"></el-option>
      <el-option label="影像" value="img"></el-option>
      <el-option label="矢量注记" value="cva"></el-option>
      <el-option label="影像注记" value="cia"></el-option>
    </el-select>
  </div>
</template>

<script>
import Map from '../map'
import TileLayer from 'ol/layer/Tile';
import TileImage from 'ol/source/TileImage';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as prj from 'ol/proj';
import * as Extent from 'ol/extent';
import WMTS from 'ol/source/WMTS';
import WMTSTileGrid from 'ol/tilegrid/WMTS';


export default {
  components: {
    Map
  },
  data () {
    return {
      type: 'vec',
      url: {
        vec: `http://t${Math.round(Math.random()*7)}.tianditu.gov.cn/vec_c/wmts?`,
        cva: `http://t${Math.round(Math.random()*7)}.tianditu.gov.cn/cva_c/wmts?`,
        img: `http://t${Math.round(Math.random()*7)}.tianditu.gov.cn/img_c/wmts?`,
        cia: `http://t${Math.round(Math.random()*7)}.tianditu.gov.cn/cia_c/wmts?`
      },
      layer: null
    }
  },
  mounted () {
    this.loadMap2(this.type)
  },
  methods: {
    /**
     * @description: TileLayer + TileImage 方式加载天地图地图
     * @param {type} 
     * @return {type} 
     */
    loadMap1 () {
      const map = this.$children[0].map
      let layers = map.getLayers()
      let existFlag = false
      layers.forEach(item => {
        if (item.className_ === this.mapType) {
          item.setVisible(true)
          existFlag = true
        } else {
          item.setVisible(false)
        }
      })
      let extent = [-180, -90, 180, 90]
      let tileSize = 256
      this.layer = new TileLayer({
        source: new TileImage({
          attributions: ['Copyright: &copy; 2015 Tianditu, i-cubed, GeoEye'],
          tileUrlFunction: (tileCoord, pixel, projection) => {
            if (!tileCoord)  return ""
            let z = tileCoord[0]
            let x = tileCoord[1]
            let y = tileCoord[2]

            let urlTemplate = this.getUrlTemplate(this.type)
            return urlTemplate.replace('{TileMatrix}', z.toString())
                              .replace('{TileRow}', y.toString())
                              .replace('{TileCol}', x.toString())
          },
          projection: prj.get('EPSG:4326'),
          tileGrid: new TileGrid({
            origin: [-180, 90],
            resolutions: this.getResolutions(extent, tileSize),
            tilesize: tileSize
          })
        })
      })
      map.addLayer(this.layer)
    },
    getUrlTemplate (type) {
      let setting = 'service=wmts&request=GetTile&version=1.0.0&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles'
      let key = '76892c38deab957e65556e5824ca53e9'
      let urlTemplate
      return `${this.url[type]}LAYER=${type}&${setting}&tk=${key}`
    },
    getResolutions (extent, tilesize) {
      let width = Extent.getWidth(extent)
      let height = Extent.getWidth(extent)
      let maxResolution = (width <= height ? height : width) / tilesize
      let resolutions = []
      for (let i = 0; i < 16; i++) {
        resolutions[i] = maxResolution / Math.pow(2, i)
      }
      return resolutions
    },
    loadMap2 () {
      const map = this.$children[0].map
      let layers = map.getLayers()
      let existFlag = false
      layers.forEach(item => {
        if (item.className_ === this.mapType) {
          item.setVisible(true)
          existFlag = true
        } else {
          item.setVisible(false)
        }
      })
      let extent = Extent.getTopLeft(prj.get('EPSG:4326').getExtent())
      let tileSize = 256
      let key = '76892c38deab957e65556e5824ca53e9'
      this.layer = new TileLayer({
        source: new WMTS({
          attributions: ['Copyright: &copy; 2015 Tianditu, i-cubed, GeoEye'],
          url: `${this.url[this.type]}&tk=${key}`,
          layer: this.type,
          style: 'default',
          matrixSet: 'c',
          format: 'tiles',
          wrapX: true,
          tileGrid: new WMTSTileGrid({
            origin: extent,
            resolutions: this.getResolutions2(extent, tileSize).resolutions,
            matrixIds: this.getResolutions2(extent, tileSize).matrixIds
          })
        })
      })
      map.addLayer(this.layer)
    },
    getResolutions2 (extent, tilesize) {
      let width = Extent.getWidth(extent)
      let height = Extent.getWidth(extent)
      let maxResolution = (width <= height ? height : width) / tilesize
      let matrixIds = new Array(18)
      let resolutions = new Array(18)
      for (let i = 0; i < 19; ++i) {
        resolutions[i] = maxResolution / Math.pow(2, i)
        matrixIds[i] = i
      }
      return {
        resolutions: resolutions,
        matrixIds: matrixIds
      }
    }
  }
}
</script>

<style scoped>
.map-switcher {
  position: absolute;
  top: 0;
  right: 0;
}
</style>