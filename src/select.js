import * as THREE from 'three';
import { selectCityTexture } from './objects';

export function bindSelectEvents(ctrl, redraw) {
  let selectedCities = {};
  const state = ctrl.data;
  function onDocumentMouseDown(event) {
    event.preventDefault();
    const mouseX = (event.clientX / state.width) * 2 - 1;
    const mouseY = - (event.clientY / state.height) * 2 + 1;

    const camera = state.threeD.elements.camera;
    const raycaster = state.threeD.raycaster;

    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY, 0.5), camera);

    var intersects = raycaster.intersectObjects(ctrl.vm.sellCity.clickables?ctrl.vm.sellCity.clickables:[]);
    if (intersects.length > 0) {
      const tileKey = intersects[0].object.tileKey;
      let selectedCity = selectedCities[tileKey];
      if (selectedCity) {
        selectedCity.material.map = selectedCity.currentMap;
        selectedCities[tileKey] = undefined;
        ctrl.vm.sellCity.selectedCities.splice(ctrl.vm.sellCity.selectedCities.indexOf(tileKey), 1);
      } else {
        ctrl.vm.sellCity.selectedCities.push(tileKey);
        selectedCity = intersects[0].object;
        selectedCities[tileKey] = selectedCity;
        selectedCity.currentMap = selectedCity.material.map;
        selectedCity.material.map = selectCityTexture(selectedCity.tileAmount, '#cccccc', 'cccccc');
      }

      state.threeD.redraw();
      redraw();
    }
    
  }

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentMouseDown, false);

  return () => {
    document.removeEventListener('mousedown', onDocumentMouseDown);
    document.removeEventListener('touchstart', onDocumentMouseDown);

  };
}

if (module.hot) {
  module.hot.accept('./objects', function() {
    try {
    } catch (e) {
      console.log(e);
    }
  });
}
