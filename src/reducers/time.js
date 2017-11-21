

module.exports = function(state = 0, action) {
  if (action.type === 'SET_TIME') {
    return action.value;
  } else {
    return state;
  }
};
