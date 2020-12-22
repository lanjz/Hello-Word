# 算法

## 两数之和

**解法一**

遍历再次，略

**解法二：两遍哈希表**

使用 `map` 结构可以更有效的方法来检查数组中是否存在目标元素

```js
 var twoSum = function(nums, target) {
    const map = {}
    for(let i in nums) {
        map[nums[i]] = i
    }
    for(let i = nums.length-1; i >=0 ; i--){
        let tar = target - nums[i]
        if(tar in map && map[tar] !==i ){
                return [i, map[tar]]
        }
    }
};
```

**方法三：一遍哈希表**

方法二的优化，将两次遍历完合成一次遍历

```js
 /**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = {}
    for(let i = nums.length-1; i >=0 ; i--){
        let tar = target - nums[i]
        if(tar in map && map[tar] !==i ){
                return [i, map[tar]]
        }
        map[nums[i]] = i
    }
};
```

注意点：

- `for(let i = nums.length-1; i >=0 ; i--)` 比 ` for(let i = 0; i < nums.length ; i++)` 效率高，节省 ` nums.length` 的计算次数

- `for` 循环比 `forEacth` 效率高

- 下面代码额外多了 `result` 变量，会多点用点内存

  ```js
    var twoSum = function(nums, target) {
        const map = {}
        let result = null
        for(let i = nums.length-1; i >=0 ; i--){
            let tar = target - nums[i]
            if(tar in map && map[tar] !==i ){
                 result = [i, map[tar]]
                 break
            }
            map[nums[i]] = i
        }
        return result
    };
  ```