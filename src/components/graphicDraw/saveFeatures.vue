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

    <div class="geom-info" v-if="infoVisible" v-drag>
      <div class="title">
        <span>图形属性信息设置</span>
      </div>
      <div class="content">
        <el-row>
          <label>图形类型(geoType):</label>
          <el-select v-model="type" disabled>
            <el-option label="点" value="Point"></el-option>
            <el-option label="线" value="LineString"></el-option>
            <el-option label="面" value="Polygon"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <label>信息类别(infoType):</label>
          <el-select v-model="type" disabled>
            <el-option label="兴趣点" value="Point"></el-option>
            <el-option label="道路线" value="LineString"></el-option>
            <el-option label="高校区域" value="Polygon"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <label>名称(name):</label>
          <el-input v-model="geomName" placeholder="请输入名称"></el-input>
        </el-row>
        <el-row>
          <label>省市(city):</label>
          <el-input v-model="geomCity" placeholder="请输入城市"></el-input>
        </el-row>
        <div class="footer">
          <el-button size="middle" type="primary" @click="save()">提交</el-button>
          <el-button size="middle" type="primary" @click="cancle()">取消</el-button>
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
import * as prj from 'ol/proj';

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
      infoVisible: false,
      geomName: '',
      geomCity: '',
      geometry: '',
      currentFeature: null,
      saveFeature: null
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
        this.currentFeature = e.feature
        let coordinates = e.feature.getGeometry().getCoordinates()
        const type = e.feature.getGeometry().getType()
        const projection = map.getView().getProjection()
        let wgsCoordinates, geom
        if (type === 'Point') {
          wgsCoordinates = prj.toLonLat(coordinates, projection)
          geom = { 
            type: 'Point',
            "coordinates": wgsCoordinates
          }
        } else if (type === 'LineString') {
          wgsCoordinates = coordinates.map(item => {
            return prj.toLonLat(item, projection)
          })
          geom = { 
            type: "LineString",
            "coordinates": [wgsCoordinates]
          }
        } else if (type === 'Polygon') {
          wgsCoordinates = coordinates[0].map(item => {
            return prj.toLonLat(item, wgsCoordinates)
          })
          geom = { 
            type: "MultiPolygon",
            "coordinates":  [[wgsCoordinates]]
          }
        }
        this.geometry = JSON.stringify(geom)
        console.log(this.geometry)
      })
    },
    handleChange() {
      const map = this.$children[0].map
      map.removeInteraction(this.draw)
      this.initDraw()
    },
    save () {
      if (!this.geomName && !this.geomCity) {
        this.$message({
          message: '要素名称或城市不能为空，请输入名称或城市',
          type: 'warning'
        })
      } else {
        this.saveFeature = {
          type: this.type,
          name: this.geomName,
          city: this.geomCity,
          geom: this.geometry
        }
        this.infoVisible = false
      }
      this.geomName = '',
      this.geomCity = '',
      this.geometry = null
    },
    cancle () {
      this.infoVisible = false
      this.vectorLayer.getSource().removeFeature(this.currentFeature)
      this.geomName = '',
      this.geomCity = '',
      this.geometry = null
    }
  },
  watch: {
    infoVisible () {
      const map = this.$children[0].map
      if (this.infoVisible) {
        map.removeInteraction(this.draw)
      } else {
        this.initDraw()
      }
    }
  },
  directives: {
    drag: {
      inserted: (el, binding, vnode) => {
        el.onmousedown = ((e) => {
          if (e.target.className !== 'geom-info' && e.target.parentElement.className !== 'geom-info') {
            return
          }
          // 获取鼠标在弹窗中的位置
          let mouseX = e.clientX - vnode.elm.offsetLeft
          let mouseY = e.clientY - vnode.elm.offsetTop
         
          document.onmousemove = (e => {
            // 鼠标移动时，弹窗的实时位置
            let left = e.clientX - mouseX
            let top = e.clientY - mouseX
            let minX = 0 + vnode.elm.offsetWidth / 2
            let maxX = window.innerWidth - vnode.elm.offsetWidth / 2
            if (left <= minX) {
              left = minX
            } else if (left > maxX) {
              left = maxX
            }

            let minY = 0
            let maxY = window.innerHeight - vnode.elm.offsetHeight
            if (top <= minY) {
              top = minY
            } else if (top > maxY) {
              top = maxY
            }

            // 设置弹窗的位置
            vnode.elm.style.left = left + "px"
            vnode.elm.style.top = top + "px"
          })

          document.onmouseup = (() => {
            document.onmousemove = document.onmouseup = null
          })
        })
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
.geom-info {
  max-width: 450px;
  position: absolute;
  top: 100px;
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