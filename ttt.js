function walk(str){
  let left = 0
  let right = 0
  let dot = 0
  for(let i of str){
    if(i === '{'){
      left++
    } else if(i === '.'){
      dot ++
    } else if(i === '}'){
      right++
    }
    if((left+dot) < right){
      return false
    }
  }
  return (Math.abs(right-left)-dot)%2 === 0
}