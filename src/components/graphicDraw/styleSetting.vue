<template>
  <div class="style-list">  
    <el-row>
      <label>点大小(radius):</label>
      <el-input v-model="style.size"></el-input>
    </el-row>
    <el-row>
      <label>填充颜色(color):</label>
      <el-input v-model="style.fillColor"></el-input>
    </el-row>
    <el-row>
      <label>边框样式(color):</label>
      <el-input v-model="style.strokeColor"></el-input>
    </el-row>
    <el-row>
      <label>边框样式(width):</label>
      <el-input v-model="style.strokeWidth"></el-input>
    </el-row>
    <el-row>
      <label>位置(align):</label>
      <el-select v-model="style.textAlign">
        <el-option value="center" label="Center"></el-option>
        <el-option value="end" label="End"></el-option>
        <el-option value="left" label="Left"></el-option>
        <el-option value="right" label="Right"></el-option>
        <el-option value="start" label="Start"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <label>基线(baseline):</label>
      <el-select v-model="style.baseline">
        <el-option value="alphabetic" label="Alphabetic"></el-option>
        <el-option value="bottom" label="Bottom"></el-option>
        <el-option value="hanging" label="Hanging"></el-option>
        <el-option value="ideographic" label="Ideographic"></el-option>
        <el-option value="middle" label="Middle"></el-option>
        <el-option value="top" label="Top"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <label>旋转角度(rotation)</label>
      <el-select v-model="style.rotation">
        <el-option value="0" label="0°"></el-option>
        <el-option value="45" label="45°"></el-option>
        <el-option value="90" label="90°"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <label>字体(font)</label>
      <el-select v-model="style.textFont">
        <el-option value="Arial" label="Arial"></el-option>
        <el-option value="Courier New" label="Courier New"></el-option>
        <el-option value="Quattrocento Sans" label="Quattrocento Sans"></el-option>
        <el-option value="Verdana" label="Verdana"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <label>字体粗细(weight)</label>
      <el-select v-model="style.textWeight">
        <el-option value="bold" label="Bold"></el-option>
        <el-option value="normal" label="Normal"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <label>字体大小(size):</label>
      <el-input v-model="style.textSize"></el-input>
    </el-row>
    <el-row>
      <label>X偏移量(offset X):</label>
      <el-input v-model="style.textOffsetX"></el-input>
    </el-row>
    <el-row>
      <label>Y偏移量(offset Y):</label>
      <el-input v-model="style.textOffsetY"></el-input>
    </el-row>
    <el-row>
      <label>字体颜色(color):</label>
      <el-input v-model="style.textColor"></el-input>
    </el-row>
    <el-row>
      <label>字体外框颜色(O .Color):</label>
      <el-input v-model="style.textOutlineColor"></el-input>
    </el-row>
    <el-row>
      <label>字体外框宽度(O .Width):</label>
      <el-input v-model="style.textOutlineWidth"></el-input>
    </el-row>
    <el-row style="textAlign: center;">
      <el-button size="middle" type="primary" @click="update">更新</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      style: {
        size: 10,
        fillColor: '#aa3300',
        strokeColor: 'red',
        strokeWidth: 2,
        textAlign: 'center',
        baseline: 'alphabetic',
        rotation: 0,
        textFont: 'Arial',
        textWeight: 'bold',
        textSize: '12px',
        textOffsetX: 0,
        textOffsetY: 0,
        textColor: 'blue',
        textOutlineColor: '#ffffff',
        textOutlineWidth: 3
      }
    }
  },
  props: {
    styleType: String,
    currentStyle: Object
  },
  methods: {
    update () {
      this.$emit('update', this.styleType, this.currentStyle);
    }
  },
  watch: {
    currentStyle () {
      if (this.currentStyle) {
        this.style = this.currentStyle
      }
    }
  }
}
</script>


<style scoped>
.style-list {
  font-size: 14px;
}
.el-row {
  margin-bottom: 5px;
}
.el-input {
  width: auto;
}
label {
  display: inline-block;
  width: 141px;
} 
</style>