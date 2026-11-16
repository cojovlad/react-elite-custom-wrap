import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { VEHICLES } from './vehicles.js';
import { MATERIALS } from './materials.js';
import { t } from './i18n.js';
import { PARTS } from './parts.js';
export { VEHICLES } from './vehicles.js';
export { PARTS } from './parts.js';

const DEFAULT_COLORS = {
  body: '#e8e2d6',
  hood: '#e8e2d6',
  roof: '#151716',
  mirrors: '#151716',
  wheels: '#151716',
  accents: '#b4a086',
};
const PART_INDEX = Object.fromEntries(
  PARTS.map(({ id }, index) => [id, index]),
);
// Paint regions on combined body meshes plus the parts that are separate meshes.
const WRAP_SHADER_COMMON = `
varying vec3 wrapPosition;
uniform vec3 wrapColors[6];
uniform vec3 wrapFlips[6];
uniform vec4 wrapParams[6];
uniform vec4 wrapFx[6];
uniform bool wrap_roadster;
uniform bool wrap_mirror_zone;
float wrapHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
vec3 wrapHash3(vec3 p) {
  return vec3(wrapHash(p), wrapHash(p + 17.31), wrapHash(p + 41.7));
}
float wrapNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(wrapHash(i), wrapHash(i + vec3(1, 0, 0)), f.x),
        mix(wrapHash(i + vec3(0, 1, 0)), wrapHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(wrapHash(i + vec3(0, 0, 1)), wrapHash(i + vec3(1, 0, 1)), f.x),
        mix(wrapHash(i + vec3(0, 1, 1)), wrapHash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}`;
const WRAP_SHADER_COLOR = `
vec3 p = wrapPosition;
int wrapIndex = WRAP_PART;
bool wrapActive = true;
#if WRAP_PART < 0
  wrapIndex = 0;
  if (wrap_roadster) {
    if (p.x > 0.65 && p.y > 0.5 && abs(p.z) < 0.8) wrapIndex = 1;
    if (p.x < -0.45 && p.y > 0.7 && abs(p.z) < 0.8) wrapIndex = 2;
    if (wrap_mirror_zone && abs(p.z) > 0.98 && p.y > 0.7 && p.x > 0.1 && p.x < 1.1) wrapIndex = 3;
  } else {
    if (p.x > 0.85 && p.y > 0.76 && abs(p.z) < 0.85) wrapIndex = 1;
    if (p.y > 1.23 && p.x > -1.1 && p.x < 0.65) wrapIndex = 2;
    if (wrap_mirror_zone && abs(p.z) > 0.93 && p.y > 0.99 && p.x > 0.1 && p.x < 1.25) wrapIndex = 3;
  }
  #ifdef WRAP_MIRRORS_ONLY
    wrapActive = wrapIndex == 3;
  #endif
#endif
vec4 wrapP = wrapParams[wrapIndex];
vec4 wrapF = wrapFx[wrapIndex];
vec3 wrapFlip = wrapFlips[wrapIndex];
float wrapRoughness = wrapP.x;
if (!wrapActive) {
  diffuseColor.rgb *= vec3(0.012);
  wrapP = vec4(0.45, 0.0, 0.3, 0.4);
  wrapF = vec4(0.0);
  wrapRoughness = wrapP.x;
} else {
  diffuseColor.rgb *= wrapColors[wrapIndex];
  if (wrapF.z > 0.5 && wrapF.z < 1.5) {
    // Twill carbon weave.
    vec2 uv = vec2(p.x + p.z * 0.7, p.y + p.z * 0.3) * 34.0;
    vec2 cell = floor(uv);
    vec2 f = fract(uv);
    float warp = step(1.0, mod(cell.x + floor(cell.y * 0.5) * 2.0 + cell.y, 2.0));
    float fiber = mix(f.y, f.x, warp);
    float sheen = 0.55 + 0.45 * sin(fiber * 3.14159);
    diffuseColor.rgb *= mix(0.45, 1.35, sheen * (0.75 + 0.25 * warp));
    wrapRoughness += (1.0 - sheen) * 0.15;
  } else if (wrapF.z > 1.5 && wrapF.z < 2.5) {
    float grain = wrapHash(vec3(0.0, floor(p.y * 1400.0), floor(p.z * 1400.0)));
    diffuseColor.rgb *= 0.88 + 0.22 * grain;
    wrapRoughness += (grain - 0.5) * 0.18;
  } else if (wrapF.z > 2.5) {
    float bump = wrapNoise(p * 160.0);
    diffuseColor.rgb *= 0.9 + 0.15 * bump;
    wrapRoughness += (bump - 0.5) * 0.2;
  }
}`;
const WRAP_SHADER_NORMAL = `
if (wrapF.x > 0.0) {
  // Metallic flakes: tiny randomly tilted facets under the clear layer.
  vec3 flake = wrapHash3(floor(wrapPosition * 620.0)) * 2.0 - 1.0;
  normal = normalize(normal + flake * 0.24 * wrapF.x);
}
if (wrapF.z > 2.5) {
  vec3 q = wrapPosition * 160.0;
  vec3 slope = vec3(wrapNoise(q + vec3(0.5, 0, 0)) - wrapNoise(q - vec3(0.5, 0, 0)),
    wrapNoise(q + vec3(0, 0.5, 0)) - wrapNoise(q - vec3(0, 0.5, 0)),
    wrapNoise(q + vec3(0, 0, 0.5)) - wrapNoise(q - vec3(0, 0, 0.5)));
  normal = normalize(normal + slope * 0.35);
}
if (wrapF.w > 0.5) {
  // Colour-flip films shift towards the second colour at grazing angles.
  float facing = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  diffuseColor.rgb = mix(wrapFlip, diffuseColor.rgb, smoothstep(0.2, 0.9, facing));
}`;

