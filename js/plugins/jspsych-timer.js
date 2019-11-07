
jsPsych.plugins["timer"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'timer',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'stimulus',
        default: 'None',
        description: 'The string of words to be displayed'
      },

      duration: {
        type: jsPsych.plugins.parameterType.INTEGER,
        pretty_name: 'duration',
        default: 1000,
        description: 'Display duration'
      }
    }
  };

  plugin.trial = function (display_element, trial) {

    // show stimulus

    display_element.innerHTML = '<div class="question">' + trial.stimulus + ' </div> <svg id="progress" width="300" height="20"><rect id="progress-border" x="1" y="1" width="290" height="18" rx="9" /><rect id="progress-bar" x="5" y="5" width="10" height="10" rx="5" /></svg>';

    anime({
      targets: "#progress-bar",
      duration: trial.duration,           
      autoplay: true,
      width: 282,
      easing: 'linear',
      complete: function(){
        var trial_data = {
          "stimulus": trial.stimulus
        };

        // clear display
        display_element.innerHTML = '';

        // finish trial
        jsPsych.finishTrial(trial_data);
      }
    });


   

  };

  return plugin;
})();
