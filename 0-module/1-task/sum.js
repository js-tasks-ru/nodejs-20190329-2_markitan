function sum(a, b) {
  if (typeof a === 'number' && 
    typeof b === 'number'
  ) {
    return a+b;
  }
  throw new TypeError('Arguments is not a numbers');
}

module.exports = sum;
