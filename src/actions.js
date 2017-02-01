'use strict'

import * as constants from './constants.js'

export function navigationState(navState) {
  return {
    type: constants.ACTION_NAVIGATION_STATE,
    payload: {
      navState: navState,
    }
  };
}

export function commandInput(input) {
  return {
    type: constants.ACTION_COMMAND_INPUT,
    payload: {
      input: input
    }
  };
}

export function commandSelect(index) {
  return {
    type: constants.ACTION_COMMAND_SELECT,
    payload: {
      index: index
    }
  };
}

export function commandShow() {
  return {
    type: constants.ACTION_COMMAND_SHOW
  };
}


export function searchResults(results) {
  return {
    type: constants.ACTION_SEARCH_RESULTS,
    payload: {
      results: results
    }
  };
}
