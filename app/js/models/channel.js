var Channel = function(caMode, serviceType, serviceFilter, deletedByUser, channelTitle, muxId) {
  this.caMode = caMode;
  this.serviceType = serviceType;
  this.serviceFilter = serviceFilter;
  this.deletedByUser = deletedByUser;
  this.channelTitle = channelTitle;
  // this.channelDisplayTitle = channelDisplayTitle;
  this.muxId = muxId;
}

module.exports = Channel;
