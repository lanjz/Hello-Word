import React from 'react'
import ErrorBoundary from '.././../components/class/ErrorBoundary'
class ClassIndex extends React.Component{
    componentDidMount() {
        // console.log(abc)
    }
    render(){
        return (
            <div>
                1
                {/*{null.map((ele,index) =>{
                    return <p key={index}>{ele}</p>
                })}*/}
            </div>
        )
    }
}
export default function () {
    return <ErrorBoundary><ClassIndex></ClassIndex></ErrorBoundary>
}


