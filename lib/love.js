'use babel';
import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import {exec} from 'child_process';
const self = '[build-love]';
const debug = atom.config.get('build-love.debug');

const config = {
  lovecmd: {
    title: 'LOVE Command',
    Description: 'Command to execute LOVE.',
    type: 'string',
    default: 'love'
  }
};

// Force atom-build to reconsume the build-love settings on config change.
atom.config.onDidChange('build-love.lovecmd', function () {
  atom.commands.dispatch(atom.views.getView(atom.workspace), 'build:refresh-targets');
});

const provideLove = function () {
  return class LoveProvider extends EventEmitter {
    constructor(cwd) {
      super();
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

      const cmd = atom.config.get('build-love.lovecmd');
      return [
        {
          name: 'Run with LOVE',
          exec: cmd,
          args: ['.'],
          cwd: this.cwd,
          atomCommandName: 'love:run-with-love',
          errorMatch: errorMatch
        }
      ];
    }
  };
};

module.exports = {
  config: config,
  provideLove: provideLove
};
