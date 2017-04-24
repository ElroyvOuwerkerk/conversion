<script>
  $(function(){
    try {
      //Set abTest variables
      var abProv = "LROY",
          prefix = "001",
          variants = ["0"],
          hypothesis = "hypothesis"
          eventName = "company-event",
          //variantName = hypothesis,
          changes = {
            1: {
              variants: {
                1: {
                  execute: function () {
                    alert("Running");
                  }
                }
              }
            }//,
            // 2: {
            //     variants: {
            //         1: {
            //             execute: function () {

            //             }
            //         },
            //         2: {
            //             execute: function () {

            //             }
            //         }
            //     }
            // }
          };

      //Function of cookie creation
      function createCookie(name, value, days) {
        var expires = "";
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 9000));
          expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
      }
      //Function of cookie read
      function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }
      //Creating the abTest
      function createABtest() {
        var randomChange = {{Random Number}} % variants.length;
      createCookie(abProv + prefix, variants[randomChange], 9);
      if (variants[randomChange] != "0") {
        var newcookie = variants[randomChange].split(".");
        var changeID = newcookie[0];
        var variantID = newcookie[1];

        changes[changeID]["variants"][variantID].execute();
        sendDimension(changeID, variantID);
      } else {
        sendDimension(0);
      }

    }
    //Sending variables to GTM dataLayer (to capture in Google Analytics)
    function sendDimension(changeID, variantID) {
      setTimeout(function(){
        if (changeID != 0) {
          dataLayer.push({
            "event": eventName,
            "eventCategory": "abTest",
            "eventAction": abProv + prefix + " : " + hypothesis,
            "eventLabel": abProv + prefix + " : " + hypothesis + " : " + changeID + "-" + variantID,
            "non-interact": 1
          });
          hj("trigger", abProv + prefix + "-" + changeID + "-" + variantID);
          //console.info(abProv + prefix + "-" + changeID + "-" + variantID);
        } else {
          dataLayer.push({
            "event": eventName,
            "eventCategory": "abTest",
            "eventAction": abProv + prefix + " : " + hypothesis,
            "eventLabel": abProv + prefix + " : " + hypothesis + " : control",
            "non-interact": 1
          });
          hj("trigger", abProv + prefix + "-control");
          //console.info(abProv + prefix + "-control");
        }
      }, 2500);
    }
    //Check if specific cookie exists
    function checkCookie(name) {
      ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(name) > -1) return true;
      }
      return false;
    }
    function eraseCookie(name) {
      createCookie(name, "", -1);
    }

    for (var j in changes) {
      for (var x in changes[j]["variants"]) {
        variants.push(j + "." + x);
      }
    }

    if (readCookie(abProv + prefix)) {
      if (variants.indexOf(readCookie(abProv + prefix)) != -1) {
        var currentCookie = readCookie(abProv + prefix).split(".");
        var currentChangeID = currentCookie[0];
        var currentVariantID = 0;
        if (currentChangeID != 0) {
          currentVariantID = currentCookie[1];
          changes[currentChangeID]["variants"][currentVariantID].execute();
        }
        sendDimension(currentChangeID, currentVariantID);
      } else {
        eraseCookie(abProv + prefix);
        createABtest();
      }
    } else {
      createABtest();
    }
  } catch (err) {
    dataLayer.push({
      "event": eventName,
      "eventCategory": "abTest-errors",
      "eventAction": err.name,
      "eventLabel":  err.message,
      "non-interact": 1
    });
  }
  });
</script>
