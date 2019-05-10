<script>
import IssuableDetails from './components/IssuableDetails';
import IssuableDiscussions from './components/IssuableDiscussions';
import CommentForm from './components/CommentForm';

const vscode = acquireVsCodeApi();

export default {
  name: 'app',
  data() {
    return {
      isLoading: false,
      issuable: {},
      discussions: [],
    };
  },
  components: {
    IssuableDetails,
    IssuableDiscussions,
    CommentForm,
  },
  computed: {
    notesById() {
      const notes = {}

      this.discussions.forEach((d) => {
        d.notes.forEach((n) => {
          notes[n.id] = n;
        });
      });

      notes[this.issuable.id] = this.issuable;
      return notes;
    },
  },
  created() {
    window.vsCodeApi = vscode;
    this.isLoading = true;

    window.addEventListener('message', event => {
      if (event.data.type === 'issuableFetch') {
        this.issuable = event.data.issuable;
        this.discussions = event.data.discussions;
        this.isLoading = false;
      } else if (event.data.type === 'markdownRendered') {
        const { ref, key, markdown } = event.data;
        const note = this.notesById[ref] || {};

        note[key] = markdown;
        note.markdownRenderedOnServer = true;
      }
    });

    window.vsCodeApi.postMessage({
      command: 'appReady',
    });
  },
}
</script>

<template>
  <div id="app">
    <p v-if="isLoading" class="loading">
      Fetching issuable details and discussions. This may take a while.
      <br />
      If it doesn't work, please
      <a href="https://gitlab.com/fatihacet/gitlab-vscode-extension/issues/new">create an issue.</a>
    </p>
    <template v-else>
      <issuable-details :issuable="issuable" />
      <issuable-discussions :discussions="discussions" />
      <comment-form :issuable="issuable" />
    </template>
  </div>
</template>

<style lang="scss">
body.vscode-light {
  * {
    border-color: #B3B7BE !important;

    &::before {
      border-color: #B3B7BE !important;
    }
  }

  .idiff.deletion {
    background: #fac5cd;
  }

  .idiff.addition {
    background: #c7f0d2;
  }

  .issuable-details .state {
    color: #fff;
  }
}
.capitalize {
  text-transform: capitalize;
}

code {
  padding: 2px 4px;
  color: #c0341d;
  background-color: #fbe5e1;
  border-radius: 4px;
}

.idiff.deletion {
  background: #df818f;
}

.idiff.addition {
  background: #7cba8d;
}

#app {
  margin-bottom: 600px; // to give editor scroll past end effect

  .loading {
    text-align: center;
    font-size: 14px;
    line-height: 30px;
  }
}
</style>
