import { tileIndexByKey, Settings, Tiles } from './state';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';


export default function initObjects(camera, state) {
  const objects = {
    tiles: [],
    cities: {},
    streaks: {},
    multiplies: {}
  };

  const scene = newScene();

  scene.add(lights());
  scene.add(meshBoard(state, objects));
  scene.add(meshSkyBox());

  scene.add(gridHelper());

  setupCamera(camera);

  return {
    scene,
    camera,
    ...objects
  };
  
}

function setupCamera(camera) {
  const xzWidth = 350,
        yHeight = 200;
  const cameraBasePos = vec3(xzWidth, yHeight, xzWidth),
        cameraTargetPos = vec3(0, 0, 0);

  camera.basePosition = cameraBasePos;
  camera.targetPosition = cameraTargetPos;

  camera.position.copy(cameraBasePos);
  camera.lookAt(cameraTargetPos);
}

function gridHelper() {
  const result = group();

  const gridXZ = new THREE
        .GridHelper(200, 10,
                    new THREE.Color(0x006600),
                    new THREE.Color(0x006600));
  result.add(gridXZ);


  const gridXY = new THREE
        .GridHelper(200, 10,
                    new THREE.Color(0x000066),
                    new THREE.Color(0x000066));
  gridXY.rotation.x = Math.PI / 2;
  // result.add(gridXY);

  const gridYZ = new THREE
        .GridHelper(200, 10,
                    new THREE.Color(0x660000),
                    new THREE.Color(0x660000));
  gridYZ.rotation.z = Math.PI / 2;
  // result.add(gridYZ);

  return result;
}

function lights() {
  const result = group();

  const ambient = lightAmbient(0xc0c0c0);
  // result.add(ambient);
  let light = lightDirectional(0xffffff, 1.8);
  light.position.set(30, 50, 30);
  result.add(light);

  light = lightDirectional(0xffffff, 0.8);
  light.position.set(30, 50, 30);
  // result.add(light);

  return result;
}

function meshBoard(state, objects) {
  const result = group();

  const boardGeo = geoCube(100, 100, 2),
        boardMat = matPhong({ color: 0x610000 }),
        boardMesh = mesh(boardGeo, boardMat);
  boardMesh.rotation.x = -Math.PI / 2.0;
  result.add(boardMesh);

  const tilesGroup = group();
  tilesGroup.position.set(-3, 3, 0);
  boardMesh.add(tilesGroup);

  let tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    Tiles.slice(1, 6));
  
  tileMesh.position.set(40, -40, 2);
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    Tiles.slice(7, 12));
  tileMesh.position.set(-30 - (6 * .5), -40, 2);
  tileMesh.rotation.z = - Math.PI / 2;
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    Tiles.slice(13, 18), -1);
  tileMesh.position.set(-30 - (6 * .5), 30 + (6 * .5), 2);
  tileMesh.rotation.z = - Math.PI;
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    Tiles.slice(19, 24), -1);
  tileMesh.position.set(40, 30 + (6 * .5), 2);
  tileMesh.rotation.z = - Math.PI * (3 / 2);
  tilesGroup.add(tileMesh);

  tilesGroup.updateWorldMatrix(true, true);

  for (var key in state.players) {
    var player = state.players[key];
    var { color, dx } = Settings.colors[key];

    let playerGeo = geoCube(4, 4, 4),
        playerMat = matPhong({ color: color }),
        playerMesh = mesh(playerGeo, playerMat);
    let playerPos = getTilePosition(
      objects.tiles,
      player.currentTile);
    playerMesh.position.set(playerPos.x + dx.x,
                            -playerPos.z + dx.y , 4);
    tilesGroup.add(playerMesh);

    objects[key] = playerMesh;
  }

  return result;
}

function getMeshForProperty(color, propType) {
  var pMesh = group();
  switch(propType) {
  case 'land':
    const cMesh = mesh(geoCylinder(0.5,0.5,8,5),
                       matPhong({
                         color: '#ffffff' }));

    const tMesh = mesh(geoTriangle(vec3(0,0,0),
                                   vec3(4,0,0),
                                   vec3(0,4,0)),
                       matPhong({
                         color: color, side: THREE.DoubleSide }));


    // tMesh.rotation.y = Math.PI * 0.5;
    // tMesh.position.z = 4;

    cMesh.rotation.x = Math.PI * 0.5;
    pMesh.add(mesh(geoCube(4, 4, 0.1),
                   matPhong({ color: color })));
    pMesh.add(cMesh);
    // pMesh.add(tMesh);
    break;
  case 'hotel':
    pMesh.add(mesh(geoCube(5, 2, 5),
                   matPhong({ color: '#ffffff' })));
    pMesh.add(mesh(geoCube(4, 1, 8),
                   matPhong({ color: color })));
    pMesh.add(mesh(geoCube(1, 1, 10),
                   matPhong({ color: color })));
    break;
  default:
    pMesh.add(mesh(geoCube(4, 2, 4),
                   matPhong({ color: color })));
  }
  pMesh.add(mesh(geoCube(10, 4, 0.01),
                 matPhong({ color: '#00cc00' })));
  return pMesh;
}

