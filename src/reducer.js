'use strict'

import * as constants from './constants.js'

const initialState = {
  mode: constants.MODE_NAVIGATION,  // The initial mode of the app.
  domain: '',                       // Current domain.
  isSafe: true,                     // whether the connection is safe or not.
  isLoading: false,                 // whether webview is loading.
  loadingProgress: 0,               // current loading progress.
  url: '',                          // the current URL of the webview.
  input: '',                        // the current command input value.
  results: [],                      // Resuts shown in the result list.
  history: {}                       // Navigation history.
};

export default function reducer(state = initialState, action = {}) {
  const navState = (action.payload) ? action.payload.navState : null;
  const url = navState ? parseURL(navState.url) : null;
  const progress = (action.payload) ? action.payload.progress : null;
  const index = (action.payload) ? action.payload.index : null;

  switch (action.type) {

    case constants.ACTION_LOAD_START:
      return {
        ...state,
        isLoading: true,
        loadingProgress: 0,
        domain: url.domain,
        url: navState.url,
      };

    case constants.ACTION_LOAD_END:
      var history = state.history;

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

      return {
        ...state,
        isLoading: false,
        loadingProgress: 1,
        domain: url.domain,
        history: history,
        url: navState.url,
      };

    case constants.ACTION_LOAD_PROGRESS:

      return {
        ...state,
        loadingProgress: progress,
      };


    case constants.ACTION_COMMAND_SHOW:
      let results = computeResults('')

      return {
        ...state,
        results: computeResults(''),
        mode: constants.MODE_COMMAND,
      };

    case constants.ACTION_COMMAND_INPUT:
      return {
        ...state,
        input: action.payload.input,
        results: computeResults(action.payload.input),
      };

    case constants.ACTION_COMMAND_SELECT:
      if (index < state.results.length) {
        return {
          ...state,
          results: [],
          input: '',
          url: state.results[index].target,
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
// current input value.
const computeResults = (input) => {
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

  return results;
}

// parseURL parses an URL into an object with domain, scheme and path.
const parseURL = (url) => {
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

