class HanulseSns {
	static getGoogleLoginUrl() {
		return (
		  'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?' +
		  `client_id=${encodeURIComponent('1006587893490-8rl2rmm19p43e0g0umkils8hpfm4v0jl.apps.googleusercontent.com')}` +
		  `&redirect_uri=${encodeURIComponent('https://www.auoi.net/sns/google')}` +
		  '&response_type=code' +
		  '&scope=email%20profile&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow'
		);
	}
}