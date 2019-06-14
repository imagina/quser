<template>
	<q-page id="pageLogout" class="flex flex-center">

		<div class="row shadow-3 q-mx-xl" style="width: 350px">
			<div class="flex flex-center col-12"
			     style="padding: 30px 25px; min-height: 365px">
				<div class="text-center">
					<q-spinner-hourglass color="blue-grey" :size="60"/>
					<h5 class="q-ma-none q-mt-lg text-faded">Closing session...</h5>
				</div>
			</div>
		</div>

	</q-page>
</template>

<script>
	export default {
		mounted() {
			this.$nextTick(async function () {
				await this.$store.dispatch("auth/AUTH_LOGOUT")
				this.$router.push({name : 'auth.login'})
			})
		}
	}
</script>

<style lang="stylus">
	@import "~variables";
	#pageLogout
		#form-login-left
			min-height 150px
			.bg-color
				background-color $blue-grey
				height 100%
				width 100%
</style>
