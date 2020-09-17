<template>
  <div>
    <Map></Map>
    <el-radio-group v-model="mapType" class="map-switcher" @change="loadMap">
      <el-radio label="osm">OpenStreetMap</el-radio>
      <el-radio label="MapQuest">MapQuest地图</el-radio>
      <el-radio label="Bing">Bing地图
        <el-select v-model="bingType" @change="bingChange">
          <el-option label="Road" value="Road"></el-option>
          <el-option label="Aerial" value="Aerial"></el-option>
          <el-option label="Aerial with labels" value="AerialWithLabels"></el-option>
          <el-option label="Collins Bart" value="CollinsBart"></el-option>
          <el-option label="Ordnance Survey" value="OrdnanceSurry"></el-option>
        </el-select>
      </el-radio>
      <el-radio label="Baidu">Baidu地图</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import Map from '../map'
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';
import BingMaps from 'ol/source/BingMaps';
import TileImage from 'ol/source/TileImage';
import * as prj from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';
import * as Extent from 'ol/extent';

export default {
  data () {
    return {
      mapType: 'osm',
      bingType: 'Road',
      osmLayer: null,
      mapQuestLayer: null,
      bingLayer: null,
      baiduLayer: null
    }
  },
  components: {
    Map
  },
  mounted () {
    this.loadMap()
  },
  methods: {
    loadMap () {
      const map = this.$children[0].map
      let layers = map.getLayers()
      let existFlag = false
      layers.forEach(item => {
        if (item.className_ === this.mapType) {
          item.setVisible(true)
          existFlag = true
        } else {
          item.setVisible(false)
        }
      })
      if (existFlag) return
      if (this.mapType === 'osm') {
        this.osmLayer = new TileLayer({
          className: 'osm',
          source: new OSM()
        })
        map.addLayer(this.osmLayer)
      } else if (this.mapType === 'MapQuest') {
        this.mapQuestLayer = new TileLayer({
          className: 'MapQuest',
          source: new XYZ({
            url: 'https://{a-d}.tiles.mapbox.com/v4/mapquest.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwcXVlc3QiLCJhIjoiY2Q2N2RlMmNhY2NiZTRkMzlmZjJmZDk0NWU0ZGJlNTMifQ.mPRiEubbajc6a5y9ISgydg',
          })
        })
        console.log(this.mapQuestLayer)
        map.addLayer(this.mapQuestLayer)
      } else if (this.mapType === 'Bing') {
        // 显示对应的bing地图
        this.bingLayer = new TileLayer({
          className: 'Bing',
          source: new BingMaps({
            key: 'AvEW30yRAk5b06vbFuBmUePb1bMSlXGry6B-jah_jtZNh0aixHUoQ_u1VjfHhFJD',
            imagerySet: this.bingType
          })
        })
        map.addLayer(this.bingLayer)
        this.bingChange()
      } else if (this.mapType === 'Baidu') {
        this.loadBaiduLayer()
      }
    },
    bingChange () {
      let source = new BingMaps({
        key: 'AvEW30yRAk5b06vbFuBmUePb1bMSlXGry6B-jah_jtZNh0aixHUoQ_u1VjfHhFJD',
        imagerySet: this.bingType
      })
      if (this.bingLayer) {
        this.bingLayer.setSource(null)
        this.bingLayer.setSource(source)
      }
    },
    /**
     * @description: 加载百度地图 --------------- ？？？？？？？？？？ 显示有问题
     * @param {type} 
     * @return {type} 
     */
    loadBaiduLayer () {
      const map = this.$children[0].map

      let extent = [-20037508, -20037508, 20037508, 20037508]
      let tilesize = 256
      let resolutions = this.getResolutions(extent, tilesize)
      this.baiduLayer = new TileLayer({
        source: new TileImage({
          attributions: 'Copyright: &copy; 2015 Baidu, i-cubed, GeoEye',
          tileUrlFunction: (tileCoord, pixelRatio, projection) => {
            if (!tileCoord)  return ""

            let z = tileCoord[0]
            let x = tileCoord[1]
            let y = tileCoord[2]
            
            x = x < 0 ? 'M'+(-x) : x
            y = y < 0 ? 'M'+(-y) : y

            return `http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=${x}&y=${y}&z=${z}&styles=pl&udt=20170809&scaler=1&p=1`
                    
          },
          projection: prj.get('EPSG:3857'),
          tileGrid: new TileGrid({
            origin: [0, 0],
            resolutions: resolutions,
            tilesize: tilesize
          })
        })
      })
      map.addLayer(this.baiduLayer)
    },
    /**
     * @description: 计算象元对应的实际距离，一般直接取 地图实际宽度/地图div大小（以像素为单位）
     * @param {type} 
     * @return {type} 
     */
    getResolutions (extent, tilesize) {
      let width = Extent.getWidth(extent)
      let height = Extent.getWidth(extent)
      let maxResolution = (width <= height ? height : width) / tilesize
      let resolutions = []
      for (let i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i)
      }
      return resolutions
    }
  }
}
</script>

<style scoped>
.map-switcher {
  position: absolute;
  top: 5px;
  left: 50px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>