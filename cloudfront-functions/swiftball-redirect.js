function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var redirectTo;

  if (uri.startsWith('/league/')) {
    var leagueId = uri.split('/').pop();
    redirectTo = `https://erastourleagues.com/?route=${uri}&leagueId=${leagueId}`;
  } else if (uri === '/leaderboard' || uri === '/concerts' || uri === '/surprisesongs' || uri === '/outfits') {
    redirectTo = `https://erastourleagues.com/?route=${uri}`;
  }

  if (redirectTo) {
    var response = {
      statusCode: 302,
      statusDescription: 'Found',
      headers: {
        location: {
          value: redirectTo,
        },
      },
    };
    return response;
  }

  // If the path doesn't match, return the original request
  return request;
}
