/** 
 */

jsPsych.plugins['dichotomous-choice'] = (function () {

    var plugin = {};

    plugin.info = {
        name: 'dichotomous-choice',
        description: '',
        parameters: {
            title: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Heading',
                default: undefined,
                description: 'Heading'
            },
            instruction: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Instruction',
                default: undefined,
                description: 'Instruction'
            },
            statements: {
                type: jsPsych.plugins.parameterType.OBJECT,
                pretty_name: 'Statements to be categorized as right or wrong',
                default: undefined,
                description: 'Statements to be categorized as right or wrong'
            },
            mistake_fn: {
                type: jsPsych.plugins.parameterType.FUNCTION,
                pretty_name: 'Mistake function',
                default: function () {},
                description: 'Function called in case of wrong answers'
            }
        }
    };

    plugin.trial = function (display_element, trial) {

        html =  '<div class="topmargincontainer"><div class="instruction"><div class="heading">'+trial.title+'</div><div class="smalltext">'+trial.instruction+'</div></div>';
        html += '<table id="mctable"><tr><th></th><th>Richtig</th><th>Falsch</th></tr>';
        
        for (i=0; i<trial.statements.length; i++) 
        {
            correct = undefined;
            incorrect = undefined;
            if (trial.statements[i].correct === true)
            {
                correct = 'mark';
                incorrect = 'nomark';
            }
            else
            {
                correct = 'nomark';
                incorrect = 'mark';
            }
            
            html += '<tr><td class="tdleft">'+trial.statements[i].text+'</td><td><input type="radio" name="stm'+i+'" value="'+correct+'"></td><td><input type="radio" name="stm'+i+'" value="'+incorrect+'"></td></tr>';
        }
        
        html += '</table><button type="button" id="next" class="navbutton">Weiter</button></div>';
        display_element.innerHTML = html;
        
        attempts = [];

        var check = function() {

            inputValues = $("input:checked").map(function () {
                return $(this).val();
            }).toArray();
            attempts.push(inputValues);

            if ($("input[value='mark']:checked").length === $("input[value='mark']").length)
            {
                var trial_data = {
                    'statements' : trial.statements,
                    'attempts' : attempts
                };
                display_element.innerHTML = '';
                jsPsych.finishTrial(trial_data); 
            } 
            else
            {
                trial.mistake_fn();
            }   
            
        };
        
        display_element.querySelector('#next').addEventListener('click', check);
        
    };

    return plugin;
})();
