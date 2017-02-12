'use strict'

import * as constants from './constants'
import {computeResults} from './results'

const initialState = {
  mode: constants.MODE_NAVIGATION,  // The initial mode of the app.
  domain: '',                       // Current domain.
  isSafe: true,                     // whether the connection is safe or not.
  isLoading: false,                 // whether webview is loading.
  loadingProgress: 0,               // current loading progress.
  targetURL: '',                    // requested URL by the user.
  currentURL: '',                   // the current URL of the webview.
  currentStatusCode: 200,           // status code of the current request.
  input: '',                        // the current command input value.
  results: [],                      // Resuts shown in the result list.
  history: {}                       // Navigation history.
};

export default function reducer(state = initialState, action = {}) {
  const navState = (action.payload) ? action.payload.navState : null;
  const url = navState ? parseURL(navState.url) : null;
  const progress = (action.payload) ? action.payload.progress : null;
  const index = (action.payload) ? action.payload.index : null;
  const history = Object.assign({}, state.history);

  switch (action.type) {
    case constants.ACTION_LOAD_START:
      {
        let updated = {
          ...state,
          isLoading: true,
          loadingProgress: 0,
          domain: url.domain,
          currentURL: navState.url,
          currentStatusCode: 200,
        };
        updated.results =  computeResults(updated.input, updated);
        return updated;
      }

    case constants.ACTION_LOAD_RESPONSE:
      {
        if (state.isLoading && state.currentURL == navState.url) {
          return {
            ...state,
            currentStatusCode: navState.statusCode,
          };
        } else {
          return state;
        }
      }

    case constants.ACTION_LOAD_END:
      {
        if (constants.HISTORY_SKIPLIST.includes(url.domain+url.path)) {
          return state;
        }
        // Don't store non 20x results in history.
        if (state.currentStatusCode >= 300) {
          return state;
        }

        history[url.domain] = history[url.domain] || {
          hit: 0,
          pathes: {}
        };
        history[url.domain].hit += 1;
        history[url.domain].last = Date.now();

        history[url.domain].pathes[url.path] =
          history[url.domain].pathes[url.path] || {
            hit: 0,
            title: ''
          };
        history[url.domain].pathes[url.path].url = url.raw;
        history[url.domain].pathes[url.path].hit += 1;
        history[url.domain].pathes[url.path].title = navState.title || '';
        history[url.domain].pathes[url.path].last = Date.now();

        let updated = {
          ...state,
          isLoading: false,
          loadingProgress: 1,
          domain: url.domain,
          history: history,
          currentURL: navState.url,
        };
        updated.results =  computeResults(updated.input, updated);
        return updated;
      }

    case constants.ACTION_LOAD_PROGRESS:
      {
        return {
          ...state,
          loadingProgress: progress,
        };
      }

    case constants.ACTION_COMMAND_SHOW:
      {
        let results = computeResults('', state)

        return {
          ...state,
          results: computeResults('', state),
          mode: constants.MODE_COMMAND,
        };
      }

    case constants.ACTION_COMMAND_CANCEL:
      {
        return {
          ...state,
          results: [],
          input: '',
          mode: constants.MODE_NAVIGATION,
        };
      }

    case constants.ACTION_COMMAND_INPUT:
      {
        return {
          ...state,
          input: action.payload.input,
          results: computeResults(action.payload.input, state),
        };
      }

    case constants.ACTION_COMMAND_SELECT:
      {
        if (index < state.results.length) {
          return {
            ...state,
            results: [],
            input: '',
            targetURL: state.results[index].target,
            mode: constants.MODE_NAVIGATION,
          };
        } else {
          return {
            ...state,
            results: [],
            input: '',
            mode: constants.MODE_NAVIGATION,
          };
        }
      }

    default:
      return state;
  }
}

// parseURL parses an URL into an object with domain, scheme, path, fragment
// and query.
const parseURL = (url) => {
  let domain = null;
  let scheme = null;
  let path = null;
  let fragment = null;
  let query = null;

  if (url.indexOf("://") > -1) {
    let sp = url.split('/');
    domain = sp[2];
    scheme = sp[0];
    if (sp.length > 3) {
      path =  '/' + url.substr(scheme.length + 3 + domain.length)
    } else {
      path = '/';
    }
  } else {
    let sp = url.split('/');
    scheme = 'http';
    domain = sp[0];
    if (sp.length > 1) {
      path =  '/' + url.substr(domain.length)
    } else {
      path = '/';
    }
  }

  let spf = path.split('#')
  if (spf.length > 0) {
    path = spf[0];
    fragment = path.substr(path.length + 1)
  }

  let spq = path.split('?')
  if (spq.length > 0) {
    path = spq[0];
    query = path.substr(path.length + 1)
  }

  return {
    raw: url,
    domain: domain,
    scheme: scheme,
    path: path,
    fragment: fragment,
    query: query,
  };
}

