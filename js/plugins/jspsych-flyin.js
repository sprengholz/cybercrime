
jsPsych.plugins["flyin"] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'flyin',
        description: '',
        parameters: {
            answer: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'answer string',
                default: undefined,
                description: 'The string of words to be displayed as answer'
            },
            abortionExpected: {
                type: jsPsych.plugins.parameterType.BOOLEAN,
                pretty_name: 'abortion expectancy',
                default: undefined,
                description: 'Abortion expectancy (true/false)'
            }
        }
    };

    plugin.trial = function (display_element, trial) {


        var answerArrived = false; 
        var abortion = false;


        // store response
        var response = {
            rt: null,
            key: null
        };

        var animationtimeline = anime.timeline({
            autoplay: false,
            complete: function(anim){
                
                if (abortion == trial.abortionExpected) {
                    $('.silhouetteFixed').css('background-image', "url('img/positive.jpg')");
                } else {
                    $('.silhouetteFixed').css('background-image', "url('img/negative.jpg')");
                }
                
                answerArrived = true;
                
                setTimeout(function () {
                    end_trial(false);
                }, 500);
            }
        });


        var end_trial = function () {

            // kill keyboard listeners
            if (typeof keyboardListener !== 'undefined') {
                jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
            }

            // collect data
            var trial_data = {
                // TODO: add all other data here (question, target,...)
                "trial_correct": (abortion == trial.abortionExpected),
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
                        abortion = true;
                        $('.flyin').html(trial.answer);
                        
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
        display_element.innerHTML = ' <div class="silhouetteFixed" style="background-image: url(\'img/neutral.jpg\');">  </div>   <div class="flyin">' + trial.answer + '</div>';
        
        console.log("ABORTION EXPECTED: " + trial.abortionExpected);
        
        // animation

        animationtimeline
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
