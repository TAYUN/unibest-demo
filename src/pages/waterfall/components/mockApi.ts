// 图片列表
export const imgs = [
  'https://gips0.baidu.com/it/u=567323913,331130417&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f1000_1000',
  'http://gips3.baidu.com/it/u=775223787,1959096310&fm=3028&app=3028&f=JPEG&fmt=auto?w=1440&h=2560',
  'http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips3.baidu.com/it/u=100751361,1567855012&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'https://gips3.baidu.com/it/u=3732737575,1337431568&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f1440_2560',
  'http://gips0.baidu.com/it/u=3560029307,576412274&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'http://gips3.baidu.com/it/u=3892227616,2240763844&fm=3028&app=3028&f=JPEG&fmt=auto?w=3200&h=3200',
  'http://gips1.baidu.com/it/u=3885198370,1571719977&fm=3028&app=3028&f=JPEG&fmt=auto?w=2560&h=1920',
  'http://gips0.baidu.com/it/u=3557606594,2640240494&fm=3028&app=3028&f=JPEG&fmt=auto?w=2048&h=2048',
  'http://gips2.baidu.com/it/u=3589715542,620993072&fm=3028&app=3028&f=JPEG&fmt=auto?w=2048&h=2048',
  'http://gips0.baidu.com/it/u=398917425,2942293409&fm=3028&app=3028&f=JPEG&fmt=auto?w=1920&h=2560',
  'http://gips0.baidu.com/it/u=1370402140,2009956566&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280',
  'http://gips2.baidu.com/it/u=3579059838,1031544773&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=720',
  'http://gips3.baidu.com/it/u=1121275038,3924754772&fm=3028&app=3028&f=JPEG&fmt=auto?w=1920&h=2560',
  'https://gips1.baidu.com/it/u=2622851591,902014643&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f600_800',
  'http://gips2.baidu.com/it/u=658660608,3402622316&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280',
  'http://gips3.baidu.com/it/u=3557221034,1819987898&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960',
  'http://gips1.baidu.com/it/u=1647344915,1746921568&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280',
  'http://gips3.baidu.com/it/u=3419425165,837936650&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024',
]
export function generateMockData({ page, pageSize, tabId }) {
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
    const width = Math.floor(Math.random() * (200 - 100) + 100) // 随机宽度 100 到 300
    const height = Math.floor(Math.random() * (250 - 100) + 100) // 随机高度 100 到 300

    const item = {
      id: i + 1,
      title: `Item ${i + 1}`,
      thumb: imgs[i % imgs.length],
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

export const mockTabListApi = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '成功',
        data: [
          { id: 1, title: '推荐' },
          { id: 2, title: '热门' },
          { id: 3, title: '最新' },
          { id: 4, title: '折扣' },
        ],
      })
    }, 500) // 模拟网络延迟
  })
}

// console.log('mock数据：', JSON.stringify(res, null, 2))
