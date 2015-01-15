var express 		= require('express'),
	app				= express();
	mongoose 		= require('mongoose'),
	morgan 			= require('morgan'), //log request to the console
	bodyParser 		= require('body-parser'), //pull information from HTML POST
	methodOverride 	= require('method-override'); // simulate DELETE and PUT


	app
	.use(express.static('./'))
	.get('*', function(req, res) {
		res.sendfile('index.html');
	})
	.use(morgan('dev')) // log every request to console
	.use(bodyParser.urlencoded({'extended':'true'}))
	.use(bodyParser.json())
	.use(bodyParser.json({type: 'application/vnd.api+json'}))
	.use(methodOverride())


	.listen(process.env.PORT || 3000, function() {
		console.log('Listening on port 3000...');
	});

	mongoose.connect('mongodb://localhost/tododb');


	// define model =================
    var Todo = mongoose.model('Todo', {
        text : String
    });


    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function(req, res) {

        // use mongoose to get all todos in the database
        Todo.find(function(err, todos) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(todos); // return all todos in JSON format
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });


app.get('*', function(req, res) {
        res.sendfile('/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });