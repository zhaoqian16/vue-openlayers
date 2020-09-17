<template>
  <div>
    <Map></Map>
    <el-button-group class='operation'>
      <el-button size="middle" @click="enless()">缩小</el-button>
      <el-button size="middle" @click="enlarge()">放大</el-button>
      <el-button size="middle" @click="panto()">平移</el-button>
      <el-button size="middle" @click="restore()">复位</el-button>
    </el-button-group>
  </div>
</template>

<script>
import Map from '../map'
import View from 'ol/View'
import * as prj from 'ol/proj'

export default {
  components: {
    Map
  },
  data () {
    return {
      option: {
        center: [12950000, 4860000],
        zoom: 8,
        rotation: Math.PI/6
      }
    }
  },
  mounted () {
    this.mapOption()
  },
  methods: {
    mapOption () {
      const map = this.$children[0].map
      map.setView(new View({
        center: this.option.center,
        zoom: this.option.zoom,
        minZoom: 6,
        maxZoom: 12,
        rotation: this.option.rotation
      }))
    },
    enless () {
      const map = this.$children[0].map
      let view = map.getView()
      let zoom = view.getZoom()
      view.setZoom(zoom - 1)
    },
    enlarge () {
      const map = this.$children[0].map
      let view = map.getView()
      let zoom = view.getZoom()
      view.setZoom(zoom + 1)
    },
    panto () {
      const map = this.$children[0].map
      let view = map.getView()
      let center = new prj.fromLonLat([114.31667, 30.51667])
      view.setCenter(center)
    },
    restore () {
      const map = this.$children[0].map
      let view = map.getView()
      view.setCenter(this.option.center)
      view.setZoom(this.option.zoom)
    }
  }
}
</script>

<style scoped>
.operation {
  position: absolute;
  left: 20px;
  bottom: 20px;
}
</style>