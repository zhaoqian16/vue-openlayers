<!--
 * @Author: your name
 * @Date: 2020-09-21 11:37:53
 * @LastEditTime: 2020-09-21 11:38:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\multiData\overLayerMaps.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="layer_control" ref="layerControl">
      <ul ref="layerTree">
        <li v-for="(item,index) in layers">
          <input type="checkbox" @change="handleChange()" :value="item.className_" v-model="layerChecked"> {{ item.className_ }}
           <ul class="layer_color">
            <li>
              <label>透明度</label>
              <el-input-number v-model="item.opacity" size="mini" @change="handle('opacity', item.opacity)"></el-input-number>
            </li>
            <li>
              <label>色彩</label>
              <el-input-number v-model="item.hue" size="mini" @change="handle('hue', item.hue)"></el-input-number>
            </li>
            <li>
              <label>饱和度</label>
              <el-input-number v-model="item.saturation" size="mini" @change="handle('saturation', item.saturation)"></el-input-number>
            </li>
            <li>
              <label>对比度</label>
              <el-input-number v-model="item.contrast" size="mini" @change="handle('contrast', contrast)"></el-input-number>
            </li>
            <li>
              <label>亮度</label>
              <el-input-number v-model="item.brightness" size="mini" @change="handle('brightness', brightness)"></el-input-number>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Map from '../map'
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import GeoJSON from 'ol/format/GeoJSON';

export default {
  components: {
    Map
  },
  data () {
    return {
      layers: [],
      vectorLayer: null,
      arcgisLayer: null,
      layerChecked: [],
      opacity: 0,
      hue: 0,
      saturation: 0,
      contrast: 0,
      brightness: 0
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      const map = this.$children[0].map
      
      this.vectorLayer = new VectorLayer({ 
        source: new VectorSource({
          url: '../../../static/data/geojson/countries.geojson',
          format: new GeoJSON()
        }), 
        className: '国界（JSON格式的矢量图）'
      })
      this.arcgisLayer = new TileLayer({
        className: 'ArcGISMapServer',
        source: new TileArcGISRest({
          url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' + 'Specialty/ESRI_StateCityHighway_USA/MapServer'
        }),
        extent: [-13884991, 2870341, -7455066, 6338219]
      })
      map.addLayer(this.vectorLayer)
      map.addLayer(this.arcgisLayer)
      this.layers = map.getLayers().array_
      this.layers.forEach(item => {
        this.layerChecked.push(item.className_)
        console.log(item.get('opacity'))
        console.log(item.get('hue'))
      })
    },
    handleChange () {
      // 如果选中，则显示；如果没有选中，则不显示
      this.layers.forEach(item => {
        console.log(item)
        let layer = this.layerChecked.find(name => name === item.className_)
        if (layer) {
          item.setVisible(true)
        } else {
          item.setVisible(false)
        }
      })
    },
    /**
     * @description: 处理色彩调整的变化===============laye不能获取除opacity以外的色彩属性
     * @param {type} 
     * @return {type} 
     */
    handle (type, value) {
      const map = this.$children[0].map
      if (type === 'opacity') {
        
      } else if (type === 'hue') {

      } else if (type === 'saturation') {

      } else if (type === 'contrast') {

      } else if (type === 'brightness') {

      }
    }
  }
}
</script>

<style scoped>
.layer_control {
  position: absolute;
  top: 5px;
  right: 0;
  min-width: 200px;
  min-height: 150px;
  background-color: rgba(0,60,136,0.5);
  border-width: 10px;
  border-radius: 10px;
  border-color: #000 #000 #000 #000;
  color: #fff;
}
.layer_control ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.layer_control  li {
  list-style: none;
  margin: 5px 15px;
}
.layer_control label {
  display: inline-block;
  width: 50px;
}
</style>