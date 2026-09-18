export type PathPoint = {
  x: number;
  y: number;
  t: number;
};

export type Spec = {
  version: 1;
  name: string;
  durationMs: number;
  loop: true;
  path: PathPoint[];
};

export type SketchSample = {
  x: number;
  y: number;
  timeMs: number;
};
