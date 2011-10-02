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
    this._spec = spec || {};
    this._currentState = null;
    this._cancelled = false;
    this._handlers = {};
  }

  FSM.VERSION = '0.0.1';
  FSM.CHANGE  = "FiniteStateMachine:Change";

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
  }  

  if (global.FiniteStateMachine) {
    throw new Error("FiniteStateMachine has already been defined.");
  } else {
    global.FiniteStateMachine = FSM;
  }
})(typeof window === 'undefined' ? this : window);