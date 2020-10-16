<!--
 * @Author: xiongqianqian
 * @Date: 2020-10-12 16:40:56
 * @LastEditTime: 2020-10-14 14:43:19
 * @LastEditors: Please set LastEditors
 * @Description: 态势标绘-----ol6尚不支持
 * @FilePath: \vue-openlayers\src\components\others\militaryPlotting.vue
-->
<template>
  <div>
    <Map></Map>
    <div class="menu">
      <el-collapse accordion>
        <el-collapse-item title="军标">
          <el-tabs v-model="activeName" class="first">
            <el-tab-pane label="图形编辑" name="first">
              <div class="first-body">
                <table>
                  <tr v-for="type in typeList" :key="type.name">
                    <td class="key"><p>{{ type.title }}&nbsp;</p></td>
                    <td>
                      <div v-for="item in type.children" :key="item.name" class="detail_type">
                        <img :src="item.url" :title="item.title" style="cursor: pointer" :ref="item.name"
                            @mouseover="handleMouseover(item.name)" 
                            @mouseout="handleMouseout(item.name)"
                            @click="drawArrow(item.name)">
                      </div>
                    </td>
                  </tr>
                </table>
                <div class="first-body-footer">
                  <el-button size="mini" @click="shapeModify()">修改图形</el-button>
                  <el-button size="mini" @click="shapeMove()()">移动图形</el-button>
                  <el-button size="mini" @click="shapeDel()">移除图形</el-button>
                </div>
              </div>
              <div class="first-footer">
                <el-button size="mini" @click="delStatus()">清除状态</el-button>
                <el-button size="mini" @click="delFeature()">清空要素</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="样式修改" name="second">
              <div class="second-body">
                <table>
                  <tr>
                    <td><span class="label">填充色</span></td>
                    <td><el-color-picker v-model="style.fillColor"></el-color-picker></td> <!-- 选取颜色 -->
                  </tr>
                  <tr>
                    <td><span class="label">点半径</span></td>
                    <td><el-input v-model="style.radius"></el-input></td> <!-- 点半径 -->
                  </tr>
                  <tr>
                    <td><span class="label">线头类型</span></td>
                    <td>
                      <el-select v-model="style.linHeadType">
                        <el-option label="圆头" value="round"></el-option>
                        <el-option label="平头" value="square"></el-option>
                        <el-option label="尖头" value="butt"></el-option>
                      </el-select>
                    </td> <!-- 线头类型 -->
                  </tr>
                  <tr>
                    <td><span class="label">拐角类型</span></td>
                    <td>
                      <el-select v-model="style.linJointType">
                        <el-option label="圆角" value="round"></el-option>
                        <el-option label="平角" value="bevel"></el-option>
                        <el-option label="尖角" value="miter"></el-option>
                      </el-select>
                    </td> <!-- 拐角类型 -->
                  </tr>
                  <tr class="show-inlineblock">
                    <td><span class="label">线型</span></td>
                    <td>
                      <el-input v-model="style.linDash"></el-input> (dash) <el-input v-model="style.linDot"></el-input> (space)
                    </td> <!-- 拐角类型 -->
                  </tr>
                  <tr >
                    <td><span class="label">线颜色</span></td>
                    <td><el-color-picker v-model="style.linColor"></el-color-picker></td> <!-- 线颜色 -->
                  </tr>
                  <tr>
                    <td><span class="label">线宽</span></td>
                    <td>
                      <el-input v-model="style.linWidth"></el-input>
                    </td> <!-- 线宽 -->
                  </tr>
                </table>
                <div class="second-body-footer">
                  <el-button size="mini" @click="styleModify()">修改样式</el-button>
                  <el-button size="mini" @click="cancleStyleModify()">撤销上次修改</el-button>
                </div>
              </div>
              <div class="second-footer">
                <el-button size="mini" @click="delStatus()">清除状态</el-button>
                <el-button size="mini" @click="delFeature()">清空要素</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
      
    </div>
  </div>
</template>

<script>
import ol from '../../../static/libs/ol/ol'
import Map from '../map'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Fill, Stroke, Circle } from 'ol/style'
import '../../../static/libs/ol/MilStd'

