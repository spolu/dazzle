'use strict'

import * as constants from './constants'

// computeResults recomputes the results to show in COMMAND mode based on the
const inputURLRegexp =
  /^(https?:\/\/)?([-a-zA-Z0-9@%._\+~#=]{2,512}\.([a-z]{2,4}))\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/

// current input value and history.
export function computeResults(input, state) {
  let results = [];
  input = input.trim();
  let history = state.history;
  let isURL = false;

  // If the input is not empty push result and url results.
  if (input.length > 0) {
    let url = inputURLRegexp.exec(input);
    // TODO check against a list of TLDs
    if (url != null) {
      isURL = true;
      results.push({
        type: constants.RESULT_TYPE_URL,
        target: (url[1] ? '' : 'http://') + url[0],
        url: url[0],
        title: '',
      });
    }

    if (constants.SEARCH_SHORTCUTS[input] != null) {
      isURL = true;
      results.push({
        type: constants.RESULT_TYPE_URL,
        target: constants.SEARCH_SHORTCUTS[input][1],
        url: constants.SEARCH_SHORTCUTS[input][0],
        title: '',
      })
    }

    const searchURL = 'https://www.google.com/search?&ie=UTF-8&q=' +
      encodeURIComponent(input)
    results.push({
      type: constants.RESULT_TYPE_SEARCH,
      target: searchURL,
      url: '',
      title: input,
    })
  }

  if (state.isLoading) {
    results.push({
      type: constants.RESULT_TYPE_URL,
      target: state.currentURL,
      url: state.domain,
      title: '',
    })
  }

  let recents = [];
  for (let domain in history) {
    for (let path in history[domain].pathes) {
      let url = domain;
      if (path != '/') {
        url += path;
      }

      let match = true;
      if (input.length > 0) {
        input.split(' ').forEach(t => {
          let r = new RegExp(t.trim(), 'i');
          if (!history[domain].pathes[path].url.match(r) &&
            !history[domain].pathes[path].title.match(r)) {
            match = false;
          }
        })
      }

      if (match) {
        recents.push({
          type: constants.RESULT_TYPE_HISTORY,
          target: history[domain].pathes[path].url,
          url: domain,
          domain: domain,
          title: history[domain].pathes[path].title,
          last: history[domain].pathes[path].last,
        });
      }
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

  // If we have hits from recents, prioritize them.
  if (input.length > 1 && recents.length > 0 && !isURL) {
    var r0 = results[0]
    results[0] = results[1];
    results[1] = r0;
  }

  return results;
}

