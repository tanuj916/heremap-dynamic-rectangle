
/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */

let
  hereRectObj = null,
  hereMrkrObj = [],
  from_lat = 0,
  from_lon = 0,
  to_lat = 0,
  to_lon = 0,
  selectedMarkers = [],
  defaultIconStyle = new H.map.Icon("https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png"),
  selectedIconStyle = new H.map.Icon("https://img.icons8.com/color/100/000000/batman.png", {size: {w: 36, h: 36}});

/**
 * Disable map draggable behavior. 
 * Set the lat and lng from the initial clicked position.
 */
let dragStartHandler = function(e) {
  behavior.disable();
  let coord = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
  from_lat = coord.lat;
  from_lon = coord.lng;
}

/**
 * To set top and bottom:
 *  If dragged from top-left to bottom-right
 *    setting values as it is
 *  Else dragged from bottom-right to top-left 
 *    inverse, since dragged from bottom
 * Same applies to set right and left value
 * An expanded version of the same is added at the end of the page
 */
let dragHandler = function(e) {
  clearRect();
  let top = 0,
      btm = 0,
      coord = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
  to_lat = coord.lat;
  to_lon = coord.lng;
  if(from_lat > to_lat) {
    top = from_lat
    btm = to_lat
  } else {
    top = to_lat
    btm = from_lat
  }
  (from_lon < to_lon) ? createRect(top, from_lon, btm, to_lon) : createRect(top, to_lon, btm, from_lon)
  getRectMarkers(hereRectObj);
}

/**
 * Enable map draggable behavior. 
 */
let dragEndHandler = function(e) {
  behavior.enable();
}

function clearRect() {
  if(hereRectObj !== null) {
    map.removeObject(hereRectObj);
    hereRectObj = null;
    selectedMarkers.forEach(function(value, idx) {
      selectedMarkers[idx].setIcon(defaultIconStyle);
    });
    document.getElementById('markerPos').innerHTML = "";
  }
}

/**
 * Find all the markers points which are inside the rectangle and change icons
 */
function getRectMarkers(rectObj) {
  selectedMarkers = [];
  hereMrkrObj.forEach(function(value, idx) {
    if(rectObj.getBounds().containsPoint(hereMrkrObj[idx].getPosition())){
      selectedMarkers.push(hereMrkrObj[idx]);
    }
  });
  document.getElementById('markerPos').innerHTML = "";
  selectedMarkers.forEach(function(value, idx) {
    selectedMarkers[idx].setIcon(selectedIconStyle);
    let ulEl = document.getElementById('markerPos');
    ulEl.innerHTML += "<li>"+selectedMarkers[idx].getPosition()+"</li>";
  });
}

function createRect(top, left, bottom, right) {
  let rectArea = new H.geo.Rect(top, left, bottom, right);
  hereRectObj = new H.map.Rect(rectArea, {
    style: {
      fillColor: 'rgba(255,229,229, 0.6)',
      strokeColor: '#DC143C',
      lineWidth: 3
    }
  })
  map.addObject(hereRectObj);
}

function addEvents() {
  map.addEventListener('dragstart', dragStartHandler);
  map.addEventListener('drag', dragHandler);
  map.addEventListener('dragend', dragEndHandler);
}

function removeEvents() {
  behavior.enable();
  clearRect();
  map.removeEventListener('dragstart', dragStartHandler);  
  map.removeEventListener('drag', dragHandler);  
  map.removeEventListener('dragend', dragEndHandler);  
}

function addMarkersToMap(map) {
  let markersArr = [
    { lat:60.1697, lng:24.8292},
    { lat: 60.1704, lng: 24.8285 },
    { lat: 60.1709, lng: 24.8277 },
    { lat: 60.1700, lng: 24.8265 },
    { lat: 60.1700, lng: 24.8283}
  ];
  markersArr.forEach(function(value, idx) {
    let marker = new H.map.Marker(value,  {icon: defaultIconStyle});
    hereMrkrObj.push(marker);
    map.addObject(marker);
  });
}

// default initializations
/**
 * Step 1: initialize communication with the platform 
 */
let platform = new H.service.Platform({
  app_id: 'devportal-demo-20180625',
  app_code: '9v2BkviRwi9Ot26kp2IysQ',
  useHTTPS: true
});
let pixelRatio = window.devicePixelRatio || 1;
let defaultLayers = platform.createDefaultLayers({
  tileSize: pixelRatio === 1 ? 256 : 512,
  ppi: pixelRatio === 1 ? undefined : 320
});

/**
 * Step 2: initialize a map - this map is centered 
 */
let map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  center: {lat:60.1697, lng:24.8292},
  zoom: 16,
  pixelRatio: pixelRatio
});
let mapTileService = platform.getMapTileService({
  type: 'base'
});

/**
 * Step 3: make the map interactive
 */
let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
let ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
addMarkersToMap(map);

/**
 * Expanded version of rectangle creation
 * 
    // top-left to bottom-right 
    if((from_lat > to_lat) && (from_lon < to_lon)){
      createRect(from_lat, from_lon, to_lat, to_lon);
    }
    // bottom-right to top-left 
    else if((from_lat < to_lat) && (from_lon > to_lon)){
      createRect(to_lat, to_lon, from_lat, from_lon);
    }
    // top-left to bottom-left 
    else if((from_lat > to_lat) && (from_lon > to_lon)) {
      createRect(from_lat, to_lon, to_lat, from_lon);
    }
    // bottom-right to top-right 
    else if((from_lat < to_lat) && (from_lon < to_lon)) {
      createRect(to_lat, from_lon, from_lat, to_lon);
    }
 * 
 */
