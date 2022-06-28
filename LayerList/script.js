import { layersPromisisList } from "./kam_function.js"
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



function togleAllSublayerVisibility(listOflayerObj, switchOff) {


  for (let i = 0; i < listOflayerObj.length; i++) {
    
 
      if (switchOff === true) {
        listOflayerObj[i].sublayersPromisis.promis.visible = false;
      } else {
        listOflayerObj[i].sublayersPromisis.promis.visible = true;
      }

    
  }
}

function togleLayerVisibility(layerrPromisis, htmlSlector, divElement, listOflayerObj) {

  if (divElement) {
    let checkLayersActive = checkActiveLayerList(htmlSlector);
    if (checkLayersActive === false) {

      togleAllSublayerVisibility(listOflayerObj, htmlSlector, true)
    }
    if (layerrPromisis.visible === true) {


      layerrPromisis.visible = false
      divElement.classList.remove("layerList-active")
      let checkLayersActivee = checkActiveLayerList(htmlSlector);

      if (checkLayersActivee === false) {

        togleAllSublayerVisibility(listOflayerObj, htmlSlector, false)
      }


    } else {



      divElement.classList.add("layerList-active")
      layerrPromisis.visible = true

    }
  }
}



function sublayerHandler(listOflayerObjIncremnt, listOflayerObj) {

  let htmlSlector = "." + listOflayerObjIncremnt.buttonsClass;
  togleLayerVisibility(listOflayerObjIncremnt.layerPromisis, htmlSlector, listOflayerObjIncremnt.button, listOflayerObj)
}

function layerHandler(listOflayerObj) {
  let inputSelector = listOflayerObj.button.firstChild;


  let htmlSlector = ".layerlist__sublayer-" + listOflayerObj.buttonsClass.slice(-4)

  if (inputSelector.checked === true) {
    inputSelector.checked = false;
    listOflayerObj.layerPromisis.visible = false
    turnOffOnSublayersPane(htmlSlector, "none")
  } else {
    inputSelector.checked = true;
    listOflayerObj.layerPromisis.visible = true
    turnOffOnSublayersPane(htmlSlector, "flex")
  }


}

