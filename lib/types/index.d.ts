/**
 * @dsh-external/dsh-minimal-gate — 极简模式工具闸门。
 *
 * 官方 `minimal` 预设（“极简模式”）只在 agent 层挂载了
 * bash（persistent）与 str_replace_editor；但第三方插件（super-injector、
 * ssh、genui、whale-report、vision、visualize 等）把工具注册进了 tools
 * 服务的**全局层**，所有 agent（包括 minimal）都会继承，因此极简模式仍会
 * 看到 32 个工具。
 *
 * 本插件对每个挂载 minimal 预设的 agent 在 scoped 层调用
 * `agent.ctx.tools.restrict({ deny: [...] })`，把当前全局层可 restrict 的
 * 所有工具 deny 掉（预设自己挂载的 scoped 工具不受影响），于是极简模式
 * 只剩 bash + str_replace_editor。deny 名单按 `tools.view()` 的
 * `restrictableNames` 动态计算，未来新增的全局工具也会自动被挡掉。
 * 校正发生在消息进入 inbox 时（早于工具快照），第一条请求即严格生效。
 */
export declare const name = "@dsh-external/dsh-minimal-gate";
/** 本插件使用的 cordis 上下文最小面。零运行时依赖，仅类型声明。 */
interface GateContext {
    get(key: string): unknown;
    on(event: string, listener: (...args: any[]) => unknown): unknown;
    effect(setup: () => () => void): void;
    logger?: {
        warn(...args: unknown[]): void;
    };
}
export declare function apply(ctx: GateContext): void;
export {};
