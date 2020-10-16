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
import OverLayerMaps from '@/components/multiData/overLayerMaps'
import CanvasTiles from '@/components/multiData/canvasTiles'

import DrawFeatures from '@/components/graphicDraw/drawFeatures'
import FeaturesStyle from '@/components/graphicDraw/featuresStyle'
import ModifyFeatures from '@/components/graphicDraw/modifyFeatures'
import DrawFreehand from '@/components/graphicDraw/drawFreehand'
import SaveFeatures from '@/components/graphicDraw/saveFeatures'
import PracticeDelete from '@/components/graphicDraw/practiceDelete'
import PracticeEdit from '@/components/graphicDraw/practiceEdit'
import PracticeUpdate from '@/components/graphicDraw/practiceUpdate'

import LoadWMTSMap from '@/components/OGCResources/loadWMTSMap'
import LoadWMSMap from '@/components/OGCResources/loadWMSMap'
import LoadWFSFeature from '@/components/OGCResources/loadWFSFeature'
import LoadWCSMap from '@/components/OGCResources/loadWCSMap'

import AddMarker from '@/components/mapMarker/addMarker'
import AddPopup from '@/components/mapMarker/addPopup'
import AddClusterLabels from '@/components/mapMarker/addClusterLabels'

import PrjTransformation from '@/components/others/prjTransformation'
import MultiViewLinkage from '@/components/others/multiViewLinkage'
import GeoLocation from '@/components/others/geoLocation'
import SimulateGeolocation from '@/components/others/simulateGeolocation'
import HeatMap from '@/components/others/heatMap'
import HotSpots from '@/components/others/hotSpots'
import CreateCharts from '@/components/others/createCharts'
import MilitaryPlotting from '@/components/others/militaryPlotting'

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
    { path: '/loadTiandituMap', name: 'loadTiandituMap', component: LoadTiandituMap},
    { path: '/overLayerMaps', name: 'overLayerMaps', component: OverLayerMaps},
    { path: '/canvasTiles', name: 'canvasTiles', component: CanvasTiles},
    { path: '/drawFeatures', name: 'drawFeatures', component: DrawFeatures},
    { path: '/featuresStyle', name: 'featuresStyle', component: FeaturesStyle},
    { path: '/modifyFeatures', name: 'modifyFeatures', component: ModifyFeatures},
    { path: '/drawFreehand', name: 'drawFreehand', component: DrawFreehand},
    { path: '/saveFeatures', name: 'saveFeatures', component: SaveFeatures},
    { path: '/practiceDelete', name: 'practiceDelete', component: PracticeDelete},
    { path: '/practiceEdit', name: 'practiceEdit', component: PracticeEdit},
    { path: '/practiceUpdate', name: 'practiceUpdate', component: PracticeUpdate},
    { path: '/loadWMTSMap', name: 'loadWMTSMap', component: LoadWMTSMap},
    { path: '/loadWMSMap', name: 'loadWMSMap', component: LoadWMSMap},
    { path: '/loadWFSFeature', name: 'loadWFSFeature', component: LoadWFSFeature},
    { path: '/loadWCSMap', name: 'loadWCSMap', component: LoadWCSMap},
    { path: '/addMarker', name: 'addMarker', component: AddMarker},
    { path: '/addPopup', name: 'addPopup', component: AddPopup},
    { path: '/addClusterLabels', name: 'addClusterLabels', component: AddClusterLabels},
    { path: '/prjTransformation', name: 'prjTransformation', component: PrjTransformation},
    { path: '/multiViewLinkage', name: 'multiViewLinkage', component: MultiViewLinkage},
    { path: '/geoLocation', name: 'geoLocation', component: GeoLocation},
    { path: '/simulateGeolocation', name: 'simulateGeolocation', component: SimulateGeolocation},
    { path: '/heatMap', name: 'heatMap', component: HeatMap},
    { path: '/hotSpots', name: 'hotSpots', component: HotSpots},
    { path: '/createCharts', name: 'createCharts', component: CreateCharts},
    { path: '/militaryPlotting', name: 'militaryPlotting', component: MilitaryPlotting}
  ]
})
