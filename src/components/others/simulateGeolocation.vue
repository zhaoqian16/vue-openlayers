<template>
  <div class="all">
    <div class="menu">
      <label>模拟导航：</label>
      <el-button @click="startTrack()" size="mini" type="primary" :disabled="disabled">开始导航</el-button>
      <span class="error" v-if="errorVisible">未能成功加载模拟数据!</span>
    </div>
    <div id="map">
      <div class="info">
        <li>
          <label>位置点坐标（position）:</label>
          <span>{{ currentInfo.position ? currentInfo.position : '----'}}</span>
        </li>
        <li>
          <label>位置精度（position accuracy）:</label>
          <span>{{ currentInfo.positionAccuracy ? currentInfo.positionAccuracy : '----'}}</span>
        </li>
        <li>
          <label>当前方向（heading）:</label>
          <span>{{ currentInfo.heading ? currentInfo.heading : '----'}}</span>
        </li>
        <li>
          <label>当前速度（speed）:</label>
          <span>{{ currentInfo.speed ? currentInfo.speed : '----'}}</span>
        </li>
        <li>
          <label>采样周期（delta）:</label>
          <span>{{ currentInfo.delta ? currentInfo.delta : '----'}}</span>
        </li>
      </div>
    </div>
    <img ref="geolocationMarker" src="../../../static/images/geolocation_marker_heading.png" />
  </div>
</template>

