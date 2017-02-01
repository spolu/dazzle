'use strict'

import * as constants from './constants.js'

const initialState = {
  mode: constants.MODE_NAVIGATION,  // The initial mode of the app.
  input: '',                        // Value of the input bar.
  domain: '',                       // Current domain.
  safe: true,                       // Whether the connection is safe or not.
  results: [],                      // Resuts shown in the result list.
  history: {}                       // Navigation history.
};

// parseURL parses an URL into an object with domain, scheme and path.
function parseURL(url) {
  var domain;
  var scheme;
  var path;

  if (url.indexOf("://") > -1) {
    var sp = url.split('/');
    domain = sp[2];
    scheme = sp[0];
    if (sp.length > 3) {
      path =  '/' + url.substr(scheme.length + 3 + domain.length)
    } else {
      path = '/';
    }
  } else {
    var sp = url.split('/');
    scheme = 'http';
    domain = sp[0];
    if (sp.length > 1) {
      path =  '/' + url.substr(domain.length)
    } else {
      path = '/';
    }
  }

  return {
    domain: domain,
    scheme: scheme,
    path: path
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case constants.ACTION_NAVIGATION_STATE:
      let navState = action.payload.navState;
      let url = parseURL(navState.url);
      var history = state.history;

      if (!navState.loading &&
        !navState.navigationType) {
        history[url.domain] = history[url.domain] || {
          hit: 0,
          pathes: {}
        };
        history[url.domain].hit += 1;

        history[url.domain].pathes[url.path] =
          history[url.domain].pathes[url.path] || {
            hit: 0,
            title: ''
          };
        history[url.domain].pathes[url.path].hit += 1;
        history[url.domain].pathes[url.path].title = navState.title || '';

        // TODO recompute results
      }

      return {
        ...state,
        domain: url.domain,
        input: url.domain + url.path,
        history: history
      };

    case constants.ACTION_COMMAND_SHOW:
      console.log('FOOOO !!!!!')
      return {
        ...state,
        mode: constants.MODE_COMMAND,
      };

    case constants.ACTION_COMMAND_INPUT:
      // TODO recompute results
      // TODO trigger google search

      return state;

    case constants.ACTION_COMMAND_SELECT:
      // TODO recompute results

      return {
        ...state,
        mode: constants.MODE_NAVIGATION,
      };


    default:
      return state;
  }
}
