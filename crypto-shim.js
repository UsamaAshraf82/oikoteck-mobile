import 'react-native-get-random-values';

module.exports = {
  randomUUID: function () {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (c ^ (global.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  },
  getRandomValues: function (buffer) {
    return global.crypto.getRandomValues(buffer);
  },
};
