
jsPsych.plugins['name'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'name',
        description: '',
        parameters: {
            title: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Instruction heading',
                default: undefined,
                description: 'Instruction heading'
            }, 
            instruction: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Instruction text',
                default: undefined,
                description: 'Instruction text'
            },
            mistake_fn: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Mistake function',
                default: function () {},
                description: 'Function called in case of wrong answer'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        start_time = (new Date()).getTime();

        load(display_element, 'name.html', function () {

            // set title and instruction
            $('#title').text(trial.title);
            $('#text').text(trial.instruction);

            // add event listener to next button
            display_element.querySelector('#next').addEventListener('click', finishNaming);
            
        });


        var finishNaming = function () 
        {
            
            name = $("#name").val().toLowerCase();
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            if (name === "")
            {
                trial.mistake_fn();
            }
            else
            {
                var trial_data = {
                    "rt": (new Date()).getTime() - start_time,
                    "name": name
                };

                display_element.innerHTML = '';
                jsPsych.finishTrial(trial_data);
            }
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
