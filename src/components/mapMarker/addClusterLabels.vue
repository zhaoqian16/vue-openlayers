<template>
  <div>
    <Map></Map>
  </div>
</template>

<script>
import Map from '../map'
export default {
  components: {
    Map
  },
  methods: {
    initClusterData () {
      let count = 20000
      this.features = new Array(count)
      for (let i = 0; i < count)
    }
    initCluster () {
      
    }
  }
}
</script>