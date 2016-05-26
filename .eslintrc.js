module.exports = {
  extends: 'airbnb/legacy',
  rules: {
    'func-names': 0,
    'one-var': 0,
    'comma-dangle': 0
  },
    "globals"   : {
    /* MOCHA */
    "describe"   : false,
    "it"         : false,
    "before"     : false,
    "beforeEach" : false,
    "after"      : false,
    "afterEach"  : false,
    "angular"   : false
  }
};
