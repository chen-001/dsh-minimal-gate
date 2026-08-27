# dsh-minimal-gate

DSH 极简模式工具闸门：让 `minimal` 预设只保留 `bash` 和 `str_replace_editor`，
自动挡掉全局层注册的其他工具（ssh、可视化、报表等）。只对 minimal 预设生效，
其他预设不受影响。

## 安装

```bash
git clone https://github.com/chen-001/dsh-minimal-gate.git
cd dsh-minimal-gate
DSH_CHECKOUT=<你的 dsh 源码路径> bash scripts/build.sh
```

构建完成后，在 DSH 会话中用注入器装载：

```text
dev_inject_plugin /path/to/dsh-minimal-gate
```

## 作用

- minimal 预设下的 agent 只剩 bash + str_replace_editor 两个工具
- 卸载即净：`dev_uninject_plugin dsh-minimal-gate` 后工具全部恢复
