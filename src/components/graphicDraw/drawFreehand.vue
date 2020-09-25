<template>
  <div>
    <Map></Map>
    <el-select v-model="type" @change="handleChange" class="menu">
      <el-option label="线" value="LineString"></el-option>
      <el-option label="面" value="Polygon"></el-option>
      <el-option label="圆" value="Circle"></el-option>
      <el-option label="无" value="None"></el-option>
    </el-select>
  </div>
</template>

<script>
import Map from '../map'
import 'ol/ol.css';
import { Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import {Draw, Modify, Snap} from 'ol/interaction';

export default {
  components: {
    Map
  },
  data () {
    return {
      type: 'LineString',
      source: null,
      draw: null,
      vectorLayer: null
    }
  },
  mounted () {
    this.initVectorLayer()
    this.initDraw()
  },
  methods: {
    initVectorLayer () {
      const map = this.$children[0].map
      this.source = new VectorSource({ wrapX: false })
      this.vectorLayer = new VectorLayer({
        source: this.source
      })
      map.addLayer(this.vectorLayer)
    },
    initDraw () {
      const map = this.$children[0].map
      if (this.type === 'None') return 
      this.draw = new Draw({
        source: this.source,
        type: this.type,
        freehand: true
      })
      map.addInteraction(this.draw)
    },
    handleChange () {
      const map = this.$children[0].map
      map.removeInteraction(this.draw)
      this.initDraw()
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