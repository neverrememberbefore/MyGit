const express = require("express")
const router = express.Router()
const {db,genid} = require("../db/DbUtils")


// 添加博客
// 修改博客
// 删除博客
// 查询博客

router.get("/detail",async(req,res) =>{
    let {id} =req.query
    let detail_sql = "SELECT * FROM `blog` WHERE `id` = ? "
    let {err,rows} = await db.async.all(detail_sql,[id]);
    if(err == null){
        res.send({
          code:200,
          msg:"获取成功",
          rows
        })
       }else {
        res.send({
          code:500,
          msg:"获取失败"
        })
       }
})

// 查询博客
router.get("/search",async(req,res) =>{
    /**
     * keyword 关键字
     * categoryid 分类id编号
     * 分页，
     * page：页码
     * pagesize 分页大小
     */
    let {keyword,categoryId,page,pagesize} = req.query

    page = page == null ? 1 :page;
    pagesize = pagesize == null ? 10 :pagesize;
    categoryId = categoryId == null ? 0 :categoryId;
    keyword = keyword == null ? "" :keyword;
    

    let whereSqls =[]
    let params = []
    if(categoryId != 0){
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId)
    }

    if(keyword != ""){
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
        params.push ("%"+keyword+"%")
        params.push("%"+keyword+"%")

    }
    let whereSqlsStr = ""
    if(whereSqls.length > 0){
        whereSqlsStr = "WHERE" + whereSqls.join("AND")
    }

    let searchSql = "SELECT `id`,`category_id`,`title`,`create_time`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlsStr + " ORDER BY `create_time` DESC LIMIT ?,?"
    //分页计算
    let searchSqlParams = params.concat([(page - 1)*pagesize],pagesize)

    //计算博客总数
    let searchCount = "SELECT count(*)  AS `count` FROM `blog` " +whereSqlsStr;
    let searchCOuntParams = params

    let searchResult = await db.async.all(searchSql,searchSqlParams)
    let countResult = await db.async.all(searchCount,searchCOuntParams)
    
    if( searchResult.err == null && countResult.err == null){
      res.send({
        code:200,
        msg:"查询成功",
        data:{
            keyword,
            categoryId,
            page,
            pagesize,
            rows:searchResult.rows,
            count:countResult.rows[0].count
        }

    })
  
    }else {
        res.send({
            code:500,
            msg:"查询失败"

        })

    }
    

})

// 删除博客
router.delete("/_token/delete",async(req,res)=>{
    let id = req.query.id
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?"
   let{err,rows} = await db.async.run(delete_sql,[id])
   
   if(err == null){
    res.send({
      code:200,
      msg:"删除成功"
    })
   }else {
    res.send({
      code:500,
      msg:"删除失败"
    })
   }
  })


// 修改博客
router.put("/_token/update",async (req,res) => {

    let {id,title,categoryId,content } = req.body;
    let create_time = new Date().getTime();

    const update_sql = "UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ? WHERE `id` = ?"
    let params = [title,content,categoryId,id ]

    let {err,rows} = await db.async.run(update_sql,params)

    if (err == null) {
        res.send({
            code:200,
            msg:"修改成功"
        })

    }else {
        res.send({
            code:500,
            msg:"修改失败"
        })

    }
})



// 添加博客
router.post("/_token/add",async (req,res) => {

    let {title,categoryId,content} = req.body;
    let id =genid.NextId();
    let create_time = new Date().getTime();
 
    const insert_sql = "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    let params = [id,title,categoryId,content,create_time]

    let {err,rows} = await db.async.run(insert_sql,params)

    if (err == null) {
        res.send({
            code:200,
            msg:"添加成功"
        })

    }else{
        res.send({
            code:500,
            msg:"添加失败",
            data:{
                title,
                categoryId,
                content
            }
        })

    }
})



module.exports = router