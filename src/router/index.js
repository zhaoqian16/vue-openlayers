import Vue from 'vue'
import Router from 'vue-router'
import Map from '@/components/map'

import ZoomSlider from '@/components/basicControl/zoomSlider'
import BasicOperation from '@/components/basicControl/basicOperation'
import LayerControl from '@/components/basicControl/layerControl'
import MousePosition from '@/components/basicControl/mousePosition'
import LayerExploration from '@/components/basicControl/layerExploration'
import Animation from '@/components/basicControl/animation'
import Meature from '@/components/basicControl/meature'

import LoadBasicMap from '@/components/multiData/loadBasicMap'
import LoadOpenData from '@/components/multiData/loadOpenData'
import LoadPublicMap from '@/components/multiData/loadPublicMap'
import LoadTiandituMap from '@/components/multiData/loadTiandituMap'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'map',
      component: Map
    },
    { path: '/zoomSlider', name: 'zoomSlider', component: ZoomSlider },
    { path: '/basicOperation', name: 'basicOperation', component: BasicOperation },
    { path: '/layerControl', name: 'layerControl', component: LayerControl },
    { path: '/mousePosition', name: 'mousePosition', component: MousePosition },
    { path: '/layerExploration', name:'layerExploration', component: LayerExploration },
    { path: '/animation', name:'animation', component: Animation },
    { path: '/meature', name: 'meature', component: Meature },
    { path: '/loadBasicMap', name: 'loadBasicMap', component: LoadBasicMap},
    { path: '/loadOpenData', name: 'loadOpenData', component: LoadOpenData},
    { path: '/loadPublicMap', name: 'loadPublicMap', component: LoadPublicMap},
    { path: '/loadTiandituMap', name: 'loadTiandituMap', component: LoadTiandituMap}
  ]
})
