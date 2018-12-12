import * as THREE from 'three';

import initObjects from './objects';

export default function threeStart(element, state) {

  state.width = element.clientWidth;
  state.height = element.clientHeight;

  const camera = initCamera(state.width, state.height),
        renderer = initRenderer(element);

  function redrawAll() {
    const elements = initObjects(camera, state);

    const redrawNow = () => {
      renderer.render(elements.scene, camera);
    };

    state.threeD = {
      elements: elements,
      renderer: renderer,
      redraw: redrawNow
    };
    redrawNow();
  }

  loadAssets(state, renderer, () => {
    redrawAll();
  });

  if (module.hot) {
    module.hot.accept('./objects', function() {
      try {
      redrawAll();      
      } catch (e) {
        console.log(e);
      }
    });
  }
}

function loadAssets(state, renderer, onLoad) {
  const manager = new THREE.LoadingManager(() => onLoad());

  const textureLoader = new THREE.TextureLoader(manager);

  state.textures = {};

  state.textures['berlin'] = textureLoader.load('/assets/cities/berlin-01.png');
  state.textures['hongkong'] = textureLoader.load('/assets/cities/hongkong-01.png');
  state.textures['lisbon'] = textureLoader.load('/assets/cities/lisbon-01.png');
  state.textures['mumbai'] = textureLoader.load('/assets/cities/mumbai-01.png');
  state.textures['saopaulo'] = textureLoader.load('/assets/cities/saopaulo-01.png');
  state.textures['singapore'] = textureLoader.load('/assets/cities/singapore-01.png');
  state.textures['buenos'] = textureLoader.load('/assets/cities/buenos-01.png');
  state.textures['jakarta'] = textureLoader.load('/assets/cities/jakarta-01.png');
  state.textures['london'] = textureLoader.load('/assets/cities/london-01.png');
  state.textures['newyork'] = textureLoader.load('/assets/cities/newyork-01.png');
  state.textures['seoul'] = textureLoader.load('/assets/cities/seoul-01.png');
  state.textures['tahran'] = textureLoader.load('/assets/cities/tahran-01.png');
  state.textures['chance'] = textureLoader.load('/assets/cities/chance-01.png');
  state.textures['jejudo'] = textureLoader.load('/assets/cities/jejudo-01.png');
  state.textures['madrid'] = textureLoader.load('/assets/cities/madrid-01.png');
  state.textures['rome'] = textureLoader.load('/assets/cities/rome-01.png');
  state.textures['shanghai'] = textureLoader.load('/assets/cities/shanghai-01.png');

  for (var key in state.textures) {
    var texture = state.textures[key];
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  };

}

function initRenderer(canvas) {
  const w = canvas.clientWidth,
        h = canvas.clientHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    precision: 'highp',
    alpha: false
  });

  renderer.sortObjects = false;
  renderer.autoClear = false;
  renderer.setSize(w, h);

  return renderer;
}

function initCamera(w, h) {
  const fov = 8,
        aspect = w / h * 1.4,
        zNear = 1,
        zFar = 2000;

  const camera = new THREE.PerspectiveCamera(
    fov, aspect, zNear, zFar);

  camera.updateProjectionMatrix();

  return camera;
}



