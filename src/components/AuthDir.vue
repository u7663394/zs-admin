<script>
export default {
  props: {
    btnPerm: {
      type: String,
      default: "",
    },
  },
  computed: {
    isShow() {
      const perms = this.$store.state.user.profile.permissions;
      return perms?.includes(this.btnPerm) || perms?.includes("*:*:*");
    },
  },
  /**
   * render() 函数式渲染
   * return 什么 <auth-btn></auth-btn> 位置就显示什么
   */
  render() {
    // this.$slots.default 被包裹的组件
    return this.isShow && this.$slots.default;
  },
};
</script>
