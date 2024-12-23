export function generateMockData({ page, pageSize }) {
  // 模拟数据源
  const totalItems = Math.floor(Math.random() * 100) + 20 // 随机生成总项数，至少为 20
  const totalPages = Math.ceil(totalItems / pageSize) // 计算总页数

  // 如果请求的页数超出总页数，设置为最后一页
  if (page > totalPages) {
    page = totalPages
  }

  // 计算返回的数据范围
  const startIdx = (page - 1) * pageSize
  const endIdx = startIdx + pageSize

  const dataList = []
  for (let i = startIdx; i < endIdx && i < totalItems; i++) {
    // 随机生成不同的宽度和高度
    const width = Math.floor(Math.random() * (300 - 100) + 100) // 随机宽度 100 到 300
    const height = Math.floor(Math.random() * (300 - 100) + 100) // 随机高度 100 到 300

    const item = {
      id: i + 1,
      title: `Item ${i + 1}`,
      thumb: `https://picsum.photos/${width}/${height}?random=${Math.random().toFixed(2)}`,
      price: (Math.random() * (100 - 10) + 10).toFixed(2),
      originalPrice: (Math.random() * (200 - 100) + 100).toFixed(2),
      communityMerchant: {
        title: `Merchant ${Math.floor(Math.random() * 20) + 1}`,
        avatar: `https://picsum.photos/50/50?random=${Math.random().toFixed(2)}`,
      },
    }

    dataList.push(item)
  }

  return {
    success: true,
    message: '请求成功',
    code: 200,
    data: {
      items: dataList,
      pageInfo: {
        currentPage: page,
        totalPages,
        totalItems,
        pageSize,
      },
    },
  }
}

// 模拟发送请求并输出结果
const pageInfo = { value: { page: 2, pageSize: 5 } } // 假设请求第 2 页，每页 5 条数据
const res = generateMockData({
  page: pageInfo.value.page,
  pageSize: pageInfo.value.pageSize,
})

// console.log('mock数据：', JSON.stringify(res, null, 2))
