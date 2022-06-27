export default class Kam_function{
    
}

export function layersPromisisList(view) {
    /* Return object:
                    - list of layers
                    - list of sublayers
     List of objects: - Layers title (tile)
                        - Layers parent title (parent)
                        - Layers promisis (promis)
                        - Layers type (type):
                                            - layers
                                            - sublayers
                        - Esri layers type(esriType) 
                                    - only in layers object not in sublayers object
    */
    let layers = [];
    let subLayers = [];
    function selectedLayers(layerse) {
      if (layerse.layers) {
        for (let i = 0; i < layerse.layers._items.length; i++) {
          let layersObject = {}
          layersObject.title = layerse.layers._items[i].title
          layersObject.parent = layerse.layers._items[i].parent.title
          layersObject.promis = layerse.layers._items[i]
          layersObject.type = "layers";
          layersObject.esriType = layerse.layers._items[i].type;
          layers.push(layersObject);
          selectedLayers(layerse.layers._items[i]);
        }
      } else if (layerse.sublayers) {
        for (let t = 0; t < layerse.sublayers._items.length; t++) {
          let subLayersObject = {}
          layerse.sublayers._items[t].visible = true;
          let titleOfSublayer = layerse.sublayers._items[t].title
          subLayersObject.title = titleOfSublayer;
          subLayersObject.parent = layerse.sublayers._items[t].parent.title
          subLayersObject.promis = layerse.sublayers._items[t]
          subLayersObject.type = "sublayers";
          subLayers.push(subLayersObject);
          selectedLayers(layerse.sublayers._items[t]);
        }
      }
    }
    selectedLayers(view.map)
    return {
      layers: layers,
      subLayers: subLayers
    }
  }