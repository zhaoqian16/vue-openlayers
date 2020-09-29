<!--
 * @Author: your name
 * @Date: 2020-09-25 11:24:38
 * @LastEditTime: 2020-09-27 11:51:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-openlayers\src\components\graphicDraw\practiceDelete.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="menu">
      <el-select v-model="type" @change="handleChange">
        <el-option label="无" value="None"></el-option>
        <el-option label="点" value="Point"></el-option>
        <el-option label="线" value="LineString"></el-option>
        <el-option label="面" value="Polygon"></el-option>
      </el-select>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="cancle">
      <span>是否删除该要素？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Map from '../map'

import { Vector as VectorSource } from 'ol/source'
import { Vector as VectorLayer } from 'ol/layer'
import {Draw, Modify, Snap, Select} from 'ol/interaction';
import * as prj from 'ol/proj';
import {Fill, Stroke, Circle, Style} from 'ol/style';
import {unByKey} from 'ol/Observable';

export default {
  components: {
    Map
  },
  data () {
    return {
      source: null,
      vectorLayer: null,
      type: 'None',
      draw: null,
      select: null,
      snap: null,
      currentFeature: null,
      dialogVisible: false
    }
  },
  mounted () {
    this.initVectorLayer()
    this.initDraw()
  },
  methods:{
    /**
     * @description: 初始化待绘制的矢量图层
     * @param {type} 
     * @return {type} 
     */
    initVectorLayer () {
      const map = this.$children[0].map
      this.source = new VectorSource({ wrapX: false})
      this.vectorLayer = new VectorLayer({
        source: this.source
      })
      map.addLayer(this.vectorLayer)
    },
    /**
     * @description: 初始化画图控件
     * @param {type} 
     * @return {type} 
     */
    initDraw () {
      const map = this.$children[0].map
      if (this.type === 'None' )  {
        this.initSnap()
        this.initSelect()
        return
      } else {
        map.removeInteraction(this.select)
      }
      this.draw = new Draw({
        source: this.source,
        type: this.type,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            })
          })
        })
      })
      map.addInteraction(this.draw)
      
    },
    /**
     * @description: 处理绘制类型改变时的函数
     * @param {type} 
     * @return {type} 
     */
    handleChange() {
      const map = this.$children[0].map
      map.removeInteraction(this.draw)
      this.initDraw()
    },
    /**
     * @description: 初始化追踪控件
     * @param {type} 
     * @return {type} 
     */
    initSnap () {
      const map = this.$children[0].map
      this.snap = new Snap({ source: this.source })
      map.addInteraction(this.snap)
    },
    /**
     * @description: 初始化选择控件
     * @param {type} 
     * @return {type} 
     */
    initSelect () {
      const map = this.$children[0].map
      this.select = new Select()
      map.addInteraction(this.select)
      // 重点----给 this.select.getFeatures() 添加监听函数
      this.select.getFeatures().on('add', e => {
        if (e && e.element) {
          this.currentFeature = e.element
          this.dialogVisible = true
        }
      })
    },
    /**
     * @description: 确认删除要素
     * @param {type} 
     * @return {type} 
     */
    confirm () {
      this.dialogVisible = false
      this.vectorLayer.getSource().removeFeature(this.currentFeature)
      unByKey(this.getFeature)
    },
    /**
     * @description: 取消删除要读
     * @param {type} 
     * @return {type} 
     */
    cancle () {
      this.dialogVisible = false
      unByKey(this.getFeature)
    }
  }
}
</script>

<style scoped>
.menu {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>