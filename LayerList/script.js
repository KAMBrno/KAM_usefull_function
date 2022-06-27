import {layersPromisisList} from "./kam_function.js"
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
      // 2e851894889d47039c090eb80ac05c81 autocasts as new PortalItem() f83d6a47687b4ce5a51b638bbcb5db1c
      id: "2e851894889d47039c090eb80ac05c81"
    }
  });

  view = new MapView({
    container: "viewDiv",
    map: webmap
  });









view.ui.add("layetList__container", "top-left");
LayerList(view, "#layetList__container")

});

function checkActiveLayerList(htmlSlector){
    let listOfElement =  document.querySelectorAll(htmlSlector);

    for(let i = 0; i < listOfElement.length; i++){
        let checkActive = listOfElement[i].classList.contains("layerList-active");
        if(checkActive){
            return true
        }
    }
    return false
}

function togleAllSublayerVisibility(listOflayerObj, htmlSlector, switchOff){

let htmlSlectorSlice = htmlSlector.slice(1);

for(let i = 0; i < listOflayerObj.length; i++){
  
  if(listOflayerObj[i].buttonsClass === htmlSlectorSlice){
    if(switchOff === true){
      listOflayerObj[i].layerPromisis.visible = false;
    }else{
      listOflayerObj[i].layerPromisis.visible = true;
    }
    
  }
}
}

function togleLayerVisibility(layerrPromisis, htmlSlector, divElement, listOflayerObj) {

if(divElement){
  let checkLayersActive = checkActiveLayerList(htmlSlector);
  if(checkLayersActive === false){

    togleAllSublayerVisibility(listOflayerObj, htmlSlector, true)
  }
  if (layerrPromisis.visible === true) {

   
    layerrPromisis.visible = false
    divElement.classList.remove("layerList-active")
    let checkLayersActivee = checkActiveLayerList(htmlSlector);

    if(checkLayersActivee === false){

      togleAllSublayerVisibility(listOflayerObj, htmlSlector, false)
    }
    

  } else {
    

    
    divElement.classList.add("layerList-active")
    layerrPromisis.visible = true

  }
}
}

function sublayerHandler(listOflayerObjIncremnt, listOflayerObj){

  let htmlSlector = "." + listOflayerObjIncremnt.buttonsClass;
  togleLayerVisibility(listOflayerObjIncremnt.layerPromisis, htmlSlector, listOflayerObjIncremnt.button, listOflayerObj) 
}

function layerHandler(listOflayerObj){
  let inputSelector = listOflayerObj.button.firstChild;

  
  let htmlSlector = ".layerlist__sublayer-"+listOflayerObj.buttonsClass.slice(-4)

  if(inputSelector.checked === true){
    inputSelector.checked = false;
    listOflayerObj.layerPromisis.visible = false
    turnOffOnSublayersPane(htmlSlector, "none")
  }else{
    inputSelector.checked = true;
    listOflayerObj.layerPromisis.visible = true
    turnOffOnSublayersPane(htmlSlector, "flex")
  }


}

function addingEventListener(listOflayerObj, type){

  for(let i = 0; i < listOflayerObj.length;i++){

    
    listOflayerObj[i].button.addEventListener("click", function(){
      if(type ==="sublayer"){
        sublayerHandler(listOflayerObj[i], listOflayerObj);
      }else{
        layerHandler(listOflayerObj[i]);
      }

    })
    
  }


}
function turnOffOnSublayersPane(htmlSlector, display){
let selector = document.querySelectorAll(htmlSlector);
for(let i = 0; i < selector.length; i++){
  selector[i].style.display = display;
}
}


