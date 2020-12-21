console.log('AAAAAAAAAAAAA')

document.body.onclick = function (){
  import(/* webpackPreload: true */ './modules/utils')
    .then(({ MB }) => {
      console.log('MB', MB)
    })
    .catch((error) => 'An error occurred while loading theS component');
}
