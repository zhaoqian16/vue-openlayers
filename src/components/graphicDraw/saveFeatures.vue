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

    <div class="geom-info" v-if="infoVisible">
      <div class="title">
        <span>图形属性信息设置</span>
      </div>
      <div class="content">
        <el-row>
          <label>图形类型(geoType):</label>
          <el-input></el-input>
        </el-row>
        <el-row>
          <label>信息类别(infoType):</label>
          <el-input></el-input>
        </el-row>
        <el-row>
          <label>名称(name):</label>
          <el-input></el-input>
        </el-row>
        <el-row>
          <label>省市(city):</label>
          <el-input></el-input>
        </el-row>
        <div class="footer">
          <el-button>提交</el-button>
          <el-button>取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from '../map'

import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import Draw from 'ol/interaction/Draw';

export default {
  components: {
    Map
  },
  data () {
    return {
      type: 'Point',
      source: null,
      vectorLayer: null,
      draw: null,
      infoVisible: false
    }
  },
  mounted () {
    this.initVectorLayer()
    this.initDraw()
  },
  methods: {
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
      this.draw.on('drawend', e => {
        this.infoVisible = true
      })
    },
    handleChange() {
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
.geom-info {
  max-width: 450px;
  position: absolute;
  top: 200px;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #fff;
  color: #2c3e50;
}
.geom-info .title {
  padding: 10px 15px;
  background-color: rgb(0, 153, 255, 0.7);
}
.geom-info .content {
  padding: 10px 15px;
}
.geom-info .content label {
  display: inline-block;
  width: 150px;
}
.geom-info .content .el-row {
  margin-bottom: 5px;
}
.geom-info .content .el-input {
  width: auto;
}
.geom-info .content .footer {
  text-align: center;
}
</style>