console.log('AAAAAAAAAAAAA')

import('./modules/utils')
  .then(({ MB }) => {
    console.log('MB', MB)
  })
  .catch((error) => 'An error occurred while loading theS component');