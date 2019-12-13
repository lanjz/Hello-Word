/**
 * 将VNdoe转换成真实DOM
 * */

import * as nodeOps from './node-ops.js'
import { createPatchFunction } from './patch.js'
// import baseModules from 'core/vdom/modules/index'
import platformModules from './modules/index.js'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat([])

export const patch = createPatchFunction({ nodeOps, modules })
