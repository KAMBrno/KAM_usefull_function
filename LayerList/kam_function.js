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

  function createLayerListInputs(promisisList) {
    /*
    Create layerslist input from esri Legend:
    Return list of layerListInputs: 
        structure: 
        let layerListInputs = [
          {
            featureLayerName: "title",
            groupTitle: "title",
            groupPromisis: "promisis",
            sublayers: [
              {
                sublayerTitle: "title",
                sublayerParent: "parentTitle",
                sublayerSymbol: "Symbol",
                sublayerPromisis: "Promisis"
              }
            ]
          }
        ]
    */

    let esriLegend__symbol = document.querySelectorAll(".esri-legend__symbol");
    let sublayers = []
    let nameOfLayer = "";
    let layersList = []

    // Loop for all symbol in legend
    for (let i = 0; i < esriLegend__symbol.length; i++) {
      // Title of group layers
      let groupTitle = esriLegend__symbol[i].parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML;
      // Sublayer title
      let sublayerTitle = esriLegend__symbol[i].parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML;

      // Select sublayers promisis
      let sublayerlayers = selectLayer(promisisList.subLayers, sublayerTitle, groupTitle);

      // Sublayer object
      let sublayerOBJ = {
        sublayerTitle: sublayerTitle,
        sublayerParent: groupTitle,
        sublayerSymbol: esriLegend__symbol[i],
        sublayersPromisis: sublayerlayers
      }

      // Check if group of layers change except for the first iteration
      if (i > 0) {
        let groupTitleMinus = esriLegend__symbol[i - 1].parentNode.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerHTML;
        if (groupTitleMinus !== groupTitle) {
          sublayers = []
        }
      }

      // Push sublayer object to sublayer list
      sublayers.push(sublayerOBJ);

      if (groupTitle !== nameOfLayer) {
        let esrilegend__layer = document.querySelectorAll(".esri-legend__layer-caption");
        // Title of legend (name of feature layer)
        let titleOfTable = esrilegend__layer[0].parentElement.parentElement.parentElement.firstChild.innerHTML;

        // Select grou of layers promisis
        let layers = selectLayer(promisisList.subLayers, groupTitle, titleOfTable);

        // Group of layers object
        let layersOBJ = {
          featureLayerName: titleOfTable,
          groupTitle: groupTitle,
          groupPromisis: layers,
          sublayers: sublayers
        }

        // Push grou of layers object to list
        layersList.push(layersOBJ)

        // change nameOfLayer
        nameOfLayer = groupTitle
      }
    }

    return layersList;
  }

  export function removeDiacriticsAndSpace(string){
    let replaceSpace = string.replace(/\s/g, '');
    let replaceDiacritics = replaceSpace.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    return replaceDiacritics;
  }