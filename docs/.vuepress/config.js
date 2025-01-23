module.exports = {
    title: 'Jay\'s blog',
    description: '贾一倍的个人网站',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: '/codecat.jpeg' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
      lineNumbers: false, // 代码块显示行号
    },
    plugins: [
      ["vuepress-plugin-auto-sidebar", {}]
    ],
    themeConfig: {
      nav:[ // 导航栏配置
        {text: '前端基础', link: '/accumulate/' },
        {text: '技术栈', link: '/stack/' },
        {text: '算法题库', link: '/algorithm/'},
        {text: '浏览器', link: '/browser/'},
        {text: '计算机网络', link: '/network/'},
        {text: '优化', link: '/optimize/'},
        {text: 'c++', link: '/c++/'}
      ],
      // sidebar: 'auto' // 侧边栏
      // sidebarDepth: 3, // 侧边栏显示3级
    }
  };