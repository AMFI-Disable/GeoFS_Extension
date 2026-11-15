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

export interface GeoFSAircraftDefinition {
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
  [key: string]: unknown;
}

export interface GeoFSEnginePart {
  thrust?: number;
  afterBurnerThrust?: number;
  reverseThrust?: number;
  torque?: number;
  [key: string]: unknown;
}

export interface GeoFSEngine {
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
  llaLocation?: [number, number, number];
  engines?: GeoFSEngine[];
  engine?: GeoFSEngine;
  parts?: Record<string, GeoFSEnginePart>;
  definition?: GeoFSAircraftDefinition;
  setup?: { mass?: number; parts?: Array<{ centerOfMass?: [number, number, number] }>; [key: string]: unknown };
  aircraftRecord?: { id?: string | number; name?: string; [key: string]: unknown };
  rigidBody?: {
    mass?: number;
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
  autopilot?: { on?: boolean; turnOff?: () => void; PIDs?: { throttle?: GeoFSThrottlePid } };
  aircraft?: {
    instance?: GeoFSAircraftInstance;
  };
  camera?: { lla?: [number, number, number]; translate?: (x: number, y: number, z: number) => void };
  preferences?: { crashDetection?: boolean };
  flyToCamera?: () => void;
  cautiousWithTerrain?: boolean;
  runways?: {
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
    weather?: { localTime?: number; definition?: { turbulences?: number } };
    instruments?: GeoFSInstruments;
    controls?: GeoFSControls;
    Cesium?: {
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
