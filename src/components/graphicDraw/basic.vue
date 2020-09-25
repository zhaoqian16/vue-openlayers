<template>
  <div id="map"></div>
</template>

<script>
let ol = require('ol')
import 'ol/ol.css';
import { Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import View from 'ol/View'

export default {
  data () {
    return {
      map: null,
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            title: 'osm',
            source: new OSM()
          })
        ],
        view: new View({
          center: [-11000000, 4600000],
          zoom: 4
        })
      })
      document.getElementsByClassName('ol-attribution')[0].style.display = 'none'
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>