const CONFIDENCE_SCORE_THRESHOLD = 0.85;

module.exports = {
  
  buildFromWitNlpEntities: function(entities) {
    var instruction = {
      onOff: "off",
      pinNum: 0
    };

    if(entities["on_off"] && entities["on_off"][0]["confidence"] > CONFIDENCE_SCORE_THRESHOLD) {
      instruction.onOff = entities["on_off"][0]["value"];
    }

    if(entities["socket_name"] && entities["socket_name"][0]["confidence"] > CONFIDENCE_SCORE_THRESHOLD) {
        var pinName = entities["socket_name"][0]["value"];

        if(pinName == "bedroom") {
          instruction.pinNum = 1;
        } else if(pinName == "bathroom") {
          instruction.pinNum = 2;
        } else if(pinName == "kitchen") {
          instruction.pinNum = 3;
        }
    }
    
    if(entities["ordinal"] && entities["ordinal"][0]["confidence"] > CONFIDENCE_SCORE_THRESHOLD) {
      var ordinalValue = entities["ordinal"][0]["value"];
      if(ordinalValue > 0 && ordinalValue <= 3) {
        instruction.pinNum = ordinalValue;
      }
    }

    if(entities["duration"] && entities["duration"][0]["confidence"] > CONFIDENCE_SCORE_THRESHOLD) {
      var durationInSeconds = entities["duration"][0]["normalized"]["value"];
      
      var now = new Date();
      now.setSeconds(now.getSeconds() + durationInSeconds);
      
      instruction.executeAfter = now;
    }
    
    // Temporary. Need to be replaced.
    instruction.homeId = 1;

    return instruction;
  }
};