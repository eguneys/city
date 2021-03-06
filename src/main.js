import { init } from 'snabbdom';
import klass from 'snabbdom/modules/class';
import attributes from 'snabbdom/modules/attributes';
import eventlisteners from 'snabbdom/modules/eventlisteners';
import style from 'snabbdom/modules/style';

export const patch = init([klass, attributes, eventlisteners, style]);

import start from './api';

import { configure } from './config';
import { defaults } from './state'; 
import makeCtrl from './ctrl';
import view from './view';


export function app(element, config) {

  let state = defaults();

  configure(state, config || {});

  let vnode, ctrl;

  function redraw() {
    vnode = patch(vnode, view(ctrl));
  }

  state.redraw = redraw;

  ctrl = new makeCtrl(state, redraw);

  const blueprint = view(ctrl);
  vnode = patch(element, blueprint);

  return start(ctrl, redraw);
}
