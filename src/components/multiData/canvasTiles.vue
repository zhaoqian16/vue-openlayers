<template>
  <div>
    <div id="map">
      <div class="menu">
        <el-button size="mini" @click="download()">当前地图下载</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tile as TileLayer} from 'ol/layer'
import { OSM, TileDebug} from 'ol/source';
import View from 'ol/View';
let ol = require('ol')
export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      let osmSource = new OSM({
        crossOrigin:'anonymous'
      })
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            title: 'osm',
            source: osmSource
          }),
          new TileLayer({
            title: 'tile grid',
            source: new TileDebug({
              projection: 'EPSG:3857',
              tileGrid: osmSource.getTileGrid()
            })
          })
        ],
        view: new View({
          center: [12900000, 4900000],
          zoom: 8
        })
      })
    },
    /**
     * @description: 保存为图片 ============ 尚未实现
     * @param {type} 
     * @return {type} 
     */
    download () {
      this.map.once('postcompose', e => {
        console.log(e)
        let canvas = e.context.canvas
        console.log(canvas.toDataURL('image/png'))
      })
      this.map.renderSync()
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
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
}
</style>