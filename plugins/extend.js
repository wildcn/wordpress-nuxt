/**
 * 批量
 * @param {Array} task promise array
 */
Promise.complete = function (task) {
  var resolveVal = [];
  var rejectVal = [];
  return new Promise((resolve, reject) => {
    var len = task.length;
    for (let i = 0; i < len; i++) {
      Promise.resolve(task[i]).then(data => {
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
    }
  })
}