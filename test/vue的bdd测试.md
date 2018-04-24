BDD的核心是验证网站的正确性为主，首先需要将需求转换为自动化的测试用例。比如这里要开发一个任务列表中添加任务和删除任务的需求。

```js
describe('添加任务', () => {
    test('在输入框中输入内容敲击回车，应该添加任务到列表中', () => {

    })

    test('添加任务成功后，输入框内容应该被清空', () => {

    })
})

describe('删除任务', () => {
    test('点击任务项中的删除按钮，任务应该被删除', () => {

    })
})
```

将需求转换为测试用例是有助于对需求的了解的。接着就要去编写真正的测试细节。比如第一个测试用例。

首先要将挂载器导入进来。

```js
import { mount, createLocalVue } from '@vue/test-utils';
import TodoApp from '@/components/TodoApp/index.vue';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter({
    linkActiveClass: 'selected'
})

describe('添加任务', () => {
    test('在输入框中输入内容敲击回车，应该添加任务到列表中', async () => {
        const wrapper = mount(TodoApp, {
            localVue,
            router
        });
        // 找到dom节点
        const input = wrapper.find('input[data-testid="new-todo"]');

        const text = 'Hello World'
        // 设置value
        await input setValue(text);
        // 点击回车
        await input.trigger('keyup.enter');
        // 断言判断 - 添加到了列表中
        expect(wrapper.find(['input[data-test="todo-item"]'])).toBeTruthy();
        expect(wrapper.find(['input[data-test="todo-text"]'])).text().toBe(text);
    })

    test('添加任务成功后，输入框内容应该被清空', () => {

    })
})
```
