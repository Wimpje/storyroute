<template>
  <Label class="centerLabel" @loaded="center"></Label>
</template>

<script>
export default {
  props: ["centerMethod"],
  methods: {
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
