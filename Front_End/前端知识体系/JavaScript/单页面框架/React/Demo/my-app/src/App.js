import React, { useState, useEffect, useMemo, memo } from 'react';
import logo from './logo.svg';
import './App.css';
import Inbox from './pages/Inbox'

const ChildrenComponent = memo(({ abc }) => {
    console.log('ChildrenComponent rending');
    return <div>ChildrenComponent: {abc} </div>;
});

function App() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
    function doSomething() {
        console.log('doSomething')
        return 'abc'
    }
    const abc = useMemo(() => doSomething(), [])
    return (
        <div>
            <p>You clicked {count} times {abc}</p>
            <button onClick={() => setCount(count+1)}>
                Click me
            </button>
            <ChildrenComponent abc={abc}></ChildrenComponent>
        </div>
    );
}

export default App;