export default {
  components: {
    Map
  },
  data () {
    return {
      activeName: '图形编辑',
      typeList: [
        { 
          name: 'arrow', 
          title: '箭头',
          children: [
            { name: 'SimpleArrow', title: '简单箭头', url: '../../../static/images/ArrowIcon/custom_tail_arrow.png' },
            { name: 'StrightArrow', title: '直箭头', url: '../../../static/images/ArrowIcon/stright_arrow.png'},
            { name: 'DoubleArrow', title: '双箭头', url: '../../../static/images/ArrowIcon/double_arrow.png' },
            { name: 'SingleLineArrow', title: '单线箭头', url: '../../../static/images/ArrowIcon/singleLine_arrow.png' }
          ],
        }, {
          name: 'compass',
          title: '指北针',
          children: [
            { name: 'ArrowCross', title: '十字箭头指北针', url: '../../../static/images/ArrowIcon/arrowcross.png' },
            { name: 'CircleClosedangle', title: '圆形尖角指北针', url: '../../../static/images/ArrowIcon/CircleClosedangleCompass.png' },
            { name: 'Closedangle', title: '尖角指北针', url: '../../../static/images/ArrowIcon/closedangle.png' },
            { name: 'DoubleClosedangle', title: '双向尖角指北针', url: '../../../static/images/ArrowIcon/DoubleClosedangleCompass.png' },
            { name: 'Fourstar', title: '四角指北针', url: '../../../static/images/ArrowIcon/fourstar.png' },
            { name: 'Rhombus', title: '菱形指北针', url: '../../../static/images/ArrowIcon/rhombus.png' },
            { name: 'SameDirectionClosedangle', title: '同向尖角指北针', url: '../../../static/images/ArrowIcon/SameDirectionClosedangleCompass.png' },
            { name: 'Triangle', title: '三角指北针', url: '../../../static/images/ArrowIcon/triangle.png' },
            { name: 'Vane', title: '风向标指北针', url: '../../../static/images/ArrowIcon/VaneCompass.png' }
          ]
        }, {
          name: 'flag',
          title: '旗帜',
          children: [
            { name: 'TriangleFlag', title: '三角旗', url: '../../../static/images/ArrowIcon/triangle_flag.png' },
            { name: 'RectFlag', title: '矩形旗', url: '../../../static/images/ArrowIcon/rect_flag.png' },
            { name: 'CurveFlag', title: '波浪旗', url: '../../../static/images/ArrowIcon/curve_flag.png' }
          ]
        }, {
          name: 'area',
          title: '集结区',
          children: [
            { name: 'Bezier', title: '任意区', url: '../../../static/images/ArrowIcon/arbitrary_area.png' },
            { name: 'AssemblyArea', title: '集结区', url: '../../../static/images/ArrowIcon/assembly.png' },
            { name: 'BezierLine', title: '光滑曲线', url: '../../../static/images/ArrowIcon/smooth_curve.png' }
          ]
        }
      ],
      style: {
        fillColor: '#ff0000',
        radius: 10,
        linHeadType: 'round',
        linJointType: 'round',
        linDash: 0,
        linDot: 0,
        linColor: '#00ff00',
        linWidth: 2
      },
      vectorSource: null,
      vectorStyle: null,
      vectorLayer: null,
      drawTool: null
    }
  },
  mounted () {
    this.$children[0].map.getView().setCenter([-93.27, 44.98])
    this.$children[0].map.getView().setZoom(3)
    console.log(ol)
    this.initVectorLayer()
    this.initDraw()
  },
  methods: {
    handleMouseover (name) {
      this.$refs[name][0].style.width = '50px'
      this.$refs[name][0].style.height = '50px'
    },
    handleMouseout (name) {
      this.$refs[name][0].style.width = '44px'
      this.$refs[name][0].style.height = '44px'
    },
    /**
     * @description: 初始化绘制层
     * @param {type} 
     * @return {type} 
     */
    initVectorLayer () {
      this.vectorSource = new VectorSource({ wrapX: false })
      this.vectorStyle = new Style({
        fill: new Fill({ color: this.style.fillColor}),
        stroke: new Stroke({
          color: this.style.linColor,
          lineCap: this.style.lineCap,
          lineJoin: this.style.lineJoint,
          lineDash: [ parseInt(this.style.linDash), parseInt(this.style.linDot)],
          width: parseInt(this.style.linWidth)
        }),
        image: new Circle({
          radius: this.style.radius,
          fill: new Fill({ color: this.style.fillColor})
        })
      })
      this.vectorLayer = new VectorLayer({
        title: '绘制层',
        source: this.vectorSource,
        style: this.vectorStyle
      })
      this.$children[0].map.addLayer(this.vectorLayer)
    },
    /**
     * @description: 开始绘制图层
     * @param {type} 
     * @return {type} 
     */
    initDraw () {
      this.drawTool = new MilStd.tool.MilStdDrawTool(this.$children[0].map)
      this.drawTool.on(MilStd.event.MilStdDrawEvent.DRAW_END, e => {
        console.log(e)
        let feature = e.feature
        feature.setStyle(this.vectorStyle)
        this.vectorSource.addFeature(feature)
      }, false, this)
    },
    drawArrow (type) { 
      console.log(type)
      let milParam
      switch (type) {
        case 'SimpleArrow':
          milParam = new MilStd.MilstdParams({
            headHeightFactor: 0.15,
            headWeightFactor: 0.4,
            neckHeightFactor: 0.75,
            neckWidthFactor: 0.1,
            tailWidthFactor: 0.1,
            hasSwallowTail: true,
            swallowTailFactor: 0.5
          })
          this.drawTool.activate(MilStd.EnumMilstdType.SimpleArrow, milParam, "drawSimpleArrow")
          break;
        case 'StrightArrow':
          milParam = new MilStd.MilstdParams({
            headHeightFactor: 0.1,
            headWeightFactor: 1.3,
            neckHeightFactor: 1.0,
            neckWidthFactor: 0.7,
            tailWidthFactor: 0.07,
            hasSwallowTail: false,
            swallowTailFactor: 0
          })
          this.drawTool.activate(MilStd.EnumMilstdType.StraightArrow, milParam, 'drawStraightArrow')
          break;
        case 'DoubleArrow':
          milParam = new MilStd.MilstdParams({
            headHeightFactor: 0.15,
            headWeightFactor: 0.8,
            neckHeightFactor: 0.7,
            neckWidthFactor: 0.4
          })
          this.drawTool.activate(MilStd.EnumMilstdType.DoubleArrow, milParam, 'drawDoubleArrow')
          break;
        case 'SingleLineArrow':
          milParam = new MilStd.MilstdParams({
            headHeightFactor: 0.1,
            headWeightFactor: 1.3
          })
          this.drawTool.activate(MilStd.EnumMilstdType.SingleLineArrow, milParam, 'drawSingleLineArrow')
          break;
        case 'ArrowCross': 
        case 'CircleClosedangle':
        case 'Closedangle':
        case 'DoubleClosedangle':
        case 'Fourstar':
        case 'Rhombus':
        case 'SameDirectionClosedangle':
        case 'Triangle':
        case 'Vane':
          this.drawTool.activate(MilStd.EnumMilstdType.Vane, null, 'drawCompass')
        case 'TriangleFlag':
        case 'RectFlag':
        case 'CurveFlag':
          this.drawTool.activate(MilStd.EnumMilstdType.CurveFlag, null, 'darwFlag')
          break;
        case 'Bezier':
        case 'AssemblyArea':
          this.drawTool.activate(MilStd.EnumMilstdType.ArbitraryArea, null, 'drawBazier')
          break;
        case 'BezierLine':
        default:
      }
    }
  }
}
</script>

<style scoped>
.el-button {
  margin-left: 0;
}
.el-button--mini {
  padding: 7px;
}

.menu {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 425px;
}
.first {
  padding: 5px 10px;
}
.first-body, .second-body {
  border: 1px dashed #409EFF;
  padding: 8px;
  height: 402px;
}
.detail_type {
  display: inline-block;
  padding: 5px;
  border: 1px dotted gray;
  width: 50px;
  height: 50px;
  margin: 0 3px 3px 0;
}
.detail_type img {
  vertical-align: top;
}
.key {
  width: 50px;
  vertical-align: top;
}
.key p {
  margin: 0;
}
table {
  border: 1px dashed gray;
  padding: 3px 0;
  height: 351px;
}
.first-body-footer, .second-body-footer {
  text-align: right;
  margin-top: 5px;
}
.first-footer, .second-footer {
  text-align: right;
  margin-top: 5px;
}
.second-body table .label {
  display: inline-block;
  width: 70px;
}
.show-inlineblock .el-input {
  width: 35%;
}

</style>

<style>
.el-input__inner {
  height: 35px;
}
.el-collapse-item__header{
  padding-left: 10px;
}
.second-body .el-color-picker,
.second-body .el-color-picker__trigger {
  width: 100%;
}
</style>