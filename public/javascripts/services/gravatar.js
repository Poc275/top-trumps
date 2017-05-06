angular.module('TCModule').factory('Gravatar', function GravatarFactory() {
	// default avatar size (appended to gravatar url)
	var avatarSize = 250;

	// base gravatar url
	var avatarUrl = 'https://www.gravatar.com/avatar/';

	// this service only has 1 function, so we can simplify it
	// by returning an anonymous function. Calling this is then
	// simply Gravatar(email)
	return function(email) {
		return avatarUrl + CryptoJS.MD5(email) + '?size=' + avatarSize.toString();
	};
});