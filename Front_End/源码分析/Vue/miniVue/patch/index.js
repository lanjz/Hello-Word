/* @flow */

import * as nodeOps from './node-ops.js'
import { createPatchFunction } from './patch.js'
// import baseModules from 'core/vdom/modules/index'
// import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
// const modules = platformModules.concat(baseModules)
const modules = []

export const patch = createPatchFunction({ nodeOps, modules })
