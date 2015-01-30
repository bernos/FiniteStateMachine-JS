function getStateMachine() {
	return new FiniteStateMachine({
		initial : "open",
		states : {
			open : {
				transitions : {
					close : "closed"
				}
			},
			closed : {
				transitions : {
					open : "open"
				}
			}
		}
	});
}




describe("A Finite State Machine", function() 
{
	describe("constructor", function() 
	{
		it("should throw when spec is not provided", function() 
		{
		  	expect(function() 
		  	{
		  		var fsm = new FiniteStateMachine()
		  	}).toThrow();
	  	});

	  	it("should throw when spec does not contain an initial state", function()
	  	{
	  		expect(function() 
	  		{
	  			var fsm = new FiniteStateMachine({});
	  		}).toThrow();
	  	});

	  	it("should throw when spec does not contain any states", function()
	  	{
	  		expect(function()
	  		{
	  			var fsm = new FiniteStateMachine({
	  				initial : "waiting"
	  			});
	  		}).toThrow();
	  	});

	  	it("should throw when initial state does not exist", function() 
	  	{
	  		expect(function()
	  		{
	  			var fsm = new FiniteStateMachine({
	  				initial : "waiting",
	  				states : {
	  					one : {}
	  				}
	  			});
	  		}).toThrow();
	  	});
	});

	describe("when executing a transition", function() 
	{
		it("should trigger the generic events for state exit, entry and change", function()
		{
			var result = [];

			function logState(e) {
				return function(fsm, state)
				{
					result.push(e + "." + state.name);
				}
			}

			getStateMachine()				
				.bind(FiniteStateMachine.EXIT, 		logState("exit"))
				.bind(FiniteStateMachine.ENTER, 	logState("enter"))
				.bind(FiniteStateMachine.CHANGE,	logState("change"))
				.run()
				.doAction("close");


			expect(result[0]).toEqual("enter.open");
			expect(result[1]).toEqual("change.open");
			expect(result[2]).toEqual("exit.open");
			expect(result[3]).toEqual("enter.closed");
			expect(result[4]).toEqual("change.closed");
		});

		it("should trigger transition events for each state", function() 
		{
			var result = [];

			function logState(e) {
				return function(fsm, state) {
					result.push(e);
				}
			}

			getStateMachine()
				.bind("open.exit", logState("open.exit"))
				.bind("closed.enter", logState("closed.enter"))
				.bind("closed.change", logState("closed.change"))
				.run()
				.doAction("close");

			expect(result[0]).toEqual("open.exit");
			expect(result[1]).toEqual("closed.enter");
			expect(result[2]).toEqual("closed.change");
		});
	});

  


  it("should initialize with initial state from spec", function() {
  	var fsm = new FiniteStateMachine({
  		initial : "waiting",
  		states : {
  			waiting : {}
  		}
  	}).run();

  	expect(fsm.getCurrentState().name).toBe("waiting");

  })
});