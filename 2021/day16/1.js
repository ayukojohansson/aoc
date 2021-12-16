const fs = require('fs');
const input = fs.readFileSync('./input.txt', 'utf8');

const data = input;

const getValue = (typeId, subPackets) => {
  switch (typeId) {
    case 0:
      return subPackets.reduce((a,b) => a+b.value, 0);
    case 1:
      return subPackets.reduce((a,b) => a*b.value, 1);
    case 2:
      return subPackets.reduce((a,b) => Math.min(a, b.value), subPackets[0].value);
    case 3:
      return subPackets.reduce((a,b) => Math.max(a, b.value), subPackets[0].value);
    case 5:
      return subPackets[0].value > subPackets[1].value ? 1 : 0;
    case 6:
      return subPackets[0].value < subPackets[1].value ? 1 : 0;
    case 7:
      return subPackets[0].value == subPackets[1].value ? 1 : 0;
  }
}

const decodePacket = (bits, packetId = 0) => {
  const version = parseInt(bits.slice(0,3),2);
  const typeId = parseInt(bits.slice(3,6),2);
  let nextIndex = 6;
  let sum = version;
  if (typeId == 4) {
    const literals = [];
    while (true) {
      const literal = bits.slice(nextIndex, nextIndex+5);
      nextIndex += 5;
      literals.push(literal.slice(1,5));
      if (literal[0] == '0') {
        return {
          version,
          typeId,
          sum,
          value: parseInt(literals.join(''), 2),
          packet: bits.slice(0, nextIndex),
          nextIndex
        }
      }
    }
  } else {
    const lengthTypeId = bits[nextIndex++];
    if (lengthTypeId == 0) {
      const subPacketLength = parseInt(bits.slice(nextIndex, nextIndex+15), 2);
      nextIndex += 15;
      const endIndex = nextIndex + subPacketLength;
      const subPackets = [];
      while (true) {
        const subPacket = decodePacket(bits.slice(nextIndex));
        subPackets.push(subPacket);
        sum += subPacket.sum;
        nextIndex += subPacket.nextIndex;
        if (nextIndex == endIndex) {
          return {
            version,
            typeId,
            sum,
            value: getValue(typeId, subPackets),
            subPackets,
            nextIndex
          }
        } else if (nextIndex > endIndex) {
          console.error('something wrong!!')
        }
      }
    } else {
      const subPacketCount = parseInt(bits.slice(nextIndex, nextIndex+11), 2);
      nextIndex += 11;
      const subPackets = [];
      for (let i=0; i<subPacketCount; i++) {
        const subPacket = decodePacket(bits.slice(nextIndex));
        nextIndex += subPacket.nextIndex;
        sum += subPacket.sum;
        subPackets.push(subPacket);
      }
      return {
        version,
        typeId,
        sum,
        value: getValue(typeId, subPackets),
        subPackets,
        nextIndex
      }
    }
    
  }
}

const calc = (inputData) => {
  const bits = inputData
    .split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
  
  return decodePacket(bits);
}

console.log('part 1:', calc(data).sum)

console.log('part 2:', calc(data).value)

