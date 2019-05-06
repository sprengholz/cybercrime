
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
                    //$('.silhouetteFixed').css('background-image', "url('img/positive.jpg')");

                    anime({
                        targets: "#mouth",
                        duration: 1000,
                        d: "M17 50 Q 25 50 33 50", 
                        autoplay: true
                    });
                } else {
                    //$('.silhouetteFixed').css('background-image', "url('img/negative.jpg')");

                    anime({
                        targets: "#mouth",
                        duration: 1000,
                        d: "M17 51 Q 25 48 33 49", 
                        autoplay: true
                    });
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
        display_element.innerHTML = ' <div class="silhouetteFixed"> <svg viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg"><g id="hat"><polygon id="hatTop" points="6,15 42,15 46,9 24,1 2,9" fill="none" stroke="black" /><polyline id="hatMiddle" points="6,15 6,18 42,18 42,15" fill="none" stroke="black" /><path id="hatShield" d="M6,18 Q 25 30 42 18" stroke="black" fill="transparent"/><circle id="hatBadge" cx="24" cy="9" r="3" stroke="black" fill="transparent"/></g><line id="browLeft" x1="10" y1="27" x2="20" y2="29" stroke="black" /><line id="browRight" x1="28" y1="29" x2="38" y2="27" stroke="black" /><ellipse id="eyeLeft" cx="15" cy="34" rx="2" ry="2" /><ellipse id="eyeRight" cx="33" cy="34" rx="2" ry="2" /><path id="mouth" d="M17 50 Q 25 50 33 50" stroke="black" fill="transparent"/></svg> </div>   <div class="flyin">' + trial.answer + '</div>';
        
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
