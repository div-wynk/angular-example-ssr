// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// CONTENT_URL: 'https://stage.wynk.in/music',
// SAPI_URL: 'https://stage.wynk.in/music',
// SEARCH_URL:'http://stagingdev.wynk.in/music',
// PLAYLIST_UPDATE:'https://stage.wynk.in/usercontent',
// RECOMMANDATION:'https://stage.wynk.in/recommendation',

export const environment = {
  production: false,
  CONTENT_URL: 'https://content.wynk.in/music',
  SAPI_URL: 'https://sapi.wynk.in/music',
  SEARCH_URL:'https://search.wynk.in/music',
  PLAYLIST_UPDATE:'https://usercontent.wynk.in/usercontent',
  RECOMMANDATION:'https://reco.wynk.in',
  WEB_SITE_URL:'https://web-dev.wynk.in',
  CURATED_ARTIST:'https://wynk.in/music',
  SSR_URL:'http://localhost:9000',
  APP_VERSION: 'dev',
  enableErrorHandler: false,
  ERROR_TRACE_URL: 'https://web-retrace.wynk.in/retrace',
  GRAPH_URL: 'https://graph.wynk.in/graph/v4',
  USER_CONTENT_URL:'https://usercontent.wynk.in',
  STREAM_URL: 'https://stream-stage.wynk.in/song/v4/stream',
  LOGIN_URL: 'https://login-stage.wynk.in/music',
  PING: 'https://ping-stage.wynk.in',
  IMG_URI: 'https://img.wynk.in/webassets-stage/',
};
