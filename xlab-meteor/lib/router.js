Router.route('/', function() {
	this.render('singleVideo');
});

Router.route('/orch', function() {
	this.render('orchestration');
});

Router.route('/examples', function() {
	this.render('examples');
});

// Router.route('/next', function() {
// 	var req = this.request;
// 	var res = this.response;
// 	console.log('req : ' + req + '\nres : ' + res);

// 	var response = {};
// 	response.videoURL = '/videos/video1.mp4';
// 	//response.videoDetails = '';
// 	res.end(JSON.stringify(response));
// },{where: 'server'});