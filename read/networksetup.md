## 查看命令

```
man networksetup
```

## 设置代理

```
networksetup -setwebproxy "Wi-fi" 127.0.0.1 1080
networksetup -setsocksfirewallproxy "Wi-fi" 127.0.0.1 1081
networksetup -setsocksfirewallproxystate "Wi-fi" off    # 关闭
```

```
networkservice=$(networksetup -listallnetworkservices |head -n 3|tail -n 1) 
networksetup -setwebproxystate $networkservice off    # 关闭
networksetup -setsocksfirewallproxy $networkservice 127.0.0.1 8080
```

## 关闭代理

```
# 获取wifi名称
networkservice=$(networksetup -listallnetworkservices |head -n 3|tail -n 1) 
networksetup -setwebproxystate $networkservice off    # 关闭
```