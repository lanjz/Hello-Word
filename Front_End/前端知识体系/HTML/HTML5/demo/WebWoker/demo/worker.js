console.log('delf', self.addEventListener, this)

/*onmessage = function(e) {
    console.log('Worker: Message received from main script', e);
    doWorker(e)
}*/
function doWorker(e) {
   /* if(e.data === 'start') {
        let count = 0
        setInterval(() => {
            postMessage(count++)
        }, 1000)
    } else if(e.data === 'end') {
        close()
    }*/
}
self.addEventListener('message', function (e) {
    console.log('addEventListener: Message received from main script', e);
    doWorker(e)
})
