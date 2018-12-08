<script>
export default {
  props: {
    issuable: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <span>
    <img
      :src="issuable.author.avatar_url"
      class="avatar"
    />
    <span class="author">
      <a
        :href="issuable.author.web_url"
        target="_blank"
      >
        {{ issuable.author.name }}
      </a>
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
