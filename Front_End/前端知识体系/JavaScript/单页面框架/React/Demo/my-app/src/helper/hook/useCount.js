import { useState, useEffect } from 'react';

export default function useCount(init) {
    const [count, setCount] = useState(init);
    useEffect(function () {
        console.log(init)
        // setCount(count+10)
        // setCount(count+10)
        return
    }, init)
    return count
}
