<script>
const moment = require('moment');
const md = require('markdown-it')().use(require('markdown-it-checkbox'));

export default {
  props: {
    issuable: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stateText() {
      const states = {
        opened: 'Open',
        closed: 'Closed',
      };

      return states[this.issuable.state] || '';
    },
    description() {
      // This could a nice Regex but :(
      const normalized = this.issuable.description.replace(
        /\/uploads/gm,
        `${this.issuable.web_url.split('/issues/')[0]}/uploads/`
      );

      return md.render(normalized);
    },
    createdAgo() {
      return moment(this.issuable.created_at).fromNow();
    },
  },
}
</script>

<template>
  <div class="issuable-details">
    <div class="header">
      <span
        :class="{ [issuable.state]: true }"
        class="state"
      >
        {{ stateText }}
      </span>
      <span class="capitalize">
        {{ issuable.state }}
      </span>
      <span class="date">
        {{ createdAgo }}
      </span>
      by
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
      <a
        :href="issuable.web_url"
      >
        View in GitLab
      </a>
    </div>
    <div class="title">
      <h2>{{ issuable.title }}</h2>
    </div>
    <div
      class="description"
      v-html="description"
    ></div>
  </div>
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
