import { describe, test, expect, beforeEach } from '@jest/globals';
import { config, defaultConfig } from '../../dist/config/index.js';

describe('Config', () => {
  test('has default generator levels', () => {
    const levels = config.get<Record<string, number>>('generator.levels');
    expect(levels).toBeDefined();
    expect(levels?.easy).toBe(35);
    expect(levels?.medium).toBe(45);
    expect(levels?.hard).toBe(65);
    expect(levels?.evil).toBe(75);
  });

  test('has default trial goal ratio', () => {
    const ratio = config.get<number>('generator.trialGoalRatio');
    expect(ratio).toBe(0.24);
  });

  test('has default solver timeout', () => {
    const timeout = config.get<number>('solver.defaultTimeout');
    expect(timeout).toBe(10000);
  });

  test('has default board size', () => {
    const boxSizeX = config.get<number>('board.defaultBoxSizeX');
    const boxSizeY = config.get<number>('board.defaultBoxSizeY');
    expect(boxSizeX).toBe(3);
    expect(boxSizeY).toBe(3);
  });

  test('has api config', () => {
    const port = config.get<number>('api.port');
    const host = config.get<string>('api.host');
    expect(port).toBeDefined();
    expect(host).toBeDefined();
  });

  test('getAll returns full config', () => {
    const all = config.getAll();
    expect(all.generator).toBeDefined();
    expect(all.solver).toBeDefined();
    expect(all.board).toBeDefined();
    expect(all.api).toBeDefined();
  });

  test('set updates config value', () => {
    config.set('solver.defaultTimeout', 5000);
    const timeout = config.get<number>('solver.defaultTimeout');
    expect(timeout).toBe(5000);
  });

  test('set creates nested path', () => {
    config.set('custom.value', 'test');
    const value = config.get<string>('custom.value');
    expect(value).toBe('test');
  });

  test('get returns undefined for invalid path', () => {
    const value = config.get<string>('invalid.path');
    expect(value).toBeUndefined();
  });

  test('has default config export', () => {
    expect(defaultConfig).toBeDefined();
    expect(defaultConfig.generator).toBeDefined();
  });
});
