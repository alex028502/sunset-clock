'use strict';

module.exports = function(state = {}, action) {
  switch (action.type) {
    case 'SET_COORDINATES':
      return Object.assign({}, state, action.value);
    case 'SET_COORDINATES_ERROR':
      return Object.assign({}, state, {error: action.value});
    default:
      return state;
  }
};
