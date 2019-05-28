
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


        var timePassed = false;
        var aborted = false;
        var keyPressed = false;

        

        // store response
        var response = {
            rt: null,
            key: null
        };

        var animationtimeline = anime.timeline({
            autoplay: false,
            complete: function(anim){

                
                end_trial(false);
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
                "trial_correct": (aborted == trial.abortionExpected),

                "trial_question": jsPsych.timelineVariable('question')(),
                "trial_secrecy": jsPsych.timelineVariable('secrecy')(),
                "trial_target": jsPsych.timelineVariable('target')(),
                "trial_matching": jsPsych.timelineVariable('matching')(),
                "trial_rt": response.rt,
            };

            console.log("RT = "+response.rt);

            // clear display
            display_element.innerHTML = '';

            // finish trial
            jsPsych.finishTrial(trial_data);

        };


        var after_response = function (info) {


            if (!keyPressed) {
                keyPressed = true;

                if (!timePassed) {

                    console.log("ABORTED: "+aborted);
                    console.log("TPASSED: "+timePassed);

                    // record first response
                    if (response.key == null) {
                        response = info;
                    }

                    animationtimeline.pause();

                    $('#flyin').html('<s><code>'+trial.answer+'</code></s>');

                    anime({
                        targets: "#flyin",
                        duration: 500,           
                        autoplay: true,
                        complete: function(){
                            aborted = true;
                            console.log("ABORTED 2: "+aborted);
                            animationtimeline.complete();
                        }
                    });
                }
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
        display_element.innerHTML = '<div id="flyin"><code>' + trial.answer + '</code></div>';
        
        
        // animation
        animationtimeline
                .add({
                    targets: '#flyin',
                    duration: 10,
                    opacity: 1.0,
                    offset: '+=0'
                })
                .add({
                    targets: '#flyin',
                    duration: 1500,
                    offset: '+=0',
                    complete: function() {
                        timePassed = true;
                    }
                })
                .add({
                    targets: '#flyin',
                    duration: 500,
                    opacity: 0.3,
                    top: $(window).height()*0.35,
                    easing: 'easeInCubic',
                    fontSize: '16px'
                })
                .add({
                    targets: '#flyin',
                    duration: 1,
                    opacity: 0
                });
        animationtimeline.play();
    };

    return plugin;
})();
