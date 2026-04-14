/**
 * @fileoverview Configuration management for SudokuSolver-API
 * @module config
 */

import type { GeneratorLevels } from '../types.js';

interface DefaultConfig {
  generator: {
    levels: GeneratorLevels;
    trialGoalRatio: number;
    defaultTimeout: number;
  };
  solver: {
    defaultTimeout: number;
  };
  board: {
    defaultBoxSizeX: number;
    defaultBoxSizeY: number;
  };
  api: {
    port: number;
    host: string;
    baseUrl: string;
    corsOrigin: string;
  };
}

const defaultConfig: DefaultConfig = {
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
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0',
    baseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
    corsOrigin: process.env.CORS_ORIGIN || '*',
  },
};

function getNestedValue<T>(obj: unknown, path: string): T | undefined {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj) as T | undefined;
}

class Config {
  #config: DefaultConfig;

  constructor() {
    this.#config = { ...defaultConfig };
    this.loadFromEnv();
  }

  loadFromEnv(): void {
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

  get<T>(path: string): T | undefined {
    return getNestedValue<T>(this.#config, path);
  }

  getAll(): DefaultConfig {
    return { ...this.#config };
  }

  set(path: string, value: unknown): void {
    const keys = path.split('.');
    let current: Record<string, unknown> = this.#config as unknown as Record<string, unknown>;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
  }
}

export const config = new Config();
export { defaultConfig };
