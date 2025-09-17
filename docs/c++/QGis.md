## QGis

编译时出现**无法解析的外部符号**，是由于引用库的版本不对，比如引用库是release版本，编译也要用release模式编译

矢量层

.shp .geojson .gmt .kml

栅格层

.tif .img .grd. .hgt

### 添加库

```apl
//动态库需要三个文件：头文件、导入库、动态库，使用动态库时先在头文件中找到声明，再在导入库中定位函数主体位置，拿到地址后再在动态库中找到函数，exe文件运行时需要到系统变量中找动态库，所以要放到同一文件夹或设置系统变量
win32{
    INCLUDEPATH += /qgis/include
    LIBS += -L/qgis/lib
    CONFIG(release, debug|release){
        LIBS += qgis_3d.lib
        LIBS += qgis_analysis.lib
        LIBS += qgis_app.lib
        LIBS += qgis_core.lib
        LIBS += qgis_gui.lib
        LIBS += qgis_native.lib
        qgis += qgis_server.lib
    }
}
```

### 加载图层文件

```c++
//初始化QgsMapCanvas
mMapCanvas = new QgsMapCanvas(this);
//初始化QgsRasterLayer
mQgsRasterLayer = new QgsRasterLayer(uri, baseName, providerType, QgsRasterLayer::LayerOptions);
//定义图层列表
QList<QgsMapLayer*> layers = {mQgsRasterLayer};
QgsProject::instance() -> addMapLayer(mQgsRasterLayer);
//设置QgsMapCanvas图层
mMapCanvas -> setExtent(mQgsRasterLayer.extent());
mMapCanvas -> setLayers(layers);
mMapCanvas -> refresh();
```

### QgsMapTool

- QgsMapToolEmitPoint点击地图时发出canvasClicked信号
- QgsRubberBand临时图形
- QgsAnnotationLayer注释图层