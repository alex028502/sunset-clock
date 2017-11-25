'use strict';

function findOnClickMethodOfElement(element) {
  // trial and error
  // looking for something like __reactEventHandlers$st5eih1w5dnuubr8uo50cnmi
  const eventHandlerKey = Object.keys(element).filter((name) => name.indexOf('reactEventHandlers') !== -1)[0];
  return element[eventHandlerKey].onClick;
}

module.exports = findOnClickMethodOfElement;
