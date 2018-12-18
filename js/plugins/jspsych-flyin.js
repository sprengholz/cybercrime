
jsPsych.plugins["flyin"] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'flyin',
        description: '',
        parameters: {
            question: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'question string',
                default: 'None',
                description: 'The string of words to be displayed as question'
            },
            answer: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'answer string',
                default: 'None',
                description: 'The string of words to be displayed as answer'
            },
            abortionExpected: {
                type: jsPsych.plugins.parameterType.BOOLEAN,
                pretty_name: 'abortion expectancy',
                default: 'None',
                description: 'Abortion expectancy (true/false)'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        var answerArrived = false; 
        
        // store response
        var response = {
            rt: null,
            key: null
        };

        var animationtimeline = anime.timeline({
            autoplay: false,
            complete: function(anim){
                
                $('.silhouetteFixed').css('background-image', "url('img/symbols/person_yellow_male.jpg')");
                answerArrived = true;
                
                setTimeout(function () {
                    
                    end_trial(false);
                }, 1000);

            }
        });


        var end_trial = function (aborted) {

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // Trial beenden

            var trial_data = {
                "question": trial.question,
                "answer": trial.answer,
                "abortionExpected": trial.abortionExpected,
                "aborted": aborted  
            };

            // clear display
            display_element.innerHTML = '';

       

            // finish trial
            jsPsych.finishTrial(trial_data);

        };


        var after_response = function (info) {


            // only record the first response
            if (response.key === null) {
                response = info;
            }

            // only react to key press before answer arrived
            if (!answerArrived)
            {
                animationtimeline.pause();
                
                anime({
                    targets: ".flyin",
                    duration: 1000,
                    top: 600,
                    opacity: 0,                
                    autoplay: true,
                    complete: function(anim){
                        end_trial(true);
                    }
                  });
                
            }
        };

        // start the response listener

        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: [32],
            rt_method: 'date',
            persist: false,
            allow_held_key: false
        });





        // show stimulus word by word

        display_element.innerHTML = '<div class="dialogbox"> ' + trial.question + ' </div> <div class="silhouetteFixed" style="background-image: url(\'img/symbols/person_male.jpg\');">  </div>   <div class="flyin">' + trial.answer + '</div>';
              
        // animation



        animationtimeline
                .add({
                    targets: ".dialogbox",
                    top: 140,
                    duration: 500,
                    opacity: 1.0,
                    easing: 'linear',
                    offset: '+=1000'
                })
                .add({
                    targets: ".flyin",
                    duration: 1,
                    opacity: 1.0,
                    offset: '+=1000'
                })
                .add({
                    targets: ".flyin",
                    duration: 2000,
                    top: 400,
                    easing: 'linear',
                    fontSize: '16px'
                })
                .add({
                    targets: ".flyin",
                    duration: 1,
                    opacity: 0
                });

        animationtimeline.play();

    };

    return plugin;
})();