// Model-space regions provide conceptual panel previews on the combined body mesh.
function partAt(point, roadster = false, mirrorZone = true) {
  if (roadster) {
    if (
      mirrorZone &&
      Math.abs(point.z) > 0.98 &&
      point.y > 0.7 &&
      point.x > 0.1 &&
      point.x < 1.1
    )
      return 'mirrors';
    if (point.x < -0.45 && point.y > 0.7 && Math.abs(point.z) < 0.8)
      return 'roof';
    if (point.x > 0.65 && point.y > 0.5 && Math.abs(point.z) < 0.8)
      return 'hood';
    return 'body';
  }
  if (
    mirrorZone &&
    Math.abs(point.z) > 0.93 &&
    point.y > 0.99 &&
    point.x > 0.1 &&
    point.x < 1.25
  )
    return 'mirrors';
  if (point.y > 1.23 && point.x > -1.1 && point.x < 0.65) return 'roof';
  if (point.x > 0.85 && point.y > 0.76 && Math.abs(point.z) < 0.85)
    return 'hood';
  return 'body';
}

// Stylised recreation of the Elite Custom Wrap garage: dark room, hexagonal LED
// ceiling grid, LED baseboard line and ventilated interlocking floor tiles.
const GARAGE = { halfX: 11, halfZ: 10.5, height: 4.2 };
const MAX_CAMERA_DISTANCE = 9.8;
const HEX_EDGE = 0.62;
const HEX_Y = GARAGE.height - 0.42;
const LED_COLOR = '#f4f8ff';

