import { combineReducers } from 'redux';
import * as Actions from '../actions/actions'

function musicReducer(state = [], action): any {
  switch(action.type) {
    case Actions.GET_MUSIC_SUCCESS:
      return {...state, music: action.payload};
  }
  return state;
}

const reducers = combineReducers({
  musicState: musicReducer
});

export default function getReducers(){ return reducers; }
