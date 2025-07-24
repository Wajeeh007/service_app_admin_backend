const uuidToBin = (uuid) => {
    const hex = uuid.replace(/-/g, '');
    const rearranged = hex.substr(14, 4) + hex.substr(9, 4) + hex.substr(0, 8) + hex.substr(19, 4) + hex.substr(24, 12);
    return Buffer.from(rearranged, 'hex');
};

const binToUuid = (buffer) => {
  const hex = buffer.toString('hex');
  const part1 = hex.substr(8, 8);
  const part2 = hex.substr(4, 4);
  const part3 = hex.substr(0, 4);
  const part4 = hex.substr(12, 4);
  const part5 = hex.substr(16);
  console.log('returning UUID')
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
};

module.exports = {
    uuidToBin,
    binToUuid
};