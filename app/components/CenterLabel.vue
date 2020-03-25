<template>
  <Label class="centerLabel" @tap="onTap" @loaded="center"></Label>
</template>

<script>
export default {
  props: ["centerMethod"],
  methods: {
    onTap(event) {
      this.$emit('tap', event)
    },
    center(args) {
      if (args.object.android) {
        args.object.android.setGravity(17);
      }
    }
  }
};
</script>

<style scoped> 
.centerLabel {
  text-align: center;
  vertical-align: center;
}
</style>
