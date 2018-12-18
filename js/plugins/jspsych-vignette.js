/** 
 */

jsPsych.plugins['vignette'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'vignette',
        description: '',
        parameters: {
            file: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Vignette file',
                default: undefined,
                description: 'Vignette file'
            },
            partner_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Name of partner',
                default: 'undefined',
                description: 'Name of partner'
            },
            affair_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Name of affair',
                default: 'undefined',
                description: 'Name of affair'
            },
            friend_name: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Name of friend',
                default: 'undefined',
                description: 'Name of friend'
            },
            partner_icon: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Icon of partner',
                default: 'undefined',
                description: 'Icon of partner'
            },
            affair_icon: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Icon of affair',
                default: 'undefined',
                description: 'Icon of affair'
            },
            friend_icon: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Icon of friend',
                default: 'undefined',
                description: 'Icon of friend'
            },
            minimum_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Minimum show time',
                default: 0,
                description: 'Minimum show time'
            }, 
            toofast_fn: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Speed too fast function',
                default: function () {},
                description: 'Function called in case of skipping the read'
            }

        }
    };

    plugin.trial = function (display_element, trial) {

        startTime = (new Date()).getTime();
        duration = 0;
        attempts = 1;

        load(display_element, trial.file, function () {
            
            $('.partner_name').each(function(){
                $(this).text(trial.partner_name);
            });
            
            $('.affair_name').each(function(){
                $(this).text(trial.affair_name);
            });
            
            $('.friend_name').each(function(){
                $(this).text(trial.friend_name);
            });
            
            $('.partner_icon').each(function(){
                $(this).attr("src",trial.partner_icon);
            });
            
            $('.affair_icon').each(function(){
                $(this).attr("src",trial.affair_icon);
            });
            
            $('.friend_icon').each(function(){
                $(this).attr("src",trial.friend_icon);
            });

            display_element.querySelector('#finishVignetteButton').addEventListener('click', check);
        });

        var check = function () {

            duration = (new Date()).getTime() - startTime;

            if (duration > trial.minimum_duration)
            {
                finishVignette();
            } else
            {
                attempts++;
                trial.toofast_fn();
            }
        };

        var finishVignette = function () {


            // Trial beenden

            var trial_data = {
                rt: duration,
                attempts: attempts
            };

            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);

        };

    };





    // helper to load via XMLHttpRequest


    function load(element, file, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file, true);
        xmlhttp.onload = function () {
            if (xmlhttp.status === 200 || xmlhttp.status === 0) { //Check if loaded
                element.innerHTML = xmlhttp.responseText;
                callback();
            }
        };
        xmlhttp.send();
    }



    return plugin;
})();
