window.AnnoColors = function(img_sel, color_list){
  
  var that = this;
  var cur_color = color_list[0].color;
  var color2label = {};

  // build color to label
  color_list.forEach(function(m){
    color2label[m.color] = m.label;
  });

  // utility function(s)
  this._reset_buttons = function(){
    document.querySelectorAll('._color_marker').forEach(function(btn){
      btn.disabled = false;
    });
  };

  // render selector buttons
  var html = '';
  color_list.forEach(function(marker){
    html += "<input class='_color_marker' style='background-color: "+ marker.color +";' type='button' value='"+ marker.label +"' /> ";
  });
  document.querySelector(img_sel).parentNode.insertAdjacentHTML('beforebegin', html + '<br>');
  document.querySelectorAll('._color_marker').forEach(function(btn){
    (function(btn){
      btn.onclick = function(){
        cur_color = btn.style.backgroundColor;
        that._reset_buttons();
        btn.disabled = true;
      }
    })(btn);
  });
  document.querySelectorAll('._color_marker')[0].click();

  // hook colorize in onSelectionCompleted event
  anno.addHandler('onSelectionCompleted', function(evt){
    // cancel event
    document.querySelector('.annotorious-editor-button-cancel').click();
    // build shape with color
    var shape = evt.shape;
    shape.style = {
      outline:   cur_color,
      stroke:    cur_color,
      hi_stroke: cur_color,
    };
    // re-draw shape
    anno.addAnnotation({ src: document.querySelector(img_sel).src,
      shapes: [ shape ],
    })     
  });

  // add annotations by color
  this.addAnnotation = function(color, an){
    an.shapes[0].style = {
      outline:   color,
      stroke:    color,
      hi_stroke: color,
    };
    anno.addAnnotation(an);
  };

  // get annotations by color
  this.getAnnotations = function(){
    var annos = {};
    color_list.forEach(function(m){
      annos[m.label] = [];
    });
    anno.getAnnotations().forEach(function(an){
      var c = an.shapes[0].style.stroke;
      var l = color2label[c];
      annos[l].push(an);
    });
    return annos;
  };
}
