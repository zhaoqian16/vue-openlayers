<template>
  <div>
    <Map></Map>
    <el-select v-model="type" @change="handleChange" class="type-switcher">
      <el-option v-for="item in typeDetail"
                 :key="item.index"
                 :label="item.label"
                 :value="item.value"></el-option>
    </el-select>
  </div>
</template>

<script>
import Map from '../map'
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer'
import {TileArcGISRest, Attribution} from 'ol/source'
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector';
import EsriJSON from 'ol/format/EsriJSON';
import {tile as tileStrategy} from 'ol/loadingstrategy';
import {createXYZ} from 'ol/tilegrid';
import {Fill, Stroke, Style} from 'ol/style';
import * as proj from 'ol/proj';

const jsonp = require('jsonp')

export default {
  components: {
    Map
  },
  data () {
    return {
      map: null,
      type: 'ArcGISMapServer',
      typeDetail: [
        {index: 0, value: 'ArcGISMapServer', label: 'ArcGIS MapServer在线瓦片'},
        {index: 1, value: 'ArcgisOnline', label: 'ArcgisOnline在线瓦片'},
        {index: 2, value: 'RestFeatureService', label: 'ArcGIS REST Feature Service'}
      ],
      mapServerLayer: null,
      onlineLayer: null,
      vectorLayer: null,
      styleCache: {
        'ABANDONED': new Style({
          fill: new Fill({
            color: 'rgba(225, 225, 225, 255)',
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 255)',
            width: 0.4,
          }),
        }),
        'GAS': new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 255)',
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0.4,
          }),
        }),
        'OIL': new Style({
          fill: new Fill({
            color: 'rgba(56, 168, 0, 255)',
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0,
          }),
        }),
        'OILGAS': new Style({
          fill: new Fill({
            color: 'rgba(168, 112, 0, 255)',
          }),
          stroke: new Stroke({
            color: 'rgba(110, 110, 110, 255)',
            width: 0.4,
          }),
        })
      }
    }
  },
  mounted () {
    this.handleChange(this.type)
  },
  methods: {
    handleChange (val) {
      // 加载val对应的地图
      let layers = this.$children[0].map.getLayers()
      let existFlag = false
      layers.forEach(item => {
        if (item.className_ === val) {
          item.setVisible(true)
          existFlag = true
        } else if (item.className_ === 'osm') {
          item.setVisible(true)
        } else {
          item.setVisible(false)
        }
      })
      if (existFlag) return
      switch (val) {
        case 'ArcGISMapServer':
          this.loadArcGISMapServer()
          break;
        case 'ArcgisOnline':
          this.loadArcgisOnline()
          break;
        case 'RestFeatureService':
          this.loadRestFeatureService()
          break;
      }
    },
    loadArcGISMapServer () {
      this.mapServerLayer = new TileLayer({
        className: 'ArcGISMapServer',
        source: new TileArcGISRest({
          url: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' + 'Specialty/ESRI_StateCityHighway_USA/MapServer'
        }),
        extent: [-13884991, 2870341, -7455066, 6338219]
      })
      this.$children[0].map.addLayer(this.mapServerLayer)
      this.setMapView(proj.fromLonLat([-121.1, 47.5]), 5)
    },
    loadArcgisOnline () {
      this.onlineLayer = new TileLayer({
        className: 'ArcgisOnline',
        source: new XYZ({
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
        }),
        attributions: 'Tiles &copy; <a href="http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
      })
      this.$children[0].map.addLayer(this.onlineLayer)
      this.setMapView(proj.fromLonLat([-121.1, 47.5]), 7)
    },
    loadRestFeatureService () {
      let serviceUrl = 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/' + 'Petroleum/KSFields/FeatureServer/'
      let layer = '0'
      let esrijsonFormat = new EsriJSON()
      let vectorSource = new VectorSource({
        loader: (extent, resolution, projection) => {
          var url = serviceUrl + layer
                    + '/query/?f=json&'
                    + 'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry='
                    + encodeURIComponent(`{"xmin":${extent[0]},"ymin":${extent[1]},"xmax":${extent[2]},"ymax":${extent[3]},"spatialReference":{"wkid":102100}}`)
                    + '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*'
                    + '&outSR=102100'
          jsonp(url, null, (error, response) => {
            if (error) {
              console.log(error)
            } else {
              
              let features = esrijsonFormat.readFeatures(response, {
                featureProjection: projection
              })
              console.log(features)
              if (features.length > 0) {
                vectorSource.addFeatures(features)
              }
            }
          })
        },
        strategy: tileStrategy(
          createXYZ({
            tileSize: 512,
          })
        )
      })
      this.vectorLayer = new VectorLayer({
        className: 'RestFeatureService',
        source: vectorSource,
        style: feature => {
          let classify = feature.get('activeprod')
          return this.styleCache[classify]
        }
      })
      this.$children[0].map.addLayer(this.vectorLayer)
      this.setMapView(proj.fromLonLat([-121.1, 47.5]), 5)
    },
    setMapView (center, zoom) {
      const view = this.$children[0].map.getView()
      view.setCenter(center)
      view.setZoom(zoom)
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
.type-switcher {
  position: absolute;
  top: 0;
  right: 0;
}
</style>