<script>
import IssuableDetails from './components/IssuableDetails';
import IssuableDiscussions from './components/IssuableDiscussions';

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
  },
  created() {
    this.isLoading = true;

    window.addEventListener('message', event => {
      this.issuable = event.data.issuable;
      this.isLoading = false;
    });
  },
}
</script>

<template>
  <div id="app">
    <h2 v-if="isLoading">Loading...</h2>
    <template v-else>
      <issuable-details :issuable="issuable" />
      <issuable-discussions :discussions="discussions" />
    </template>
  </div>
</template>

<style lang="scss">
</style>
