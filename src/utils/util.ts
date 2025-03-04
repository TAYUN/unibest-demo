// 睡眠函数
export function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
// 封装navigateTo
export function navTo(url) {
  uni.navigateTo({
    url,
  })
}
