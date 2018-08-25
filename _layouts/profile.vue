<template>
	<q-page id="profile">
		<div class="q-layout-page row justify-center layout-padding relative-position" style="min-height: calc(100vh - 50px);">
			<q-inner-loading :visible="loading">
				<q-spinner-hourglass size="50px" color="primary"></q-spinner-hourglass>
				<span class="text-faded">loading information...</span>
			</q-inner-loading>
			<div style="width: 1100px; max-width: 90vw;">
				<div class="text-title text-blue-9 col-12 q-title text-right">
					<q-icon name="edit"></q-icon>
					<span>PROFILE</span>
				</div>
				<div class="form-profile-data col-12">
					<div class="form-title q-title">
						Profile Info
					</div>
					<div class="row form-container q-py-md">
						<div class="col-md-12 order-xs-last">
							<div class="row">
								<div class="item_form col-md-4 q-px-lg q-mb-xl">
									<img :src="image" alt="" style="width: 100%; border-radius: 100%; max-height: 380px">
									<q-uploader url=""
															hide-upload-button
															@add="getSignedUrl"
															color="primary"
															extensions=".jpg"
															float-label="Photo"/>

								</div>
								<div class="item_form col-md-8 q-mb-md">
									<div class="row">
										<div class="item_form col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="phone"
												icon-color="primary"
											>
												<q-input
													type="text"
													v-model="profile.tel"
													float-label="Telephone"
													@input="profile.tel = $helper.maskPhone(profile.tel)"/>
											</q-field>
										</div>
										<div class="item_form col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="phone"
												icon-color="primary"
											>
												<q-input
													type="text"
													v-model="profile.ext_number"
													float-label="Extension Number"/>
											</q-field>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="cake"
												icon-color="primary"
											>
												<q-datetime class="no-shadow"
																		v-model="profile.birthday"
																		float-label="Birthday"
																		format="YYYY/MM/DD"
																		clearable>
												</q-datetime>
											</q-field>
										</div>
										<div class="item_form col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="chrome_reader_mode"
												icon-color="primary"
											>
												<q-input type="text" v-model="profile.identification" float-label="Identification"/>
											</q-field>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="person_pin_circle"
												icon-color="primary"

											>
												<q-input type="text" v-model="profile.address" float-label="Address"/>
											</q-field>
										</div>
										<div class="col-md-6 q-px-lg q-mb-xl">
											<q-field
												icon="location_city"
												icon-color="primary"

											>
												<q-input type="text" v-model="profile.city" float-label="City"/>
											</q-field>
										</div>
									</div>
									<div class="row">
										<div class="col-12 q-px-lg q-my-xl">
											<div class="form-title q-title">
												Social Networks
												<q-btn
													round
													flat
													class=""
													icon="add"
													color="primary"
													@click="addSocial()"
													size="sm"
												/>
											</div>

											<table class="q-table responsive">
												<thead>
												<tr>
													<th>Social Red</th>
													<th colspan="2">Link</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="(item, index) in profile.social" :key="'row_social_'+index">
													<td>
														<div id="socialShare" class="btn-group share-group">
															<a data-toggle="dropdown" class="btn btn-info principal">
																<i :class="'fa '+item.label"></i>

															</a>
															<q-btn-dropdown
																icon="share">
																<!-- dropdown content -->
																<q-list link v-for="(red,indexTwo) in redes" :key="indexTwo">
																	<q-item>
																		<q-item-main>
																			<q-item-tile label><a @click="addLabelAndColor(index,red.label,red.color)" title="Twitter" data-toggle="tooltip" data-id="fa-twitter" class="btn social-link btn-twitter" data-placement="right">
																				{{red.label}}
																			</a>
																				</q-item-tile>
																		</q-item-main>
																	</q-item>
																</q-list>
															</q-btn-dropdown>
															<q-chip
																:color="item.color"
																small >
																{{item.label}}
															</q-chip>


														</div>
													</td>
													<td>
														<q-field>
															<q-input type="text"
																			 v-model="item.desc"
																			 placeholder="@myaccount or /myaccount"
															/>
														</q-field>
													</td>
													<td>
														<q-btn
															round
															class=""
															icon="delete"
															color="primary"
															@click="removeSocial(index)"
															size="sm"
														/>
														</td>
												</tr>


												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="form-user-data col-12">
					<div class="form-title q-title">
						General Info
					</div>
					<div class="row form-container q-py-md">
						<div class="col-md-12 order-xs-last">
							<div class="row">
								<div class="item_form col-md-4 q-px-lg q-mb-md">
									<q-field
										:error="$v.form.first_name.$error"
										error-label="This field is required"
									>
										<q-input type="text"
														 v-model="form.first_name"
														 float-label="First Name:"
										/>
									</q-field>


								</div>
								<div class="item_form col-md-4 q-px-lg q-mb-md">
									<q-field
										:error="$v.form.last_name.$error"
										error-label="This field is required"
									>
									<q-input v-model="form.last_name" float-label="Last Name:"/>
									</q-field>
								</div>
								<div class="item_form col-md-4 q-px-lg q-mb-md">
									<q-field
										:error="$v.form.email.$error"
										error-label="This field is required"
									>
									<q-input v-model="form.email" type="email" float-label="Email" placeholder="example@email.com"/>
									</q-field>
								</div>
							</div>
							<div class="row">

								<!--
								<div class="item_form col-md-6 q-px-lg q-mb-md">
									<q-input v-model="form.telephone" type="number" float-label="Telephone" />
								</div>
								-->
							</div>
							<!--
							<div class="row">
								<div class="item_form col-md-6 q-px-lg q-mb-md">
									<q-input v-model="form.password" type="password" float-label="Password"/>
								</div>
								<div class="item_form col-md-6 q-px-lg q-mb-md">
									<q-input v-model="form.password_confirmation" type="password" float-label="Password Confirm"/>
								</div>
							</div>
							-->
						</div>
						<!--
						<div class="col-md-3">

							<div class="item_form col-md-4 order-xs-first q-px-lg q-mb-md">
								<img :src="form.main_image ? form.main_image : 'statics/profile.png'" class="full-width">
								<q-input @change="setImage" v-model="form.image_url" type="file" />
							</div>

						</div>-->
					</div>
				</div>
				<!--=== SAVE ===-->
				<div class="col-12 text-center q-py-lg">
					<q-btn :loading="loading"
								 color="primary"
								 @click="submit">
						Save
					</q-btn>

				</div>
			</div>
		</div>
	</q-page>
