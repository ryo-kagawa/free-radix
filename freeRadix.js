"use strict";

const RADIX64 = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "+", "/"
];
const TARGET_RADIX_LENGTH = 36;

const calcBitShiftCount = (radix) => {
  let bitShiftCount = 0;
  let powerOfTwoNumber = 1;
  while(radix > powerOfTwoNumber) {
    powerOfTwoNumber <<= 1;
    bitShiftCount++;
  }
  return bitShiftCount;
}

const radix10ToFreeRadix = (targetNumber, outputRadix, outputRadixStringList) => {
  const powerOfTwoCalc = (number, radix, bitShift) => {
    const remainder = number & (radix - 1);
    const value = (number - remainder) >> bitShift;
    return {
      value,
      remainder
    }
  }

  const calc = (number, radix) => {
    const remainder = number % radix;
    const value = (number - remainder) / radix;
    return {
      value,
      remainder
    }
  }

  outputRadixStringList = outputRadixStringList || RADIX64;
  let value = Number(targetNumber);
  const isPowerOfTwo = !(outputRadix & (outputRadix - 1));
  const calcMethod = isPowerOfTwo ? powerOfTwoCalc : calc;
  const bitShiftCount = isPowerOfTwo && calcBitShiftCount(outputRadix);
  let ret = [];
  while(outputRadix < value) {
    const temp = calcMethod(value, outputRadix, bitShiftCount);
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
  const isPowerOfTwo = !(inputRadix & (inputRadix - 1));
  const bitShiftCount = isPowerOfTwo && calcBitShiftCount(inputRadix);
  let value = 0;
  for(let i=0,len=targetNumber.length; i<len; i++) {
    const targetRadix10 = inputRadixStringList.indexOf(targetNumber[i]);
    if(i !== targetNumber.length-1) {
      const temp = value + targetRadix10;
      value = isPowerOfTwo ? temp << bitShiftCount : temp * inputRadix;
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
