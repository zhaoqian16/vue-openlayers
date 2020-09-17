<template>
  <div>
    <Map></Map>
  </div>
</template>

<script>
import Map from '../map'
import { ZoomSlider, ZoomToExtent} from 'ol/control'
import Projection from 'ol/proj/Projection'
export default {
  components: {
    Map
  },
  mounted () {
    this.initZoomSlider()
    this.initZoomToExtent()
  },
  methods: {
    initZoomSlider () {
      const map = this.$children[0].map
      let zoomSlider = new ZoomSlider()
      map.addControl(zoomSlider)
    },
    initZoomToExtent () {
      const map = this.$children[0].map
      let zoomToExtent = new ZoomToExtent({
        extent: [
          13100000, 4290000,
          13200000, 5210000
        ]
      })
      map.addControl(zoomToExtent)
    }
  }
}
</script>
<style>
/* 滑块放中间 */
/* #map .ol-zoom .ol-zoom-out {
  margin-top: 204px;
}
#map .ol-zoomslider {
  background-color: transparent;
  top: 2.3em;
}

#map .ol-touch .ol-zoom .ol-zoom-out {
  margin-top: 212px;
}
#map .ol-touch .ol-zoomslider {
  top: 2.75em;
}

#map .ol-zoom-in.ol-has-tooltip:hover [role=tooltip],
#map .ol-zoom-in.ol-has-tooltip:focus [role=tooltip] {
  top: 3px;
}

#map .ol-zoom-out.ol-has-tooltip:hover [role=tooltip],
#map .ol-zoom-out.ol-has-tooltip:focus [role=tooltip] {
  top: 232px;
} */

/* 滑块横放 */
#map .ol-zoomslider {
  top: 8px;
  left: auto;
  right: 8px;
  background-color: rgba(255,69,0,0.2);
  width: 200px;
  height: 15px;
  padding: 0;
  box-shadow: 0 0 5px rgb(255,69,0);
  border-radius: 20px;
}

#map .ol-zoomslider:hover {
  background-color: rgba(255,69,0,0.3);
}

#map .ol-zoomslider-thumb {
  height: 15px;
  width: 15px;
  margin: 0;
  filter: none;
  background-color: rgba(255,69,0,0.6);
  border-radius: 20px;
}
#map a.ol-zoomslider-handle:hover {
  background-color: rgba(255,69,0,0.7);
}
</style>