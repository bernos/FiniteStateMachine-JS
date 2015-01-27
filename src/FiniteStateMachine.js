(function(global){

  var FSM = function(spec) {
    var spec = spec || {},
        currentState = null,
        cancelled = false,
        handlers = {},
        self = this;

    function _getInitialState() {
      return _getState(spec.initial);
    };

    function _getState(name) {
      if (null === name || null === spec.states) {
        return null;
      }

      for (var i in spec.states) {
        if (spec.states[i]['name'] === name) {
          return spec.states[i];
        }
      }

      return null;
    };

    function _transitionTo(state, data) {
      if (null === state) { return null; }
      
      cancelled = false;
            
      if (currentState && currentState.exitEvent) {
        self.trigger(currentState.exitEvent, self, data);
      }  

      if (cancelled) {
        cancelled = false;
        return null;
      }

      self.trigger(FSM.EXIT, self, currentState, data);

      if (state.entryEvent) {
        self.trigger(state.entryEvent, self, data);
      }

      if (cancelled) {
        cancelled = false;
        return null;
      }

      self.trigger(FSM.ENTER, self, state, data);

      currentState = state;

      if (currentState.changeEvent) {
        self.trigger(currentState.changeEvent, self, data);
      }

      self.trigger(FSM.CHANGE, self, state, data);
    };

    function _getTargetStateForAction(action) {
      if (null === currentState) { return null; }
      if (null === currentState.transitions) { return null; }

      for (var i = 0, m = currentState.transitions.length; i < m; i++) {
        if (currentState.transitions[i]['action'] === action) {
          return _getState(currentState.transitions[i]['target']);
        }
      }

      return null;
    }

    this.bind = function(event, handler) {
      (handlers[event] || (handlers[event] = [])).push(handler);
      return self;
    };

    this.unbind = function(event, handler) {
      if (!event) {
        handlers = {};
      } else if (!handler) {
        handlers[event] = [];
      } else if (handlers[event]) {
        var l = handlers[event];
        for(var i = l.length - 1; i > -1; i--) {
          l.splice(i,1);
          return self;
        }
      }
      return self;
    };

    this.trigger = function(event) {
      var l;
      if (l = handlers[event]) {
        for (var i = 0, m = l.length; i < m; i++) {
          l[i].apply(self, Array.prototype.slice.call(arguments, 1));
        }
      }
      return self;
    };

    this.run = function() {
      if (_getInitialState()) {
        _transitionTo(_getInitialState(), null);
      }
    };

    this.doAction = function(action, data) {
      var data = data || {};
      var newState = _getTargetStateForAction(action);
      
      if (newState) {
        _transitionTo(newState, data);
      }
    };

    this.cancel = function() {
      cancelled = true;
    };

    this.getCurrentState = function() {
      return currentState;
    };
  }

  FSM.VERSION = '0.0.1';
  FSM.CHANGE  = "FiniteStateMachine:Change";
  FSM.ENTER = "FiniteStateMachine:Enter";
  FSM.EXIT = "FiniteStateMachine:Exit";

  if (global.FiniteStateMachine) {
    throw new Error("FiniteStateMachine has already been defined.");
  } else {
    global.FiniteStateMachine = FSM;
  }
})(typeof window === 'undefined' ? this : window);