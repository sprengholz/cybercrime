
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

        var abortion;
        var abortionDefault = 'Keine Ahnung';
        var answerArrived = false; 
        
        // randomly decide to start with true or abortion answer
        if (Math.random() < 0.5){
            abortion = true;
        } else {
            abortion = false;
        }


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


        var end_trial = function () {

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // collect data
            var trial_data = {
                "question": trial.question,
                "answer": trial.answer,
                "abortion_expected": trial.abortionExpected,
                "aborted": abortion  
            };

            // clear display
            display_element.innerHTML = '';

            // finish trial
            jsPsych.finishTrial(trial_data);

        };


        var after_response = function (info) {

            if (!answerArrived) {

                animationtimeline.pause();

                anime({
                    targets: ".flyin",
                    duration: 500,
                    top: '+=50',
                    opacity: 0,                
                    autoplay: true,
                    complete: function(anim){
                        abortion = !abortion;
                        if (abortion){
                            $('.flyin').html(abortionDefault);
                        } else {
                            $('.flyin').html(trial.answer);
                        }
                        animationtimeline.seek(1500);
                        animationtimeline.play();
                    }
                });
            }
        };


        // start the response listener

        var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: [32],
            rt_method: 'date',
            persist: true,
            allow_held_key: false
        });


        // show stimulus word by word
        
        if (abortion) {
            display_element.innerHTML = '<div class="dialogbox"> ' + trial.question + ' </div> <div class="silhouetteFixed" style="background-image: url(\'img/symbols/person_male.jpg\');">  </div>   <div class="flyin">' + abortionDefault + '</div>';
        } else {
            display_element.innerHTML = '<div class="dialogbox"> ' + trial.question + ' </div> <div class="silhouetteFixed" style="background-image: url(\'img/symbols/person_male.jpg\');">  </div>   <div class="flyin">' + trial.answer + '</div>';
        }
        
        
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
                    offset: '+=500'
                })
                .add({
                    targets: ".flyin",
                    duration: 2000,
                    top: 400,
                    easing: 'linear',
                    fontSize: '16px',
                    offset: '+=500'
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
