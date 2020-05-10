import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import useCount from './helper/hook/useCount'
import './App.css';
import Inbox from './pages/Inbox'

function App() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
    const count2 = useCount(count)
    /*useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    }, [test]);*/
    function f() {
        setCount(count + 1)
    }
    return (
        <div>
            <p>自定义Hook:{count2}</p>
            <p>You clicked {count} times</p>
            <button onClick={f}>
                Click me
            </button>
            {
                count%2 === 0 && <Inbox></Inbox>
            }
        </div>
    );
}

export default App;
