
/**
 * 将VNdoe转换成真实DOM
 * */
// src\platforms\web\runtime\patch.js

import * as nodeOps from './node-ops.js'
import platformModules from './modules/index.js'
import { createPatchFunction } from './patch.js'

const modules = platformModules
export const patch = createPatchFunction({ nodeOps, modules })
