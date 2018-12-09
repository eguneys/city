import * as THREE from 'three';

export default function initObjects(camera, state) {
  const objects = {};

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

  const playerGeo = geoCube(4, 4, 4),
        playerMat = matPhong({ color: 0xff0000 }),
        playerMesh = mesh(playerGeo, playerMat);
  const playerPos = getTilePosition(
    objects.tiles,
    state.players['player1'].currentTile);
  playerMesh.position.set(playerPos.x, -playerPos.z, 4);
  tilesGroup.add(playerMesh);

  objects.player1 = playerMesh;

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

function vec3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

function lightAmbient(color) {
  return new THREE.AmbientLight(color);
}

function lightDirectional(color, intensity) {
  return new THREE.DirectionalLight(color, intensity);
}

function geoCube(w, h, d) {
  return new THREE.CubeGeometry(w, h, d);
}

function matPhong(opts) {
  return new THREE.MeshPhongMaterial(opts);
}

function matBasic(opts) {
  return new THREE.MeshBasicMaterial(opts);
}

function matMulti(array) {
  return new THREE.MultiMaterial(array);
}

function mesh(geo, mat) {
  return new THREE.Mesh(geo, mat);
}

function group() {
  return new THREE.Group();
}

function newScene() {
  return new THREE.Scene();
}
