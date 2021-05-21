## 1. 概述

```WebGL```可以理解为原生的```javascript```，而```three.js```更像是```jq```。

```WebGL```可以将```javascrit```与```openGL ES2```结合进行显卡操作，让前端可以通过编写```js```代码，借助显卡在浏览器端编写```3D```图形。不过在这个过程对于图形渲染需要使用着色器语言就是```LES```才能完成页面展示操作。

```Three.js```是一个类库，他的内部提供了很多````3D````显示功能，首先介绍一下几个核心的概念。

- 场景

场景就是所展示在的空间。也可以说是一个舞台。任何要展示的内容都可以放置在场景中。场景就是一个三维空间。

- 相机

相机可以理解为眼睛，可以把它想象成浏览器的眼睛。

相机用来生成快照，将场景和场景中的内容进行快照保存，渲染到页面中。

在```Three.js```中有正投影相机和透视相机，正投影相机会将远处和近处的内容做同等大小的处理，透视相机则更符合人的心理习惯，近大远小。

- 渲染器

渲染器决定了内容如何呈现至屏幕，也就是将相机中的内容渲染到页面。

- 几何体

几何体就是要渲染的图形。

## 绘制一个3D立方体

```js
// 场景构建
const scene = new THREE.Scene();
// 相机(眼睛) - 使用透视相机
// 视角45度，纵横比, 近点距离，远点距离
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000); // 1到1000米
// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
// 几何体
document.body.appendChild(renderer.domElement);
// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 材质
const material = new THREE.MeshBasicMaterial({
    color: 0x324334,
    wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

// 修