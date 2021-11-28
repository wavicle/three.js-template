export interface Configuration {
  orbitControls: boolean;
  stats: boolean;
  gridHelper: boolean;
  defaultLights: {
    point: boolean;
    ambient: boolean;
    hemisphere: boolean;
  };
}

export const DEBUG_CONFIG: Configuration = {
  orbitControls: true,
  stats: true,
  gridHelper: true,
  defaultLights: {
    point: true,
    ambient: true,
    hemisphere: true,
  },
};

export const DEFAULT_CONFIG: Configuration = {
  orbitControls: false,
  stats: true,
  gridHelper: false,
  defaultLights: {
    point: true,
    ambient: true,
    hemisphere: true,
  },
};
