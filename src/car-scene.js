import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { VEHICLES } from './vehicles.js';
import { t } from './i18n.js';
export { VEHICLES } from './vehicles.js';

export const PARTS = [
  { id: 'body', label: 'Body' },
  { id: 'hood', label: 'Hood' },
  { id: 'roof', label: 'Roof / rear deck' },
  { id: 'mirrors', label: 'Mirrors' },
  { id: 'wheels', label: 'Wheels' },
  { id: 'accents', label: 'Accents' },
];

const DEFAULT_COLORS = {
  body: '#e8e2d6',
  hood: '#e8e2d6',
  roof: '#151716',
  mirrors: '#151716',
  wheels: '#151716',
  accents: '#b4a086',
};
const FINISHES = {
  gloss: { roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.12 },
  satin: { roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 },
  matte: { roughness: 0.85, clearcoat: 0, clearcoatRoughness: 0.8 },
};

// Model-space regions provide conceptual panel previews on the combined body mesh.
function partAt(point, roadster = false) {
  if (roadster) {
    if (
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.minPolarAngle = Math.PI * 0.2;
  controls.autoRotateSpeed = 1;
  const room = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environment = generator.fromScene(room, 0.04);
  scene.environment = environment.texture;
  generator.dispose();
  room.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x55534b, 1));
  const light = new THREE.DirectionalLight(0xfff2de, 3);
  light.position.set(3, 7, 5);
  scene.add(light);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = -5;
  light.shadow.camera.right = 5;
  light.shadow.camera.top = 5;
  light.shadow.camera.bottom = -5;
  light.shadow.normalBias = 0.035;
  light.shadow.bias = -0.0001;
  const fill = new THREE.DirectionalLight(0xd9e8ff, 1);
  fill.position.set(-4, 3, -4);
  scene.add(fill);
  const studio = new THREE.Group();
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#e8e2d6',
    roughness: 0.88,
    metalness: 0,
  });
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#c9c2b5',
    roughness: 0.32,
    metalness: 0.12,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.012;
  floor.receiveShadow = true;
  studio.add(floor);
  const seamMaterial = new THREE.MeshBasicMaterial({ color: '#b6afa2' });
  const stripMaterial = new THREE.MeshBasicMaterial({ color: '#fffaf0' });
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: '#a8a296',
    roughness: 0.6,
  });
  for (let side = 0; side < 4; side++) {
    const wall = new THREE.Group();
    const surface = new THREE.Mesh(
      new THREE.BoxGeometry(26, 8, 0.15),
      wallMaterial,
    );
    surface.position.set(0, 4, -9);
    surface.receiveShadow = true;
    wall.add(surface);
    for (let x = -12; x <= 12; x += 3) {
      const seam = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 8, 0.025),
        seamMaterial,
      );
      seam.position.set(x, 4, -8.91);
      wall.add(seam);
    }
    for (const x of [-6, -3, 0, 3, 6]) {
      const mount = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 4.1, 0.08),
        frameMaterial,
      );
      mount.position.set(x, 3.15, -8.86);
      wall.add(mount);
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.085, 3.98, 0.025),
        stripMaterial,
      );
      strip.position.set(x, 3.15, -8.8);
      wall.add(strip);
    }
    const baseboard = new THREE.Mesh(
      new THREE.BoxGeometry(26, 0.14, 0.12),
      frameMaterial,
    );
    baseboard.position.set(0, 0.07, -8.82);
    wall.add(baseboard);
    wall.rotation.y = (side * Math.PI) / 2;
    studio.add(wall);
  }
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), wallMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = 8;
  studio.add(ceiling);
  for (const z of [-3.5, 0, 3.5]) {
    const softbox = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.05, 0.5),
      stripMaterial,
    );
    softbox.position.set(0, 7.9, z);
    studio.add(softbox);
  }
  scene.add(studio);
  let colors = { ...DEFAULT_COLORS };
  let finish = 'gloss';
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
  const uniforms = Object.fromEntries(
    ['body', 'hood', 'roof', 'mirrors'].map((part) => [
      `wrap_${part}`,
      { value: new THREE.Color(colors[part]) },
    ]),
  );
  uniforms.wrap_roadster = { value: false };
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
      perspective: [0.67, 0.2, 0.83],
      side: [0, 0.17, 1],
      front: [1, 0.16, 0],
      rear: [-1, 0.16, 0],
    };
    if (!directions[name]) throw new RangeError(`Unknown view: ${name}`);
    currentView = name;
    const direction = new THREE.Vector3(...directions[name]).normalize();
    const horizontalFov =
      2 *
      Math.atan(
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect,
      );
    const distance = Math.max(7.5, 2.9 / Math.tan(horizontalFov / 2));
    controls.target.set(0, 0.8, 0);
    camera.position.copy(controls.target).addScaledVector(direction, distance);
    controls.minDistance = distance * 0.55;
    controls.maxDistance = Math.min(distance * 1.35, 17);
    controls.update();
    schedule();
  }
  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    view();
  }
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
    for (const part of ['body', 'hood', 'roof', 'mirrors'])
      uniforms[`wrap_${part}`].value.set(colors[part]);
    for (const material of paintMaterials)
      Object.assign(material, FINISHES[finish]);
    for (const [part, materials] of solidMaterials) {
      for (const material of materials) {
        material.color.set(colors[part]);
        Object.assign(material, FINISHES[finish]);
      }
    }
    schedule();
  }
  function paintBody(mesh, mirrorsOnly = false) {
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      side: THREE.DoubleSide,
      ...FINISHES[finish],
    });
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
          `#include <common>
          varying vec3 wrapPosition;
          uniform vec3 wrap_body;
          uniform vec3 wrap_hood;
          uniform vec3 wrap_roof;
          uniform vec3 wrap_mirrors;
          uniform bool wrap_roadster;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          vec3 p = wrapPosition;
          vec3 wrapColor = wrap_body;
          if (p.x > 0.85 && p.y > 0.76 && abs(p.z) < 0.85) wrapColor = wrap_hood;
          if (p.y > 1.23 && p.x > -1.1 && p.x < 0.65) wrapColor = wrap_roof;
          if (abs(p.z) > 0.93 && p.y > 0.99 && p.x > 0.1 && p.x < 1.25) wrapColor = wrap_mirrors;
          if (wrap_roadster) {
            wrapColor = wrap_body;
            if (p.x > 0.65 && p.y > 0.5 && abs(p.z) < 0.8) wrapColor = wrap_hood;
            if (p.x < -0.45 && p.y > 0.7 && abs(p.z) < 0.8) wrapColor = wrap_roof;
            if (abs(p.z) > 0.98 && p.y > 0.7 && p.x > 0.1 && p.x < 1.1) wrapColor = wrap_mirrors;
          }
          diffuseColor.rgb *= wrapColor;`,
        );
      if (mirrorsOnly) {
        shader.fragmentShader = shader.fragmentShader
          .replace(
            'vec3 wrapColor = wrap_body;',
            'vec3 wrapColor = vec3(0.012);',
          )
          .replace('if (p.x > 0.85', 'if (false && p.x > 0.85')
          .replace('if (p.y > 1.23', 'if (false && p.y > 1.23');
      }
    };
    material.customProgramCacheKey = () =>
      mirrorsOnly ? 'wrap-mirror-caps-v1' : 'wrap-body-panels-v1';
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
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: colors[explicitPart],
              map: explicitPart === 'wheels' ? original.map : null,
              side: THREE.DoubleSide,
              metalness:
                explicitPart === 'wheels' || explicitPart === 'accents'
                  ? 0.7
                  : 0.2,
              ...FINISHES[finish],
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
            mesh.material = new THREE.MeshPhysicalMaterial({
              color: colors[part],
              side: THREE.DoubleSide,
              metalness: 0.7,
              ...FINISHES[finish],
            });
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
            const part = partAt(point, Boolean(vehicle.roadster));
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
    setColors(nextColors, nextFinish = finish) {
      if (!FINISHES[nextFinish])
        throw new RangeError(`Unknown finish: ${nextFinish}`);
      for (const { id } of PARTS) {
        if (!/^#[0-9a-f]{6}$/i.test(nextColors[id]))
          throw new TypeError(`Invalid color for ${id}.`);
      }
      colors = { ...nextColors };
      finish = nextFinish;
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
      controls.dispose();
      if (model) disposeModel(model);
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
