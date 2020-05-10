
import React, { useState } from 'react';
import useCount from '../helper/hook/useCount'
export default function About() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useCount(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}