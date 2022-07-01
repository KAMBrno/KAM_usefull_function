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


  export function removeDiacriticsAndSpace(string){
    let replaceSpace = string.replace(/\s/g, '');
    let replaceDiacritics = replaceSpace.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    return replaceDiacritics;
  }


  export function LayerList(view, layerListContainer) {
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
        
  
        // Add widget to the bottom right corner of the view
        view.ui.add(legend, "bottom-right");
  
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
  
        function sublayerHandler(caunter, listOflayerObj) {
  
          let htmlSlector = ".kam-layerlist__sublayer-" + removeDiacriticsAndSpace(listOflayerObj[caunter].sublayerParent);
          console.log(htmlSlector)
          let sublayersRow = document.querySelectorAll(htmlSlector);

  sublayersRow[caunter].addEventListener("click", function () {
            let chcekActive = checkActiveLayerList(htmlSlector);
  
            if (chcekActive === false) {
              console.log("Active false")
              togleAllSublayerVisibility(listOflayerObj, true)
            }
            
            if (listOflayerObj[caunter].sublayersPromisis.promis.visible === true) {
  
  
              listOflayerObj[caunter].sublayersPromisis.promis.visible = false
              sublayersRow[caunter].classList.remove("layerList-active")
              let checkLayersActivee = checkActiveLayerList(htmlSlector);
  
              if (checkLayersActivee === false) {
  
                togleAllSublayerVisibility(listOflayerObj, false)
              }
  
  
            } else {
  
  
  
              sublayersRow[caunter].classList.add("layerList-active")
              listOflayerObj[caunter].sublayersPromisis.promis.visible = true
  
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
  
            createGroupLayersRow(groupContainers, layerInputs[i], i);
            for (let k = 0; k < layerInputs[i].sublayers.length; k++) {
              console.log(layerInputs[i].sublayers[k])
              createSubLayers(groupContainers, layerInputs[i].sublayers[k])
              sublayerHandler(k, layerInputs[i].sublayers)
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
  
        function createGroupLayersRow(containers, layerInputs, caunter) {

          let maindiv = containers.layersGroupContainer;
          let p = document.createElement("b");
          let div = document.createElement("div");
  
          p.innerHTML = layerInputs.groupTitle;
          div.classList.add("kam-layerlist__flex-row")
          p.classList.add("kam-layerlist__layer-title")
          if(caunter === 0){
            maindiv.classList.add("kam-layerList__layersGroup-first")
          }
  
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
          let title = document.createElement("p");
          inputRange.type = "range";
          inputRange.min = 0;
          inputRange.max = 1;
          inputRange.step = 0.1;
          title.innerHTML = "Průhlednost"
          containers.opacityContainer.appendChild(inputRange);
          containers.opacityContainer.appendChild(title);
  
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
            let layerInputs = createLayerListInputs(promisisList);
            createLayerList(layerInputs, layerListContainer)
  
            //legend.destroy()
          }
  
        }
      });
  
    });
  
  }