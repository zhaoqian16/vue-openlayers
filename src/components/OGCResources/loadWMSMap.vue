<template>
  <div>
    <Map></Map>
    <div class="menu">
      <el-radio-group v-model="loadType" @change="handleChange">
        <el-radio label="image">image WMS</el-radio>
        <el-radio label="tile">tiled WMS</el-radio>
        <el-radio label="tilegrid">tile grid 512×256 WMS</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import Map from '../map'
import { ImageWMS, TileWMS} from 'ol/source'
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer'
import * as prj from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import {getTopLeft, getWidth, getHeight} from 'ol/extent';

export default {
  components: {
    Map
  },
  data () {
    return {
      loadType: 'image',
      imageLayer: null,
      tileLayer: null,
      tilegridLayer: null
    }
  },
  mounted () {
    this.loadWmsByImage()
    // this.loadWmsByTile()
    // this.loadWmsByTilegrid()
  },
  methods: {
    loadWmsByImage () {
      let extent = prj.get('EPSG:3857').getExtent()
      this.imageLayer = new ImageLayer({
        className: 'image',
        opacity: 1,
        extent: extent,
        source: new ImageWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: { 
            'LAYERS': 'topp:states'
          },
          serverType: 'geoserver',
          ratio: 1
        })
      })
      this.$children[0].map.addLayer(this.imageLayer)
      this.$children[0].map.getView().setCenter(prj.toLonLat([-10997148, 4569099], 'EPSG:3857'))
    },
    loadWmsByTile () {
      this.tileLayer = new TileLayer({
        className: 'tile', 
        source: new TileWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: {
            'LAYERS': 'topp:states',
            'TILED': true
          },
          serverType: 'geoserver',
          transition: 0
        })
      })
      this.$children[0].map.addLayer(this.tileLayer)
      this.$children[0].map.getView().setCenter(prj.toLonLat([-10997148, 4569099], 'EPSG:3857'))
    },
    loadWmsByTilegrid () {
      let extent = prj.get('EPSG:3857').getExtent()
      let resolutions = this.getTileGrid(extent, 256)
      this.tilegridLayer = new TileLayer({
        className: 'tilegrid',
        source: new TileWMS({
          url: 'https://ahocevar.com/geoserver/wms',
          params: {
            'LAYERS': 'topp:states',
            'TILED': true
          },
          serverType: 'geoserver',
          tileGrid: new TileGrid({
            extent: extent,
            resolutions: resolutions,
            tilesize: [512, 256]
          })
        })
      })
      this.$children[0].map.addLayer(this.tilegridLayer)
      this.$children[0].map.getView().setCenter(prj.toLonLat([-10997148, 4569099], 'EPSG:3857'))
    },
    getTileGrid (extent, tilesize) {
      let width = getWidth(extent)
      let height = getWidth(extent)
      let maxResolution = (width <= height ? height : width) / tilesize
      let resolutions = new Array(22)
      for (let i = 0; i < 22; i++) {
        resolutions[i] = maxResolution / Math.pow(2, i)
      }
      return resolutions
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
      if (this.loadType === 'image') {
        this.loadWmsByImage()
      } else if (this.loadType === 'tile') {
        this.loadWmsByTile()
      } else if (this.loadType === 'tilegrid') {
        this.loadWmsByTilegrid()
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