<template>
	<div id="searchUsers">
		<div class="form-title">
			Search Users
		</div>

		<div class="row q-py-md relative-position">
			<!--Tabs-->
			<div class="fields col-12 col-md-6">
				<q-tabs v-model="tabsModel" animated swipeable align="justify" inverted>
					<q-tab name="tab-search" icon="search" slot="title"/>
					<q-tab name="tab-list" icon="list" slot="title"/>

					<!--= Tab search users =-->
					<q-tab-pane name="tab-search">
						<!--Search-->
						<q-search v-model="filter.search" clearable/>
						<!--Departments-->
						<q-select
							icon="fas fa-home"
							v-model="filter.department"
							float-label="Departments"
							multiple chips
							:options="departmentsSelect"
						/>
						<!--Roles-->
						<q-select
							v-model="filter.roles"
							float-label="Roles"
							multiple chips
							:options="rolesSelect"
						/>
						<!--Button Filter-->
						<div class="col-12 q-mt-md">
							<q-btn icon-right="fas fa-search" color="primary"
							       @click="searchUsers()">
								Search
							</q-btn>
						</div>
					</q-tab-pane>

					<!--= Tab list users =-->
					<q-tab-pane name="tab-list">
						<!--= Infinite Scroll users =-->
						<q-infinite-scroll :handler="getUsers" inline ref="infiniteScrollUsers"
						                   style="height: 340px; overflow-y: scroll">

							<!-- List users -->
							<q-list no-border link v-if="usersList && usersList.length">
								<q-item tag="label" v-for="(user,key) in usersList" :key="key">
									<!--Check box for select user-->
									<q-item-side>
										<q-checkbox v-if="!user.selected"
										            v-model="userSelected" :val="user"/>
										<q-icon v-else name="fas fa-check" color="positive"></q-icon>
									</q-item-side>
									<!--Name user-->
									<q-item-main>
										<q-item-tile label>
											{{user.fullName}}
										</q-item-tile>
									</q-item-main>
								</q-item>
							</q-list>

							<!--Block no user available-->
							<div v-if="usersNotFound" class="text-center q-mt-md text-grey-7">
								<q-icon name="far fa-sad-tear" size="40px"></q-icon>
								<h6 class="q-my-sm q-subheading">Users not found</h6>
								<!--Button refresh list users-->
								<q-btn icon-right="fas fa-sync" color="primary"
								       @click="searchUsers()">
									Refresh
								</q-btn>
							</div>

							<!--Spinner list-->
							<div slot="message" class="text-center">
								<q-spinner-dots color="primary" :size="40"></q-spinner-dots>
							</div>
						</q-infinite-scroll>
					</q-tab-pane>
				</q-tabs>
			</div>

			<!--User Selected List-->
			<div class="fields col-12 col-md-6">

				<!--Counter users selected-->
				<div class="text-center">
					<q-chip pointing="down" color="primary">
						Users Selected: {{userSelected.length}}
					</q-chip>
				</div>

				<!--List user selected-->
				<q-scroll-area style="height:368px">
					<q-list v-if="userSelected && userSelected.length">
						<q-item tag="label" v-for="(user,key) in userSelected" :key="key">
							<q-item-side>
								{{key+1}}.
							</q-item-side>
							<q-item-main>
								<q-item-tile label>
									{{user.fullName}}
								</q-item-tile>
							</q-item-main>
							<q-item-side right>
								<q-btn size="sm" flat icon="fas fa-trash-alt"
								       color="red" @click="removeUserSelected(key)"/>
							</q-item-side>
						</q-item>
					</q-list>


					<div v-else class="text-center q-mt-md text-grey-7">
						<q-icon name="far fa-frown" size="40px"></q-icon>
						<h6 class="q-my-sm q-subheading">No user selected</h6>
					</div>

					<div slot="message" class="text-center">
						<q-spinner-dots color="primary" :size="40"></q-spinner-dots>
					</div>
				</q-scroll-area>
			</div>
		</div>
	</div>
</template>
<script>
	/*Plugins*/
	import {array} from '@imagina/qhelper/_plugins/array'

	/*Services*/
	import profileService from '@imagina/quser/_services/profile/index'
	import rolesServices from '@imagina/quser/_services/roles'
	import userServies from '@imagina/quser/_services/users'

	export default {
		props: {},
		components: {},
		watch: {
			//Return to v-model, data users
			userSelected(data) {
				let response = {users: data, usersId: []}

				//Get only ID from users
				for (var item in data) {
					let user = data[item]
					response.usersId.push(user.id)
				}
				//Emit response
				this.$emit('input', response)
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.getDepartments()
				this.getRoles()
			})
		},
		data() {
			return {
				/*Users Selected*/
				userSelected: [],

				/*Search*/
				filter: {
					search: '',
					department: [],
					roles: []
				},

				/*Options*/
				departmentsSelect: [],
				rolesSelect: [],
				usersList: [],

				usersNotFound: false,
				tabsModel: 'tab-search',
				page: 0
			}
		},
		methods: {
			//Get users with infinite scroll
			getUsers(page, done) {
				this.usersNotFound = false
				let params = {
					filter: {},
					page: page,
				}
				//Validate params
				this.filter.search ? params.filter.search = this.filter.search : false
				this.filter.department.length ? params.filter.department = this.filter.department : false
				this.filter.roles.length ? params.filter.roles = this.filter.roles : false

				//Request users
				profileService.crud.index('apiRoutes.profile.users', {params: params}).then(response => {
					setTimeout(() => {
						if (response.data.length) {//Load data
							if (page > this.page) {
								this.usersList = this.usersList.concat(response.data)
								this.inUserSelected()
							}
							done()
						} else {//Stop infinite scroll
							this.$refs.infiniteScrollUsers.stop()
						}

						this.usersNotFound = (this.usersList && this.usersList.length) ? false : true
						this.page = page //update current page infinite scroll
					}, 500)
				})
			},

			//Filter users
			searchUsers() {
				//Change tab to user list
				this.tabsModel = 'tab-list'
				//Await while change to tab of user list
				setTimeout(() => {
					this.usersList = []//empty user list
					//Reset current page infinite scroll.
					//for bug in infinite scroll
					this.page = 0
					//Reset infiniteScroll
					this.$refs.infiniteScrollUsers.reset()
					//Request again data in infinite scroll
					setTimeout(() => {
						this.$refs.infiniteScrollUsers.resume()
					}, 100)
				}, 100)
			},

			//Get Departments
			getDepartments() {
				profileService.crud.index('apiRoutes.profile.departments').then(response => {
					let departments = response.data
					if (departments && departments.length) {
						this.departmentsSelect = array.select(departments)
					}
				})
			},

			//Get Roles
			getRoles() {
				profileService.crud.index('apiRoutes.profile.roles').then(response => {
					let roles = response.data
					if (roles && roles.length) {
						this.rolesSelect = array.select(roles)
					}
				})
			},

			//Define if user in list already is in userSelected
			inUserSelected() {
				let usersSelected = this.userSelected
				let userList = this.usersList

				for (var key in userList) {
					let user = userList[key]
					let index = usersSelected.findIndex(x => x.id == user.id)
					user.selected = (index != -1) ? true : false
				}
			},

			//Remove user seleted from list
			removeUserSelected(index) {
				this.userSelected.splice(index, 1);
				this.inUserSelected()
			},

			//Reset Component
			reset() {
				this.userSelected = []
				this.inUserSelected()
			}
		}

	}
</script>
<style lang="stylus">
	@import "~variables";
	#searchUsers
		.fields
			padding 5px 15px

		.q-tab-pane
			padding 12px 0px
</style>
