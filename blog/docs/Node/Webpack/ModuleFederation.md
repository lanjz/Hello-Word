# Module Federation

[Module Federation](https://webpack.docschina.org/concepts/module-federation/) 是 Webpack 5 一个重要更新功能。文档的介绍如下：  
一个应用可以由多个独立的构建组成。这些独立的构建之间没有依赖关系，他们可以独立开发、部署。上述解释，其实就是微前端的概念。使用 module federation，我们可以在一个 javascript 应用中动态加载并运行另一个 javascript 应用的代码，并实现应用之间的依赖共享
