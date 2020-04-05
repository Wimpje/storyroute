<template>
  <GridLayout row="*" @loaded="onLoaded" v-if="!loading">
    <ActivityIndicator :busy="loading"
      row="0"
      verticalAlignment="middle"
      horizontalAlignment="middle" />
    <Label v-if="loadingTrouble"
      row="0"
      marginTop="60"
      class="loadingTrouble" 
      verticalAlignment="middle" 
      horizontalAlignment="middle" 
      textWrap="true">
      <FormattedString>
        <Span class="fas" text.decode="&#xf071;"/>
        <Span :text="loadingTrouble" class="title" />
      </FormattedString>
    </Label>
    <Button v-if="showReloader"
      row="0"
      marginTop="150"
      :text="'btn.reload' | L" 
      class="reloadButton"
      @tap="reload">
    </Button>
  </GridLayout>
</template>

<script>
import { localize } from "nativescript-localize";

export default {
  props: ["data"],

  data() {
    return {
      loading: false,
      loadingTrouble: '',
      timeout: null,
      loaded: false,
      showReloader: false
    }
  },
  watch: {
    data (oldVal, newVal) {
      // cancel and check again
      this.reset()
      this.startChecking()
    }
  },
  beforeDestroy() {
    this.reset()
  },
  methods: {
    checkData() {
      let hasData = false
      if (!this.data) {
        hasData = false
      }
      else if(Array.isArray(this.data) && this.data.length === 0) {
        hasData = false
      }
      else {
        hasData = true
      }

      this.loading = !hasData
      if (hasData) {
        this.loadingTrouble = ''
        this.showReloader = false
      }
      return hasData
    },
    onLoaded() {
      this.startChecking() 
    },
    reload() {
      this.$emit('reload', true)
    },
    reset() {
      this.loading = false
      this.showReloader = false
      this.loadingTrouble = ''
      if (this.timeout) 
        clearTimeout(this.timeout)

    },
    startChecking() {
      const hasData = this.checkData()

      if(!hasData) {
        // load 10 sec, then display initial message, then another 10, and give up
        this.timeout = setTimeout(() => {
         if (!this.checkData()) {
            this.loadingTrouble = localize('message.loadingTroubleInitial')
            this.timeout = setTimeout(() => {
                if(!this.checkData()) {
                  this.loadingTrouble = localize('message.loadingTrouble')
                  this.loading = false
                  this.showReloader = true
                }
            }, 10000)
         }
        }, 10000)
      }
    }
  }
};
</script>

<style scoped> 
.loadingTrouble {
  margin: 20;
  font-size: 18;
}
</style>
