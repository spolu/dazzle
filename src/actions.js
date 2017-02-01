export const NAVIGATION_STATE = 'NAVIGATION_STATE';
export const COMMAND_INPUT = 'COMMAND_INPUT';
export const COMMAND_SELECT = 'COMMAND_SELECT';
export const COMMAND_SHOW = 'COMMAND_SHOW';
export const SEARCH_RESULTS = 'SEARCH_RESULTS';

export function navigationState(navState) {
  return {
    type: NAVIGATION_STATE,
    payload: {
      navState: navState,
    }
  };
}

export function commandInput(input) {
  return {
    type: COMMAND_INPUT,
    payload: {
      input: input
    }
  };
}

export function commandSelect(index) {
  return {
    type: COMMAND_SELECT,
    payload: {
      index: index
    }
  };
}

export function commandShow() {
  return {
    type: COMMAND_SHOW
  };
}


export function searchResults(results) {
  return {
    type: SEARCH_RESULTS,
    payload: {
      results: results
    }
  };
}
