/**
 * 批量
 * @param {Array} task promise array
 */
Promise.complete = function (task, flag) {
  var resolveVal = [];
  var rejectVal = [];
  return new Promise((resolve, reject) => {
    var len = task.length;
    for (let i = 0; i < len; i++) {
      console.log("Promise.complete -> task[i]", task[i])
      if (!!task[i] && typeof task[i].then === 'function') {
        task[i].then(data => {
          resolveVal.push(data);
          if (i === len - 1) {
            resolve(resolveVal);
          }
        }).catch(err => {
          rejectVal.push(err);
          if (i === len - 1) {
            resolve(resolveVal);
          }
        })
      } else {
        console.log("Promise.complete -> not Promise, flag:: ", flag)
        if (i === len - 1) {
          resolve(resolveVal);
        }
      }

    }
  })
}