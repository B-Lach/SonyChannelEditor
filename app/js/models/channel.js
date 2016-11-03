var channel = function(caMode, serviceType, serviceFilter, deletedByUser, channelTitle, channelDisplayTitle, transponder) {
  this.caMode = caMode;
  this.serviceType = serviceType;
  this.serviceFilter = serviceFilter;
  this.deletedByUser = deletedByUser;
  this.channelTitle = channelTitle;
  this.channelDisplayTitle = channelDisplayTitle;
  this.transponder = transponder;
};

module.exports = channel;
