'use strict'

// Action constants
export const ACTION_LOAD_START = 'ACTION_LOAD_START';
export const ACTION_LOAD_END = 'ACTION_LOAD_END';
export const ACTION_LOAD_PROGRESS = 'ACTION_LOAD_PROGRESS';

export const ACTION_COMMAND_INPUT = 'ACTION_COMMAND_INPUT';
export const ACTION_COMMAND_SELECT = 'ACTION_COMMAND_SELECT';
export const ACTION_COMMAND_SHOW = 'ACTION_COMMAND_SHOW';
export const ACTION_COMMAND_CANCEL = 'ACTION_COMMAND_CANCEL';

export const MODE_NAVIGATION = 'MODE_NAVIGATION';
export const MODE_COMMAND = 'MODE_COMMAND';

export const HEIGHT_CC_NAVIGATION = 30;
export const HEIGHT_CC_COMMAND = 44;

export const RESULT_TYPE_URL = 'RESULT_TYPE_URL';
export const RESULT_TYPE_HISTORY = 'RESULT_TYPE_HISTORY';
export const RESULT_TYPE_SEARCH = 'RESULT_TYPE_SEARCH';

// Result histoy SKIPLIST
export const HISTORY_SKIPLIST = [
  'www.google.com/search',
];

// Styles
export const FONT_SIZE = 16;

// Colors
export const BLACK = '#000000';
export const BLACK_TRANSPARENT = BLACK + '20';
export const WHITE = '#ffffff';

export const RED = '#ff3b53';
export const GREEN = 'b8e986';
export const BLUE = '#7fbbff';
