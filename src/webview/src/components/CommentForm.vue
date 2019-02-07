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
    min-height: 140px;
    border-radius: 4px;
    padding: 16px;
    font-size: 13px;
    box-sizing: border-box;
    border: 1px solid #919191;
    resize: vertical;
    margin-bottom: 8px;

    &:focus {
      outline: 0;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
    }
  }

  button {
    background-color: #1aaa55;
    border-color: #168f48;
    color: #fff;
    border-radius: 3px;
    padding: 6px 10px;
    font-size: 14px;
    outline: 0;
    margin-right: 10px;
    cursor: pointer;

    &:disabled {
      opacity: .6;
      cursor: default;
    }
  }
}
</style>
