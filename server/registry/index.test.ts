import * as fs from 'fs';
import * as crypto from 'crypto';

import route from './index';

it('creates the tar', async () => {
  const version = {
    version: '1.0.0',
    npm_dependencies: { test: '1.0.0 '},
    sandbox: {
      slug: 'test'
    },
    source: {
      directories: [{
        id: 1,
        directory_id: null,
        title: 'directory'
      }],
      modules: [{
        directory_id: 1,
        title: 'firstmodule.js',
        code: 'const hey = \'hello world\'',
      }]
    }
  };

  await route({ request: { body: version } });

  expect(fs.readFileSync('public/registry/anonymous-test-1.0.0.tgz')).toBeTruthy();
});

it('responds correctly', async () => {
  const version = {
    version: '1.0.0',
    npm_dependencies: { test: '1.0.0 '},
    sandbox: {
      slug: 'test'
    },
    source: {
      directories: [{
        id: 1,
        directory_id: null,
        title: 'directory'
      }],
      modules: [{
        directory_id: 1,
        title: 'firstmodule.js',
        code: 'const hey = \'hello world\'',
      }]
    }
  };

  const ctx = { request: { body: version } };

  await route(ctx);

  expect(ctx.body.shasum).toBeTruthy();
  expect(ctx.body.tarball).toBeTruthy();
});

it('generates correct shasum', async () => {
  const version = {
    version: '1.0.0',
    npm_dependencies: { test: '1.0.0 '},
    sandbox: {
      slug: 'test'
    },
    source: {
      directories: [{
        id: 1,
        directory_id: null,
        title: 'directory'
      }],
      modules: [{
        directory_id: 1,
        title: 'firstmodule.js',
        code: 'const hey = \'hello world\'',
      }]
    }
  };

  const ctx = { request: { body: version } };

  await route(ctx);

  const file = fs.readFileSync('public/registry/anonymous-test-1.0.0.tgz');
  const shasum = crypto.createHash('sha1').update(file).digest('hex');

  expect(ctx.body.shasum).toEqual(shasum);
});
