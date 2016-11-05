var Parser = function() {
  const fs = require('fs'), xml2js = require('xml2js'),
    Transponder = require('../models/transponder.js'),
    Channel = require('../models/channel.js')

  this.parseFile = function(path) {
    return new Promise(function(resolve, reject) {
      fs.readFile(path, {encoding:'utf8'}, function(err, data) {
        if (err) {
          reject(err)
        } else {
          var xml = new xml2js.Parser()
          xml.parseString(data, function(error, result) {
            if (error) {
              reject(err)
            } else {
              var root = result.SdbRoot
              resolve(parseXml(root))
            }
          })        }
      })
    })
  }

  function parseXml(rootNode) {
    return new Promise(function(resolve, reject) {
      var sdbCNode = rootNode.SdbXml[0].sdbC[0]

      // Transponder Node
      var multiplexNode = sdbCNode.Multiplex[0]
      var tsDescrNode = sdbCNode.TS_Descr[0]
      concatDict(multiplexNode, tsDescrNode)
      // Channel Node
      var serviceNode = sdbCNode.Service[0]

      var promise1 = getTransponders(multiplexNode)
      var promise2 = getChannels(serviceNode)

      Promise.all([promise1, promise2]).then(resolve)
      .catch(reject)
    })
  }

  function getChannels(obj) {
    return new Promise(function(resolve, reject) {
      var caModeArray = getArrayFromString(obj.dvb_info[0].t_free_ca_mode[0]._)
      var serviceTypeArray = getArrayFromString(obj.dvb_info[0].ui1_sdt_service_type[0]._)
      var serviceFilterArray = getArrayFromString(obj.ServiceFilter[0]._)
      var deletedByUserArray = getArrayFromString(obj.b_deleted_by_user[0]._)
      var channelTitleArray = getArrayFromString(obj.Name[0]._)
      var sortingArray = getArrayFromString(obj.No[0]._)
      //TODO Handle empty strings => will be skiped atm
      // var displayTitleArray = getArrayFromString(obj.dvb_info[0].s_svc_name[0]._)
      var muxIdArray = getArrayFromString(obj.MuxID[0]._)

      if (validateArrays({caModeArray, serviceTypeArray, serviceFilterArray, deletedByUserArray, channelTitleArray, muxIdArray})) {
        var channels = new Array()

        for (index in caModeArray) {
          var caMode = caModeArray[index]
          var serviceType = serviceTypeArray[index]
          var serviceFiler = serviceFilterArray[index]
          var deletedByUser = deletedByUserArray[index]
          var channelTitle = channelTitleArray[index]
          var muxId = muxIdArray[index]

          var channel = new Channel(caMode, serviceType, serviceFiler, deletedByUser, channelTitle, muxId)
          channels.push(channel)
        }
        resolve({
          channels: channels,
          sorting: sortingArray
        })
      } else {
        reject(Error('Given Channel Node is inconsistent'))
      }
    })
  }

  function getTransponders(obj) {
    return new Promise(function(resolve, reject) {
      var freqArray = getArrayFromString(obj.SysFreq[0]._)
      var symRateArray = getArrayFromString(obj.ui4_sym_rate[0]._)
      var netIdArray = getArrayFromString(obj.Nid[0]._)
      var tsIdArray = getArrayFromString(obj.Tsid[0]._)
      var muxIdArray = getArrayFromString(obj.MuxID[0]._)

      if (validateArrays({freqArray, symRateArray, netIdArray, tsIdArray,muxIdArray})) {
        var transponders = new Array()

        for (index in freqArray) {
          var freq = freqArray[index]
          var symRate = symRateArray[index]
          var netId = netIdArray[index]
          var tsId = tsIdArray[index]
          var muxId = muxIdArray[index]

          var transponder = new Transponder(freq, symRate, netId, tsId, muxId)
          transponders.push(transponder)
        }
        resolve({transponders: transponders})
      } else {
        reject(Error('Given Transponder Node is inconsistent'))
      }
    })
  }

  // Concat two dictionaries - needed for transponder generation
  function concatDict(dict1, dict2) {
    for (key in dict2) {
      dict1[key] = dict2[key]
    }
  }

  // Split the xml content string into seperate values
  function getArrayFromString(string) {
    return string.split('\n').filter(function(s) { return s !== '' })
  }

  // compare the lengh of the given arrays
  function validateArrays(arrays) {
    var keys = Object.keys(arrays)
    const refLength = arrays[keys[0]].length

    for (key of keys) {
      var obj = arrays[key]

      if (obj.length !== refLength) { return false }
    }
    return true
  }
}

module.exports = Parser
