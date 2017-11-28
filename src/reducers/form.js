'use strict';

module.exports = function(state = {}, action) {
  switch (action.type) {
    case 'SET_PAGE':
      // listening for the same action type
      // so when we switch page
      // we always clear the form
      return Object.assign({}, state, {
        fieldValue: '',
      });
    case 'SET_COORDINATES_FORM_VALUE':
      return Object.assign({}, state, {
        fieldValue: action.value,
      });
    default:
      return state;
  }
};