function createLayerListRow(indexOfSymbol, title, layerPromisis, contanersekector, layerTitle) {
  let layetList__container = document.querySelector(contanersekector);
  //symbol.style.display = "none";

  let p = document.createElement("p");
  let div = document.createElement("div");
 
  p.innerHTML = title;
  div.classList.add("flex-row")
  p.classList.add("layerList-title")
  let group;
  let buttonsClass;
  if (indexOfSymbol) {
    indexOfSymbol.classList.add("kam_layerList-icons")
    div.appendChild(indexOfSymbol);
    buttonsClass = "layerlist__sublayer-" + layerTitle;
    div.classList.add("layerlist__sublayer");
    div.classList.add(buttonsClass)
    group = layerTitle;


  }else{
    let input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    div.appendChild(input);
    buttonsClass = "layerlist__layer-" + layerTitle;
    div.classList.add("layerlist__layer");
    div.classList.add(buttonsClass);
    /*
    div.addEventListener("click", function () {
       
        togleLayerVisibility(layerPromisis)
      })
      */
  }

  div.appendChild(p);

  layetList__container.appendChild(div);
  return {
    button: div,
    parentGroup: group,
    layerPromisis: layerPromisis,
    buttonsClass: buttonsClass

  };
}

function selectLayer(promisList, title, parent) {
  /* Return selected layer or sublayer object
  - promisList it is return value from "layersPromisisList" function
           object: - Layers title (tile)
                      - Layers parent title (parent)
                      - Layers promisis (promis)
                      - Layers type (type):
                                          - layers
                                          - sublayers
                      - Esri layers type(esriType) 
                                  - only in layers object not in sublayers object
  */

  for (let i = 0; i < promisList.length; i++) {

    if (promisList[i].title === title && promisList[i].parent === parent) {
      return promisList[i]
     
    } else if (promisList[i].title === title && promisList[i].esriType === parent) {

    }
  }

}


function LayerList(view, layerListContainer) {
  let lachtan = "LACHTAN";
  view.when(() => {
    require(["esri/widgets/Legend"], (

      Legend,

    ) => {

      const legend = new Legend({
        view: view,

      });
      
      legend.renderNow()
      


      loadingFunction(legend)
      view.map.layers.items[0].visible = true;

      // Add widget to the bottom right corner of the view
      view.ui.add(legend, "bottom-right");



      function createLayerList(promisisList) {

  
        let esriLegend__symbol = document.querySelectorAll(".esri-legend__symbol");
        let esrilegend__layer = document.querySelectorAll(".esri-legend__layer-caption");
       

        var layerTitle = "";
        var subLayersCouner = 0;
        var layersCouner = 0;
        let layerGroupsList = [];
        let subLayersList = [];
     
        for (let i = 0; i < esrilegend__layer.length; i++) {
          let checkIfIsLayer = esrilegend__layer[i].parentNode.classList.contains("esri-legend__layer-table");
          if (checkIfIsLayer) {
            let titleOfTable = esrilegend__layer[i].parentElement.parentElement.parentElement.firstChild.innerHTML;

            layerTitle = esrilegend__layer[i].innerHTML
            let layers = selectLayer(promisisList.subLayers, esrilegend__layer[i].innerHTML, titleOfTable);

            let layerlistRow = createLayerListRow(undefined, esrilegend__layer[i].innerHTML, layers.promis, layerListContainer, layerTitle)
            layerGroupsList.push(layerlistRow)
            layersCouner += 1

          } else {
            let layers = selectLayer(promisisList.subLayers, esrilegend__layer[i].innerHTML, layerTitle);
            let layerlistRow = createLayerListRow(esriLegend__symbol[subLayersCouner], esrilegend__layer[i].innerHTML, layers.promis, layerListContainer, layerTitle);
            subLayersList.push(layerlistRow)
            subLayersCouner += 1
          }

        }
        return {
          layers: layerGroupsList,
          sublayers: subLayersList
        }
      }
      function loadingFunction(legend) {
        let loading = document.querySelector(".loading");

        if (legend === true) {
          return
        }
        let startLegend = true;
        const myInterval = setInterval(function () {


          if (legend.isResolved() === true && startLegend === true) {

            myStopFunction()
            return
          }
        }, 1000);

        function myStopFunction() {
          startLegend = false;
          let promisisList = layersPromisisList(view);
          let layerList = createLayerList(promisisList);
          addingEventListener(layerList.sublayers, "sublayer");
          addingEventListener(layerList.layers, "layers");

          //legend.destroy()
        }

      }
    });

  });

}



function otherFunction(inputFunction){
  inputFunction()
}