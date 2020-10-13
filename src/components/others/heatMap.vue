<template>
  <div>
    <div class="menu">
      <div>设置热点图的参数：</div>
      <div>
        <label>热点半径（radius size）:</label>
        <input type="range" id="radius" min="1" max="50" step="1" value="10" v-model="radius" /> {{ radius }}
      </div>
      <div>
        <label>模糊尺寸（blur size）:</label>
        <input type="range" id="blur" min="1" max="50" step="1" value="15" v-model="blur" /> {{ blur }}
      </div>
    </div>
    <Map></Map>
  </div>
</template>

<script>
import Map from '../map'
import { Heatmap } from 'ol/layer'
import {Vector as VectorSource} from 'ol/source'
import { KML } from 'ol/format'
export default {
  components: {
    Map
  },
  data () {
    return {
      radius: 9,
      blur: 11,
      heatmapLayer: null
    }
  },
  mounted () {
    this.initHeatmapLayer()
    this.initHeatMapListener()
  },
  methods: {
    /**
     * @description: 创建热图图层 
     * @param {type} 
     * @return {type} 
     */
    initHeatmapLayer () {
      this.heatmapLayer = new Heatmap({
        source: new VectorSource({
          url: '../../../static/data/kml/2012_Earthquakes_Mag5.kml',
          format: new KML({
            extractStyles: false
          }),
          wrapX:false
        }),
        radius: parseInt(this.radius, 10),
        blur: parseInt(this.blur, 10)
      })
      this.$children[0].map.addLayer(this.heatmapLayer)
    },
    /**
     * @description: 为矢量数据源 heatmapLayer 添加addfeature监听
     * @param {type} 
     * @return {type} 
     */
    initHeatMapListener () {
      this.heatmapLayer.getSource().on('addfeature', e => {
        console.log(e.feature)
        let name = e.feature.get('name')
        let magnitude = parseFloat(name.substr(2))
        e.feature.set('weight', magnitude - 5)
      })
    }
  },
  watch: {
    radius (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.heatmapLayer.setRadius(parseInt(this.radius, 10))
      }
    },
    blur (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.heatmapLayer.setBlur(parseInt(this.blur, 10))
      }
    }
  }
}
</script>

<style scoped>
.menu {
  font-size: 14px;
}
.menu label {
  display: inline-block;
  width: 180px;
}
</style>