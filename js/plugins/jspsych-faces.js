
jsPsych.plugins['faces'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'faces',
        description: '',
        parameters: {
            title: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Selection heading',
                default: undefined,
                description: 'Selection heading'
            }, 
            instruction: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Selection instruction',
                default: undefined,
                description: 'Selection instruction'
            },
            faces: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: 'Faces',
                default: undefined,
                description: 'Faces'
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

        load(display_element, 'faces.html', function () {

            // set title and instruction
            $('#title').text(trial.title);
            $('#text').text(trial.instruction);

            // add images to html
            if (trial.faces.length !== 0)
            {
                for (i=0; i<trial.faces.length; i++)
                {    
                    facehtml =  '<div class="facecontainer">';
                    facehtml += '<input id="face'+i+'" type="radio" name="face" value="'+trial.faces[i]+'" />';
                    facehtml += '<label id="facelabel'+i+'" class="face '+trial.faces[i]+'" for="face'+i+'"></label>';
                    facehtml += '</div>';
                    
                    $('.face-selector').append(facehtml);
                    
                    // add event listener to faces
                    display_element.querySelector('#face'+i).addEventListener('change', showNamingField);
                }
            }

            // add event listener to next button
            display_element.querySelector('#next').addEventListener('click', finishSelection);
        });


        var showNamingField = function ()
        {
            val = $("input[name='face']:checked").val();
            id = parseInt($("input[name='face']:checked").attr('id').slice(-1));
            $('#naming').insertAfter($('#facelabel'+id));
            $('#naming').css("display", "block").show();
            $('#naming').focus();
        };

        var finishSelection = function () 
        {
            selection = $("input[name='face']:checked").val();
            name = $("#naming").val().toLowerCase();
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            if (selection === undefined || name === "")
            {
                trial.mistake_fn();
            }
            else
            {
                var trial_data = {
                    "rt": (new Date()).getTime() - start_time,
                    "selection": selection,
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
