<script>
export default {
  props: {
    issuable: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      note: '',
    };
  },
};
</script>

<template>
  <div class="main-comment-form">
    <textarea v-model="note"></textarea>
    <button>Comment</button>
  </div>
</template>

<style lang="scss">
.main-comment-form {
  margin: 20px 0 30px 0;

  textarea {
    width: 100%;
    height: 140px;
    border-radius: 4px;
    padding: 16px;
    font-size: 13px;
    box-sizing: border-box;
  }
}
</style>