export function removeProperty(state, key) {

  const objects = state.threeD.elements;
  const tileIndex = tileIndexByKey(key);
  const tile = objects.tiles[tileIndex];



  tween(objects.cities[key].scale)
    .to({x: 0.1, y: 0.1, z: 0.1 }, 500)
    .onComplete(() => {
      tile.remove(objects.cities[key]);
      delete objects.cities[key];
    })
    .start();
}

export function addProperty(state,
                            key,
                            toll) {
  const objects = state.threeD.elements;
  const { owner } = toll;
  const propType = toll.owned;

  if (objects.cities[key] && objects.cities[key].propType === propType) {
    return objects.cities[key];
  }

  const { color } = Settings.colors[owner];

  const result = group();

  const tileIndex = tileIndexByKey(key);
  const tile = objects.tiles[tileIndex];

  let pMesh = getMeshForProperty(color, propType);

  result.add(pMesh);

  if (tileIndex < 6 || tileIndex > 18) {
    result.position.set(0, 8, 1.1);
    result.rotation.z = Math.PI;
  } else {
    result.position.set(0, -8, 1.1);
  }

  if (objects.cities[key]) {
    tile.remove(objects.cities[key]);
  }

  tile.add(result);
  objects.cities[key] = result;
  result.propType = propType;

  result.scale.set(0.1, 0.1, 0.1);
  tween(result.scale)
    .to({x: 1, y: 1, z: 1 }, 500)
    .start();

  
  return result;
}

function getStreakMesh(color) {
  return mesh(geoExtrude(shapeStreak(), {
    steps: 2,
    depth: 2.5,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.6,
    bevelSegments: 10
  }),
              matPhong({ color: color, side: THREE.DoubleSide }));
}

export function addStreak(state, key, owner) {
  const objects = state.threeD.elements;
  
  if (objects.streaks[key]) {
    return;
  }
  const { color } = Settings.colors[owner];

  const result = group();

  const tileIndex = tileIndexByKey(key);
  const tile = objects.tiles[tileIndex];

  let pMesh = getStreakMesh(color);
  pMesh.position.x = -15 - 0.25;
  pMesh.position.y = -10 - 0.25;
  pMesh.position.z = -1;
  // pMesh.rotation.y = Math.PI * 0.5;
  result.add(pMesh);

  tile.add(result);
  objects.streaks[key] = result;

  result.position.set(0, 0, 100);
  tween(result.position)
    .easing(TWEEN.Easing.Bounce.InOut)
    .to({x: 0, y: 0, z: 0 }, 600)
    .start();

  return;
}

export function addTollMultiply(state, key, multiply) {
  const objects = state.threeD.elements;
  
  if (objects.multiplies[key] === multiply) {
    return;
  }

  const tileIndex = tileIndexByKey(key);
  const tile = objects.tiles[tileIndex];

  let pMesh = mesh(geoPlane(10, 5.5),
                   matBasic({ transparent: true,
                              alphaTest: 0.1,
                              map: tollMultiplyTexture('x' + multiply) }));
  if (tileIndex < 6 || tileIndex > 18) {
    pMesh.position.set(0, -8, 1.1);
  } else {
    pMesh.position.set(0, 8, 1.1);
    pMesh.rotation.z = Math.PI;
  }

  tile.add(pMesh);
  objects.multiplies[key] = multiply;
}

function tween(obj) {
  return new TWEEN.Tween(obj);
}

export function getTilePosition(tiles, index) {
  const tile = tiles[index];
  return vec3().setFromMatrixPosition(tile.matrixWorld);
}

function oneSideTileGroup(objectsTiles, textures, tiles, rotation = 1) {
  const colorMap = {
    hongkong: { color: 0xffd700 },
    shanghai: { color: 0xffd700 },
    jakarta: { color: 0x6ce768 },
    singapore: { color: 0x6ce768 },
    mumbai: { color: 0x58c8ff },
    tahran: { color: 0x58c8ff },
    buenos: { color: 0x1fab4d },
    saopaulo: { color: 0x1fab4d },
    lisbon: { color: 0xff7400 },
    madrid: { color: 0xff7400 },
    berlin: { color: 0xa35cff },
    rome: { color: 0xa35cff },
    london: { color: 0x0011ff },
    seoul: { color: 0xff0000 },
    newyork: { color: 0xff0000 },
    jejudo: { color: 0xcccccc },
    chance: { color: 0x953500 }
  };

  const tileGroup = group();

  const cornerGeo = geoCube(20, 20, 2),
        cornerMat = matPhong({ color: 0xffffff }),
        cornerMesh = mesh(cornerGeo, cornerMat);
  // cornerMesh.position.set(38, -38, 2);
  tileGroup.add(cornerMesh);
  objectsTiles.push(cornerMesh);

  for (var i = 0; i < 5; i++) {
    const tile = tiles[i],
          { color } = colorMap[tile.key],
          texture = textures[tile.key];
    texture.rotation = rotation * Math.PI / 2;

    const tileGeo = geoCube(10, 20, 2),
          tileMat = [
            matPhong({ color: color }),
            matPhong({ color: color }),
            matPhong({ color: color }),
            matPhong({ color: color }),
            matBasic({ map: texture }),
            matPhong({ color: color }),
          ],
          tileMesh = mesh(tileGeo, tileMat);
    tileMesh.position.set((i + 1) * (- 10 - .5) - 5, 0, 0);
    tileGroup.add(tileMesh);
    objectsTiles.push(tileMesh);
  }

  return tileGroup;
}

