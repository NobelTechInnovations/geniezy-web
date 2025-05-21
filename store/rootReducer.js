import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import settingReducer from './setting/reducer';
import appReducer from './app/reducer';
import ecomerceReducer from './ecomerce/reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    setting: settingReducer,
    app: appReducer,
    ecomerce: ecomerceReducer,
});

export default rootReducer;
