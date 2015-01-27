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