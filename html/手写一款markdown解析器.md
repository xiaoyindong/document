## 1. 准备

编写getHtml函数，传入markdown文本，使用fs读取markdown内容，传入到getHtml函数中。

```js
const fs = require('fs');

const source = fs.readFileSync('./test.md', 'utf-8');

const getHtml = (source) => {
    // 处理标题
    return source;
}

const result = getHtml(source);

console.log(result);

```

## 2. 处理图片&超链接

```js
const formatLink = (source) => {
    let html = source.replace(/\!\[(.*)\]\((.*)\)/, (...props) => {
        const alt = props[1];
        const link = props[2];
        return `<img alt="${alt}" href="${link}" />`
    })
    html = html.replace(/\[(.*)\]\((.*)\)/g, (...props) => {
        const text = props[1];
        const link = props[2];
        return `<a href="${link}">${text}</a>`
    });
    return html;
}
```

## 3. 处理blockquote

```js
const formatBlock = (source) => {
    let html = source.replace(/(>+)\s(.*)/g, (...props) => {
        const text = (props[2] || '').trimStart();
        if (text) {
            return `<blockquote>${text}</blockquote>`;
        } else {
            return props[0];
        }
    });
    html = html.replace(/(`{3})([\s\S]*)`{3}/g, (...props) => {
        const text = props[2] || '';
        return `<pre>${text}</pre>`;
    });
    return html;
}
```

## 4. 处理表格

```js
const formatTable = (source) => {
    let html = source.replace(/\|.*\|\n\|\s*-+\s*\|.*\|\n/g, (...props) => {
        let str = '<table><tr>';
        const data = props[0].split(/\n/)[0].split('|');
        for (let i = 1; i < data.length - 1; i++) {
            str += `<th>${data[i].trim()}</th>`
        }
        str += '<tr></table>';
        return str;
    });
    return formatTd(html);
}

const formatTd = (source) => {
    const html = source.replace(/<\/table>\|.*\|\n/g, (...props) => {
        let str = '<tr>';
        const data = props[0].split('|');
        for (let i = 1; i < data.length - 1; i++) {
            str += `<td>${data[i].trim()}</td>`
        }
        str += '<tr></table>';
        return str;
    });
    if (html.includes('</table>|')) {
        return formatTd(html);
    }
    return html;
}
```

## 5. 处理标题

```js
const formatTitle = (source) => {
    return source.replace(/(#+)\s(.*)/g, (...props) => {
        const length = (props[1] || '').length;
        const text = props[2] || '';
        if (length > 0 && length < 7) {
            return `<h${length}>${text.trimStart()}</h${length}>`;
        } else {
            return props[0] || '';
        }
    });
}
```

## 6. 处理字体

```js
const formatFont = (source) => {
    let html = source.replace(/(\~{2})(.*)\~{2}/g, (...props) => {
        return `<del>${props[2]}</del>`;
    });
    html = html.replace(/[* -]{3,}\n/g, () => {
        return `<hr />`;
    })
    html = html.replace(/(\*{3})(.*)\*{3}/g, (...props) => {
        return `<strong><em>${props[2]}</em></strong>`;
    });
    html = html.replace(/(\*{2})(.*)\*{2}/g, (...props) => {
        return `<strong>${props[2]}</strong>`;
    });
    html = html.replace(/(\*)(.*)\*/g, (...props) => {
        return `<em>${props[2]}</em>`;
    });
    return html;
}
```

## 7. 处理列表

```js
const getHtml = (source) => {
    // 处理标题
    let html = formatLink(source);
    html = formatBlock(html);
    html = formatTable(html);
    html = formatTitle(html);
    html = formatFont(html);
    return html;
}

const result = getHtml(source);

console.log(result);
```