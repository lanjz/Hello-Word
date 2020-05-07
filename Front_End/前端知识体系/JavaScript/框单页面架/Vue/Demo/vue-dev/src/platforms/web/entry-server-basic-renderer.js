/* @flow */

import modules from './server/modules'
import directives from './server/directives'
import { isUnaryTag, canBeLeftOpenTag } from './compiler/util'
import { createBasicRenderer } from 'server/create-basic-renderer'

export default createBasicRenderer({
  modules,
  directives,
  isUnaryTag,
  canBeLeftOpenTag
})
