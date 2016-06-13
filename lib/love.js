'use babel';
import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';
const self = '[build-love]';
const debug = atom.config.get('build-love.debug');

export function provideLove() {
  return class LoveProvider {

    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'Build-Love';
    }

    isEligible() {
      try {
        fs.accessSync(path.join(this.cwd, 'main.lua'));
        return true;
      } catch (e) {
        return false;
      }
    }

    settings() {
      const errorMatch = [
        'Error: Syntax error: (?<file>[^:]+):(?<line>[^:]+): (?<message>.+)', // Syntax Error
        '.*Error: (?<file>[^:]+):(?<line>[^:]+): (?<message>.+)' // Runtime Error
      ];
      return [
        {
          name: 'Run with Love',
          exec: 'love',
          args: ['.'],
          cwd: this.cwd,
          atomCommandName: 'love:run-with-love',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
