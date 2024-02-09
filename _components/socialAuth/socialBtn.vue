<template>
    <div class="
              tw-shadow-lg
              tw-border
              tw-bg-white
              tw-text-sm
              tw-py-3
              tw-px-4
              tw-rounded
              tw-w-full
              tw-cursor-pointer
              hover:tw-bg-gray-100
              tw-my-2">
        <div class="tw-flex">
            <div class="tw-w-6">
                <img class="tw-w-6 tw-h-6" :src="icon" alt="">
            </div>
            <div
            class="
                tw-w-11/12
                tw-text-center
                tw-font-bold"
            >
                {{ title }}
            </div>
          <q-spinner
              v-if="loading"
              color="primary"
              size="23px"
              :thickness="2"
          />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: () => null,
        },
        icon: {
            type: String,
            default: () => null,
        },
      loading: {type: Boolean, default : false}
    }
}
</script>
