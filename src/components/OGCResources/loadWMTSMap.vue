<template>
  <div>
    <Map></Map>
    <div class="menu">
      <input type="checkbox" v-model="visible" @change="handleChange()" :value="visible">arcgisonline WMTS
    </div>
  </div>
</template>

<script>
import Map from '../map'
import { Tile as TileLayer} from 'ol/layer'
import WMTS from 'ol/source/WMTS'
import Attribution from 'ol/control/Attribution';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getTopLeft, getWidth, getHeight} from 'ol/extent';

export default {
  components: {
    Map
  },
  mounted () {
    this.addWMTSMap()
  },
  data () {
    return {
      visible: true,
      layer: null
    }
  },
  methods: {
    addWMTSMap () {
      const map = this.$children[0].map
      let attribution = new Attribution({
        label: `Tiles &copy; <a href="http://services.arcgisonline.com/arcgis/rest/services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>`
      })
      let extent = getProjection('EPSG:3857').getExtent()
      let tilesize = 256
      let tileGrid = this.getTileGrid(extent, tilesize)
      this.layer = new TileLayer({
        opacity: 1,
        source: new WMTS({
          attributions: 'Tiles © <a href="https://services.arcgisonline.com/arcgis/rest/' +
                        'services/Demographics/USA_Population_Density/MapServer/">ArcGIS</a>',
          url: 'https://services.arcgisonline.com/arcgis/rest/' +
               'services/Demographics/USA_Population_Density/MapServer/WMTS/',
          matrixSet: 'EGSG:3857',
          format: 'image/png',
          projection: getProjection('EPSG:3857'),
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(extent),
            resolutions: tileGrid.resolutions,
            matrixIds: tileGrid.matrixIds
          }),
          style: 'default',
          wrapX: true
        })
      })
      map.addLayer(this.layer)
    },
    getTileGrid (extent, tilesize) {
      let width = getWidth(extent)
      let height = getWidth(extent)
      let maxResolution = (width <= height ? height : width) / tilesize
      let resolutions = new Array(14)
      let matrixIds = new Array(14)
      for (let i = 0; i < 14; i++) {
        resolutions[i] = maxResolution / Math.pow(2, i)
        matrixIds[i] = i
      }
      return {
        resolutions: resolutions,
        matrixIds: matrixIds
      }
    },
    handleChange () {
      if (this.visible) {
        // 显示
        this.layer.setVisible(true)
      } else {
        // 隐藏
        this.layer.setVisible(false)
      }
    }
  }
}
</script>
<style>
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>

