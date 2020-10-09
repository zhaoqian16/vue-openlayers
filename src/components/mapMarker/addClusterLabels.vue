<!--
 * @Author: your name
 * @Date: 2020-09-30 09:51:34
 * @LastEditTime: 2020-10-09 10:28:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\mapMarker\addClusterLabels.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="manu">
      <input type="range" min="0" max="100" step="1" v-model="distance">
    </div>
    
  </div>
</template>

<script>
import Map from '../map'
import * as prj from 'ol/proj'
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Vector as VectorSource, Cluster} from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';

export default {
  components: {
    Map
  },
  data () {
    return {
      features: [],
      source: null,
      clusterSource: null,
      distance: 40,
      styleCache: {},
      clusterLayer: null
    }
  },
  mounted () {
    this.initClusterData()
    this.initCluster()
  },
  methods: {
    initClusterData () {
      const map = this.$children[0].map
      const projection = map.getView().getProjection().getCode()
      let count = 20000
      let e = 4500000
      this.features = new Array(count)
      for (let i = 0; i < count; i++) {
        let coordinates = [ 2 * e * Math.random() - e, 2 * e * Math.random() - e ]
        coordinates = prj.toLonLat(coordinates, 'EPSG:3857')
        this.features[i] = new Feature(new Point(coordinates))
      }
    },
    initCluster () {
      const map = this.$children[0].map
      this.source = new VectorSource({
        features: this.features
      })
      this.clusterSource = new Cluster({
        distance: parseInt(this.distance, 10),
        source: this.source
      })
      this.clusterLayer = new VectorLayer({
        source: this.clusterSource,
        style: (feature) => {
          let size = feature.get('features').length
          let style = this.styleCache[size]
          if (!style) {
            style = new Style({
              image: new CircleStyle({
                radius: 10,
                stroke: new Stroke({ color: '#fff' }),
                fill: new Fill({ color: '#3399CC' })
              }),
              text: new Text({
                text: size.toString(),
                fill: new Fill({ color: '#fff' })
              })
            })
            this.styleCache[size] = style
          }
          return style
        }
      })
      map.addLayer(this.clusterLayer)
    }
  },
  watch: {
    distance (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.clusterSource.setDistance(parseInt(this.distance, 10))
      }
    }
  }
}
</script>

<style scoped>
.manu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>