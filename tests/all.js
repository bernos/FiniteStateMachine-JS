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

			var fsm = new FiniteStateMachine({
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
			}).run();

			fsm.bind(FiniteStateMachine.EXIT, function()
			{
				result.push("exit");
			});

			fsm.bind(FiniteStateMachine.ENTER, function()
			{
				result.push("enter");
			});

			fsm.bind(FiniteStateMachine.CHANGE, function()
			{
				result.push("change");
			});

			fsm.doAction("close");

			expect(result[0]).toEqual("exit");
			expect(result[1]).toEqual("enter");
			expect(result[2]).toEqual("change");
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