export interface GeoFSAnimationValues {
  kias?: number;
  mach?: number;
  altitude?: number;
  haglFeet?: number;
  verticalSpeed?: number;
  heading360?: number;
  loadFactor?: number;
  aoa?: number;
  groundSpeedKnt?: number;
  groundSpeed?: number;
  rpm?: number;
  reverser?: number | boolean;
  parkingBrake?: number | boolean;
  gearPosition?: number;
  lights?: number | boolean;
  flapsTarget?: number;
  flapsPosition?: number;
  pitch?: number;
  roll?: number;
  NAVGlideAngleDeviation?: number;
  NAVVNAV?: boolean;
  airbrakesPosition?: number;
  [key: string]: unknown;
}

export interface GeoFSSound {
  id: string;
  file: string;
  effects?: Record<string, { value?: string; ratio?: number; offset?: number; ramp?: number[]; lastValue?: unknown }>;
  playing?: boolean;
  loading?: boolean;
  loaded?: boolean;
  loop?: boolean;
}

export interface GeoFSAircraftDefinition {
  sounds?: GeoFSSound[];
  Vspeeds?: Record<string, number>;
  name?: string;
  externalName?: string;
  mass?: number;
  maxThrust?: number;
  maxRPM?: number;
  engineInertia?: number;
  flapsSteps?: number;
  flapsPositions?: number[];
  hasGear?: boolean;
  gearPositions?: number[];
  hasAirbrakes?: boolean;
  reverseThrust?: boolean;
  reverse?: boolean;
  maxAltitude?: number;
  zeroThrustAltitude?: number;
  zeroRPMAltitude?: number;
  inertiaTensor?: unknown;
  tensorFactor?: unknown;
  parts?: Array<{ animations?: Array<{ value?: string; offset?: number; lt?: unknown; [key: string]: unknown }>; [key: string]: unknown }>;
  [key: string]: unknown;
}

export interface GeoFSEnginePart {
  thrust?: number;
  afterBurnerThrust?: number;
  reverseThrust?: number;
  torque?: number;
  lift?: number;
  [key: string]: unknown;
}

interface GeoFSParticleEmitter {
  destroy: () => void;
}

export interface GeoFSEngine {
  points?: { contrailAnchor?: unknown };
  object3d?: { worldPosition?: [number, number, number] };
  thrust?: number;
  on?: boolean;
  [key: string]: unknown;
}

