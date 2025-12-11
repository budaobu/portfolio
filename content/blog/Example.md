---
title: 'Blog 功能演示：代码块与图片集' 
date: '2025-05-20' 
description: '这是一篇演示文章，展示了我们新开发的博客系统的核心功能：代码块溢出换行、一键复制以及精美的图片灯箱效果。' 
category: 'Tech'
---

欢迎来到新的博客模块！这里主要测试两项核心功能的渲染效果。

## 1. 代码块演示

这是一个非常长的代码行，用于测试自动换行 (Soft Wrap) 功能，而不是传统的横向滚动。你可以尝试点击右上角的复制按钮。

```typescript
// 这是一个超长的注释，用于测试在移动端或窄屏设备上，代码块是否会正确地进行折行显示，而不是出现难看的水平滚动条，从而提升阅读体验。
export const longFunction = (param1: string, param2: number, param3: boolean): void => {
  console.log(`Parameters received: ${param1}, ${param2}, ${param3}`);
  // 这里模拟一段很长的逻辑代码
  const result = param1.split('').reverse().join('') + Math.random().toString(36).substring(7);
  return result;
}
```


## 2. 普通图片演示

普通的 Markdown 图片会自动居中显示：

## 3. 图片集演示 (Image Gallery)

下面是一个 4 列宫格的图片集，点击任意图片可以打开灯箱 (Lightbox) 模式进行查看。我们使用自定义组件 ::image-gallery 来实现。

::image-gallery
---
images:
  - https://images.unsplash.com/photo-1501854140884-074bf86ee95c%3Fq%3D80%26w%3D600%26auto%3Dformat%26fit%3Dcrop
  - https://images.unsplash.com/photo-1504674900247-0877df9cc836%3Fq%3D80%26w%3D600%26auto%3Dformat%26fit%3Dcrop
  - https://images.unsplash.com/photo-1469474968028-56623f02e42e%3Fq%3D80%26w%3D600%26auto%3Dformat%26fit%3Dcrop
  - https://images.unsplash.com/photo-1447752875215-b2761acb3c5d%3Fq%3D80%26w%3D600%26auto%3Dformat%26fit%3Dcrop
---
::

结语

这个博客系统基于 @nuxt/content 构建，支持 MDX 组件，这意味着我们可以在文章中嵌入任何 Vue 组件！