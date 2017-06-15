import { combineReducers } from 'redux';

export default (preloadedReducers) => (createStore) => (reducer, preloadedState, enhancer) => {
  const store = createStore(reducer, preloadedState, enhancer);
  const replaceReducer = store.replaceReducer;
  const soyaReducers = { ...preloadedReducers };

  return {
    ...store,
    replaceReducer: (nextReducers) => {
      if (!nextReducers) return;

      let nextReducer = nextReducers;
      if (typeof nextReducers === 'object') {
        const keys = Object.keys(nextReducers);
        keys.forEach(key => {
          if (soyaReducers[key] && soyaReducers[key] !== nextReducers[key]) {
            throw new Error(`Duplicate reducer name: ${key}`);
          }
          soyaReducers[key] = nextReducers[key];
        });
        nextReducer = combineReducers(soyaReducers);
      }
      replaceReducer(nextReducer);
    },
    soya: true,
  };
};
