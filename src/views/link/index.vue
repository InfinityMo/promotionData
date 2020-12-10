<template>
  <div class="page">
    <el-upload class="upload-demo"
               action="/basicinfo/test2"
               :show-file-list="false"
               :limit="3"
               :file-list="fileList">
      <el-button size="small"
                 type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
import tableMixin from '@/mixins/dealTable'
export default {
  mixins: [tableMixin],

  data () {
    return {
      fileList: []
    }
  },

  async created () {

  },
  mounted () {

  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
