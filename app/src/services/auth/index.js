import { router } from '../../index'

//endpoint constants
const API_URL = 'http://localhost:3000/api/v1';
const LOGIN_URL = API_URL + '/auth/login';
const SIGNUP_URL = API_URL + '/users';


export default {
	user: {
		authenticated: false
	},

	register(context, userDetails, redirect) {
		context.$http.post(SIGNUP_URL, userDetails).then((res) => {

			let user = res.data;

			this.login(context, user, redirect);

		}).catch((err) => {
			console.log(err);
		});
	},

	login(context, credentials, redirect) {
		context.$http.post(LOGIN_URL, credentials).then((res) => {
			localStorage.setItem('token', res.data.token);
			localStorage.setItem('user', res.data.user);
			this.user.authenticated = true;

			//redirect to a specified route
			if (redirect) {
				router.go(redirect);
			}
		}).catch((err) => {
			context.error = err;
		});
	},
	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		this.user.authenticated = false;
	},

	checkAuth() {
		var jwt = localStorage.getItem('token')
		if (jwt) {
			this.user.authenticated = true
		} else {
			this.user.authenticated = false;
		}
	},

	getHeader() {
		return {
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		}
	}
}
