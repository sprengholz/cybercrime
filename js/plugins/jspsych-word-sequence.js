
jsPsych.plugins["word-sequence"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'word-sequence',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'stimulus',
        default: 'None',
        description: 'The string of words to be displayed'
      },
      image: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'stimulus',
        default: 'male or female',
        description: 'male or female image indication'
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    var elements = trial.stimulus.split(' ');
    
    // show stimulus word by word
    
    display_element.innerHTML = '<div class="silhouette-'+trial.image+'"> <div class="question">'+elements[0]+'</div> </div>'; 
    
    var i = 1;                    
    function loop () {
       
       setTimeout(function () {    
          display_element.innerHTML = '<div class="silhouette-'+trial.image+'"> <div class="question">'+elements[i]+'</div> </div>';       
          i++;                     
          if (i < elements.length) {            
             loop();            
          }    
          else
          {
              setTimeout(function () {
                  finishSequence();
              }, 250 + elements[i-1].length * 25);
          }
       }, 250 + elements[i-1].length * 25);
    }

    loop(); 
    
    
    /*
    (function loop (i) {          
        setTimeout(function () {  
            console.log(elements[i]);
            display_element.innerHTML = '<div class="question">'+elements[i]+'</div>';               
            if (--i) loop(i);     
        }, 250+elements[i]*25);
    })(elements.length); */ 
    
    var finishSequence = function() {
            
            
            // Trial beenden
                
            var trial_data = {
                "stimulus": trial.stimulus
            };

            // clear display
            display_element.innerHTML = '';

            // finish trial
            jsPsych.finishTrial(trial_data); 

        };



  };

  return plugin;
})();
