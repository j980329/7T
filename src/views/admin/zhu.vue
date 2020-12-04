<template>
 <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/heima.png" alt=""> -->
        <span>电商后台管理系统  ip:{{user.ip}} 归属地:{{user.cname}}</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>


      <!-- 侧边栏 -->
      

      
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="left">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
      <div class="abc" v-if="this.a==2"></div>
        <el-menu
         background-color="#333744"
        text-color="#fff" 
        active-text-color="#409EFF" 
        unique-opened
         :collapse="isCollapse" 
         :collapse-transition="false" 
         router :default-active="users">

          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
 
 
            <!-- 二级菜单 -->
            <el-menu-item   :index="'/' + it.path" v-for="it in item.children" :key="it.id" @click="saveNavState('/' + it.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{it.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        </div>
      </el-aside>
      
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data() {
        return {
  a:2,
   
     user:JSON.parse(localStorage.getItem('ip'))||{ 'cname':"",'ip':''},
               
          

menulist:JSON.parse(localStorage.getItem('menulist'))||[],
iconsObj:{
  '125':'iconfont icon-user',
  '103':'iconfont icon-tijikongjian',
  '101':'iconfont icon-shangpin',
  '102':'iconfont icon-danju',
  '145':'iconfont icon-baobiao',
},
ico:{
'110':'iconfont icon-user',
'111':'iconfont icon-user',
'112':'iconfont icon-user',
'114':'iconfont icon-user',
'115':'iconfont icon-user',
'121':'iconfont icon-user',
'107':'iconfont icon-user',
'146':'iconfont icon-user',
},
isCollapse:false,
users:"",

        };
    },
    created() {
this.getMenuList()
this.users=window.sessionStorage.getItem('users')
    },
    mounted() {
this.ready()
    },
    methods: {
logout(){
  window.sessionStorage.clear()
  this.$router.push('/login')
},
async getMenuList(){
  const {data:res}=await this.$axios.get('menus')
  if(res.meta.status !==200) return this.$message.error(res.meta.msg)
  this.menulist = res.data
  localStorage.setItem('menulist',JSON.stringify(this.menulist))
console.log(res)
},
toggleCollapse(){
  this.isCollapse = !this.isCollapse
  if(this.isCollapse){
    this.a=1
  }else{
    this.a=2
  }
},
saveNavState(users){
  window.sessionStorage.setItem('users',users)
  this.users = users
},
 ready:function(){
        console.log(returnCitySN)
               //获取本地IP地址
               var cname=returnCitySN.cname;
           var cip = returnCitySN["cip"];
               //给vuedata对象里的字段赋值
           this.user.ip = cip
           this.user.cname=cname
          localStorage.setItem('ip',JSON.stringify(this.user))
       }
},
computed:{},

watch:{},

}

</script>

<style  scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
 
}
 .el-header> div {
    display: flex;
    align-items: center;
    
  }
.el-header> div> span {
      margin-left: 15px;
    }

.el-aside {
  background-color: #333744;
  
  
}

.el-aside>.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.left{
position:fixed;

}
.abc{
  width: 200px;
height: 1px;
}
</style>

