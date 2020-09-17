<template>
  <div>
    <div id="map"></div>
    <div class="layer_control" ref="layerControl">
      <div class="title"><label>图层列表</label></div>
      <ul ref="layerTree" class="layer_tree">
        <li v-for="(item,index) in layers">
          <input type="checkbox" @change="handleChange()" :value="item.className_" v-model="layerChecked"> {{ item.className_ }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import View from 'ol/View'
import { Tile as TileLayer } from 'ol/layer'
import { OSM } from 'ol/source'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { GeoJSON, KML } from 'ol/format'
let ol = require('ol')

export default {
  data () {
    return {
      layers: [],
      map: null,
      layerChecked: []
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.layers = [
        new TileLayer({
          source: new OSM(), 
          className: '世界地图（OSM瓦片）'
        }),
        new VectorLayer({ 
          source: new VectorSource({
            url: '../../../static/data/geojson/countries.geojson',
            format: new GeoJSON()
          }), 
          className: '国界（JSON格式的矢量图）'
        }),
        new VectorLayer({
          source: new VectorSource({
            url: '../../../static/data/kml/2012_Earthquakes_Mag5.kml',
            format: new KML({
              extractStyles: false
            })
          }),
          className: '点（KML格式矢量图）'
        })
      ]
      this.layers.forEach(item => this.layerChecked.push(item.className_))
      console.log(this.layerChecked)
      this.map = new ol.Map({
        target: 'map',
        layers: this.layers,
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      }),
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    },
    handleChange (index) {
      // 如果选中，则显示；如果没有选中，则不显示
      this.layers.forEach(item => {
        let layer = this.layerChecked.find(name => name === item.className_)
        if (layer) {
          item.setVisible(true)
        } else {
          item.setVisible(false)
        }
      })
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: absolute;
}
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
.layer_control .title {
  font-weight: 700;
  font-size: 15px;
  margin: 10px;
}
.layer_control .layer_tree {
  list-style: none;
  margin: 0;
  padding: 0;
}
.layer_control .layer_tree li {
  list-style: none;
  margin: 5px 15px;
}
</style>