/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */


var nums = [2,7,11,15]
var target = 9

   for(var i = 0 ; i< nums.length-1; i++)
   {
      for(var j = i+1 ; j< nums.length; j++)
      {
         if((target-nums[j]) == nums[i])
         {
            console.log([i,j])
         }
      }
   }







