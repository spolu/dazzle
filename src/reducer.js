'use strict'

import * as constants from './constants.js'

const initialState = {
  mode: constants.MODE_NAVIGATION,  // The initial mode of the app.
  domain: '',                       // Current domain.
  isSafe: true,                     // whether the connection is safe or not.
  isLoading: false,                 // whether webview is loading.
  loadingProgress: 0,               // current loading progress.
  targetURL: '',                    // requested URL by the user.
  currentURL: '',                   // the current URL of the webview.
  input: '',                        // the current command input value.
  results: [],                      // Resuts shown in the result list.
  history: {}                       // Navigation history.
};

export default function reducer(state = initialState, action = {}) {
  const navState = (action.payload) ? action.payload.navState : null;
  const url = navState ? parseURL(navState.url) : null;
  const progress = (action.payload) ? action.payload.progress : null;
  const index = (action.payload) ? action.payload.index : null;
  const history = state.history;

  switch (action.type) {
    case constants.ACTION_LOAD_START:
      return {
        ...state,
        isLoading: true,
        loadingProgress: 0,
        domain: url.domain,
        currentURL: navState.url,
      };

    case constants.ACTION_LOAD_END:

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

      return {
        ...state,
        isLoading: false,
        loadingProgress: 1,
        domain: url.domain,
        history: history,
        currentURL: navState.url,
      };

    case constants.ACTION_LOAD_PROGRESS:

      return {
        ...state,
        loadingProgress: progress,
      };


    case constants.ACTION_COMMAND_SHOW:
      let results = computeResults('', history)

      return {
        ...state,
        results: computeResults('', history),
        mode: constants.MODE_COMMAND,
      };

    case constants.ACTION_COMMAND_INPUT:
      return {
        ...state,
        input: action.payload.input,
        results: computeResults(action.payload.input, history),
      };

    case constants.ACTION_COMMAND_SELECT:
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

    default:
      return state;
  }
}

const inputURLRegexp =
  /^(https?:\/\/)?([-a-zA-Z0-9@%._\+~#=]{2,512}\.([a-z]{2,4}))\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/

// computeResults recomputes the results to show in COMMAND mode based on the
// current input value and history.
const computeResults = (input, history) => {
  let results = [];
  input = input.trim();

  let url = inputURLRegexp.exec(input);
  // TODO check against a list of TLDs
  if (url != null) {
    results.push({
      type: constants.RESULT_TYPE_URL,
      target: (url[1] ? '' : 'http://') + url[0],
      url: url[0],
      title: '',
    });
  }

  if (input.length > 0) {
    const searchURL = 'https://www.google.com/search?&ie=UTF-8&q=' +
      encodeURIComponent(input)
    results.push({
      type: constants.RESULT_TYPE_SEARCH,
      target: searchURL,
      url: '',
      title: input,
    })
  }

  let recents = [];
  for (let domain in history) {
    for (let path in history[domain].pathes) {
      let url = domain;
      if (path != '/') {
        url += path;
      }

      recents.push({
        type: constants.RESULT_TYPE_HISTORY,
        target: history[domain].pathes[path].url,
        url: url,
        title: history[domain].pathes[path].title,
        last: history[domain].pathes[path].last,
      });
    }
  }
  recents.sort((a, b) => {
    if (a.last < b.last) {
      return 1;
    } else {
      return -1;
    }
  });
  recents.forEach(r => {
    results.push(r);
  })

  return results;
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

