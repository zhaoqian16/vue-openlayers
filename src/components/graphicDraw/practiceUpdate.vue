<!--
 * @Author: your name
 * @Date: 2020-09-25 11:24:38
 * @LastEditTime: 2020-09-27 09:24:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\graphicDraw\practiceUpdate.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="menu">
      <el-select v-model="type" @change="handleChange">
        <el-option label="点" value="Point"></el-option>
        <el-option label="线" value="LineString"></el-option>
        <el-option label="面" value="Polygon"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import Map from '../map'

import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Draw from 'ol/interaction/Draw';
import * as prj from 'ol/proj';

export default {
  components: {
    Map
  },
  data () {
    return {
      source: null,
      type: null
    }
  },
  methods:{
    initVectorLayer () {
      const map = this.$children[0].map
      this.source = new VectorSource({ wrapX: false})
      this.vectorLayer = new VectorLayer({
        source: this.source
      })
      map.addLayer(this.vectorLayer)
    },
    initDraw () {
      const map = this.$children[0].map
      this.draw = new Draw({
        source: this.source,
        type: this.type
      })
      map.addInteraction(this.draw)
    },
    handleChange() {
      const map = this.$children[0].map
      map.removeInteraction(this.draw)
      this.initDraw()
    },
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