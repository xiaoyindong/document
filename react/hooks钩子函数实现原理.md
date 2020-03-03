
## useState钩子函数实现原理

我们都知道useState是用来保存状态的，在调用这个函数的时候需要传入一个初始值，返回值是一个数组，第一个值是状态值，第二个值是设置状态值的函数。

```jsx
const [count, setCount] = useState(0);
return <div>
    {count}
    <button onClick={() => {
        setCount(count + 1)
    }}></button>
</div>
```

我们先声明一下useState函数，返回一个数组，接收初始值，定义一个state变量存储初始值。注意useState方法只能执行一次，所以我们还需要处理一下，将state放在外面，如果有值不设置默认值，如果没有值再设置默认值。

在创建一个设置state值的方法，返回出去。

```js
let state;
function useState (initialState) {
    state = state ? state : initialState;
    function setState(newState) {
        state = newState;
    }
    return [state, setState]
}
```

当我们调用完setState更新state之后需要渲染视图，也就是组件需要重新渲染。我们需要定义这个方法，然后在setState方法中调用这个方法。

```js
function setState(newState) {
    state = newState;
    render();
}
function render() {

}
```

在render方法中需要调用ReactDOM来重新渲染视图。

```js
function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}
```

基本的一个功能我们实现完了，但是存在一个问题，我们之前useState是可以执行多次设置多个状态的，我们这里只能存储一个，所以还需要进一步修改。

可以将state修改为一个数组，设置state的方法也放在一个数组中存储。对应关系通过下标实现。

```js
let state = [];
const setters = [];
let stateIndex = 0;
```

useState代码我们修改一下，state变量改成了数组，这里也得修改一下state[stateIndex].

```js
function useState (initialState) {
    state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState;
    return [state, setState]
}
```

接着setState的位置也要修改一下，当我们修改state的时候需要传入下标，我们这里采用闭包的方式将各自的下标保存一份，这样在点击按钮的时候就可以拿到对应的下标了。我们定一个个createSetter来实现, 这个函数接收一个下标作为参数，返回一个函数就是我们之前设置的setState。函数接收newState, 设置在state中，index是闭包缓存的index, 最后调用一下render就可以了。

```js
function createSetter (index) {
    return function (newState) {
        state[index] = newState;
        render();
    }
}
```

我们可以调用createSetter方法来得到设置state的方法并且存储index。

```js
function useState (initialState) {
    state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState;
    const setState = createSetter(stateIndex);
    setters.push(setState);
    return [state, setState]
}
```

最后我们还要处理一下设置下标值的改变。每次调用useState的时候让stateIndex加1，同时我们也知道每次调用render的时候useState会重新执行，所以我们在render方法中将stateInd