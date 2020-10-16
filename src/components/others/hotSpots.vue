<!--
 * @Author: your name
 * @Date: 2020-10-12 15:18:41
 * @LastEditTime: 2020-10-15 10:40:39
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
  </div>
</template>

<script>
import Map from '../map'
import $axios from 'axios'
import qs from 'qs'
import {Vector as VectorSource} from 'ol/vector'
import { Style, Fill, Stroke, Circle } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import { Polygon } from 'ol/geom'

export default {
  components:  {
    Map
  },
  methods: {
    vectorSource: null,
    style: null,
    vectorLayer: null,
    hotSpotsSource: null,
    hotSpotsLayer: null

  },
  created () {
    this.showHotspots()
    // 添加矢量图层、热区绘制图层
  },
  methods: {
    getHotspotsData () {
      $axios.post('http://localhost:8080/static/data/RegDataHandler.ashx', qs.stringify({ type: 'select', table: 'GDPChartInfo'}))
        .then(res => {
          this.showHotspots(res)
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

      this.hotSpotsSource = new VectorSource()
      this.hotSpotsLayer = new VectorLayer({
        source: this.hotSpotsSource,
        style: this.style,
        opacity: 1
      })
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
    }
  }
}
</script>