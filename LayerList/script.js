import { layersPromisisList, LayerList } from "./kam_function.js"
var view;
require(["esri/views/MapView", "esri/widgets/Legend", "esri/WebMap",
  "esri/config"], (
    MapView,
    Legend,
    WebMap,
    esriConfig
  ) => {
  var portalURL = "https://gis.brno.cz/esri";
  esriConfig.portalUrl = portalURL;
  const webmap = new WebMap({
    portalItem: {
      // 2e851894889d47039c090eb80ac05c81 autocasts as new PortalItem() f83d6a47687b4ce5a51b638bbcb5db1c  8789db4c12494f72b66dc907b09c3499
      id: "8789db4c12494f72b66dc907b09c3499"
    }
  });

  view = new MapView({
    container: "viewDiv",
    map: webmap
  });


  view.ui.add("layetList__container", "top-left");
  LayerList(view, "#layetList__container")

});










function otherFunction(inputFunction) {
  inputFunction()
}