export interface GeoFSAircraftInstance {
  id?: string | number;
  name?: string;
  suspensions?: Array<{ name?: string; collisionPoints?: Array<[number, number, number]> }>;
  airfoils?: Array<{ name?: string; propwash?: number; forceDirection?: number; object3d?: { _scale?: [number, number, number] } }>;
  groundContact?: boolean;
  crashed?: boolean;
  crash?: () => void;
  animationValue?: Record<string, unknown>;
  stalling?: boolean;
  trueAirSpeed?: number;
  collisionPoints?: Array<{ worldPosition?: [number, number, number] }>;
  cockpitSetup?: { parts?: Array<{ object3d?: { _scale?: [number, number, number] } }> };
  object3d?: { worldRotation?: Array<[number, number, number]> };
  llaLocation?: [number, number, number];
  engines?: GeoFSEngine[];
  engine?: GeoFSEngine;
  parts?: Record<string, GeoFSEnginePart>;
  definition?: GeoFSAircraftDefinition;
  setup?: {
    mass?: number;
    parts?: Array<{
      centerOfMass?: [number, number, number];
      animations?: Array<{ value?: string; offset?: number; [key: string]: unknown }>;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
  aircraftRecord?: { id?: string | number; name?: string; [key: string]: unknown };
  rigidBody?: {
    mass?: number;
    applyTorque?: (torque: [number, number, number]) => void;
    applyTorqueImpulse?: (torque: [number, number, number]) => void;
    applyCentralImpulse?: (impulse: [number, number, number]) => void;
    getAngularVelocity?: () => [number, number, number];
    setAngularVelocity?: (velocity: [number, number, number]) => void;
    setMassProps?: (mass: number, inertia: unknown) => void;
    linearVelocity?: [number, number, number];
    [key: string]: unknown;
  };
  startEngine?: () => void;
  startEngines?: () => void;
  stopEngines?: () => void;
  stopEngine?: () => void;
  setFlaps?: (step: number) => void;
  [key: string]: unknown;
}

export interface GeoFSPositionControl {
  position?: number;
  target?: number;
  positionTarget?: number;
  delta?: number;
}

export interface GeoFSInstruments {
  update?: (...args: unknown[]) => unknown;
  hide?: () => void;
  show?: () => void;
  visible?: boolean;
}

export interface GeoFSControls {
  axisSetters?: { throttle?: { process?: (...args: unknown[]) => unknown } };
  throttle?: number;
  throttleLeft?: number;
  throttleRight?: number;
  throttle1?: number;
  throttle2?: number;
  throttle3?: number;
  throttle4?: number;
  reversers?: boolean;
  flaps?: GeoFSPositionControl;
  airbrakes?: GeoFSPositionControl;
  brakes?: number;
  elevatorTrim?: number;
  elevatorTrimMin?: number;
  manipulatorSetters?: {
    setThrottle?: (val: number) => void;
  };
  setters?: {
    setFlaps?: { set?: () => void };
    setGear?: { set?: () => void };
    setAirbrakes?: { set?: () => void };
  };
  [key: string]: unknown;
}

export interface GeoFSThrottlePid {
  initialize?: (output: number, input: number) => void;
  set: (setpoint: number, min: number, max: number) => void;
  compute: (input: number, dt: number) => number;
}

export interface GeoFSGlobal {
  version?: string | number;
  isPaused?: () => boolean;
  autopilot?: {
    on?: boolean;
    turnOff?: () => void;
    speedMode?: string;
    values?: { speed?: number };
    setSpeed?: (speed: number) => void;
    setSpeedMode?: (mode: string) => void;
    PIDs?: { throttle?: GeoFSThrottlePid };
  };
  aircraft?: {
    instance?: GeoFSAircraftInstance;
  };
  camera?: { lla?: [number, number, number]; translate?: (x: number, y: number, z: number) => void };
  preferences?: { crashDetection?: boolean };
  flyToCamera?: () => void;
  cautiousWithTerrain?: boolean;
  fx?: {
    ParticleEmitter?: new (options: Record<string, unknown>) => GeoFSParticleEmitter;
    particles?: Record<string, {
      _emitter?: GeoFSParticleEmitter;
      setColor?: (color: unknown) => void;
      destroy: () => void;
    }>;
  };
  runways?: {
    nearRunways?: Record<string, { icao?: string }>;
    modelVisibility?: number | boolean;
    setRunwayModelVisibility?: (visible: number | boolean) => void;
    getNearestRunway?: (location: [number, number, number]) => {
      aimingPointLla1?: [number, number, number];
      aimingPointLla2?: [number, number, number];
    } | undefined;
  };
  aircraftList?: Record<string, { name?: string; [key: string]: unknown }>;
  animation?: {
    values?: GeoFSAnimationValues;
  };
  api?: {
    hdOn?: boolean;
    renderingSettings?: { physicsDeltaMs?: number; degradedCollisions?: boolean; lowResRunways?: boolean };
    imageryProvider?: unknown;
    viewer?: {
      scene?: {
        canvas?: HTMLCanvasElement;
        postProcessStages?: {
          add?: (stage: unknown) => unknown;
          remove?: (stage: unknown) => void;
        };
        camera?: unknown;
      };
      terrainProvider?: unknown;
    };
    addFrameCallback?: (cb: (dt?: number) => void) => number;
    removeFrameCallback?: (id: number) => void;
    setImageryProvider?: (provider: unknown, flag?: boolean) => void;
    renderingQuality?: () => void;
  };
  environment?: {
    time?: number;
    sunElevation?: number;
    metar?: { raw?: string; clouds?: number; visibility?: number; temp?: number };
  };
  utils?: {
    now?: () => number;
    machToKnots?: (mach: number) => number;
    distanceBetweenLocations?: (a: [number, number, number], b: [number, number, number]) => number;
  };
  [key: string]: unknown;
}

export interface GeoFSCartesian {
  x: number;
  y: number;
  z: number;
}

declare global {
  interface Window {
    geofs?: GeoFSGlobal;
    componentHandler?: {
      upgradeElement: (element: Element) => void;
      downgradeElements?: (elements: Element[]) => void;
    };
    audio?: {
      on?: boolean;
      sounds?: Record<string, GeoFSSound>;
      soundplayer?: { stopSound?: (sound: GeoFSSound) => void };
    };
    weather?: { localTime?: number; currentWindSpeed?: number; definition?: { turbulences?: number } };
    multiplayer?: {
      visibleUsers?: Record<string, { distance?: number; referencePoint?: { lla?: [number, number, number] } }>;
    };
    instruments?: GeoFSInstruments;
    controls?: GeoFSControls;
    Cesium?: {
      Color?: new (r: number, g: number, b: number, a: number) => unknown;
      PostProcessStage?: new (opts: { fragmentShader: string; uniforms?: Record<string, unknown> }) => unknown;
      UrlTemplateImageryProvider?: new (opts: { url: string; maximumLevel?: number; credit?: unknown }) => unknown;
      BingMapsImageryProvider?: new (opts: { url?: string; key: string; mapStyle?: string }) => unknown;
      Credit?: new (text: string, showOnScreen?: boolean) => unknown;
      Cartesian3?: { fromDegrees?: (lon: number, lat: number, alt: number) => GeoFSCartesian };
      SceneTransforms?: {
        wgs84ToWindowCoordinates?: (scene: unknown, pos: GeoFSCartesian) => { x: number; y: number } | undefined;
        worldToWindowCoordinates?: (scene: unknown, pos: GeoFSCartesian) => { x: number; y: number } | undefined;
      };
      [key: string]: unknown;
    };
  }
}
