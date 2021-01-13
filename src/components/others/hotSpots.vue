<!--
 * @Author: your name
 * @Date: 2020-10-12 15:18:41
 * @LastEditTime: 2020-10-19 09:09:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\others\hotSpots.vue
-->
<template>
  <div>
    <div class="menu">
      <label>热区功能：</label>
      <el-button size="mini" type="primary">显示热区</el-button>
      <el-button size="mini" type="primary">绘制热区</el-button>
      <el-button size="mini" type="primary">删除热区</el-button>
    </div>
    <Map></Map>
    <div id="popup" ref="popup"></div>
  </div>
</template>

<script>
import Map from '../map'
import {Vector as VectorSource} from 'ol/source'
import { Style, Fill, Stroke, Circle } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import { Polygon } from 'ol/geom'
import axios from 'axios'

export default {
  components:  {
    Map
  },
  methods: {
    vectorSource: null,
    style: null,
    vectorLayer: null,
    hotSpotsSource: null,
    hotSpotsLayer: null,
    popup: null

  },
  created () {
    this.getHotspotsData()
    // 添加矢量图层、热区绘制图层
  },
  methods: {
    getHotspotsData () {
      this.$post('https://localhost:44363/RegDataHandler.ashx', { type: 'select', table: 'GDPChartInfo'})
        .then(res => {
          console.log(res)
          // this.showHotspots(res)
        })
        .catch( err => {
          console.log(err)
        })
    },
    drawHotspot () {

    },
    deleteHotspot () {

    },
    // 添加矢量图层、热区绘制图层
    initLayer () {
      const map = this.$children[0].map
      this.vectorSource = new VectorSource()
      this.style = new Style({
        fill: new Fill({ color: 'rgba(255, 102, 0, 0.2)'}),
        stroke: new Stroke({ color: '#cc3300', width: 2}),
        image: new Circle({ radius: 7, fill: new Fill({ color: '#cc3300'})})
      })
      this.vectorLayer = new VectorLayer({
        title: '矢量图层',
        source: this.vectorSource,
        style: this.style,
        opacity: 0.5
      })
      map.addLayer(this.vectorLayer)

      this.hotSpotsSource = new VectorSource()
      this.hotSpotsLayer = new VectorLayer({
        source: this.hotSpotsSource,
        style: this.style,
        opacity: 1
      })
      map.addLayer(this.hotSpotsLayer)
    },
    initOverlay () {
      this.popup = new Overlay({
        element: this.$refs.popup,
        position: 'bottom-center',
        stopEvent: false
      })
      this.$children[0].map.addOverlay(popup)
    },
    // 将获取的数据添加到矢量图层上
    showHotspots (data) {
      data.forEach((item,i) => {
        let coords = item.Geometry.split(';')
        coords.map(coord => {
          return coord.split('.')
        })
        let feature = new ol.Feature({
          geometry: new Polygon([coords]),
          name: item.name,
          gdp2015: item.GDP_2015,
          gdp2016: item.GDP_2016,
          gdp2017: item.GDP_2017,
          id: item.id
        })
        this.vectorSource.addFeature(feature)
      })
    },
    // 添加鼠标移动事件监听处理函数--捕获要素时添加热区
    addMapListener () {
      this.map.on('pointermove', e => {
        const map = this.$children[0].map
        // 确定鼠标点捕获到的要素，如果捕获到，改变鼠标样式为pointer，否则为默认
        let pixel = map.getEventPixel(e.originEvent)
        let feauteFlag = map.hasFeatureAtPixel(pixel) // 返回值是 boolean
        map.getTargetElement().style.cursor = featureFlag ? 'pointer' : ''
        if (featureFlag) {
          let feature = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            return feature
          })
          if (feature) {
            this.hotSpotsLayer.setVisible(true)
            if (this.preFeature != null) {
              if (this.preFeature === feature) {
                this.flag = true
              } else {
                this.flag = false
                this.hotSpotsSource.removeFeature(this.preFeature)
                this.preFeature = feature
              }
            }

            if (!this.flag) {
              this.currentFeature = feature
              this.currentFeature.setStyle(this.style)
              this.hotSpotsSource.addFeature(this.currentFeature)
              this.hotSpotsLayer.setVisible(true)
              this.preFeature = this.currentFeature
            }

            this.popup.setPosition(e.coordinate)
            
          }
        }
        
        if (feature) { // 打开删除对话框
          this.deleteVisible = true
          this.feature = feature
        }
      })
    },
    init
  }
}
</script>