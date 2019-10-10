<template>
	<q-page id="pageCompletedPassword" class="flex flex-center">

		<!--Form-->
		<div class="row shadow-3 q-mx-md" style="width: 350px">
			<div id="form-login-right"
			     class="col-12"
			     style="padding: 30px 25px">

			    <!-- TITLE -->
				<h4 class="q-headline text-primary text-center q-mt-none q-mb-md q-pb-sm"
				    style="border-bottom: 2px solid #f1f1f1">
					{{$tr('quser.layout.label.changePassword')}}
				</h4>

				<!-- NEW PASS -->
				<q-field
					:error="$v.form.newPassword.$error"
					:error-label="$tr('ui.message.fieldMinLeng', {num : 8})"
					:count="8"
				>
					<q-input v-model="form.newPassword"
					         type="password"
					         name="password"
					         autocomplete="off"
					         :float-label="$tr('quser.layout.label.newpassword')"
					/>
				</q-field>

				<!-- CONFIRM NEW PASS -->
				<q-field
					:error="$v.form.confirmNewPassword.$error"
					:error-label="$tr('ui.message.fieldCheckPassword')"
					:count="8"
				>
					<q-input v-model="form.confirmNewPassword"
					         type="password"
					         autocomplete="off"
					         :float-label="$tr('quser.layout.label.confirmPassword')"
					/>
				</q-field>

				<!--=== Button Change ===-->
				<div class="text-center q-mt-md">
					<q-btn :loading="loading"
					       color="primary"
					       name="submit"
					       @click="changePassword()">
							{{$tr('quser.layout.label.changePassword')}}
							<span slot="loading">
	                			<q-spinner-hourglass class="on-left"/>
	                			{{`${$tr('ui.label.loading')}...`}}
	              			</span>
					</q-btn>
				</div>

				
			</div>
		</div>

		<!--Dialog Close Sessions-->
		<q-dialog v-model="showDialog" prevent-close ok="Yes" cancel="No" @ok="getOut(true)" @cancel="getOut(false)">
			<span slot="title" class="text-teal">{{$tr('quser.layout.message. passwordUpdated')}}</span>
			<span slot="message">{{$tr('quser.layout.message.closeSessions')}}</span>
		</q-dialog>
		
	</q-page>
</template>

<script>
	/*Plugins*/
	import {required, email, numeric, minLength,sameAs} from 'vuelidate/lib/validators';
	import alert from '@imagina/qhelper/_plugins/alert'
	import {helper} from '@imagina/qhelper/_plugins/helper'
	import authService from '@imagina/quser/_services/profile/index';

	//Services
	import profileServices from '@imagina/quser/_services/profile'

	export default {
		data() {
			return {
				loading: false,
				form: {
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
				newPassword: {
					required, 
					minLength: minLength(8)
				},
				confirmNewPassword: {
					required, 
					minLength: minLength(8),
					sameAsPassword: sameAs('newPassword')
				}
			}
		},
		methods: {
			//change password
			changePassword() {
				if (!this.inRequest) {
					this.$v.$touch();
					if (!this.$v.$error) {
						this.loading = !this.loading;
						this.inRequest = true
						profileServices.resetCompleted(
							this.form,
							this.$route.params.id,
							this.$route.params.code
							).then(response => {
								this.loading = false
								this.inRequest = false
								this.userId = response.data.userId
								this.showDialog = true
						}).catch(error => {
							this.$alert.error({message : error, pos : 'top'})
							this.inRequest = false
							this.loading = false
						})
						
					} else {
						this.$alert.error({message: this.$tr('ui.message.formInvalid'), pos: 'bottom'})
					}
				}
			},
			//get out form
			getOut(closeSessions = false) {
				if (closeSessions) {
					const params = {remember: false, params: {userId: this.userId}}
					profileServices.crud.index('apiRoutes.quser.authLogoutAll', params)
				}

				//Redirect
				this.$router.push({name: 'auth.login'})
			}
		}
	}
</script>

<style lang="stylus">
	@import "~variables";
	#pageCompletedPassword
		.q-input
			padding-top 15px

		#form-login-left
			min-height 150px

			.bg-color
				background-color $primary
				height 100%
				width 100%
</style>
