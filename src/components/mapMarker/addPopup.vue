<!--
 * @Author: your name
 * @Date: 2020-09-30 09:51:34
 * @LastEditTime: 2020-09-30 16:41:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\mapMarker\addPopup.vue
-->
<template>
  <div>
    <Map></Map>
    <div id="popup" class="ol-popup" ref="popup">
      
    </div>
  </div>
</template>

<script>
import Map from '../map'

import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Style, Icon, Text, Stroke, Fill} from 'ol/style'
import Overlay from 'ol/Overlay';

export default {
  components: {
    Map
  },
  data () {
    return {
      pointInfo: {
        coordinates: [116.28, 39.54],
        cityName: 'beijing',
        attr: {
          title: '北京市(中华人民共和国首都)',
          titleURL: 'http://www.openlayers.org/',
          text: '北京（Beijing），简称京，中华人民共和国首都、直辖市，中国的政治、文化和国际交往中心……',
          imgURL: '/static/images/bj.png'
        }
      },
      vectorSource: null,
      vectorLayer: null,
      overlay: null
    }
  },
  mounted () {
    this.initVectorLayer()
    this.initListener()
    // 先创建一个Overlay，点击时将其放到对应位置
    this.initOverLay()
  },
  methods: {
    initVectorLayer () {
      const map = this.$children[0].map
      this.vectorSource = new VectorSource() 
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource
      })
      map.addLayer(this.vectorLayer)
      let feature = new Feature({
        geometry: new Point(this.pointInfo.coordinates),
        name: this.pointInfo.cityName,
        population: 2115
      })
      feature.setStyle(this.createLabelStyle(feature))
      this.vectorSource.addFeature(feature)
      map.getView().setCenter(this.pointInfo.coordinates)
      map.getView().setZoom(12)
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
          src: '../../../static/images/icon/icon.png'

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
    initListener () {
      this.$children[0].map.on('click', e => {
        let feature = this.$children[0].map.forEachFeatureAtPixel(e.pixel, (feature, layer) => { return feature })
        if (feature) {
          let template = this.initTemplate(this.pointInfo)
          this.$refs.popup.innerHTML = template
          this.$refs.popup.children[0].onclick = this.handleClose
          this.overlay.setPosition(this.pointInfo.coordinates)
          console.log(this.overlay)
        }
      })
    },
    initOverLay () {
      this.overlay = new Overlay({
        element: this.$refs.popup,
        autoPan: true,
        positioning: 'bottom-center',
        stopEvent: false,
        autoPanAnimation: {
          duration: 250
        }
      })
      this.$children[0].map.addOverlay(this.overlay)
    },
    initTemplate (info) {
      return `
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content">
          <a class="markerInfo" href="${info.attr.titleURL}">${info.attr.title}</a>
          <div class="markerText">${info.attr.text}</div>
          <img class="markerImg" src="${info.attr.imgURL}">
        </div>
      `
    },
    handleClose () {
      console.log('close')
      this.overlay.setPosition(undefined)
      return false
    }
  }
}
</script>

<style>
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
  filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 45px;
  left: -50px;
}

.ol-popup:after, .ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}

.ol-popup-closer:after {
    content: "✖";
}

#popup-content {
  /* width: 300px; */
  font-size: 14px;
  font-family: "微软雅黑";
}

#popup-content .markerInfo {
  font-weight: bold;
}

</style>