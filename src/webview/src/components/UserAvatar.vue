<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      required: false,
      default: 24,
    },
    showAvatar: {
      type: Boolean,
      required: false,
      default: true,
    },
    showHandle: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    sizeClass() {
      return `s${this.size}`;
    },
  },
};
</script>

<template>
  <span>
    <img
      v-if="showAvatar"
      :src="user.avatar_url"
      :class="sizeClass"
      class="avatar"
    />
    <span class="author">
      {{ user.name }}
      <a
        v-if="showHandle"
        :href="user.web_url"
        target="_blank"
      >@{{user.username}}</a>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.avatar {
  border-radius: 100%;
  max-width: 64px;
  max-height: 64px;
  vertical-align: middle;
}

.s24 {
  width: 24px;
  height: 24px;
}

.s40 {
  width: 40px;
  height: 40px;
}

.capitalize {
  text-transform: capitalize;
}
</style>