function meshSkyBox() {
  const skyGeo = geoCube(1000, 1000, 1000);

  const materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(matBasic({
      color: 0x61a0c3,
      side: THREE.BackSide
    }));
  }

  const skyMat = materialArray;

  return mesh(skyGeo, skyMat);
}

export function vec3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

export function lightAmbient(color) {
  return new THREE.AmbientLight(color);
}

export function lightDirectional(color, intensity) {
  return new THREE.DirectionalLight(color, intensity);
}

export function geoTriangle(v1, v2, v3) {
  var geom = new THREE.Geometry();
  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);

  geom.faces.push(new THREE.Face3(0,1,2));
  geom.computeFaceNormals();
  return geom;
}

export function geoCylinder(rt, rb, h, r, hs) {
  return new THREE.CylinderGeometry(rt, rb, h, r, hs);
}

export function geoCube(w, h, d) {
  return new THREE.CubeGeometry(w, h, d);
}

export function geoPlane(w, h) {
  return new THREE.PlaneGeometry(w, h);
}

export function geoExtrude(shape, settings) {
  return new THREE.ExtrudeBufferGeometry(shape, settings);
}

export function matPhong(opts) {
  return new THREE.MeshPhongMaterial(opts);
}

export function matBasic(opts) {
  return new THREE.MeshBasicMaterial(opts);
}

export function matMulti(array) {
  return new THREE.MultiMaterial(array);
}

export function mesh(geo, mat) {
  return new THREE.Mesh(geo, mat);
}

export function group() {
  return new THREE.Group();
}

export function newScene() {
  return new THREE.Scene();
}

export function newTexture(canvas) {
  return new THREE.Texture(canvas);
}

export function newSprite(opts) {
  const mat = new THREE.SpriteMaterial(opts);
  return new THREE.Sprite(mat);
}

function shapeStreak() {
  const width = 20,
        length = 20,
        thick = 0.1,
        radius = 2;
  var shape = new THREE.Shape();
  roundedRect3(shape, 0, 0, width, length, radius);

  var hole = new THREE.Path();
  roundedRect3(hole, thick, thick,
               width - thick,
               length - thick,
               radius);
  
  shape.holes.push(hole);
  return shape;
}

export function tollMultiplyTexture(amount) {
  const width = 64,
        height = 32;
  const texture = withCanvasTexture(width, height, (canvas, ctx) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.clearRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
    ctx.font = '18pt Fredoka One';
    ctx.fillStyle = 'black';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(amount, width / 2, height / 2);
    return canvas;
  });
  return texture;
}

export function selectCityTexture(amount, color, color2) {
  const width = 256,
        height = 128;
  const texture = withCanvasTexture(width, height, (canvas, ctx) => {
    const border1 = 2,
          border2 = 10,
          radius = 50;

    ctx.font = '60pt Fredoka One';
    ctx.fillStyle = 'black';
    roundRect(ctx, 0, 0, width, height, radius);
    ctx.fillStyle = color;
    roundRect(ctx, border1, border1, width-border1 * 2, height-border1 * 2, radius);
    ctx.fillStyle = color2;
    roundRect(ctx, border2, border2, width-border2 * 2, height-border2 * 2, radius);
    ctx.fillStyle = 'white';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(amount, 128, 80);
    return canvas;
  });
  return texture;
}

// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Sprite-Text-Labels.html
// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();   
}

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(canvas, canvas.getContext('2d'));

  // document.body.appendChild(canvas);

  const texture = newTexture(canvas);
  texture.needsUpdate = true;
  return texture;  
}

function roundedRect3(ctx, x, y, width, height, radius) {
  ctx.moveTo( x, y + radius );
  ctx.lineTo( x, y + height - radius );
  ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
  ctx.lineTo( x + width - radius, y + height );
  ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
  ctx.lineTo( x + width, y + radius );
  ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
  ctx.lineTo( x + radius, y );
  ctx.quadraticCurveTo( x, y, x, y + radius );
}
