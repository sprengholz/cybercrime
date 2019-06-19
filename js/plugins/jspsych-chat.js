/** 
 * Modified chat plugin (differs from first - more general - version used for masters thesis)
 */

jsPsych.plugins['chat'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'chat',
        description: '',
        parameters: {
            conversation: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: 'Conversation',
                default: undefined,
                description: 'Conversation'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        start_time = (new Date()).getTime();
        attempts = [];

        load(display_element, 'chat.html', function() {
            
            // show initial messages of other
            
            if (trial.conversation.length !== 0)
            {
                while (trial.conversation[0].person !== 'Subject')
                {
                    sendMessage(trial.conversation[0]);
                    trial.conversation.shift();
                }
            }
            
            display_element.querySelector('#openPressTextButton').addEventListener('click', openPressText);
            display_element.querySelector('#sendMessageButton').addEventListener('click', check);
            
        });

        function openPressText(){
            $('#presstextContainer').html(presstext);
            $('#presstextContainer').slideDown();
        }
            
        var check = function() {

            field = $('#messageInput');
            textToSend = field.val().trim();
            if (textToSend.length == 0){
                textToSend = "&nbsp;";
            }
            
            attempts.push(textToSend);
            
            if (trial.conversation.length !== 0)
            {
                if (trial.conversation[0].person === 'Subject')
                {
                    var answerOk = false;

                    // send message and clear input
                    sendMessage({person: 'Subject', text: textToSend});
                    field.val("");

                    if (trial.conversation[0].evaluate_answer){
                        if (trial.conversation[0].secret === null){
                            // there is just a correct answer, nothing secret (e.g. How old are you?)
                            var nonsecretText = trial.conversation[0].nonsecret.trim();
                            if (textToSend.toLowerCase().includes(nonsecretText.toLowerCase())) {
                                sendMessage({person: 'Other', text: trial.conversation[0].nonsecret_message});
                                answerOk = true;
                            } else {
                                sendMessage({person: 'Other', text: trial.conversation[0].missing_message});
                            }
                        } else {
                            // there is a secret (e.g. What was stolen?)
                            var secretText = trial.conversation[0].secret.trim();
                            var nonsecretText = trial.conversation[0].nonsecret.trim();
                            // secret uttered (e.g. a book)
                            if (textToSend.toLowerCase().includes(secretText.toLowerCase())) {
                                sendMessage({person: 'Other', text: trial.conversation[0].secret_message});
                                answerOk = true;
                            // nonsecret uttered (e.g. a pen)
                            } else if (textToSend.toLowerCase().includes(nonsecretText.toLowerCase())) {
                                sendMessage({person: 'Other', text: trial.conversation[0].nonsecret_message});
                                answerOk = true;
                            // neither uttered (e.g. I dont know)
                            } else {
                                sendMessage({person: 'Other', text: trial.conversation[0].missing_message});
                            }
                        }
                    } else {
                        // do not eval answer, just post the reply
                        sendMessage({person: 'Other', text: trial.conversation[0].message});
                        answerOk = true;
                    }
                    
                    // next message
                    if (answerOk) {
                        trial.conversation.shift();
                    }
                    
                }
                
                // falls noch Nachrichten vorhanden, Folgenachrichten von Other zeigen
                while(trial.conversation.length !== 0)
                {
                    if (trial.conversation[0].person !== 'Subject')
                    {
                        sendMessage(trial.conversation[0]);
                        trial.conversation.shift();
                    }
                    else
                    {
                        break;
                    }
                }
            }
            
            // falls keine Nachrichten mehr vorhanden, Chat beenden
            if (trial.conversation.length === 0)
            {
                $("#sendMessageButton").hide();
                setTimeout(function(){
                    finishChat();   
                },5000);
            }
        };
        
        var finishChat = function() {
            
            
            // Trial beenden
                
                var trial_data = {
                    "attempts" : attempts,
                    "rt": (new Date()).getTime() - start_time
                };
                
                display_element.innerHTML = '';
                jsPsych.finishTrial(trial_data); 
            
        };




    };
    
    
    function sendMessage(message)
    {
        // append message and scroll down
        if (message.person === 'Subject')
        {
            
            $('#messageArea').append('<div class="message"><div class="messageSubject" style="display: none;">'+message.text+'</div></div>').slideDown("fast");
            $('div.messageSubject').fadeIn();
            $('#messageArea').scrollTop(1E10);
        }
        else
        {
            setTimeout(function(){
                $('#messageArea').append('<div class="message"><div class="messageOther" style="display: none;"><code>'+message.text+'</code></div></div>').slideDown("fast");
                $('div.messageOther').fadeIn();
                $('#messageArea').scrollTop(1E10);
            },1000);
            
        }
        
    }

    

    
    
      // helper to load via XMLHttpRequest
  function load(element, file, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", file, true);
    xmlhttp.onload = function(){
        if(xmlhttp.status === 200 || xmlhttp.status === 0){ //Check if loaded
            element.innerHTML = xmlhttp.responseText;
            callback();
        }
    };
    xmlhttp.send();
  }



    return plugin;
})();
