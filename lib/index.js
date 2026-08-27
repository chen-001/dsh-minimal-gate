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
 */
export const name = '@dsh-external/dsh-minimal-gate';
/** 极简预设下始终保留的模型可见工具。 */
const KEEP = new Set(['bash', 'str_replace_editor']);
function optionalService(ctx, service) {
    try {
        return ctx.get(service);
    }
    catch {
        return undefined;
    }
}
export function apply(ctx) {
    /** agent/created 等事件由 dsh-agent/dsh-tools 模块扩充，不引入其类型时用宽类型挂监听。 */
    const on = ctx.on.bind(ctx);
    /** agent.id -> 当前生效的 gate（deny 名单签名 + 撤销器）。 */
    const gates = new Map();
    const clearGate = (agentId) => {
        const gate = gates.get(agentId);
        gate?.dispose?.();
        gates.delete(agentId);
    };
    const applyGate = (agent) => {
        if (!agent?.ctx)
            return;
        const presets = optionalService(ctx, 'agentPresets');
        let preset;
        try {
            preset = presets?.composedPreset?.(agent.ctx);
        }
        catch {
            return;
        }
        if (preset !== 'minimal') {
            clearGate(agent.id);
            return;
        }
        const tools = agent.ctx.tools;
        if (!tools?.restrict || !tools?.view)
            return;
        let deny;
        try {
            deny = [...tools.view(agent.ctx).restrictableNames].filter((name) => !KEEP.has(name)).sort();
        }
        catch {
            return;
        }
        const signature = deny.join('\u0000');
        if (!signature) {
            // 全局层没有可 deny 的工具：无事可做，也不保留空 gate。
            clearGate(agent.id);
            return;
        }
        const current = gates.get(agent.id);
        if (current?.signature === signature)
            return;
        current?.dispose?.();
        gates.delete(agent.id);
        try {
            const dispose = tools.restrict({ deny });
            gates.set(agent.id, { signature, dispose });
        }
        catch (error) {
            ctx.logger?.warn(`[dsh-minimal-gate] restrict failed for agent ${agent.id}: ${String(error)}`);
        }
    };
    // 已存在的 agent（注入/热重载时进程里已有会话）。
    const agents = optionalService(ctx, 'agents');
    try {
        for (const agent of agents?.list() ?? [])
            applyGate(agent);
    }
    catch {
        // agent 注册表尚未就绪时静默；agent/created 会补上。
    }
    on('agent/created', ({ agent }) => {
        applyGate(agent);
    });
    on('agent/disposed', ({ agent }) => {
        clearGate(agent.id);
    });
    on('agent/request', async (payload, next) => {
        const resolved = await next();
        try {
            // 预设可能在首条消息前被切换（recompose）；每次请求前校正一次，
            // 签名不变时是 no-op，不会堆积重复 restriction。
            applyGate(payload.agent);
        }
        catch {
            // 校正失败不阻断请求。
        }
        return resolved;
    });
    // 新全局工具注册后重新校正所有活 agent（minimal 下新工具也要被挡）。
    on('tools/change', () => {
        try {
            for (const agent of agents?.list() ?? [])
                applyGate(agent);
        }
        catch {
            // 忽略：下一次 agent/request 仍会校正。
        }
    });
    // 插件卸载/热重载时撤掉本插件加的所有 restriction。
    ctx.effect(() => () => {
        for (const gate of gates.values())
            gate.dispose?.();
        gates.clear();
    });
}
//# sourceMappingURL=index.js.map