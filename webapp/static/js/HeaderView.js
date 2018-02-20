/* jshint undef: true, unused: true */
//HeaderView
//   Backbone View extension for managing user-defined headers.
//
//   Allows user to define an area at the top of a page that should not be considered content when performing a regex
//   search
//
//
//   1/18/2018  REM; created
//   1/30/2018  REM; updated UI to reduce mouse flicker, increase intuitiveness
//   2/1/2018   REM; adding state so that it can be determined if header is being enlarged or shrunk on a resize event
//
/* global $, paper, Backbone, _, console */
(function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && define.amd) define(definition);
  else context[name] = definition();
})('HeaderView', this, function (name, context) {
  return Backbone.View.extend({
    tagName: 'div',
    className:'header-region',
    template:"",
    events:{'mousedown': 'enableHeaderResize',
            'mouseup': 'endHeaderResize',
            'mousemove': 'resizeHeader'},
    previous_y: 0, //Record of mouse height (relative to page) updated in between resize operations
    BUFFER:10, //TODO: make a prototype include buffer as a const to reduce object overhead...
    height_on_start_of_resize: 0, //Header height before the user begins resize operation
    resizing: false,

    enableHeaderResize: function(event){
      this.resizing = true;
      this.height_on_start_of_resize = parseInt(this.$el.css('height'));
      this.previous_y = (event.pageY - this.$el['0'].parentElement.offsetTop);

      //So that the user can more easily drag the header area when it is up at the top of the page
      if(this.BUFFER>=this.previous_y){
        this.$el.css({'height': this.BUFFER});
      }

    },

    endHeaderResize: function(event){
      if(this.resizing===true){
        this.resizing = false;
        console.log("In endHeaderResize:");
        console.log(this.$el);
        sendback={};
        sendback['previous_header_height'] = this.height_on_start_of_resize; //Don't think the server needs it now...we'll see...
        sendback['current_header_height'] =parseInt(this.$el.css('height'));
        this.trigger('header_resized',sendback);
      }
    },

    resizeHeader: function(event){
      if(this.resizing===true){
        var mouseLocation = event.pageY - this.$el['0'].parentElement.offsetTop;
        var new_height = mouseLocation;
        if((this.previous_y>new_height) && (new_height<=this.BUFFER)){ //When the user is shrinking the size of the header
          new_height=0;
        }
        else{
          new_height+=this.BUFFER; //buffer added to reduce cursor flicker
        }
        this.$el.css({'height': new_height })
        if(new_height==0){
          this.endHeaderResize(event);
        }
        this.previous_y = mouseLocation; //Updating status variables for next mousemove...
      }
    },

    initialize: function(data){

      this.id = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
      this.$el.css({
        "top": data.top,
        "left": data.left,
        "width": data.width,
        "height": 0
      });

      this.$el.attr('title','Drag down to define header area');
      this.$el.attr('draggable','false');
      //Detect when user moves mouse/release mouse outside of the area
      $(document).on({
        mousemove: _.bind(this.resizeHeader,this),
        mouseup: _.bind(this.endHeaderResize, this)
      });
      }});
    });