function seededRandom(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function canvasTexture(width, height, draw, color = true) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawFloorTiles(context, size, count, palette) {
  const tile = size / count;
  const step = tile / 12;
  for (let row = 0; row < count; row++) {
    for (let column = 0; column < count; column++) {
      const x = column * tile;
      const y = row * tile;
      const shade = (row + column) % 2;
      const slope = row % 2 === column % 2 ? 1 : -1;
      context.fillStyle = palette[shade];
      context.fillRect(x, y, tile, tile);
      context.save();
      context.beginPath();
      context.rect(x + 3, y + 3, tile - 6, tile - 6);
      context.clip();
      for (let k = -tile; k <= tile * 2; k += step) {
        const x0 = slope > 0 ? x + k : x + tile - k;
        context.strokeStyle = '#050506';
        context.lineWidth = step * 0.5;
        context.beginPath();
        context.moveTo(x0, y);
        context.lineTo(x0 + slope * tile, y + tile);
        context.stroke();
        context.strokeStyle = 'rgba(255,255,255,0.09)';
        context.lineWidth = 1.2;
        context.beginPath();
        context.moveTo(x0 + step * 0.36, y);
        context.lineTo(x0 + step * 0.36 + slope * tile, y + tile);
        context.stroke();
      }
      context.restore();
      context.strokeStyle = '#040405';
      context.lineWidth = 4;
      context.strokeRect(x + 1, y + 1, tile - 2, tile - 2);
    }
  }
}

function drawBanner(context, width, height) {
  const background = context.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, '#101113');
  background.addColorStop(1, '#060607');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.strokeStyle = '#f2f2f2';
  context.lineWidth = 5;
  context.beginPath();
  context.arc(width / 2, 92, 54, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = '#f7f7f7';
  context.font = 'italic 900 38px Arial, sans-serif';
  context.fillText('ELITE', width / 2, 90);
  context.font = '700 11px Arial, sans-serif';
  context.fillText('C U S T O M   W R A P', width / 2, 168);
  context.font = '700 24px Arial, sans-serif';
  context.fillText('PPF', width / 2, 222);
  context.font = '600 17px Arial, sans-serif';
  context.fillStyle = '#d9d9d9';
  context.fillText('· Colantare ·', width / 2, 254);
  context.fillText('· Detailing ·', width / 2, 282);
  const glow = context.createRadialGradient(128, 368, 4, 128, 368, 96);
  glow.addColorStop(0, 'rgba(210,220,235,0.35)');
  glow.addColorStop(1, 'rgba(210,220,235,0)');
  context.fillStyle = glow;
  context.fillRect(0, 300, width, 140);
  context.fillStyle = '#1c1d20';
  context.beginPath();
  context.moveTo(44, 392);
  context.quadraticCurveTo(70, 352, 120, 346);
  context.quadraticCurveTo(176, 342, 204, 372);
  context.quadraticCurveTo(222, 376, 216, 394);
  context.closePath();
  context.fill();
  context.fillStyle = '#e9e9e9';
  context.font = '700 15px Arial, sans-serif';
  context.fillText('ELITE CUSTOM WRAP', width / 2, 452);
  context.fillStyle = '#9a9a9a';
  context.font = '10px Arial, sans-serif';
  context.fillText('WRAP · PPF · DETAILING STUDIO', width / 2, 476);
}

function hexGrid(clusters) {
  const edges = new Map();
  const vertices = new Map();
  const rowStep = Math.sqrt(3) * HEX_EDGE;
  const key = (x, z) => `${x.toFixed(2)},${z.toFixed(2)}`;
  for (const cluster of clusters) {
    const columns = Math.ceil(cluster.width / (1.5 * HEX_EDGE));
    const rows = Math.ceil(cluster.depth / rowStep);
    for (let q = -columns; q <= columns; q++) {
      for (let r = -rows; r <= rows; r++) {
        const x = cluster.x + 1.5 * HEX_EDGE * q;
        const z = cluster.z + rowStep * (r + (Math.abs(q) % 2) / 2);
        if (
          Math.abs(x - cluster.x) + HEX_EDGE > cluster.width / 2 ||
          Math.abs(z - cluster.z) + rowStep / 2 > cluster.depth / 2
        )
          continue;
        for (let side = 0; side < 6; side++) {
          const a0 = (side * Math.PI) / 3;
          const a1 = ((side + 1) * Math.PI) / 3;
          const x0 = x + HEX_EDGE * Math.cos(a0);
          const z0 = z + HEX_EDGE * Math.sin(a0);
          const x1 = x + HEX_EDGE * Math.cos(a1);
          const z1 = z + HEX_EDGE * Math.sin(a1);
          edges.set(key((x0 + x1) / 2, (z0 + z1) / 2), {
            x: (x0 + x1) / 2,
            z: (z0 + z1) / 2,
            angle: Math.atan2(z1 - z0, x1 - x0),
          });
          vertices.set(key(x0, z0), { x: x0, z: z0 });
        }
      }
    }
  }
  return { edges: [...edges.values()], vertices: [...vertices.values()] };
}

function buildGarage(renderer) {
  const { halfX, halfZ, height } = GARAGE;
  const group = new THREE.Group();
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  const transform = new THREE.Object3D();
  transform.rotation.order = 'YXZ';
  const matrixFor = (x, y, z, sx, sy, sz, rotationY = 0, rotationX = 0) => {
    transform.position.set(x, y, z);
    transform.rotation.set(rotationX, rotationY, 0);
    transform.scale.set(sx, sy, sz);
    transform.updateMatrix();
    return transform.matrix.clone();
  };
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  // Floor: grooved interlocking tiles (8 x 8 tiles of 40 cm per texture repeat).
  const floorTexture = canvasTexture(1024, 1024, (context, size) =>
    drawFloorTiles(context, size, 8, ['#333438', '#09090a']),
  );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set((halfX * 2) / 3.2, (halfZ * 2) / 3.2);
  floorTexture.anisotropy = anisotropy;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(halfX * 2, halfZ * 2),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
      bumpMap: floorTexture,
      color: '#a9a8a4',
      bumpScale: 1.4,
      roughness: 0.74,
      metalness: 0.05,
      envMapIntensity: 0.08,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.012;
  floor.receiveShadow = true;
  group.add(floor);
  const bandTexture = canvasTexture(256, 256, (context, size) =>
    drawFloorTiles(context, size, 2, ['#8e9195', '#0d0d0e']),
  );
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping;
  bandTexture.repeat.set((halfX * 2) / 0.8, 1);
  bandTexture.anisotropy = anisotropy;
  const band = new THREE.Mesh(
    new THREE.PlaneGeometry(halfX * 2, 0.8),
    new THREE.MeshStandardMaterial({
      map: bandTexture,
      bumpMap: bandTexture,
      bumpScale: 1.4,
      roughness: 0.64,
      metalness: 0.05,
      envMapIntensity: 0.16,
    }),
  );
  band.rotation.x = -Math.PI / 2;
  band.position.set(0, -0.008, -halfZ + 1.6);
  band.receiveShadow = true;
  group.add(band);

  // Matte charcoal walls with a faint mottled plaster texture, darker ceiling.
  const random = seededRandom(1907);
  const wallTexture = canvasTexture(256, 256, (context, size) => {
    context.fillStyle = '#28292b';
    context.fillRect(0, 0, size, size);
    for (let blot = 0; blot < 140; blot++) {
      const x = random() * size;
      const y = random() * size;
      const radius = 6 + random() * 22;
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
      const tone = random() > 0.55 ? '255,255,255' : '0,0,0';
      gradient.addColorStop(0, `rgba(${tone},${0.01 + random() * 0.02})`);
      gradient.addColorStop(1, `rgba(${tone},0)`);
      context.fillStyle = gradient;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
  });
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(5, 1);
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.94,
    metalness: 0,
    envMapIntensity: 0.06,
  });
  const walls = [
    [0, -halfZ, 0, halfX * 2],
    [halfX, 0, -Math.PI / 2, halfZ * 2],
    [0, halfZ, Math.PI, halfX * 2],
    [-halfX, 0, Math.PI / 2, halfZ * 2],
  ];
  for (const [x, z, rotation, length] of walls) {
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(length, height),
      wallMaterial,
    );
    wall.position.set(x, height / 2, z);
    wall.rotation.y = rotation;
    wall.receiveShadow = true;
    group.add(wall);
  }
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(halfX * 2, halfZ * 2),
    new THREE.MeshStandardMaterial({
      color: '#0b0b0c',
      roughness: 0.95,
      envMapIntensity: 0.02,
    }),
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = height;
  group.add(ceiling);

  // Emissive LEDs (hex tubes + baseboard line) share one instanced draw call.
  const { edges, vertices } = hexGrid([
    { x: -4.3, z: 0, width: 8, depth: 12.6 },
    { x: 4.3, z: 0, width: 8, depth: 12.6 },
  ]);
  const ledMatrices = edges.map((edge) =>
    matrixFor(edge.x, HEX_Y, edge.z, HEX_EDGE - 0.05, 0.03, 0.065, -edge.angle),
  );
  const stripY = 0.2;
  for (const [x, z, rotation, length] of walls) {
    const inward = new THREE.Vector3(0, 0, 0.03).applyAxisAngle(
      THREE.Object3D.DEFAULT_UP,
      rotation,
    );
    ledMatrices.push(
      matrixFor(
        x + inward.x,
        stripY,
        z + inward.z,
        length - 0.1,
        0.022,
        0.02,
        rotation,
      ),
    );
  }
  const ledMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff',
    fog: false,
    toneMapped: false,
  });
  const leds = new THREE.InstancedMesh(
    unitBox,
    ledMaterial,
    ledMatrices.length,
  );
  ledMatrices.forEach((matrix, index) => leds.setMatrixAt(index, matrix));
  leds.frustumCulled = false;
  group.add(leds);

  // Soft additive halos make the thin tubes read as bright LEDs without bloom.
  const glowTexture = canvasTexture(
    4,
    64,
    (context, width, glowHeight) => {
      const gradient = context.createLinearGradient(0, 0, 0, glowHeight);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, glowHeight);
    },
    false,
  );
  const glowGeometry = new THREE.PlaneGeometry(1, 1);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: '#cfe0ff',
    alphaMap: glowTexture,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const glowMatrices = edges.map((edge) =>
    matrixFor(
      edge.x,
      HEX_Y - 0.02,
      edge.z,
      HEX_EDGE,
      0.15,
      1,
      -edge.angle,
      -Math.PI / 2,
    ),
  );
  for (const [x, z, rotation, length] of walls) {
    const inward = new THREE.Vector3(0, 0, 0.02).applyAxisAngle(
      THREE.Object3D.DEFAULT_UP,
      rotation,
    );
    glowMatrices.push(
      matrixFor(x + inward.x, stripY, z + inward.z, length, 0.12, 1, rotation),
    );
  }
  const glows = new THREE.InstancedMesh(
    glowGeometry,
    glowMaterial,
    glowMatrices.length,
  );
  glowMatrices.forEach((matrix, index) => glows.setMatrixAt(index, matrix));
  glows.frustumCulled = false;
  glows.renderOrder = 1;
  group.add(glows);

  // Ceiling hardware: black beams, steel profiles and hex connectors.
  const fixtureData = [];
  for (let x = -halfX + 2; x < halfX; x += 4.2)
    fixtureData.push([
      matrixFor(x, height - 0.16, 0, 0.32, 0.32, halfZ * 2),
      '#0b0b0c',
    ]);
  for (let z = -halfZ + 1.2; z < halfZ; z += 1.35)
    fixtureData.push([
      matrixFor(0, height - 0.36, z, halfX * 2, 0.035, 0.05),
      '#3a3d41',
    ]);
  for (const vertex of vertices)
    fixtureData.push([
      matrixFor(vertex.x, HEX_Y, vertex.z, 0.07, 0.05, 0.07),
      '#55585c',
    ]);
  const fixtures = new THREE.InstancedMesh(
    unitBox,
    new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.55,
      envMapIntensity: 0.35,
    }),
    fixtureData.length,
  );
  const fixtureColor = new THREE.Color();
  fixtureData.forEach(([matrix, color], index) => {
    fixtures.setMatrixAt(index, matrix);
    fixtures.setColorAt(index, fixtureColor.set(color));
  });
  fixtures.frustumCulled = false;
  group.add(fixtures);

  // Roll-up "ELITE" banner standing near the back wall.
  const bannerTexture = canvasTexture(256, 512, drawBanner);
  bannerTexture.anisotropy = anisotropy;
  const banner = new THREE.Group();
  const bannerPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 1.7),
    new THREE.MeshStandardMaterial({
      map: bannerTexture,
      roughness: 0.6,
      envMapIntensity: 0.4,
    }),
  );
  bannerPanel.position.y = 0.97;
  bannerPanel.castShadow = true;
  const bannerBase = new THREE.Mesh(
    unitBox,
    new THREE.MeshStandardMaterial({
      color: '#8b8f94',
      roughness: 0.35,
      metalness: 0.8,
    }),
  );
  bannerBase.scale.set(0.92, 0.1, 0.2);
  bannerBase.position.y = 0.06;
  banner.add(bannerPanel, bannerBase);
  banner.position.set(-0.4, 0, -halfZ + 0.5);
  banner.rotation.y = 0.3;
  group.add(banner);

  // Reflection environment: a compact dark bay whose whole ceiling is the
  // honeycomb (boosted LEDs), so gloss paint picks up hexagon highlights even
  // from the low hero camera.
  const envHalfX = 7;
  const envHalfZ = 6;
  const envScene = new THREE.Scene();
  const envRoom = new THREE.Mesh(
    new THREE.BoxGeometry(envHalfX * 2, height, envHalfZ * 2),
    new THREE.MeshBasicMaterial({ color: '#0c0c0d', side: THREE.BackSide }),
  );
  envRoom.position.y = height / 2;
  const envFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(envHalfX * 2, envHalfZ * 2),
    new THREE.MeshBasicMaterial({ color: '#1c1d1f' }),
  );
  envFloor.rotation.x = -Math.PI / 2;
  envFloor.position.y = 0.01;
  const envGrid = hexGrid([
    { x: -3.4, z: 0, width: 6.2, depth: envHalfZ * 2 },
    { x: 3.4, z: 0, width: 6.2, depth: envHalfZ * 2 },
  ]);
  const envMatrices = envGrid.edges.map((edge) =>
    matrixFor(edge.x, HEX_Y, edge.z, HEX_EDGE - 0.04, 0.08, 0.14, -edge.angle),
  );
  for (const [x, z, rotation, length] of [
    [0, -envHalfZ + 0.05, 0, envHalfX * 2],
    [envHalfX - 0.05, 0, Math.PI / 2, envHalfZ * 2],
    [0, envHalfZ - 0.05, 0, envHalfX * 2],
    [-envHalfX + 0.05, 0, Math.PI / 2, envHalfZ * 2],
  ])
    envMatrices.push(matrixFor(x, stripY, z, length, 0.05, 0.05, rotation));
  const envLedMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(LED_COLOR).multiplyScalar(6),
  });
  const envLeds = new THREE.InstancedMesh(
    unitBox,
    envLedMaterial,
    envMatrices.length,
  );
  envMatrices.forEach((matrix, index) => envLeds.setMatrixAt(index, matrix));
  envScene.add(envRoom, envFloor, envLeds);
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(envScene, 0.015, 0.1, 60, {
    position: new THREE.Vector3(0, 1, 0),
  });
  generator.dispose();
  envRoom.geometry.dispose();
  envRoom.material.dispose();
  envFloor.geometry.dispose();
  envFloor.material.dispose();
  envLedMaterial.dispose();
  envLeds.dispose();
  return { group, environment };
}

