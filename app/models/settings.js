import * as db from '../common/database';

export const name = 'Settings';
export const type = 'Settings';
export const prefix = 'set';
export const canDuplicate = false;

export function init () {
  return {
    showPasswords: false,
    useBulkHeaderEditor: false,
    followRedirects: true,
    editorFontSize: 11,
    editorIndentSize: 2,
    editorLineWrapping: true,
    editorKeyMap: 'default',
    httpProxy: '',
    httpsProxy: '',
    noProxy: '',
    proxyConfiguration: 'auto',
    timeout: 0,
    validateSSL: true,
    forceVerticalLayout: false,
    autoHideMenuBar: false,
    theme: 'default',
    disableAnalyticsTracking: false
  };
}

export function migrate (doc) {
  doc = migrateProxyEnabled(doc)
  return doc;
}

export async function all () {
  const settings = await db.all(type);
  if (settings.length === 0) {
    return [await getOrCreate()];
  } else {
    return settings;
  }
}

export async function create (patch = {}) {
  return db.docCreate(type, patch);
}

export async function update (settings, patch) {
  return db.docUpdate(settings, patch);
}

export async function getOrCreate (patch = {}) {
  const results = await db.all(type);
  if (results.length === 0) {
    return await create(patch);
  } else {
    return results[0];
  }
}

// ~~~~~~~~~~ //
// Migrations //
// ~~~~~~~~~~ //

/**
 * Migrate proxyEnabled setting to proxyConfiguration ('auto' or 'manual')
 * @param settings
 * @returns {*}
 */
function migrateProxyEnabled (settings) {
  if (settings.proxyConfiguration) {
    return settings;
  }

  if(settings.proxyEnabled === true) {
    settings.proxyConfiguration = 'manual';
  } else {
    settings.proxyConfiguration = 'auto';
  }
  delete settings.proxyEnabled;

  return settings;
}
