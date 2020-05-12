import React, { useState, useCallback, useRef, useEffect, useMemo,useContext,  memo, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import logo from '../../logo.svg';
import '../../App.css';
import Inbox from '../../pages/Inbox'

let ChildrenComponent = memo(({ cab }) => {
    console.log('ChildrenComponent rending');
    const theme = useContext(ThemeContext);
    console.log('theme', theme)
    return <div>ChildrenComponent</div>;
})
const lazy = function () {
    return new Promise(resolve => {
        setTimeout(resolve, 2000)
    })
}
const themes = {
    light: {
        foreground: "#000000",
        background: "#eeeeee"
    },
    dark: {
        foreground: "#ffffff",
        background: "#222222"
    }
};
const ThemeContext = React.createContext(themes.light);
function HookApp() {
    const inputEl = useRef(null);

    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
    function doSomething() {
        console.log('doSomething')
        return 'abc'
    }
    useEffect(() => {
        console.log('inputEl', inputEl)
    })
    useLayoutEffect(() => {
        async function deng() {
            await lazy()
            console.log('useLayoutEffect')
        }
        deng()
        inputEl.current.style.background = count%2 === 0 ? 'red': 'blue'

    })

    // const abc = useMemo(() => doSomething(), [])
    const callBack = useCallback(() => setCount(100), [])
    return (
        <div ref={inputEl}>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count+1)}>
                Click me
            </button>
            <ThemeContext.Provider value={themes.dark}>
                <ChildrenComponent cab={callBack}></ChildrenComponent>
            </ThemeContext.Provider>
        </div>
    );
}

export default HookApp;
