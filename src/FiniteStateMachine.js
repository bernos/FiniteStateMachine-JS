(function(global){
  
  /**
   * spec is an objec in the format
   * {
   *    initial: "state one",
   *    states: [
   *      {
   *        name: "state one",
   *        transitions: [
   *          {
   *            action: "myAction",
   *            target: "state two"
   *          }
   *        ]
   *      }
   *    ]
   * }
   */  

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

      if (state.entryEvent) {
        self.trigger(state.entryEvent, self, data);
      }

      if (cancelled) {
        cancelled = false;
        return null;
      }

      currentState = state;

      if (currentState.changeEvent) {
        self.trigger(currentState.changeEvent, self, data);
      }

      self.trigger(FSM.CHANGE, self, data);
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
  /*
  FSM.prototype = {
    bind: function(ev, handler) {
      var l = this._handlers[ev] || (this._handlers[ev] = []);
      l.push(handler);
      return this;
    },

    unbind: function(ev, handler) {
      if (!ev) {
        // remove all handlers for all events
        this._handlers = {};
      } else  if (!handler) {
        // remove all handlers for the specified event
        this._handlers[ev] = [];
      } else if (this._handlers[ev]) {
        var l = this._handlers[ev];
        for (var i = l.length - 1; i > -1; i--) {
          if (l[i] === handler) {
            l.splice(i,1);
            return this;
          }
        }
      }
      return this;
    },

    trigger: function(ev) {
      var l;
      if (l = this._handlers[ev]) {
        for (var i = 0, m = l.length; i < m; i++) {
          l[i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
      }
      return this;
    },

    run: function() {
      if (this._getInitialState()) {
        this._transitionTo(this._getInitialState(), null);
      }
    },

    doAction: function(action, data) {
      var data = data || {};
      var newState = this._getTargetStateForAction(action);
      
      if (newState) {
        this._transitionTo(newState, data);
      }
    },

    cancel: function() {
      this._cancelled = true;
    },

    getCurrentState: function() {
      return this._currentState;
    },

    _getInitialState: function() {
      return this._getState(this._spec.initial);
    },

    _getState: function(name) {
      if (null === name || null === this._spec.states) {
        return null;
      }

      for (var i in this._spec.states) {
        if (this._spec.states[i]['name'] === name) {
          return this._spec.states[i];
        }
      }

      return null;
    },

    _transitionTo: function(state, data) {
      if (null === state) { return null; }
      
      this._cancelled = false;
      
      if (this._currentState && this._currentState.exitEvent) {
        this.trigger(this._currentState.exitEvent, this, data);
      }  

      if (this._cancelled) {
        this._cancelled = false;
        return null;
      }

      if (state.entryEvent) {
        this.trigger(state.entryEvent, this,  data);
      }

      if (this._cancelled) {
        this._cancelled = false;
        return null;
      }

      this._currentState = state;

      if (this._currentState.changeEvent) {
        this.trigger(this._currentState.changeEvent, this, data);
      }

      this.trigger(FSM.CHANGE, this, data);
    },

    _getTargetStateForAction: function(action) {
      if (null === this._currentState) { return null; }
      if (null === this._currentState.transitions) { return null; }

      for (var i = 0, m = this._currentState.transitions.length; i < m; i++) {
        if (this._currentState.transitions[i]['action'] === action) {
          return this._getState(this._currentState.transitions[i]['target']);
        }
      }

      return null;
    }
  }*/  

  if (global.FiniteStateMachine) {
    throw new Error("FiniteStateMachine has already been defined.");
  } else {
    global.FiniteStateMachine = FSM;
  }
})(typeof window === 'undefined' ? this : window);