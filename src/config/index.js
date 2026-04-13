/**
 * @fileoverview Configuration management for SudokuSolver-API
 * @module config
 */

const defaultConfig = {
  generator: {
    levels: {
      easy: 35,
      medium: 45,
      hard: 65,
      evil: 75,
    },
    trialGoalRatio: 0.24,
    defaultTimeout: 10000,
  },
  solver: {
    defaultTimeout: 10000,
  },
  board: {
    defaultBoxSizeX: 3,
    defaultBoxSizeY: 3,
  },
  api: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
  },
};

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

class Config {
  #config;

  constructor() {
    this.#config = { ...defaultConfig };
    this.loadFromEnv();
  }

  loadFromEnv() {
    if (process.env.GENERATOR_TIMEOUT) {
      this.#config.generator.defaultTimeout = parseInt(process.env.GENERATOR_TIMEOUT, 10);
    }
    if (process.env.SOLVER_TIMEOUT) {
      this.#config.solver.defaultTimeout = parseInt(process.env.SOLVER_TIMEOUT, 10);
    }
    if (process.env.API_PORT) {
      this.#config.api.port = parseInt(process.env.API_PORT, 10);
    }
    if (process.env.API_HOST) {
      this.#config.api.host = process.env.API_HOST;
    }
  }

  get(path) {
    return getNestedValue(this.#config, path);
  }

  getAll() {
    return { ...this.#config };
  }

  set(path, value) {
    const keys = path.split('.');
    let current = this.#config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }
}

export const config = new Config();
export { defaultConfig };
