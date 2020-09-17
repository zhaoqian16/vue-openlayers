<template>
  <div>
    <Map></Map>
    <el-button-group class='animation'>
      <el-button size="middle" @click="rotateLeft">↻</el-button>
      <el-button size="middle" @click="rotateRight">↺</el-button>
      <el-button size="middle" @click="panTo()">pan to 沈阳</el-button>
      <el-button size="middle" @click="elasticTo()">elastic to 北京</el-button>
      <el-button size="middle" @click="bounceTo()">bounce to 上海</el-button>
      <el-button size="middle" @click="spinTo()">spin to 武汉</el-button>
      <el-button size="middle" @click="flyTo()">fly to 广州</el-button>
      <el-button size="middle" @click="rotateAround()">rotate around 海口</el-button>
      <el-button size="middle" @click="tour()">take a tour</el-button>
    </el-button-group>
  </div>
</template>

<script>
import Map from '../map'
import * as prj from 'ol/proj'
import {easeIn, easeOut} from 'ol/easing'
export default {
  data () {
    return {
      city: {
        shenyang: prj.fromLonLat([123.24, 41.]),
        beijing: prj.fromLonLat([116.28, 39.54]),
        shanghai: prj.fromLonLat([121.29, 31.14]),
        wuhan: prj.fromLonLat([114.21, 30.37]),
        guangzhou: prj.fromLonLat([113.15, 23.08]),
        haikou: prj.fromLonLat([110.20, 20.02])
      },
      view: null
    }
  },
  components: {
    Map
  },
  mounted () {
    this.view = this.$children[0].map.getView()
    this.view.setCenter(prj.fromLonLat([114.5, 38.]))
    this.view.setZoom(8)
  },
  methods: {
    // 整个地图向左旋转
    rotateLeft () {
      this.view.animate({
        rotation: this.view.getRotation() + Math.PI / 2
      })
    }, 
    // 整个地图向右旋转
    rotateRight () {
      this.view.animate({
        rotation: this.view.getRotation() - Math.PI / 2
      })
    },
    // 定位
    panTo () {
      this.view.animate({
        center: this.city.shenyang,
        duration: 2000
      })
    },
    // 弹性效果定位
    elasticTo () {
      this.view.animate({
        center: this.city.beijing,
        duration: 2000,
        easing: t => {
          return Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
        }
      })
    },
    // 反弹定位
    bounceTo () {
      this.view.animate({
        center: this.city.shanghai,
        duration: 2000,
        easing: t => {
          var s = 7.5625;
          var p = 2.75;
          var l;
          if (t < 1 / p) {
            l = s * t * t;
          } else {
            if (t < 2 / p) {
              t -= 1.5 / p;
              l = s * t * t + 0.75;
            } else {
              if (t < 2.5 / p) {
                t -= 2.25 / p;
                l = s * t * t + 0.9375;
              } else {
                t -= 2.625 / p;
                l = s * t * t + 0.984375;
              }
            }
          }
          return l;
        }
      })
    },
    // 自旋效果
    spinTo () {
      let center = this.view.getCenter()
      this.view.animate(
        {
          center: [ center[0] + (this.city.wuhan[0] - center[0]) / 2,
                    center[1] + (this.city.wuhan[0] - center[0]) / 2 ],
          rotation: Math.PI,
          easing: easeIn
        }, 
        {
          center: this.city.wuhan,
          rotation: 2 * Math.PI,
          easing: easeOut
        }
      )
    },
    flyTo (location) {
      fly(this.city.guangzhou, () => {})
    },
    // 飞行效果
    fly (location, done) {
      let parts = 2
      let called = false
      let zoom = this.view.getZoom()
      function callback (complete) {
        --parts
        if (called) {
          return
        }
        if (parts === 0 || !complete) {
          called = true
          done(complete)
        }
      }
      this.view.animate({
        center: location,
        duration: 2000
      }, callback)
      this.view.animate({
        zoom: zoom - 1,
        duration: 1000
      },{
        zoom: zoom, 
        duration: 1000
      }, callback)
    },
    // 螺旋效果定位
    rotateAround () {
      let rotation = this.view.getRotation()
      this.view.animate(
        {
          rotation: rotation + Math.PI,
          anchor: this.city.haikou,
          easing: easeIn
        },
        {
          rotation: rotation + 2 * Math.PI,
          anchor: this.city.haikou,
          easing: easeOut
        }
      )
    },
    // 旅行路线
    tour () {
      let locations = [this.city.shenyang, this.city.beijing,
                       this.city.shanghai, this.city.wuhan,
                       this.city.guangzhou, this.city.haikou]
      let index = -1
      let _this = this
      function next (more) {
        if (more) {
          ++ index
          if (index < locations.length) {
            let delay = index === 0 ? 0 : 750
            setTimeout(() => {
              _this.fly(locations[index], next)
            }, delay)
          } else {
            _this.$message({
              message: '旅行结束！',
              type: 'success'
            })
          }
        } else {
          _this.$message({
            message: '旅行取消！',
            type: 'warning'
          })
        }
      }
      next(true)
    }
  }
}
</script>

<style scoped>
.animation {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>