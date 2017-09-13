/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        var recognition = new SpeechRecognition();
        recognition.maxAlternatives = 5;
        recognition.onresult = function(event) {
          if (event.results.length > 0) {
            var result = event.results[0];
            for (var i = 0; i < result.length; ++i) {
              var text = result[i].transcript;
              var isFinal = result[i].final;
              var confidence = result[i].confidence;
              var resultDiv = $("<li>")
                .addClass("success")
                .append($("<div>")
                .click(function(){
                  TTS.speak({
                    text   : $(this).children("b").text(),
                    locale : 'en-US',
                    rate   : 0.75
                  }, function () {
                      console.log('speak success');
                  }, function (reason) {
                      console.log('speak error : '+reason);
                  });
                })
                  .append($("<b>").text(text))
                  .append($("<div>").text("Confidence : "+confidence))
                  .append($("<div>").text("Is Final : "+isFinal))
                );
                console.log(resultDiv);
              $("#output").append(resultDiv);
              $("#click").attr("state", "waiting");
              $("#click").text("Click to Speak");
            }
          }
        }
        recognition.onerror = function(event){
          var error = event.error;
          var message = event.message;
          var resultDiv = $("<li>")
            .addClass("error")
            .append($("<div>")
              .append($("<b>").text("Error"))
              .append($("<div>").text("Code : "+error))
              .append($("<div>").text("Message : "+message))
            );

            console.log(resultDiv);
          $("#output").append(resultDiv);
          $("#click").attr("state", "waiting");
          $("#click").text("Click to Speak");
        }

        function start() {
          if("waiting" == $("#click").attr("state")){
            window.recognition.start();
            $("#click").attr("state", "running");
            $("#click").text("Listening");
          }else{
            window.recognition.stop();
            $("#click").attr("state", "waiting");
            $("#click").text("Click to Speak");
          }
        }
        $("#click").on("click", start);
        window.recognition = recognition;
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
        //
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
