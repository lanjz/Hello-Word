import React from 'react'
function ChildrenDemo(props) {  
  console.log(props.children, 'children30');
  console.log(React.Children.map(props.children, item => [item, [item, [item]]]), 'children31');
  console.log(React.Children.map(props.children,item=>item),'children31') 
  return props.children;
}
export default ()=>( 
   <ChildrenDemo><span key={'.0/'}>1</span> <span>2</span> </ChildrenDemo>
)
