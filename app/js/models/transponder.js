var transponder = function(frequency, symRate, netId, tsId, muxId) {
  this.frequency = frequency;
  this.symRate = symRate;
  this.netId = netId;
  this.tsId = tsId;
  this.muxId = muxId;
};

module.exports = transponder;
