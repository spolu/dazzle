'use strict'

import * as constants from './constants.js'

export function loadStart(navState) {
  return {
    type: constants.ACTION_LOAD_START,
    payload: {
      navState: navState,
    }
  };
}

export function loadResponse(navState) {
  return {
    type: constants.ACTION_LOAD_RESPONSE,
    payload: {
      navState: navState,
    }
  };
}

export function loadEnd(navState) {
  return {
    type: constants.ACTION_LOAD_END,
    payload: {
      navState: navState,
    },
  };
}

export function loadProgress(progress) {
  return {
    type: constants.ACTION_LOAD_PROGRESS,
    payload: {
      progress: progress,
    },
  };
}

export function commandInput(input) {
  return {
    type: constants.ACTION_COMMAND_INPUT,
    payload: {
      input: input,
    },
  };
}

export function commandSelect(index) {
  return {
    type: constants.ACTION_COMMAND_SELECT,
    payload: {
      index: index,
    },
  };
}

export function commandShow() {
  return {
    type: constants.ACTION_COMMAND_SHOW,
    payload: {},
  };
}

export function commandCancel() {
  return {
    type: constants.ACTION_COMMAND_CANCEL,
    payload: {},
  };
}
