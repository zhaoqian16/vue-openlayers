# vue-openlayers

> an openlayers project with vue

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## ogc resources

- 加载WMTS数据方法: source的WMTS + layer的Tile，以瓦片图层方式加载
- 加载WMS地图的方法
  + layer的Image + source的ImageWMS，以图片图层方式加载
  + layer的Tile + source的tileWMS ，以瓦片图层方式加载
  + layer的Tile + source的TileWMS，使用512×256的瓦片网格，通过tileGrid参数自定义瓦片网格对象
- 加载WFS地图的方法：layer的Vector + source的Vector，source设置loader对应的获取数据的函数
- 加载WCS地图的方法
  + layer的Image + source的ImageWCS， 以图片图层方式加载
  + layer的Image + source的ImageStatic，以图片图层方式加载
