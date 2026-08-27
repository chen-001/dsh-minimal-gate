# dsh-minimal-gate

DSH 极简模式工具闸门：让 `minimal` 预设只保留 `bash` 和 `str_replace_editor`，
自动挡掉全局层注册的其他工具。只对 minimal 预设生效，其他预设不受影响。

## 安装

```bash
dsh plugin --profile web add github:chen-001/dsh-minimal-gate
```

安装后自动进入该 profile 的插件层并生效（热挂载，无需重启）。

> 如果 pnpm 提示构建脚本被阻止（pnpm 10 默认拦截 git 依赖的 prepare），
> 忽略即可——仓库自带编译产物；也可以按提示在 profile 的
> `pnpm-workspace.yaml` 里 allowlist 后重装。

## 卸载

```bash
dsh plugin --profile web remove @dsh-external/dsh-minimal-gate
```

## 作用

- minimal 预设下的 agent 只剩 bash + str_replace_editor 两个工具
- 以后安装的其他插件（注册到全局工具层）也会自动被挡在 minimal 之外，
  不需要修改本插件