export function createCarScene(
  container,
  { onSelectPart, onError, onLoadStart, onLoad } = {},
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minPolarAngle = Math.PI * 0.36;
  controls.autoRotateSpeed = 1;
  let baseMinDistance = 4;
  let baseMaxDistance = 10;
  const { group: studio, environment } = buildGarage(renderer);
  scene.environment = environment.texture;
  scene.environmentIntensity = 1;
  scene.add(new THREE.HemisphereLight(0xf2f5ff, 0x2a2a2c, 1.1));
  const light = new THREE.DirectionalLight(0xf6f8ff, 2.6);
  light.position.set(1.5, 8, 2.5);
  scene.add(light);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = -5;
  light.shadow.camera.right = 5;
  light.shadow.camera.top = 5;
  light.shadow.camera.bottom = -5;
  light.shadow.radius = 6;
  light.shadow.normalBias = 0.035;
  light.shadow.bias = -0.0001;
  const fill = new THREE.DirectionalLight(0xe4ecff, 1.1);
  fill.position.set(-4, 3, -4);
  scene.add(fill);
  const front = new THREE.DirectionalLight(0xffffff, 0.9);
  front.position.set(5, 2.5, 6);
  scene.add(front);
  scene.add(studio);
  let colors = { ...DEFAULT_COLORS };
  let materials = Object.fromEntries(PARTS.map(({ id }) => [id, 'gloss']));
  let flips = {};
  let model;
  let disposed = false;
  let frame = 0;
  let visible = true;
  let currentView = 'perspective';
  let vehicleId = 'bmw';
  let loadVersion = 0;
  let pointerStart;
  const paintMaterials = [];
  const solidMaterials = new Map();
  const raycaster = new THREE.Raycaster();
  const uniforms = {
    wrapColors: { value: PARTS.map(() => new THREE.Color()) },
    wrapFlips: { value: PARTS.map(() => new THREE.Color()) },
    wrapParams: { value: PARTS.map(() => new THREE.Vector4()) },
    wrapFx: { value: PARTS.map(() => new THREE.Vector4()) },
  };
  uniforms.wrap_roadster = { value: false };
  uniforms.wrap_mirror_zone = { value: true };
  const draco = new DRACOLoader();
  draco.setDecoderPath('/decoders/');
  draco.setWorkerLimit(2);
  const loader = new GLTFLoader()
    .setDRACOLoader(draco)
    .setMeshoptDecoder(MeshoptDecoder);
  const loading = document.createElement('div');
  loading.className = 'model-loading';
  loading.setAttribute('role', 'status');
  loading.innerHTML =
    '<span class="eyebrow">LOADING REAL VEHICLE</span><strong>BMW M4 Competition</strong><progress max="100" value="0"></progress><small>Preparing the detailed 3D model...</small>';
  let loadingPercentage = null;
  function translateLoading() {
    loading.querySelector('.eyebrow').textContent = t('LOADING REAL VEHICLE');
    loading.querySelector('small').textContent =
      loadingPercentage === null
        ? t('Preparing the detailed 3D model...')
        : t('{percentage}% downloaded', { percentage: loadingPercentage });
  }
  translateLoading();
  container.append(loading);

  function schedule() {
    if (!disposed && visible && !document.hidden && !frame)
      frame = requestAnimationFrame(render);
  }
  function render() {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const moving = controls.update();
    renderer.render(scene, camera);
    if (moving || controls.autoRotate) schedule();
  }
  function view(name = currentView) {
    const directions = {
      perspective: [0.67, 0.07, 0.83],
      side: [0, 0.06, 1],
      front: [1, 0.06, 0],
      rear: [-1, 0.06, 0],
    };
    if (!directions[name]) throw new RangeError(`Unknown view: ${name}`);
    currentView = name;
    const direction = new THREE.Vector3(...directions[name]).normalize();
    camera.fov = 34;
    const horizontalFov =
      2 *
      Math.atan(
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect,
      );
    let distance = Math.max(7.5, 2.9 / Math.tan(horizontalFov / 2));
    // Stay inside the garage on narrow screens by widening the lens instead.
    if (distance > MAX_CAMERA_DISTANCE) {
      distance = MAX_CAMERA_DISTANCE;
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(2.9 / distance / camera.aspect),
      );
    }
    camera.updateProjectionMatrix();
    controls.target.set(0, 0.95, 0);
    camera.position.copy(controls.target).addScaledVector(direction, distance);
    baseMinDistance = distance * 0.55;
    baseMaxDistance = Math.max(
      distance,
      Math.min(distance * 1.35, MAX_CAMERA_DISTANCE + 0.4),
    );
    limitOrbit();
    controls.update();
    schedule();
  }
  // Keeps the orbiting camera under the LED ceiling when looking from above.
  function limitOrbit() {
    const clearance = GARAGE.height - 0.6 - controls.target.y;
    controls.maxDistance = Math.min(
      baseMaxDistance,
      clearance / Math.max(Math.cos(controls.getPolarAngle()), 1e-3),
    );
    controls.minDistance = Math.min(baseMinDistance, controls.maxDistance);
  }
  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view();
  }
  controls.addEventListener('change', limitOrbit);
  controls.addEventListener('change', schedule);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    schedule();
  });
  intersectionObserver.observe(container);
  document.addEventListener('visibilitychange', schedule);
  resize();

  function applyColors() {
    PARTS.forEach(({ id }, index) => {
      const preset = MATERIALS[materials[id]] ?? MATERIALS.gloss;
      uniforms.wrapColors.value[index].set(colors[id]);
      uniforms.wrapFlips.value[index].set(flips[id] ?? colors[id]);
      uniforms.wrapParams.value[index].set(
        preset.roughness,
        preset.metalness,
        preset.clearcoat,
        preset.clearcoatRoughness,
      );
      uniforms.wrapFx.value[index].set(
        preset.flake ?? 0,
        preset.iridescence ?? 0,
        preset.pattern ?? 0,
        flips[id] ? 1 : 0,
      );
    });
    schedule();
  }
  // One physically based wrap film material; the shader reads each part's
  // colour and finish from shared uniforms, so recolouring needs no recompiles.
  function createWrapMaterial(part, { map = null, mirrorsOnly = false } = {}) {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map,
      side: THREE.DoubleSide,
      clearcoat: 1,
      iridescence: 1,
      iridescenceIOR: 1.6,
      iridescenceThicknessMinimum: 220,
      iridescenceThicknessMaximum: 560,
    });
    material.defines = {
      WRAP_PART: part === 'body' ? -1 : PART_INDEX[part],
      ...(mirrorsOnly ? { WRAP_MIRRORS_ONLY: '' } : {}),
    };
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 wrapPosition;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nwrapPosition = position;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>\n${WRAP_SHADER_COMMON}`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>\n${WRAP_SHADER_COLOR}`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          '#include <roughnessmap_fragment>\nroughnessFactor = clamp(wrapRoughness, 0.04, 1.0);',
        )
        .replace(
          '#include <metalnessmap_fragment>',
          '#include <metalnessmap_fragment>\nmetalnessFactor = wrapP.y;',
        )
        .replace(
          '#include <normal_fragment_maps>',
          `#include <normal_fragment_maps>\n${WRAP_SHADER_NORMAL}`,
        )
        .replace(
          '#include <lights_physical_fragment>',
          `#include <lights_physical_fragment>
          #ifdef USE_CLEARCOAT
            material.clearcoat = wrapP.z;
            material.clearcoatRoughness = clamp(wrapP.w, 0.0525, 1.0);
          #endif
          #ifdef USE_IRIDESCENCE
            material.iridescence = wrapF.y;
          #endif`,
        );
    };
    material.customProgramCacheKey = () =>
      mirrorsOnly
        ? 'wrap-mirror-caps-v1'
        : `wrap-film-v2-${part}-${map ? 'map' : 'plain'}`;
    return material;
  }
  function paintBody(mesh, mirrorsOnly = false) {
    const material = createWrapMaterial('body', { mirrorsOnly });
    mesh.material = material;
    mesh.userData.partId = 'body';
    paintMaterials.push(material);
  }
  const disposeModel = (object) => {
    const materials = new Set();
    const textures = new Set();
    object.traverse((child) => {
      child.geometry?.dispose();
      for (const material of child.material
        ? Array.isArray(child.material)
          ? child.material
          : [child.material]
        : []) {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
      }
    });
    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
  };

  function loadVehicle(id) {
    vehicleId = id;
    const vehicle = VEHICLES.find((item) => item.id === id);
    uniforms.wrap_roadster.value = Boolean(vehicle.roadster);
    // The approximate mirror region only fits low sports cars; explicit mirror
    // materials or `mirrorZone: false` disable it.
    const mirrorZone = !vehicle.mirrors?.length && vehicle.mirrorZone !== false;
    uniforms.wrap_mirror_zone.value = mirrorZone;
    const version = ++loadVersion;
    if (model) {
      scene.remove(model);
      disposeModel(model);
      model = null;
    }
    paintMaterials.length = 0;
    solidMaterials.clear();
    onLoadStart?.(id);
    loading.querySelector('strong').textContent =
      `${vehicle.brand} ${vehicle.model}`;
    loading.querySelector('progress').value = 0;
    loadingPercentage = null;
    translateLoading();
    container.append(loading);
    schedule();
    loader.load(
      `/models/${vehicle.file}.glb`,
      (gltf) => {
        if (disposed || version !== loadVersion) {
          disposeModel(gltf.scene);
          return;
        }
        const source = gltf.scene;
        const excluded = [];
        source.traverse((child) => {
          if (vehicle.exclude?.includes(child.material?.name))
            excluded.push(child);
        });
        excluded.forEach((child) => {
          child.removeFromParent();
          disposeModel(child);
        });
        source.rotation.y = vehicle.rotation ?? Math.PI / 2;
        source.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(source);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 4.85 / size.x;
        const normalize = new THREE.Matrix4().makeScale(scale, scale, scale);
        const offset = new THREE.Matrix4().makeTranslation(
          -center.x,
          -bounds.min.y,
          -center.z,
        );
        normalize.multiply(offset);
        const root = new THREE.Group();
        const sourceMaterials = new Set();
        source.traverse((child) => {
          if (!child.isMesh) return;
          const original = child.material;
          sourceMaterials.add(original);
          const geometry = child.geometry.clone();
          // Quantized attributes must be expanded before world-space baking.
          for (const attributeName of ['position', 'normal', 'tangent']) {
            const attribute = geometry.getAttribute(attributeName);
            if (!attribute || attribute.array instanceof Float32Array) continue;
            const values = new Float32Array(
              attribute.count * attribute.itemSize,
            );
            for (let vertex = 0; vertex < attribute.count; vertex++) {
              for (
                let component = 0;
                component < attribute.itemSize;
                component++
              ) {
                values[vertex * attribute.itemSize + component] =
                  attribute.getComponent(vertex, component);
              }
            }
            geometry.setAttribute(
              attributeName,
              new THREE.Float32BufferAttribute(values, attribute.itemSize),
            );
          }
          const mesh = new THREE.Mesh(
            geometry.applyMatrix4(
              normalize.clone().multiply(child.matrixWorld),
            ),
            original.clone(),
          );
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          const name = original.name.toLowerCase();
          const bodyMaterial = vehicle.paint?.includes(original.name);
          const explicitPart =
            vehicle.meshParts?.[child.name] ??
            ['hood', 'roof', 'mirrors', 'wheels', 'accents'].find((part) =>
              vehicle[part]?.includes(original.name),
            );
          if (bodyMaterial) {
            mesh.material.dispose();
            paintBody(mesh);
          } else if (explicitPart) {
            mesh.material.dispose();
            mesh.material = createWrapMaterial(explicitPart, {
              map: explicitPart === 'wheels' ? original.map : null,
            });
            mesh.userData.partId = explicitPart;
            const materials = solidMaterials.get(explicitPart) ?? [];
            materials.push(mesh.material);
            solidMaterials.set(explicitPart, materials);
          } else if (
            id === 'lamborghini' &&
            name === 'carbon_r' &&
            (child.geometry.attributes.position.count > 10000 ||
              [938, 2297].includes(child.geometry.attributes.position.count))
          ) {
            mesh.material.dispose();
            paintBody(mesh);
          } else if (
            id === 'bmw' &&
            (name.includes('body151') ||
              name.includes('zx1') ||
              name.includes('livery1'))
          ) {
            mesh.material.dispose();
            paintBody(mesh);
          } else if (id === 'bmw' && name.includes('black161')) {
            mesh.material.dispose();
            paintBody(mesh, true);
          } else if (
            name.includes('m8rim') ||
            name.includes('chrome51') ||
            name.includes('piggrill') ||
            (id === 'lamborghini' &&
              ['material', 'crbn_jante', 'carbon_m', 'metal_c'].includes(name))
          ) {
            const part =
              name.includes('m8rim') ||
              (id === 'lamborghini' &&
                ['material', 'crbn_jante'].includes(name))
                ? 'wheels'
                : 'accents';
            mesh.material.dispose();
            mesh.material = createWrapMaterial(part);
            mesh.userData.partId = part;
            const materials = solidMaterials.get(part) ?? [];
            materials.push(mesh.material);
            solidMaterials.set(part, materials);
          }
          if (id === 'lamborghini' && ['cuir', 'cuir.001'].includes(name)) {
            mesh.material.color.set('#232323');
          }
          root.add(mesh);
        });
        model = root;
        scene.add(root);
        const retainedTextures = new Set();
        root.traverse((mesh) => {
          if (mesh.material)
            Object.values(mesh.material).forEach((value) => {
              if (value?.isTexture) retainedTextures.add(value);
            });
        });
        const unusedTextures = new Set();
        sourceMaterials.forEach((material) =>
          Object.values(material).forEach((value) => {
            if (value?.isTexture && !retainedTextures.has(value))
              unusedTextures.add(value);
          }),
        );
        unusedTextures.forEach((texture) => texture.dispose());
        source.traverse((child) => child.geometry?.dispose());
        sourceMaterials.forEach((material) => material.dispose());
        const shadowCanvas = document.createElement('canvas');
        shadowCanvas.width = shadowCanvas.height = 128;
        const context = shadowCanvas.getContext('2d');
        const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 64);
        gradient.addColorStop(0, '#00000055');
        gradient.addColorStop(1, '#00000000');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 128, 128);
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(6, 3),
          new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(shadowCanvas),
            transparent: true,
            depthWrite: false,
          }),
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.015;
        root.add(shadow);
        loading.remove();
        applyColors();
        view();
        const availableParts = new Set(solidMaterials.keys());
        const point = new THREE.Vector3();
        root.traverse((mesh) => {
          if (mesh.userData.partId !== 'body') return;
          const positions = mesh.geometry.getAttribute('position');
          const mirrorsOnly =
            mesh.material.customProgramCacheKey() === 'wrap-mirror-caps-v1';
          for (let vertex = 0; vertex < positions.count; vertex++) {
            point.fromBufferAttribute(positions, vertex);
            const part = partAt(point, Boolean(vehicle.roadster), mirrorZone);
            if (!mirrorsOnly || part === 'mirrors') availableParts.add(part);
          }
        });
        onLoad?.(id, [...availableParts]);
      },
      (event) => {
        if (version === loadVersion && !disposed && event.total) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          loading.querySelector('progress').value = percentage;
          loadingPercentage = percentage;
          translateLoading();
        }
      },
      (error) => {
        if (!disposed && version === loadVersion) {
          loading.remove();
          onError?.(error);
        }
      },
    );
  }

  function pointerDown(event) {
    if (event.button === 0)
      pointerStart = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
      };
  }
  function pointerUp(event) {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const moved = Math.hypot(
      event.clientX - pointerStart.x,
      event.clientY - pointerStart.y,
    );
    pointerStart = null;
    if (moved > 6 || !model) return;
    const rect = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    const hit = raycaster.intersectObject(model, true)[0];
    if (hit?.object.userData.partId)
      onSelectPart?.(
        hit.object.userData.partId === 'body'
          ? partAt(
              hit.point,
              Boolean(
                VEHICLES.find((vehicle) => vehicle.id === vehicleId).roadster,
              ),
              uniforms.wrap_mirror_zone.value,
            )
          : hit.object.userData.partId,
      );
  }
  const pointerCancel = () => {
    pointerStart = null;
  };
  renderer.domElement.addEventListener('pointerdown', pointerDown);
  renderer.domElement.addEventListener('pointerup', pointerUp);
  renderer.domElement.addEventListener('pointercancel', pointerCancel);

  return {
    translateLoading,
    setVehicle(id) {
      if (!VEHICLES.some((item) => item.id === id))
        throw new RangeError(`No real model is available for ${id}.`);
      if (id !== vehicleId || loadVersion === 0 || !model) loadVehicle(id);
    },
    // colors: part -> hex; nextMaterials: part -> MATERIALS key;
    // nextFlips: part -> second hex for colour-flip films.
    setColors(nextColors, nextMaterials = materials, nextFlips = {}) {
      for (const { id } of PARTS) {
        if (!/^#[0-9a-f]{6}$/i.test(nextColors[id]))
          throw new TypeError(`Invalid color for ${id}.`);
        if (!MATERIALS[nextMaterials[id]])
          throw new RangeError(`Unknown material for ${id}.`);
      }
      colors = { ...nextColors };
      materials = { ...nextMaterials };
      flips = { ...nextFlips };
      applyColors();
    },
    setView: view,
    resetView() {
      view('perspective');
    },
    setAutoRotate(enabled) {
      controls.autoRotate = Boolean(enabled);
      schedule();
    },
    download(filename) {
      if (!model) throw new Error('The vehicle is still loading.');
      renderer.render(scene, camera);
      const anchor = document.createElement('a');
      anchor.download = filename;
      anchor.href = renderer.domElement.toDataURL('image/png');
      anchor.click();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', schedule);
      renderer.domElement.removeEventListener('pointerdown', pointerDown);
      renderer.domElement.removeEventListener('pointerup', pointerUp);
      renderer.domElement.removeEventListener('pointercancel', pointerCancel);
      controls.removeEventListener('change', schedule);
      controls.removeEventListener('change', limitOrbit);
      controls.dispose();
      if (model) disposeModel(model);
      studio.traverse((child) => child.isInstancedMesh && child.dispose());
      disposeModel(studio);
      light.shadow.dispose();
      environment.dispose();
      draco.dispose();
      renderer.dispose();
      loading.remove();
      renderer.domElement.remove();
    },
  };
}
