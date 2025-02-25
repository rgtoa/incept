import type { ServerConfig } from '@stackpress/incept/dist/types';
import type { LanguageConfig } from '@stackpress/incept-i18n/dist/types';
import type { DatabaseConfig } from '@stackpress/incept-inquire/dist/types';
import type { SessionConfig } from '@stackpress/incept-user/dist/types';
import type { TemplateConfig } from '@stackpress/incept-ink/dist/types';
import type { AdminConfig } from '@stackpress/incept-admin/dist/types';
import type { APIConfig } from '@stackpress/incept-api/dist/types';
import type { EmailConfig } from '@stackpress/incept-email/dist/types';

import path from 'path';

const cwd = process.cwd();
const seed = process.env.SESSION_SEED || 'abc123';
const environment = process.env.NODE_ENV || 'development';

export type Config = ServerConfig 
  & DatabaseConfig
  & LanguageConfig 
  & TemplateConfig 
  & SessionConfig 
  & AdminConfig
  & APIConfig
  & EmailConfig;

export const config: Config = {
  idea: { 
    lang: 'js',
    revisions: path.join(cwd, 'revisions')
  },
  server: {
    port: 3000,
    cwd: cwd,
    mode: environment,
    bodySize: 0
  },
  database: {
    migrations: path.join(cwd, 'migrations'),
    schema: {
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT'
    }
  },
  template: {
    engine: 'ink',
    config: {
      brand: '',
      minify: environment !== 'development',
      serverPath: path.join(cwd, 'build/template'),
      manifestPath: path.join(cwd, 'build/template/manifest.json'),
      cwd: environment === 'development' 
        ? path.join(cwd, 'src')
        : path.join(cwd, 'dist'),
      dev: { 
        buildRoute: '/client',
        socketRoute: '/__ink_dev__'
      }
    },
    templates: []
  },
  email: {
    host: 'smtp.example.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: 'username',
      pass: 'password',
    }
  },
  session: {
    name: 'session',
    seed: seed,
    access: {
      ADMIN: [
        { method: 'GET', route: '/build/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/admin/**' },
        { method: 'ALL', route: '/api/**' }
      ],
      USER: [
        { method: 'GET', route: '/build/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/api/**' }
      ],
      GUEST: [
        { method: 'GET', route: '/build/**' },
        { method: 'GET', route: '/__ink_dev__' },
        { method: 'GET', route: '/dev.js' },
        { method: 'GET', route: '/images/**' },
        { method: 'GET', route: '/styles/**' },
        { method: 'GET', route: '/favicon.ico' },
        { method: 'GET', route: '/favicon.png' },
        { method: 'ALL', route: '/' },
        { method: 'ALL', route: '/auth/**' },
        { method: 'ALL', route: '/api/**' }
      ]
    },
    auth: {
      name: 'Incept',
      logo: '/images/incept-logo-long.png',
      '2fa': {},
      captcha: {},
      roles: [ 'USER' ],
      username: true,
      email: true,
      phone: true,
      password: {
        min: 8,
        max: 32,
        upper: true,
        lower: true,
        number: true,
        special: true
      }
    }
  },
  cookie: { path: '/' },
  admin: {
    root: '/admin',
    menu: [
      {
        name: 'Profiles',
        icon: 'user',
        path: '/admin/profile/search',
        match: '/admin/profile'
      },
      {
        name: 'Files',
        icon: 'file',
        path: '/admin/file/search',
        match: '/admin/file'
      },
      {
        name: 'Addresses',
        icon: 'map-marker',
        path: '/admin/address/search',
        match: '/admin/address'
      },
      {
        name: 'Auth',
        icon: 'lock',
        path: '/admin/auth/search',
        match: '/admin/auth'
      },
      {
        name: 'Connections',
        icon: 'users',
        path: '/admin/connection/search',
        match: '/admin/connection'
      },
      {
        name: 'Apps',
        icon: 'laptop',
        path: '/admin/application/search',
        match: '/admin/application'
      },
      {
        name: 'Sessions',
        icon: 'coffee',
        path: '/admin/session/search',
        match: '/admin/session'
      }
    ]
  },
  api: {
    expires: 1000 * 60 * 60 * 24 * 365,
    scopes: {
      'user': { 
        name: 'User API Service',
        description: 'Profile Endpoints' 
      }
    },
    endpoints: [
      //Auth Endpoints
      {
        method: 'GET',
        route: '/api/auth/search',
        type: 'public',
        event: 'auth-search',
        data: {}
      },
      //Profile Endpoints
      {
        method: 'GET',
        route: '/api/profile/search',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-search',
        data: {}
      },
      {
        method: 'GET',
        route: '/api/profile/detail/:id',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      },
      {
        method: 'GET',
        route: '/api/profile/get/:key/:value',
        type: 'app',
        scopes: [ 'user' ],
        event: 'profile-get',
        data: {}
      },
      //Address Endpoints
      {
        method: 'GET',
        route: '/api/my/address',
        type: 'session',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      },
      //File Endpoints
      {
        method: 'GET',
        route: '/api/my/files',
        type: 'session',
        scopes: [ 'user' ],
        event: 'profile-detail',
        data: {}
      }
    ]
  },
  languages: {
    en_US: {
      label: 'EN',
      translations: {
        'Sign In': 'Signin'
      }
    },
    th_TH: {
      label: 'TH',
      translations: {
        'Sign In': 'Signin'
      }
    }
  }
};