<template>
  <div>
    <Map></Map>
    <div class="menu">
      <label class="label">选择标注类型后鼠标在地图上点击添加标注:</label>
      <el-radio-group v-model="labelType" size="mini" @change="handleChange"> 
        <el-radio-button label="vectorLabel">Vector Label</el-radio-button>
        <el-radio-button label="overlayLabel">Overlay Label</el-radio-button>
      </el-radio-group>
      <div ref="overlay">
        
      </div>
      
    </div>
  </div>
</template>

<script>
import Map from '../map'

import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import {Style, Icon, Text, Fill, Stroke} from 'ol/style'
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import { Point } from 'ol/geom';

 export default {
  components: {
    Map
  },
  data () {
    return {
      labelType: 'vectorLabel',
      vectorSource: null,
      vectorLayer: null
    }
  },
  mounted() {
    this.initVectorLayer()
    this.initListener()
  },
  methods: {
    handleChange () {
      console.log(this.labelType)
    },
    initVectorLayer () {
      this.vectorSource = new VectorSource()
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource
      })
      this.$children[0].map.addLayer(this.vectorLayer)
    },
    initListener () {
      this.$children[0].map.on('click', e => {
        let point = e.coordinate
        console.log(point)
        if (this.labelType === 'vectorLabel') {
          this.addVectorLabel(point)
        } else if (this.labelType === 'overlayLabel') {
          this.addOverlayLabel(point)
        }
      })
    },
    createLabelStyle (feature) {
      return new Style({
        image: new Icon({
          anchor: [0.5, 60],
          anchorOrigin: 'top-right',
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          offsetOrigin: 'top-right',
          opacity: 0.75,
          src: '../../../static/icon/icon.png'

        }),
        text: new Text({
          textAlign: 'center',
          textBaseline: 'middle',
          font: 'normal 14px 微软雅黑',
          text: feature.get('name'),
          fill: new Fill({ color: 'aa3300' }),
          stroke: new Stroke({ color: '#ffcc33', width: 2 })
        })
      })
    },
    addVectorLabel (coordinate) {
      let feature = new Feature({
        geometry: Point(coordinate),
        name: '标注点'
      })
      feature.setStyle(this.createLabelStyle(feature))
      this.vectorSource.addFeature(feature)
    },
    addOverlayLabel (coordinate) {
      let template = `
        <div class="marker" title="标注点">
          <a class="address" href="#">标注点</a>
        </div>
      `
      this.$refs.overlay.appendChild(template)
      let overlay = new Overlay({
        position: coordinate,
        positioning: 'center-center',
        element: this.$refs.overlay,
        stopEvent: false
      })
      map.addOverlay(overlay)
      let text = new Overlay({
        position: coordinate,
        element: this.$refs.overlay.children[0].children[0]
      })
      map.addOverlay(text)
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
.menu .label {
  display: inline-block;
  padding: 5px 10px;
  background-color: #409EFF;
  font-size: 14px;
  color: #fff;
  border-color:  #409EFF;
  border-radius: 5px;;
}
</style>