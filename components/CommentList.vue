<template>
  <div class="common" v-show="commentList.length" id="comment">
    <div class="comment-list">
      <div class="menu">
        <div class="h1">
          <span class="title">全部评论</span>
          <span class="total">{{postModel.commentsCollection.length}}</span>
        </div>
      </div>
      <div class="list">
        <ul>
          <CommentBox
            @reply="val=>$emit('reply',val)"
            v-for="(item,index) in commentList"
            :key="index"
            :index="index"
            :item="item"
          >
            <template slot="tools">
              <div class="tools">
                <span class="reply" @click="$emit('reply',item)">
                  <i class="icon-reply"></i>回复
                </span>
              </div>
            </template>
            <template slot="children">
              <ul>
                <CommentBox
                  @reply="val=>$emit('reply',val)"
                  v-for="(child,index) in item.children"
                  :key="index"
                  :item="child"
                >
                </CommentBox>
              </ul>
            </template>
          </CommentBox>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import CommentBox from './CommentBox'
  export default {
    components: {
      CommentBox,
    },
    props: {
      commentList: Array,
      postModel:Object
    },
  }
</script>

<style lang="scss" scoped>
  .comment-list {
    width: 650px;
    background-color: #fff;
    text-align: left;
    padding: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    margin-bottom: 30px;
    .menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #ec7259;
      font-size: 18px;
      font-weight: 500;
      height: 20px;
      line-height: 20px;
      .title {
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
</style>