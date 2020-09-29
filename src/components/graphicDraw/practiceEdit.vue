<!--
 * @Author: your name
 * @Date: 2020-09-25 11:20:21
 * @LastEditTime: 2020-09-28 10:45:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\graphicDraw\practiceEdit.vue
-->
<template>
  <div>
    <Map></Map>

    <div class="geom-info" v-if="infoVisible">
      <div class="title">
        <span>图形属性信息设置</span>
      </div>
      <div class="content">
        <el-row>
          <label>图形类型(geoType):</label>
          <el-select v-model="type" disabled>
            <el-option label="点" value="Point"></el-option>
            <el-option label="线" value="MultiLineString"></el-option>
            <el-option label="面" value="MultiPolygon"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <label>信息类别(infoType):</label>
          <el-select v-model="type" disabled>
            <el-option label="兴趣点" value="Point"></el-option>
            <el-option label="道路线" value="MultiLineString"></el-option>
            <el-option label="高校区域" value="MultiPolygon"></el-option>
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
let ol = require('ol')
let practiceData = require('../../../static/data/json/practiceEdit-data.json')
import { Point, LineString, Polygon} from 'ol/geom';
import {Vector as VectorLayer} from 'ol/layer'
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Circle, Style} from 'ol/style';
import * as prj from 'ol/proj';
import Select from 'ol/interaction/Select';
import {Draw, Modify, Snap} from 'ol/interaction';
import GeoJSON from 'ol/format/GeoJSON';


import Map from '../map'
import DrawFeatures from './drawFeatures'
export default {
  components: {
    Map
  },
  data () {
    return {
      source: null,
      vectorLayer: null,
      modify: null,
      infoVisible: false,
      type: '',
      geometry: null,
      geomName: '',
      geomCity: '',
      saveGeom: null,
      currentFeature: null
    }
  },
  mounted () {
    this.initFeature()
    this.initSelect()
  },
  methods: {
    initFeature () {
      const map = this.$children[0].map
      this.source = new VectorSource({
        features: new GeoJSON().readFeatures(practiceData)
      })
      this.vectorLayer = new VectorLayer({
        source: this.source,
        style: (() => {
          let styles = {
            'Point': new Style({image: new Circle({radius: 7, fill: new Fill({color: '#ff0000'})})}),
            'MultiLineString': new Style({stroke: new Stroke({color: '#ff0000', width: 2})}),
            'MultiPolygon': new Style({stroke: new Stroke({color: '#ff0000', width: 2}), fill: new Fill({color: 'rgba(255, 255, 255, 0.2)'})})
          }
          return (feature) => {
            return styles[feature.getGeometry().getType()]
          }
        })()
      })
      map.addLayer(this.vectorLayer)
      map.getView().setCenter([114.2905, 30.5607])
      map.getView().setZoom(12)
    },
    initSelect () {
      const map = this.$children[0].map
      const _this = this
      let modify = {
        init: function () {
          this.select = new Select()
          map.addInteraction(this.select)

          this.modify = new Modify({
            features: this.select.getFeatures()
          })
          map.addInteraction(this.modify)
          this.setEvents()
        },
        setEvents: function () {
          let selectedFeatures = this.select.getFeatures()
          this.select.on('change:active', function () {
            selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
          })
          selectedFeatures.on('add', e => {
            if (e && e.element) {
              let feature = e.element
              let id = feature.getId()
              _this.$get('/static/data/json/practiceEdit-data.json', {})
                  .then( res => {
                    let detail = res.features.find(item => item.id === id)
                    _this.geomName = detail.properties.name
                    _this.geomCity = detail.properties.city
                  })
              _this.type = feature.getGeometry().getType()
              _this.infoVisible = true
              _this.currentFeature = feature
            }
          })
        },
        setActive: function () {
          this.select.setActive('active')
          this.modify.setActive('active')
        }
      }
      modify.init()
      modify.setActive()
    },
    save () {
      const map = this.$children[0].map
      let coordinates = this.currentFeature.getGeometry().getCoordinates()
      let geom
      if (this.type === 'Point') {
        geom = { 
          type: 'Point',
          "coordinates": coordinates
        }
      } else if (this.type === 'MultiLineString') {
        geom = { 
          type: "MultiLineString",
          "coordinates": [coordinates]
        }
      } else if (this.type === 'MultiPolygon') {
        geom = { 
          type: "MultiPolygon",
          "coordinates":  [coordinates]
        }
      }
      this.geometry = geom
      console.log(this.geomName, this.geomCity, this.geometry)
      if (!this.geomName && !this.geomCity) {
        this.$message({
          message: '要素名称或城市不能为空，请输入名称或城市',
          type: 'warning'
        })
      } else {
        let _this = this
        this.$get('/static/data/json/practiceEdit-data.json', {})
          .then( res => {
            let id = this.currentFeature.getId()
            let index = res.features.findIndex(item => item.id === id)
            res.features[index].properties.name = this.geomName
            res.features[index].properties.city = this.geomCity
            res.features[index].geometry = this.geometry
            // 保存文件 ======================================= 待完善
            
          })
        this.saveGeom = {
          type: this.type,
          name: this.geomName,
          city: this.geomCity,
          geom: this.geometry
        }
        this.infoVisible = false
      }
    },
    cancle () {
      this.infoVisible = false
    }
    
  }
}
</script>

<style scoped>
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