<template>
  <el-container class="wrap-box">
    <el-aside class="left-box" width="260px">
      <img :src="require('@/assets/images/headpic.jpg')" alt="">
      <div class="sname">
        <span class="user">{{objUser.MemberName}}</span>
      </div>
      <div class="leve">{{objUser.MemberType}}</div>
      <div class="text first">下载权限：每日下载3次</div>
      <div class="text">注册时间：{{objUser.Regtime}}</div>
      <div class="text">到期时间：{{objUser.EndTime}}</div>
      <div class="btn-group">
        <el-button class="charge">充值会员</el-button>
        <el-button class="exit" type="danger" @click.native="handlerExit">退出登录</el-button>
      </div>
    </el-aside>
    <el-container>
      <el-header class="right-header">
        <div class="flexbox">
          <div class="flexbox-item">
            <el-input
              class="input"
              placeholder="请输入资源地址"
              v-model="strDownload"
              clearable></el-input>
          </div>
          <el-button class="btn" type="primary" @click.native="submitAdd" :loading="intTime > 0 || isSubmitLoad">{{intTime > 0 ? `缓存中${intTime}秒` : '提交'}}</el-button>
        </div>
      </el-header>
      <el-main>
        <div>
          <el-button class="btn-refresh" type="primary" size="small" @click.native="$_getData" v-if="strEmpty=='暂无数据'">刷新</el-button>
        </div>
        <el-table
          :data="tableData"
          :empty-text="strEmpty"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="60">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源地址">
          </el-table-column>
          <el-table-column
            label="操作"
            width="80">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click.native="handlerDownload(scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
      isSubmitLoad: false,
      strDownload: '',
      tableData: [],
      objUser: {},
      strAuthor: `${window.localStorage.token_type} ${window.localStorage.access_token}`,
      intTime: 0,
      strEmpty: '正在加载中...'
    }
  },
  methods: {
    $_inter () {
      this.intTime--
      if (this.intTime > 0) {
        setTimeout(this.$_inter, 1000)
      }
      if (this.intTime % 3 === 0) {
        this.submitAdd(false)
      }
    },
    handlerExit () {
      window.localStorage.removeItem('token_type')
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('expires_in')
      this.$router.replace({name: 'login'})
    },
    handlerDownload (data) {
      window.open(data.download)
    },
    submitAdd (isLoad = true) {
      this.isSubmitLoad = true
      this.$http.post('/api/Member/SubmitUrl', qs.stringify({
        SubmitDownUrl: this.strDownload
      }), {
        headers: {
          Authorization: this.strAuthor
        }
      }).then(response => {
        this.isSubmitLoad = false
        let objData = response.data
        if (objData.IsSuccess) {
          if (!isLoad) {
            if (this.intTime <= 0) {
              this.$message({
                showClose: true,
                message: '资源文件过大，请稍后到下面列表刷新下',
                duration: 0
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: objData.Msg
            })
            this.intTime = 10
            this.$_inter()
          }
        } else {
          if (objData.Url) {
            this.intTime = 0
            this.tableData.push({
              index: this.tableData.length,
              url: this.strDownload,
              download: objData.Url
            })
            this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            })
          } else {
            this.$alert(objData.Msg)
          }
        }
      })
    },
    $_getData () {
      this.tableData = []
      this.strEmpty = '正在获取中...'
      this.$http.get('/api/Member/GetDownloadUrl', {
        headers: {
          Authorization: this.strAuthor
        },
        params: {
          Mobile: this.objUser.MemberName,
          PageIndex: 1,
          PageSize: 10000
        }
      }).then(response => {
        let objData = response.data
        this.strEmpty = '暂无数据'
        if (objData.IsSuccess) {
          let arrTmp = objData.Data || []
          let arrDataTmp = []
          for (let index in arrTmp) {
            arrDataTmp.push({
              id: parseInt(index) + 1,
              url: arrTmp[index].SourceUrl,
              download: arrTmp[index].DownloadUrl
            })
          }
          this.tableData = arrDataTmp
        }
      })
    }
  },
  mounted () {
    /* console.log(window.author) */
    this.$http.get('/api/Member/GetMemberInfo', {
      headers: {
        Authorization: this.strAuthor
      }
    }).then(response => {
      let objData = response.data
      if (objData.IsSuccess) {
        this.objUser = objData
        this.$_getData()
      } else {
        this.$router.replace({name: 'login'})
      }
    })
  }
}
</script>

<style lang="less" scoped>
.text-right{
  text-align: right;
}
.wrap-box{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.left-box{
  background-color: #409eff;
  color: #fff;
  text-align: center;
  img{
    margin: 60px auto 20px;
    display: block;
    width: 140px;
    height: 140px;
    border-radius: 100%;
  }
  .sname{
    .user{
      font-size: 18px;
    }
  }
  .leve{
    margin: 5px 0;
    font-size: 15px;
    text-align: center;
  }
  .text{
    margin: 5px 0;
    padding: 0 0 0 30px;
    font-size: 14px;
    text-align: left;
    &.first{
      margin: 40px 0 5px;
    }
  }
  .btn-group{
    margin: 40px 0 0;
    div{
      margin: 10px 40px;
    }
  }
}
.right-header{
  z-index: 1;
  box-shadow: 0 0 16px rgba(0, 0, 0, .2);
  .input{
    display: inline-block;
    margin: 10px 0;
  }
  .btn{
    margin: 10px 0 10px 10px;
    padding: 0 20px;
    height: 40px;
  }
}
.flexbox{
  display: flex;
  .flexbox-item{
    flex: 1;
    align-items: center;
    justify-content: center;
  }
}
</style>
