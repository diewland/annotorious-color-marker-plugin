window.AnnoColors = function(img_sel, color_list){
  
  var that = this;
  var cur_color = color_list[0].color;
  var img_dom = document.querySelector(img_sel);
  window.colors = [];
  var color2label = {};

  // update color values
  color_list.forEach(function(m){
    colors.push(m.color);
    color2label[m.color] = m.label;
  });

  // utility function(s)
  this._reset_buttons = function(){
    document.querySelectorAll('._color_marker').forEach(function(btn){
      btn.disabled = false;
    });
  };
  this._find_anno = function(evt){
    var annos = anno.getAnnotations();
    for(var i=0; i<annos.length; i++){
      var an = annos[i];
      var s = an.shapes[0];
      var g = s.geometry;
      var x = evt.offsetX;
      var y = evt.offsetY;
      if(s.units != 'pixel'){ // annotorious style
        x = x / img_dom.width;
        y = y / img_dom.height;
      }
      if((g.x <= x) && (x <= g.x+g.width ) &&
         (g.y <= y) && (y <= g.y+g.height)){
        return an;
      }
    }
  }
  this._get_next_color = function(cur_color){
    var cur_idx  = colors.indexOf(cur_color);
    var next_idx = (cur_idx+1) % colors.length;
    return colors[next_idx];
  };

  // render selector buttons
  var html = '';
  color_list.forEach(function(marker){
    html += "<input class='_color_marker' style='background-color: "+ marker.color +";' type='button' value='"+ marker.label +"' /> ";
  });
  img_dom.parentNode.insertAdjacentHTML('beforebegin', html + '<br>');
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
    anno.addAnnotation({ src: img_dom.src,
      shapes: [ shape ],
    })     
  });

  // toggle annotation color
  img_dom.nextSibling.addEventListener('mousedown', function(evt){
    var an = that._find_anno(evt);
    if(an){
      var next_color = that._get_next_color(an.shapes[0].style.stroke);
      an.shapes[0].style.outline = next_color;
      an.shapes[0].style.stroke = next_color;
      an.shapes[0].style.hi_stroke = next_color;
    }
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