function addingEventListener(listOflayerObj, type) {

  for (let i = 0; i < listOflayerObj.length; i++) {


    listOflayerObj[i].button.addEventListener("click", function () {
      if (type === "sublayer") {
        sublayerHandler(listOflayerObj[i], listOflayerObj);
      } else {
        layerHandler(listOflayerObj[i]);
      }

    })

  }


}
function turnOffOnSublayersPane(htmlSlector, display) {
  let selector = document.querySelectorAll(htmlSlector);
  for (let i = 0; i < selector.length; i++) {
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


  } else {
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


      function togleAllSublayerVisibility(listOflayerObj, switchOff) {


        for (let i = 0; i < listOflayerObj.length; i++) {
          
       
            if (switchOff === true) {
              listOflayerObj[i].sublayersPromisis.promis.visible = false;
            } else {
              listOflayerObj[i].sublayersPromisis.promis.visible = true;
            }
      
          
        }
      }

      function checkActiveLayerList(htmlSlector) {
        let listOfElement = document.querySelectorAll(htmlSlector);

        for (let i = 0; i < listOfElement.length; i++) {
          let checkActive = listOfElement[i].classList.contains("layerList-active");
          if (checkActive) {
            return true
          }
        }
        return false
      }

      function sublayerHandler(caunter, sublayersObj, listOflayerObj) {

        let htmlSlector = ".kam-layerlist__sublayer-" + sublayersObj.sublayerParent;
        let sublayersRow = document.querySelectorAll(htmlSlector);

        sublayersRow[caunter].addEventListener("click", function () {
          let chcekActive = checkActiveLayerList(htmlSlector);

          if (chcekActive === false) {
            console.log("Active false")
            togleAllSublayerVisibility(listOflayerObj, true)
          }
          
          if (sublayersObj.sublayersPromisis.promis.visible === true) {


            sublayersObj.sublayersPromisis.promis.visible = false
            sublayersRow[caunter].classList.remove("layerList-active")
            let checkLayersActivee = checkActiveLayerList(htmlSlector);

            if (checkLayersActivee === false) {

              togleAllSublayerVisibility(listOflayerObj, false)
            }


          } else {



            sublayersRow[caunter].classList.add("layerList-active")
            sublayersObj.sublayersPromisis.promis.visible = true

          }
          
        })


      }

      function groupLayersHandler(groupContainers, promisis) {
        let checkBox = groupContainers.layersGroupContainer.firstChild.firstChild;
        let rangeInput = groupContainers.opacityContainer.firstChild;
        groupContainers.layersGroupContainer.addEventListener("click", function () {

          if (promisis.groupPromisis.promis.visible === true) {
            promisis.groupPromisis.promis.visible = false;

            checkBox.checked = false;
            groupContainers.sublayersContainer.style.display = "none";
            groupContainers.opacityContainer.style.display = "none";
          } else {
            checkBox.checked = true;
            promisis.groupPromisis.promis.visible = true;
            groupContainers.sublayersContainer.style.display = "block";
            groupContainers.opacityContainer.style.display = "block";
          }
          console.log(groupContainers);
          console.log(promisis);
          console.log(rangeInput);
        });

        rangeInput.addEventListener("input", function () {
          console.log(promisis);
          promisis.groupPromisis.promis.opacity = rangeInput.value;
          for (let i = 0; i < promisis.sublayers.length; i++) {

            promisis.sublayers[i].sublayersPromisis.promis.opacity = rangeInput.value;
          }
        })

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


      function creatLayerGroupContainers(layerListContainer) {
        let htmlElement = document.querySelector(layerListContainer)
        let mainContainer = document.createElement("div");
        let layersGroupContainer = document.createElement("div");
        let sublayersContainer = document.createElement("div");
        let opacityContainer = document.createElement("div");
        layersGroupContainer.classList.add("kam-layerList__layersGroup");
        sublayersContainer.classList.add("kam-layerList__sublayers");
        opacityContainer.classList.add("kam-layerList__opacity");
        mainContainer.appendChild(layersGroupContainer);
        mainContainer.appendChild(sublayersContainer);
        mainContainer.appendChild(opacityContainer);
        htmlElement.appendChild(mainContainer);
        return {
          mainContainer: mainContainer,
          layersGroupContainer: layersGroupContainer,
          sublayersContainer: sublayersContainer,
          opacityContainer: opacityContainer
        }
      }

      function createLayerList(layerInputs, layerListContainer) {
        let layerGroupsList = [];
        for (let i = 0; i < layerInputs.length; i++) {
          let groupContainers = creatLayerGroupContainers(layerListContainer);

          createGroupLayersRow(groupContainers, layerInputs[i]);
          for (let k = 0; k < layerInputs[i].sublayers.length; k++) {
            console.log(layerInputs[i].sublayers[k])
            createSubLayers(groupContainers, layerInputs[i].sublayers[k])
            sublayerHandler(k, layerInputs[i].sublayers[k], layerInputs[i].sublayers)
          }
          createOpacityRange(groupContainers)
          groupLayersHandler(groupContainers, layerInputs[i])
        }


      }

      function removeDiacriticsAndSpace(string) {
        let replaceSpace = string.replace(/\s/g, '');
        let replaceDiacritics = replaceSpace.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        return replaceDiacritics;
      }

      function createGroupLayersRow(containers, layerInputs) {
        console.log(containers);
        console.log(layerInputs)
        let maindiv = containers.layersGroupContainer;
        let p = document.createElement("p");
        let div = document.createElement("div");

        p.innerHTML = layerInputs.groupTitle;
        div.classList.add("kam-layerlist__flex-row")
        p.classList.add("kam-layerlist__layer-title")

        let input = document.createElement("input");
        input.type = "checkbox";
        input.checked = true;
        input.classList.add("kam-layerlist__layer-checkbox")
        div.appendChild(input);
        div.appendChild(p);
        let buttonsClass = "kam-layerlist__layer-" + removeDiacriticsAndSpace(layerInputs.groupTitle);

        div.classList.add(buttonsClass);
        maindiv.appendChild(div)

      }


      function createSubLayers(containers, layerInputs) {
        let maindiv = containers.sublayersContainer;
        //symbol.style.display = "none";

        let p = document.createElement("p");
        let div = document.createElement("div");
        let sublayerSymbol = layerInputs.sublayerSymbol
        p.innerHTML = layerInputs.sublayerTitle;
        div.classList.add("kam-layerlist__flex-row")
        p.classList.add("kam-layerlist__sublayer-title")
        sublayerSymbol.classList.add("kam-layerlist__sublayer-icons")
        div.appendChild(sublayerSymbol);
        div.appendChild(p);
        let buttonsClass = "kam-layerlist__sublayer-" + removeDiacriticsAndSpace(layerInputs.sublayerParent);
        div.classList.add("kam-layerlist__sublayer");
        div.classList.add(buttonsClass)
        maindiv.appendChild(div)
      }

      function createOpacityRange(containers) {
        let inputRange = document.createElement("input");
        inputRange.type = "range";
        inputRange.min = 0;
        inputRange.max = 1;
        inputRange.step = 0.1;
        containers.opacityContainer.appendChild(inputRange);

      }

      /*
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
      
      */


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
          let layerInputs = createLayerListInputs(promisisList);
          createLayerList(layerInputs, "#layetList__container")
          //let layerList = createLayerList(promisisList);


          //addingEventListener(layerList.sublayers, "sublayer");
          //addingEventListener(layerList.layers, "layers");

          //legend.destroy()
        }

      }
    });

  });

}



function otherFunction(inputFunction) {
  inputFunction()
}