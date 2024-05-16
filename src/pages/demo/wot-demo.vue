<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'WOT Demo',
  },
}
</route>

<template>
  <view class="">
    <wd-cell-group custom-class="group" title="编辑" border>
      <view title-width="0" v-for="(group, groupIndex) in mealData.mealInfo" :key="group.groupName">
        <wd-input
          type="text"
          label="套餐组名"
          label-width="110rpx"
          center
          v-model="group.groupName"
          placeholder="请输入套餐组名..."
          use-suffix-slot
          clearable
        >
          <template #suffix>
            <wd-button
              class="ml-2"
              @click="addItem(groupIndex)"
              type="primary"
              size="small"
              plain
              custom-class="button"
            >
              添加条目
            </wd-button>
            <wd-button
              class="ml-2"
              @click="deleteGroup(groupIndex)"
              type="error"
              size="small"
              plain
              custom-class="button"
            >
              删除此组
            </wd-button>
          </template>
        </wd-input>
        <wd-table :data="group.list" :showHeader="false" :stripe="false">
          <wd-table-col prop="name" :label="group.groupName" width="300rpx">
            <template #value="{ row }">
              <wd-input
                class="text-align-center after-none"
                v-model="row.name"
                placeholder="名称"
              />
            </template>
          </wd-table-col>
          <wd-table-col prop="unit" label="单位">
            <template #value="{ row }">
              <wd-input
                class="text-align-center"
                v-model="row.unit"
                size="small"
                placeholder="单位"
              />
            </template>
          </wd-table-col>

          <wd-table-col prop="price" label="价格" width="200rpx">
            <template #value="{ row }">
              <wd-input
                class="text-align-center"
                v-model="row.price"
                type="number"
                size="small"
                placeholder="价格"
              />
            </template>
          </wd-table-col>
          <wd-table-col prop="number" label="数量">
            <template #value="{ row }">
              <wd-input
                class="text-align-center"
                v-model="row.number"
                type="number"
                size="small"
                placeholder="数量"
              />
            </template>
          </wd-table-col>
          <wd-table-col prop="" label="操作" width="100rpx">
            <template #value="{ row, index }">
              <view class="operate text-align-center">
                <wd-button
                  class="!color-red-400"
                  type="icon"
                  icon="delete"
                  @click="deleteItem(row, index, group, groupIndex)"
                ></wd-button>
              </view>
            </template>
          </wd-table-col>
        </wd-table>
      </view>
      <wd-button
        class="ml-76 my-2"
        size="small"
        plain
        custom-class="button w-full"
        @click="addGroup"
      >
        添加组
      </wd-button>
    </wd-cell-group>
  </view>
</template>

<script lang="ts" setup>
const mealData = ref({
  mealInfo: [
    {
      groupName: '套餐一',
      list: [
        {
          name: '套餐一条目一',
          unit: '份',
          price: 10,
          number: 1,
        },
        {
          name: '套餐一条目二',
          unit: '份',
          price: 10,
          number: 1,
        },
      ],
    },
  ],
})
</script>

<style lang="scss" scoped>
//
</style>
