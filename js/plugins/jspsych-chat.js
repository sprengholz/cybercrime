/** 
 */

jsPsych.plugins['chat'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'chat',
        description: '',
        parameters: {
            title: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Chat heading',
                default: undefined,
                description: 'Chat heading'
            },
            instruction: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Chat instruction',
                default: undefined,
                description: 'Chat instruction'
            },
            conversation_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Conversation name',
                default: undefined,
                description: 'Conversation name'
            },
            conversation: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: 'Conversation',
                default: undefined,
                description: 'Conversation'
            },
            mistake_fn: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Mistake function',
                default: function () {},
                description: 'Function called in case of wrong answer'
            },
            correct_fn: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Correct function',
                default: function () {},
                description: 'Function called in case of correct answer'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        start_time = (new Date()).getTime();
        attempts = [];

        load(display_element, 'chat.html', function() {
            
            // show title and instruction
            $('#instructionTitle').text(trial.title);
            $('#instructionText').text(trial.instruction);
            $('#conversation_name').text(trial.conversation_name);
            
            
            // show initial messages of other
            
            if (trial.conversation.length !== 0)
            {
                while (trial.conversation[0].person !== 'Subject')
                {
                    sendMessage(trial.conversation[0]);
                    trial.conversation.shift();
                }
            }
            
            display_element.querySelector('#sendMessageButton').addEventListener('click', check);
            display_element.querySelector('#finishChatButton').addEventListener('click', finishChat);
            
        });
            
        var check = function() {
            
            field = $('#messageInput');
            textToSend = field.val().trim();
            
            attempts.push(textToSend);
            
            if (trial.conversation.length !== 0)
            {
                if (trial.conversation[0].person === 'Subject')
                {
                    var secretText = trial.conversation[0].secret.trim();
                    var nonsecretText = trial.conversation[0].nonsecret.trim();
                    //older, more rigid check on equality: if (expectedText.toLowerCase() === textToSend.toLowerCase())
                    if (textToSend.toLowerCase().includes(nonsecretText.toLowerCase()) && !textToSend.toLowerCase().includes(secretText.toLowerCase()))
                    {
                        //older: sendMessage(trial.conversation[0]);
                        sendMessage({person: 'Subject', text: textToSend});
                        field.val("");
                        trial.conversation.shift();
                        trial.correct_fn();
                    }
                    else
                    {
                        //field.css('background', '#ffaaaa');
                        trial.mistake_fn();
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
            
            // falls keine Nachrichten mehr vorhanden, Button zum Beenden des Trials einblenden
            if (trial.conversation.length === 0)
            {
                // Sendebutton ausgrauen
                // Weiter Button sichtbar machen
                setTimeout(function(){
                  
                    $('#chatOverlay').css("display", "flex").hide().fadeIn("slow");
                    //$('#chatOverlay').css('visibility', 'visible');    
                },7000);
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
                $('#messageArea').append('<div class="message"><div class="messageOther" style="display: none;">'+message.text+'</div></div>').slideDown("fast");
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