<script>
let ol = require('ol')
import { Tile as TileLayer} from 'ol/layer'
import { OSM } from 'ol/source'
import View from 'ol/view'
import { LineString } from 'ol/geom'
export default {
  data () {
    return {
      map: null,
      disabled: false,
      trackData: undefined,
      errorVisible: false,
      currentInfo: {
        position: '',
        positionAccuracy: '',
        heading: '',
        speed: '',
        delta: ''
      },
      marker: null,
      deltaMean: 500,
      positions: undefined,
      previousM: 0
    }
  },
  created () {
    this.getTrackData()
  },
  mounted () {
    this.initMap()
    this.initGeolocation()
    this.initMarker()
    this.initGeolocationListener()
    this.initMapListener()
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
          center: [0, 0],
          zoom: 1,
          projection: 'EPSG:4326'
        })
      })
      this.positions = new LineString([], 'XYZM');
    },
    // 创建导航定位控件
    initGeolocation () {
      this.geolocation = new ol.Geolocation({
        projection: this.map.getView().getProjection(),
        trackingOptions: {
          enableHighAccuracy: true
        }
      })
    },
    initMarker () {
      this.marker = new ol.Overlay({
        positioning: 'center-center',
        element: this.$refs.geolocationMarker,
        stopEvent: false
      })
      this.map.addOverlay(this.marker)
    },
    // 获取轨迹数据
    getTrackData () {
      this.$get('/static/data/json/geolocation-orientation.json').then(res => {
        if (res && res.data) {
          this.trackData = res.data
        }
      })
    },
    // 开始导航
    startTrack () {
      if (this.trackData == null || this.trackData == undefined) {
        this.errorVisible = true
        return
      }
      let first = this.trackData.shift()
      // 位置变换
      this.positionChange(first)
      this.prevDate = first.timestamp
      this.geolocate()
      this.map.on('postcompose', () => {
        this.map.render()
      })
      this.map.render()
      this.disabled = true
    },
    positionChange (position) {
      let coords = position.coords
      this.geolocation.set('accuracy', coords.accuracy)
      this.geolocation.set('heading', coords.heading * Math.PI * 2 / 360)
      this.geolocation.set('position', [coords.longitude, coords.latitude])
      this.geolocation.set('speed', coords.speed)
      this.geolocation.changed()
    },
    geolocate () {
      let position = this.trackData.shift()
      if (!position) {
        this.disabled = true
        return
      }
      let newDate = position.timestamp
      this.positionChange(position)
      window.setTimeout( () => {
        this.prevDate = newDate
        console.log(this.prevDate)
        this.geolocate()
      }, (newDate - this.prevDate) / 0.5)
    },
    initGeolocationListener () {
      // 为定位控件添加位置变更事件
      this.geolocation.on('change', (e) => {
        // 添加定位点
        // 更新信息面板的信息
        let position = this.geolocation.getPosition()
        let accuracy = this.geolocation.getAccuracy()
        let heading = this.geolocation.getHeading() || 0
        let speed = this.geolocation.getSpeed() || 0
        let m = Date.now()
        this.addCurrentPosition(position, heading, m, speed)
        let coords = this.positions.getCoordinates()
        if (coords.length >= 2 ) {
          this.deltaMean = (coords[coords.length - 1][3] - coords[0][3]) / (coords.length - 1)
        }

        this.currentInfo.position = position[0].toFixed(2) + ', ' + position[1].toFixed(2)
        this.currentInfo.positionAccuracy = accuracy + ' m'
        this.currentInfo.heading = Math.round(this.radToDeg(heading)) + '&deg;'
        this.currentInfo.spped = (speed * 3.6).toFixed(1) + ' km/h'
        this.currentInfo.delta = Math.round(this.deltaMean) + 'ms'
      })

      
      // 定位控件添加错误事件处理函数
      this.geolocation.on('error', (error) => {
        alert('geolocation error')
      })

    },
    addCurrentPosition (position, heading, m, speed) {
      let lng = position[0]
      let lat = position[1]
      let fCoords = this.positions.getCoordinates()
      let previous = fCoords[fCoords.length-1]
      let previousHeading = previous && previous[2]
      if (previousHeading) {
        let headingDiff = heading - this.mod(previousHeading)
        if (Math.abs(headingDiff) > Math.PI) {
          let sign = (headingDiff >= 0) ? 1 : -1;
          headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff))
        }
        heading = previousHeading + headingDiff
      }
      this.positions.appendCoordinate([lng, lat, heading, m])
      this.positions.setCoordinates(this.positions.getCoordinates().slice(-20))
      if (heading && speed) {
        this.$refs.geolocationMarker.src = '../../../static/images/geolocation_marker_heading.png'
      } else {
        this.$refs.geolocationMarker.src = '../../../images/geolocation_marker.png'
      }
    },
    radToDeg (rad) {
      return rad * 360 / (Math.PI * 2)
    },
    mod (n) {
      return ((n % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI)
    },
    initMapListener () {
      this.map.on('precompose', (map) => {
        let frameState = map.frameState
        if (this.frameState !== null) {
          let m = frameState - this.deltaMean * 1.5
          m = Math.max(m, this.previousM);
          this.previousM = m;
          // 沿模拟轨迹设置当前定位点的position
          var c = this.positions.getCoordinateAtM(m, true);
          var view = frameState.viewState;
          if (c) {
            view.center = this.getCenterWithHeading(c, -c[2], view.resolution);//设置中心点
            view.rotation = -c[2];//设置地图旋转角度
            this.marker.setPosition(c);//设置导航定位点的标注位置
          }
        }
        return true;
      })
    },
    getCenterWithHeading(position, rotation, resolution) {
      var size = this.map.getSize();
      var height = size[1];
      return [
        position[0] - Math.sin(rotation) * height * resolution * 1 / 4,
        position[1] + Math.cos(rotation) * height * resolution * 1 / 4
      ];
    }
  }
}
</script>

<style scoped>
.all {
  width: 100%;
  height: 100%;
}
.menu .error{
  display: inline-block;
  color: #ff0000;
  font-size: 14px;
  margin-left: 20px;
}
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
#map .info {
  background-color: #8fc5fa;
  border-radius: 8px;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 999;
  font-size: 14px;
}
#map li {
  list-style: none;
  padding: 5px 10px;
}
#map li label {
  display: inline-block;
  width: 200px;
}
</style>