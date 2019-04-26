import * as THREE from 'three';

export default function initObjects(camera, state) {
  const objects = {
    properties: {}
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
  let light = lightDirectional(0xffffff, 0.8);
  light.position.set(30, 50, 30);
  result.add(light);

  light = lightDirectional(0xffffff, 0.8);
  light.position.set(30, 50, 30);
  result.add(light);

  return result;
}

function meshBoard(state, objects) {
  const result = group();

  const boardGeo = geoCube(100, 100, 2),
        boardMat = matPhong({ color: 0x610000 }),
        boardMesh = mesh(boardGeo, boardMat);
  boardMesh.rotation.x = -Math.PI / 2.0;
  result.add(boardMesh);

  objects.tiles = [];

  const tilesGroup = group();
  tilesGroup.position.set(-3, 3, 0);
  boardMesh.add(tilesGroup);

  let tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    state.tiles.slice(1, 6));
  
  tileMesh.position.set(40, -40, 2);
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    state.tiles.slice(7, 12));
  tileMesh.position.set(-30 - (6 * .5), -40, 2);
  tileMesh.rotation.z = - Math.PI / 2;
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    state.tiles.slice(13, 18), -1);
  tileMesh.position.set(-30 - (6 * .5), 30 + (6 * .5), 2);
  tileMesh.rotation.z = - Math.PI;
  tilesGroup.add(tileMesh);

  tileMesh = oneSideTileGroup(
    objects.tiles,
    state.textures,
    state.tiles.slice(19, 24), -1);
  tileMesh.position.set(40, 30 + (6 * .5), 2);
  tileMesh.rotation.z = - Math.PI * (3 / 2);
  tilesGroup.add(tileMesh);

  tilesGroup.updateWorldMatrix(true, true);

  for (var key in state.players) {
    var player = state.players[key];
    var { color, dx } = state.colors[key];

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

  for (key in state.properties) {
    var property = state.properties[key];
    var tile = objects.tiles[tileIndexByKey(state.tiles, key)];

    if (property.owner) {
      addProperty(state, objects,
                  key,
                  tile,
                  property.owner,
                  property.owned);
    }
  }

  return result;
}

function tileIndexByKey(tiles, key) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].key === key) return i;
  }
  return -1;
}

export function addProperty(state, objects,
                            key, tile,
                            owner,
                            propType) {
  const { color } = state.colors[owner];  
  const result = group();

  const tileIndex = tileIndexByKey(state.tiles, key);

  let geo = geoCube(4, 2, 4),
      mat = matPhong({ color: color }),
      pMesh = mesh(geo, mat);

  result.add(pMesh);

  if (tileIndex < 6 || tileIndex > 18) {
    result.position.set(0, 8, 2);
  } else {
    result.position.set(0, -8, 2);
  }

  tile.add(result);
  objects.properties[key] = result;
  return result;
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

export function geoCube(w, h, d) {
  return new THREE.CubeGeometry(w, h, d);
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

export function selectCityTexture(amount, color, color2) {
  const width = 256,
        height = 128;
  const canvas = withCanvas(width, height, (canvas, ctx) => {
    const border1 = 2,
          border2 = 10,
          radius = 50;

    ctx.font = '60pt Arial';
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

  const texture = newTexture(canvas);
  texture.needsUpdate = true;
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

function withCanvas(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return f(canvas, canvas.getContext('2d'));
}
