import { combineReducers } from 'redux';
import uiReducer from './uiReducer';
import displayModeReducer from './displayModeReducer';

export default combineReducers({
  uiReducer,
  displayModeReducer
})