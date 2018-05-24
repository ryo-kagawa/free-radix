const RADIX64 = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "+", "/"
];
const TARGET_RADIX_LENGTH = 36;

const calc = (number, radix) => {
  const remainder = number % radix;
  const value = (number - remainder) / radix;
  return {
    value,
    remainder
  }
}

const radix10ToFreeRadix = (targetNumber, outputRadix, outputRadixStringList) => {
  outputRadixStringList = outputRadixStringList || RADIX64;
  let value = Number(targetNumber);
  let ret = [];
  while(outputRadix < value) {
    const temp = calc(value, outputRadix);
    value = temp.value;
    ret.push(outputRadixStringList[temp.remainder]);
  }
  const temp = calc(value, outputRadix);
  ret.push(outputRadixStringList[temp.remainder]);
  if(temp.value !== 0) {
    ret.push(outputRadixStringList[temp.value]);
  }
  ret.reverse();
  return ret.join("");
}

const freeRadixToRadix10 = (targetNumber, inputRadix, inputRadixStringList) => {
  if(!inputRadixStringList && inputRadix <= TARGET_RADIX_LENGTH) {
    targetNumber = targetNumber.toLocaleLowerCase("en-US");
  }
  inputRadixStringList = inputRadixStringList || RADIX64;
  let value = 0;
  for(let i=0,len=targetNumber.length; i<len; i++) {
    targetRadix10 = inputRadixStringList.indexOf(targetNumber[i]);
    if(i !== targetNumber.length-1) {
      value = (value + targetRadix10) * inputRadix;
    } else {
      value += targetRadix10;
    }
  }
  return value;
}

const freeRadixToFreeRadix = (targetNumber, inputRadix, outputRadix, inputRadixStringList, outputRadixStringList) => {
  outputRadixStringList = outputRadixStringList || inputRadixStringList;
  const radix10 = freeRadixToRadix10(targetNumber, inputRadix, inputRadixStringList);
  const outputValue = radix10ToFreeRadix(radix10, outputRadix, outputRadixStringList);
  return outputValue;
}
