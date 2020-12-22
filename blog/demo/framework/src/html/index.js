
console.log('AAAAA33AAAAAAA333A', utils.MB())

document.body.onclick = function (){
  import(/* webpackPreload: true */ '../modules/utils')
    .then(({ MB }) => {
      console.log('MB', MB)
    })
    .catch((error) => 'An error occurred while loading theS component');
}

import * as utils from '../modules/utils'
console.log('22222222', utils)