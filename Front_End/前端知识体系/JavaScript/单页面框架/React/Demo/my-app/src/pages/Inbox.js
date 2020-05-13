import { createBrowserHistory } from 'history'
import React, { useState, useEffect } from 'react';
function About2() {
    console.log(111, createBrowserHistory())
    return <h1>Hello, About</h1>;
}
export default  function About(props) {
    console.log(props)
    console.log('about')
    return (
        <div>
            <p>About</p>
            <About2></About2>
        </div>
    );
}