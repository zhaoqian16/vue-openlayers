<!--
 * @Author: xiongqianqian
 * @Date: 2020-10-09 10:32:54
 * @LastEditTime: 2020-10-10 10:23:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\others\geoLocation.vue
-->
<template>
  <div class="all">
    <div class="menu">
      <div class="control">
        <label>导航定位：</label>
        <el-checkbox v-model="checked">开启定位</el-checkbox>
      </div>
      <div class="errorInfo" v-if="errorVisible">{{ error.message }}</div>
    </div>
    <div id="map"></div>
    <div class="locationInfo">
      <li>
        <label>位置经度（position accuracy）:</label>
        <span>{{ locationInfo.accuracy ? locationInfo.accuracy : '----' }} [m]</span>
      </li>
      <li>
        <label>海拔高度（altitude）:</label>
        <span>{{ locationInfo.altitude ? locationInfo.altitude : '----'}} [m]</span>
      </li>
      <li>
        <label>海拔精度（altitude accuracy）:</label>
        <span>{{ locationInfo.altitudeAccuracy ? locationInfo.altitudeAccuracy : '----'}} [m]</span>
      </li>
      <li>
        <label>航向（heading）:</label>
        <span>{{ locationInfo.heading ? locationInfo.heading : '----'}} [rad]</span>
      </li>
      <li>
        <label>速度（speed）:</label>
        <span>{{ locationInfo.speed ? locationInfo.speed : '----'}} [m/s]</span>
      </li>
    </div>
  </div>
</template>

<script>
let ol = require('ol')
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'
import {Style, Icon} from 'ol/style'
import { Point } from 'ol/geom'

export default {
  data () {
    return {
      map: null,
      geolocation: null,
      checked: false,
      featureLayer: null,
      accuracyFeature: null,
      errorVisible: false,
      error: null,
      locationInfo: {
        accuracy: '',
        altitude: '',
        altitudeAccuracy: '',
        heading: '',
        speed: ''
      }
    }
  },
  mounted () {
    this.initMap()
    this.initGeolocation()
    this.initFeatureLayer()
    this.initGeolocationListener()
  },
  methods: {
    // 创建定位控件
    // 监听定位控件的开启与关闭。如果开启，添加定位点标注；如果关闭，移除定位点标注
    // 为定位控件添加位置变更事件，位置变更时，更新面板中的导航位置信息
    // 定位控件添加错误事件处理函数
    // 定位控件添加精确模式定位点要素
    // 定位控件添加导航位置变更事件处理
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      })
    },
    initGeolocation () {
      this.geolocation = new ol.Geolocation({
        projection: this.map.getView().getProjection(),
        trackingOptions: {
          enableHighAccuracy: true
        }
      })
    },
    initFeatureLayer () {
      this.accuracyFeature = new ol.Feature()
      this.positionFeature = new ol.Feature()
      this.positionFeature.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 60],
            anchorOrigin: 'top-right',
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            offsetOrigin: 'top-right',
            opacity: 0.75,
            src: '../../../static/images/icon/icon.png'
          })
        })
      )
      this.featureLayer = new VectorLayer({
        source: new VectorSource({
          features: [this.accuracyFeature, this.positionFeature]
        })
      })
    },
    initGeolocationListener () {
      // 添加精确模式定位点要素
      this.geolocation.on('change:accuracyGeometry', () => {
        this.accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry())
      })
      // 定位控件添加错误事件处理函数
      this.geolocation.on('error', (error) => {
        this.error = error
        this.errorVisible = true
      })
      // 为定位控件添加位置变更事件
      this.geolocation.on('change', () => {
        this.locationInfo.accuracy = this.geolocation.getAccuracy()
        this.locationInfo.altitude = this.geolocation.getAltitude()
        this.locationInfo.altitudeAccuracy = this.geolocation.getAltitudeAccuracy()
        this.locationInfo.heading = this.geolocation.getHeading()
        this.locationInfo.speed = this.geolocation.getSpeed()
      })
      // 添加导航位置变更事件处理
      this.geolocation.on('change:position', () => {
        let coordinates = this.geolocation.getPosition()
        this.positionFeature.setGeometry(coordinates ? new Point(coordinates) : null)
        this.flyLocation(coordinates, () => {})
      })
    },
    flyLocation (center, done) {
      let duration = 4000
      let zoom = this.map.getView().getZoom()
      let parts = 2
      let called = false
      function callback(complete) {
        --parts
        if (called) {
          return
        }
        if (parts === 0 || !complete) {
          called = true
          done(complete)
        }
      }
      this.map.getView().animate({
        center: center,
        duration: duration
      }, callback)
      this.map.getView().animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
        zoom: zoom,
        duration: duration / 2
      }, callback)
    }
  },
  watch: {
    checked () {
      this.geolocation.setTracking(this.checked)
      if (this.checked) {
        this.map.addLayer(this.featureLayer)
      } else {
        this.map.removeLayer(this.featureLayer)
      }
    }
  }
}
</script>

<style scoped>
.all {
  width: 100%;
  height: 100%;
  /* position: relative; */
}
.menu{
  font-size: 14px;
  color: #606266;
}
#map {
  width: 100%;
  height: 100%;
}
.locationInfo {
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: #8fc5fa;
  border-radius: 8px;
  font-size: 14px;
}
.locationInfo li {
  list-style: none;
  padding: 5px 10px;
}
.locationInfo li label {
  display: inline-block;
  width: 200px;
}
</style>