<template>
  <div>
    <Map></Map>
    <el-select v-model="dataType" @change="handleChange" class="type-switcher">
      <el-option label="geojson" value="geojson"></el-option>
      <el-option label="kml" value="kml"></el-option>
      <el-option label="gpx" value="gpx"></el-option>
    </el-select>
  </div>
</template>

<script>
import Map from '../map'
import {GeoJSON, KML, GPX} from 'ol/format'
import {Vector as VectorLayer} from 'ol/layer'
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Circle, Style} from 'ol/style';
export default {
  components: {
    Map
  },
  data () {
    return {
      dataType: 'geojson',
      styles: null,
    }
  },
  mounted () {
    this.initStyles()
    this.handleChange('geojson')
  },
  methods: {
    handleChange (val) {
      // 如果存在，则显示；如果不存在，则创建
      let layers = this.$children[0].map.getLayers()
      let existFlag = false
      layers.forEach(item => {
        if (item.className_ === 'val') {
          item.setVisible(true)
          existFlag = true
        } else if (item.className_ === 'osm') {
          item.setVisible(true)
        } else {
          item.setVisible(false)
        }
      })
      if (existFlag) return
      let url, center, zoom
      if (val === 'geojson') {
        url = '../../../static/data/geojson/countries.geojson'
        center = [0, 0]
        zoom = 2
      } else if (val === 'kml') {
        url =  '../../../static/data/kml/2012-02-10.kml'
        center = [876970, 5859807]
        zoom = 10
      } else if (val === 'gpx') {
        url = '../../../static/data/gpx/fells_loop.gpx'
        center = [-7916041, 5228379]
        zoom = 12
      }
      this.loadVectData(val, url)
      const view = this.$children[0].map.getView()
      view.setCenter(center)
      view.setZoom(zoom)
    },
    /**
     * @description: 加载矢量数据
     * @param {type} 
     * @return {type} 
     */
    loadVectData (type, dataUrl) {
      let format
      if (type === 'geojson') {
        format = new GeoJSON()
      } else if (type === 'kml') {
        format = new KML()
      } else if (type === 'gpx') {
        format = new GPX()
      }
      this.vectorLayer = new VectorLayer({
        className: type,
        source: new VectorSource({
          url: dataUrl,
          format: format
        }),
        style: (feature, resolution) => {
          return this.styles[feature.getGeometry().getType()]
        }
      })
      this.$children[0].map.addLayer(this.vectorLayer)
    },
    initStyles () {
      const image = new Circle({
        radius: 5,
        fill: null,
        stroke: new Stroke({color: 'red', width: 1})
      })
      const pointStyle = [
        new Style({image: image})
      ]
      const lineStyle = [
        new Style({
          stroke: new Stroke({color: 'green', width: 1})
        })
      ]
      const polygonStyle = [
        new Style({
          stroke: new Stroke({color: 'blue', lineDash: [4], width: 3}),
          fill: new Fill({color: 'rgba(0, 0, 255, 0.1)'})
        })
      ]
      const multiPolygonStyle = [
        new Style({
          stroke: new Stroke({color: 'yellow', width: 1}),
          fill: new Fill({color: 'rgba(255, 255, 0, 0.1)'})
        })
      ]
      const geometryCollectionStyle = [
        new Style({
          stroke: new Stroke({color: 'magenta', width: 2}),
          fill: new Fill({color: 'magenta'}),
          image: new Circle({
            radius: 10, 
            fill: null, 
            stroke: new Stroke({color: 'magenta'})
          })
        })
      ]
      const circleStyle = [
        new Style({
          stroke: new Stroke({color: 'red', width: 2}),
          fill: new Fill({color: 'rgba(255, 0, 0, 0.2)'})
        })
      ]
      this.styles = {
        'Point': pointStyle,
        'MultiPoint': pointStyle,
        'LineString': lineStyle,
        'MultiLineString': lineStyle,
        'Polygon': polygonStyle,
        'MultiPolygon': multiPolygonStyle,
        'GeometryCollection': geometryCollectionStyle,
        'Circle': circleStyle
      }
    }
  }
}
</script>

<style scoped>
.type-switcher {
  position: absolute;
  top: 0;
  right: 0;
}
</style>