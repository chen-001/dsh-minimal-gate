# dsh-minimal-gate

DSH 极简模式工具闸门：让 `minimal` 预设只保留 `bash` 和 `str_replace_editor`，
自动挡掉全局层注册的其他工具。只对 minimal 预设生效，其他预设不受影响。

## 安装

```bash
dsh plugin --profile web add github:chen-001/dsh-minimal-gate
```

安装后自动进入该 profile 的插件层，重启 web 后生效。

## 卸载

```bash
dsh plugin --profile web remove @dsh-external/dsh-minimal-gate
```

## 作用

- minimal 预设下的 agent 只剩 bash + str_replace_editor 两个工具
- 以后安装的其他插件（注册到全局工具层）也会自动被挡在 minimal 之外，
  不需要修改本插件

## 实现原理

对 minimal 预设的会话动态计算当前全局工具名单，用 `tools.restrict({ deny })`
拉黑除 bash 与 str_replace_editor 外的所有工具；每条消息进入时先校正，
第一条请求即严格生效，并监听工具变动事件随时更新。

---

## English

A tool gate for DSH's `minimal` preset: keeps only `bash` and
`str_replace_editor`, denying every other globally-registered tool.
Only affects the minimal preset.

### Install

```bash
dsh plugin --profile web add github:chen-001/dsh-minimal-gate
```

The plugin joins the profile layer automatically; restart the web app to load it.

### Uninstall

```bash
dsh plugin --profile web remove @dsh-external/dsh-minimal-gate
```

### What it does

- Agents on the minimal preset see only `bash` and `str_replace_editor`
- Future plugins (registered to the global tool layer) are kept out of
  minimal automatically — no changes to this plugin needed

### How it works

For minimal-preset sessions it computes the current global tool list and
denies all of it except `bash` and `str_replace_editor` via
`tools.restrict({ deny })`. The gate is applied as each message enters the
inbox, so the very first request is already restricted; tool-registry changes
trigger re-checks.
