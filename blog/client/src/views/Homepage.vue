<template>
  <div class="container">
    <div class="nav">
      <div @click="homepage">首页</div>
      <div>
        <n-popselect
         @update:value="searchcategory"
          v-model:value="selectedcategory"
          :options="categorytyOptions"
          trigger="click"
        >
          <div>
            分类<span>{{ categoryName }}</span>
          </div>
        </n-popselect>
      </div>

      <div @click="dashboard">后台</div>
    </div>
    <n-divider />
    <n-space class="search">
        <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键字" />
        <n-button type="primary" ghost @click="loadBlogs(0)">搜索</n-button>
    </n-space>
    <div v-for="(blog, index) in blogListInfo" style="margin-bottom: 15px; cursor: pointer;">
      <n-card :title="blog.title" @click="todetail(blog)">
        {{ blog.content }}
        <template #footer>
          <n-space align="center">
            <div>发布时间：{{ blog.create_time }}</div>
          </n-space>
        </template>
      </n-card>
    </div>
    <n-pagination
      @update:page="loadBlogs"
      v-model:page="pageInfo.page"
      :page-count="pageInfo.pagecount"
    />
    <n-divider />
    <div class="footer">
      <div>Power by XXXX</div>
      <div>XICP备XXXX号-1</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const message = inject("message");
const dialog = inject("dialog");
const axios = inject("axios");

const pageInfo = reactive({
  page: 1,
  pagesize: 3,
  pagecount: 0,
  count: 0,
  keyword: "",
  categoryId: 0
});

const selectedcategory = ref(0);
const blogListInfo = ref([]);
const categorytyOptions = ref([]);

onMounted(() => {
  loadCategorys();
  loadBlogs();
});

const loadBlogs = async (page = 0) => {
  if (page != 0) {
    pageInfo.page = page;
  }
  let res = await axios.get(
    `/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pagesize=${pageInfo.pagesize}&categoryId=${pageInfo.categoryId}`
  );
  let temp_rows = res.data.data.rows;
  for (let row of temp_rows) {
    row.content += "...";
    let d = new Date(row.create_time);
    row.create_time = `${d.getFullYear()}年${
      d.getMonth() + 1
    }月${d.getDate()}日`;
  }
  blogListInfo.value = temp_rows;
  pageInfo.count = res.data.data.count;
  pageInfo.pagecount =
    parseInt(pageInfo.count / pageInfo.pagesize) +
    (pageInfo.count % pageInfo.pagesize > 0 ? 1 : 0);
  console.log(res);
};

const categoryName = computed(() => {
  let selectedOption = categorytyOptions.value.find((option) => {
    return option.value == selectedcategory.value;
  });
  return selectedOption ? selectedOption.label : "";
});

const loadCategorys = async () => {
  let res = await axios.get("/category/list");
  categorytyOptions.value = res.data.rows.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  console.log(categorytyOptions.value);
};

const searchcategory=  (categoryId) =>{
 pageInfo.categoryId=categoryId
 loadBlogs()

}

const todetail = (blog) => {
router.push({path:"/detail",query:{id:blog.id}})
}

const homepage = () => {
  router.push("/");
};
const dashboard = () => {
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.container {
  width: 1200px;
  margin: 0 auto;
}
.search{
    margin-bottom: 15px;
}
.nav {
  display: flex;
  font-size: 20px;
  padding-top: 20px;
  color: #64676a;
  div {
    cursor: pointer;
    margin-right: 15px;
    &:hover {
      color: #f60;
    }
    span {
      font-size: 12px;
    }
  }
}
.footer {
  text-align: center;
  line-height: 25px;
  color: #64676a;
}
</style>
