<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <span>
    <img :src="user.avatar_url" class="avatar" />
    <span class="author">
      <a :href="user.web_url" target="_blank">{{ user.name }}</a>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.avatar {
  width: 24px;
  height: 24px;
  border-radius: 24px;
}
.capitalize {
  text-transform: capitalize;
}
</style>
