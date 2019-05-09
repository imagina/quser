<template>
	<q-page id="pageChangePassword" class="flex flex-center">
		<!--Form-->
		<div class="row shadow-3 q-mx-md" style="width: 350px">
			<div id="form-login-right"
			     class="col-12"
			     style="padding: 30px 25px">
				<h4 class="q-headline text-primary text-center q-mt-none q-mb-md q-pb-sm"
				    style="border-bottom: 2px solid #f1f1f1">
					Change Password
				</h4>
				<div class="q-body-1 text-center text-warning q-pb-md q-mb-md"
				     style="border-bottom: 2px solid #f1f1f1" v-if="hasUserName">
					<q-icon name="warning"></q-icon>
					For security reasons, you must change your password.
				</div>
				<!-- USER -->
				<q-field
					:error="$v.form.email.$error"
					error-label="This field is required"
				>
					<q-input ref="email"
					         autocomplete="off"
					         v-model="form.email"
					         type="text"
					         :before="[{icon: 'person'}]"
					         @keyup.enter="changePassword()"
					         float-label="User Name"
					/>
				</q-field>
				<!-- OLD PASS -->
				<q-field
					:error="$v.form.password.$error"
					error-label="This field is required"
				>
					<q-input v-model="form.password"
					         type="password" ref="currentPassword"
					         autocomplete="off"
					         :before="[{icon: 'lock'}]"
					         @keyup.enter="changePassword()"
					         float-label="Current Password"
					/>
				</q-field>
				<!-- NEW PASS -->
				<q-field
					:error="$v.form.newPassword.$error"
					error-label="This field is required and with min length"
					:count="8"
				>
					<q-input v-model="form.newPassword"
					         type="password"
					         autocomplete="off"
					         name="password"
					         @keyup.enter="changePassword()"
					         float-label="New Password"
					/>
				</q-field>
				<!-- CONFIRM NEW PASS -->
				<q-field
					:error="$v.form.confirmNewPassword.$error"
					error-label="This field is required and with min length"
					:count="8"
				>
					<q-input v-model="form.confirmNewPassword"
					         type="password"
					         name="password"
					         autocomplete="off"
					         @keyup.enter="changePassword()"
					         float-label="Confirm New Password"
					/>
				</q-field>

				<!--=== LOGIN ===-->
				<div class="text-center q-mt-md">
					<q-btn :loading="login"
					       color="primary"
					       name="submit"
					       @click="changePassword()">
						Change Password
						<span slot="loading">
                <q-spinner-hourglass class="on-left"/>
                VALIDATING...
              </span>
					</q-btn>
				</div>

				<!--Button actions-->
				<!--<div class="full-width text-center q-pt-lg">
					<q-btn flat color="primary" label="Login"
					       :to="{name : 'auth.login'}">
					</q-btn>
				</div>-->
			</div>
		</div>
		<!--Dialog-->
		<q-dialog
			v-model="showDialog"
			prevent-close
			ok="Yes"
			cancel="No"
			@ok="getOut(true)"
			@cancel="getOut(false)"
		>
			<!-- This or use "title" prop on <q-dialog> -->
			<span slot="title" class="text-teal">Updated password!</span>

			<!-- This or use "message" prop on <q-dialog> -->
			<span slot="message">
				Do you want to close all your active sessions?
			</span>
		</q-dialog>

		<!--like must will be the password-->
		<q-dialog
			v-model="dialogPassword"
			prevent-close
		>
			<!-- This or use "message" prop on <q-dialog> -->
			<span slot="message">
				<h1 class="q-title text-warning">
					<q-icon name="warning"></q-icon>
					The new password must contain
				</h1>
				- Minimum eight (8) characters <br>
				- One character uppercase <br>
				- One character lowercase <br>
				- One number <br><br>
				Example: (MyPass435)
			</span>
		</q-dialog>
	</q-page>
</template>

<script>
	/*Plugins*/
	import {required, email, numeric, minLength} from 'vuelidate/lib/validators';
	import {alert} from '@imagina/qhelper/_plugins/alert'
	import {helper} from '@imagina/qhelper/_plugins/helper'
	import authService from '@imagina/quser/_services/profile/index';

	//Services
	import profileServices from '@imagina/quser/_services/profile'

	export default {
		data() {
			return {
				form: {
					email: '',
					password: '',
					newPassword: '',
					confirmNewPassword: '',
				},
				hasUserName : false,
				login: false,
				inRequest: false,
				showDialog: false,
				dialogPassword: false,
				userId: false
			}
		},
		validations: {
			form: {
				email: {required},
				password: {required},
				newPassword: {required, minLength: minLength(8)},
				confirmNewPassword: {required, minLength: minLength(8)}
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.setFocus()
			})
		},
		methods: {
			//change password
			changePassword() {
				if (!this.inRequest) {//Check is already is in request
					this.$v.$touch();
					if (this.$v.$error) {//Check if isn't errors in validate form
						alert.error('Please review fields again.', 'bottom');
					} else {
						if (this.checkNewPassword()) {//Check if new password is same to confrimation
							this.login = !this.login;
							this.inRequest = true
							profileServices.changePassword(this.form).then(response => {
								this.userId = response.data.userId
								this.showDialog = true
							}).catch(error => {
								alert.error(error, 'top')
								this.login = !this.login;
								this.inRequest = false
							})
						}
					}
				}
			},
			//Check if new password is same with confirmation
			checkNewPassword() {
				if (this.form.newPassword != this.form.confirmNewPassword) {
					alert.error('Password confirmation is wrong')
					return false
				}

				if (!this.$helper.checkPassword(this.form.newPassword)) {
					this.dialogPassword = true
					return false
				}

				return true
			},
			//get out form
			getOut(closeSessions = false) {
				if (closeSessions) {
					const params = {remember: false, params: {userId: this.userId}}
					profileServices.crud.index('apiRoutes.profile.authLogoutAll', params)
				}

				//Redirect
				if (this.$route.query.redirectTo) this.$router.push({name: 'auth.login'})
				else window.location.href = config('apiRoutes.api.fha_login')
			},
			//set focus and username in form
			setFocus() {
				//Check if exist username in url
				let queryUserName = this.$route.query.username
				if(queryUserName) this.hasUserName = queryUserName

				if (this.hasUserName) {
					this.form.email = this.hasUserName
					this.$refs.currentPassword.focus()
				} else {
					this.$refs.email.focus()
				}
			}
		}
	}
</script>

<style lang="stylus">
	@import "~variables";
	#pageChangePassword
		.q-input
			padding-top 15px

		#form-login-left
			min-height 150px

			.bg-color
				background-color $primary
				height 100%
				width 100%
</style>
