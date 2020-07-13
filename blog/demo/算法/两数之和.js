/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = {}
  let result = null
  for(let i in nums){
    let tar = target - nums[i]
    if(map[tar] && map[tar] !==i ){
      result = [i, map[tar]]
      break
    }
    map[nums[i]] = i
  }
  return result
};

var twoSum2 = function(nums, target) {
  const map = {}
  let result = null
  for(let i in nums){
    map[nums[i]] = i
  }
  for(let i in nums){
    let tar = target - nums[i]
    if(map[tar] && map[tar] !==i ){
      result = [i, map[tar]]
      break
    }
  }
  return result
};
