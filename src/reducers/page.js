'use strict';

module.exports = function(state = '', action) {
  switch (action.type) {
    case 'SET_PAGE':
      return action.value;
    default:
      return state;
  }
};
