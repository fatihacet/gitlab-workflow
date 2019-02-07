<script>
import UserAvatar from './UserAvatar';

const moment = require('moment');
const md = require('markdown-it')().use(require('markdown-it-checkbox'));

export default {
  props: {
    issuable: {
      type: Object,
      required: true,
    },
  },
  components: {
    UserAvatar,
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
      if (this.issuable.markdownRenderedOnServer) {
        return this.issuable.description;
      }

      const description = this.issuable.description || '';
      const webUrl = this.issuable.web_url || '';
      const path = `${webUrl.split('/issues/')[0]}/uploads/`;
      const normalized = description.replace(/\/uploads/gm, path);

      return md.render(normalized);
    },
    createdAgo() {
      return moment(this.issuable.created_at).fromNow();
    },
  },
  mounted() {
    window.vsCodeApi.postMessage({
      command: 'renderMarkdown',
      markdown: this.issuable.description,
      ref: this.issuable.id,
      key: 'description',
    });
  },
};
</script>

<template>
  <div class="issuable-details">
    <div class="header">
      <span
        :class="{ [issuable.state]: true }"
        class="state"
      >{{ stateText }}</span>
      <span class="capitalize"> opened</span>
      {{ createdAgo }} by
      <user-avatar
        :user="issuable.author"
        :show-handle="false"
      />
      <a :href="issuable.web_url" class="view-link">
        Open in GitLab
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

<style lang="scss">
.issuable-details {
  border-bottom: 1px solid #919191;
  line-height: 21px;

  .header {
    padding: 10px 0 6px;
    line-height: 36px;
    margin-bottom: 8px;
    border-bottom: 1px solid #919191;
    position: relative;

    .view-link {
      position: absolute;
      right: 0;
    }

    .state {
      border-radius: 4px;
      padding: 2px 9px;
      margin-right: 5px;
      font-size: 12px;

      &.opened {
        background-color: #2A9D3F;
      }

      &.closed {
        background-color: #1D64C9;
      }
    }
  }

  .description {
    margin-bottom: 16px;
  }
}
</style>