</template>

<script>
  /*Services*/
  import authService from '../_services/auth';
  import profileService from '../_services/profile';

  /*Plugins*/
  import {required, email, sameAs, minLength} from 'vuelidate/lib/validators';
  import {alert} from '@imagina/qhelper/_plugins/alert';
  import {helper} from '@imagina/qhelper/_plugins/helper';

  export default {
    mounted() {
      this.$nextTick(function () {
        this.getData();
      })
    },
    data() {
      return {
        redes:[
          {
            label:'Facebook',
            color:'primary'
          },
          {
            label:'Google +',
            color:'negative'
          },
          {
            label:'LinkedIn',
						color:'blue'
          },
          {
            label:'Twitter',
						color:'light-blue'
          },
          {
            label:'Instagram',
						color:'deep-purple'
          },
          {
            label:'Whatsapp',
						color:'green'
          },
				],
        loading:false,
        profile: '',
        form: '',
        userData: '',
        image: '',

      }
    },
    validations: {
      form: {
        first_name: {required},
        last_name: {required},
        password: {

          minLength: minLength(7)
        },
        password_confirmation: {

          minLength: minLength(7),
          sameAsPassword: sameAs('password')
        },
        email: {email,required},

      }
    },
    methods: {
      getData() {
        helper.storage.get.item('userData').then(response =>{
          this.profile = response.profile;
        });
        helper.storage.get.item('userData').then(response => {
          this.userData = response
        })
        this.image = this.profile.mainimage;
        this.form = this.userData;
      },

      async getSignedUrl(files) {
        setTimeout(() => {
          this.image = this.profile.mainimage =  files[0].__img.src;
        }, 500)
      },

      addSocial: function () {
        if (!this.profile.social) {
          this.profile.social = [];
        }
        this.profile.social.push({
          label: '',
					color:'',
          desc: '',
        });
      },

      removeSocial: function (index) {
        this.profile.social.splice(index, 1);
      },

      addLabelAndColor: function (index, label,color) {
        this.profile.social[index].label = label;
        this.profile.social[index].color = color;
      },

      /*check fields required from form*/
      submit() {
        this.$v.$touch();

        if (this.$v.$error) {
          alert.error('Please review your fields again.', 'bottom');
        } else {
          this.saveProfile();
        }
      },

      saveProfile() {
        this.loading = true;
        let data = {
          userData:this.userData,
					profile: this.profile,
				}
        profileService.update(this.profile.id,data).then(response => {
          alert.success('Profile updated','top')
          this.loading = false;
        }).catch(error => {
          alert.error('Profile not updated','bottom')
          this.loading = false;
        });

      }
    }
  }

</script>
<style lang="stylus">
	@import "~variables";

	#form-profile
		.form-user-data
			border 1px solid $grey-4
			border-top none

	/*=== FORM ===*/
	.form-user-data, .form-profile-data
		margin 25px auto
		.form-title
			border-bottom 1px solid $grey-4
			border-top 1px solid $grey-4
			padding 15px 30px
			background-color $grey-2
			color $primary
			font-weight 500
			margin 15px 0
		.form-container
			.q-item-main
				flex initial
			.q-item-label
				color $primary
				font-size 16px
				font-weight 500
			.q-item-side
				color $primary
				font-weight 500

</style>
