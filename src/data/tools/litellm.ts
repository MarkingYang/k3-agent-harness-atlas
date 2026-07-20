import type { ToolDetail } from '../toolDetail'

/**
 * LiteLLM 详情数据（模型网关层）
 * 事实来源：BerriAI/litellm 官方 GitHub README 与 docs.litellm.ai 官方文档
 */
export const litellmDetail: ToolDetail = {
  toolId: 'litellm',
  tagline: '统一接口调用 100+ 模型，换模型只改一行',
  problem:
    '生产中的 Agent 往往需要同时接入多家模型：OpenAI、Anthropic、Azure、Gemini 乃至国产模型。各家 SDK 的参数、鉴权、限流与异常类型各不相同，换一家模型就要重写一版调用代码，重试与降级逻辑也得自己造。成本更难核算：token 花费散落在各厂商控制台，无法按团队或项目归集。LiteLLM 把这些差异收敛进一个 OpenAI 兼容的 completion() 接口与 Router 组件，让模型切换、容错与成本追踪从工程问题变成配置问题。',
  architecture: [
    {
      title: '统一调用接口',
      desc: 'completion() 对 100+ 厂商暴露同一套 OpenAI 格式 API，模型名写作 provider/model 形式，响应格式与异常类型全部归一化为 OpenAI 风格。',
    },
    {
      title: 'Router 路由',
      desc: 'Router 维护 model_list 部署清单，同名 model_name 归为一组，可按 simple-shuffle、latency-based、cost-based 等策略在组内负载均衡。',
    },
    {
      title: 'Fallback 容错',
      desc: '通过 fallbacks 声明备用模型组，配合 num_retries 重试（限流时指数退避）与 cooldown 冷却机制，主模型超时或限流时自动切换到健康部署。',
    },
    {
      title: '成本与观测',
      desc: '内置 model cost map 自动核算每次调用花费，success_callback 一行即可把输入输出接入 Langfuse、MLflow、Helicone 等观测平台。',
    },
    {
      title: 'Proxy 网关',
      desc: 'litellm[proxy] 可启动自托管网关：虚拟 Key、按 Key/团队/用户的预算与限流、管理后台 UI，任何 OpenAI 兼容客户端零改动接入。',
    },
  ],
  quickStart: {
    install: 'pip install litellm',
    code: `from litellm import completion, Router

# 1) 统一调用：同一接口调用任意厂商模型
resp = completion(
    model="openai/gpt-4o",  # 改模型名即可切换厂商
    messages=[{"role": "user", "content": "用一句话解释 MCP"}],
)
print(resp.choices[0].message.content)

# 2) Router fallback：主模型失败自动切备用
router = Router(
    model_list=[
        {"model_name": "main", "litellm_params": {"model": "openai/gpt-4o"}},
        {"model_name": "backup", "litellm_params": {"model": "anthropic/claude-3-5-sonnet-20241022"}},
    ],
    fallbacks=[{"main": ["backup"]}],
)
print(router.completion(model="main", messages=[{"role": "user", "content": "hi"}]))`,
    lang: 'python',
    note: '示例已按官方 Quickstart 精简，需设置 OPENAI_API_KEY / ANTHROPIC_API_KEY 环境变量。',
  },
  useCases: [
    {
      title: '多模型灰度与降级',
      desc: '线上 Agent 主用 GPT 系模型，限流或故障时经 fallbacks 自动切到 Claude 或国产模型，可用性与成本双保险。',
    },
    {
      title: '统一成本核算',
      desc: '按 API Key、团队、项目维度归集各厂商 token 花费并设置预算告警，终结在多家控制台之间手工对账。',
    },
    {
      title: '模型横向评测',
      desc: '同一套 prompt 经统一接口批量打到不同模型，输出格式完全一致，便于横向比较质量、延迟与价格。',
    },
  ],
  ecosystem: ['OpenAI', 'Anthropic', 'Azure OpenAI', 'Amazon Bedrock', 'Vertex AI', 'Ollama', 'Langfuse', 'LiteLLM Proxy'],
  resources: [
    { label: 'GitHub 仓库', url: 'https://github.com/BerriAI/litellm' },
    { label: '官方文档 · Quickstart', url: 'https://docs.litellm.ai/docs/' },
    { label: 'Router 路由与负载均衡', url: 'https://docs.litellm.ai/docs/routing' },
    { label: 'Fallback 容错配置', url: 'https://docs.litellm.ai/docs/proxy/reliability' },
    { label: '支持的模型与价格', url: 'https://docs.litellm.ai/docs/providers' },
  ],
  articles: [
    {
      title: 'Migrating LiteLLM to Rust - Building the Fastest and Litest AI Gateway',
      author: 'LiteLLM Team',
      source: 'LiteLLM 官方工程博客',
      url: 'https://docs.litellm.ai/blog/litellm-rust-launch',
      note: '官方详解网关热路径迁移 Rust 的架构决策与性能基准',
    },
    {
      title: 'How OpenRouter Model Routing Works',
      author: 'OpenRouter Team',
      source: 'OpenRouter 官方博客',
      url: 'https://openrouter.ai/blog/insights/model-routing/',
      note: '拆解模型路由与供应商路由两层设计，可对照 LiteLLM Router',
    },
    {
      title: 'What is an LLM Gateway?',
      author: 'Portkey Team',
      source: 'Portkey 官方博客',
      url: 'https://portkey.ai/blog/what-is-an-llm-gateway',
      note: '同类网关视角，讲清控制平面的核心职能与生产价值',
    },
    {
      title: 'AI Gateway Benchmark: Kong AI Gateway, Portkey, and LiteLLM',
      author: 'Kong Engineering',
      source: 'Kong 工程博客',
      url: 'https://konghq.com/blog/engineering/ai-gateway-benchmark-kong-ai-gateway-portkey-litellm',
      note: '第三方压测对比三大网关吞吐与延迟，方法可复现',
    },
  ],
  faq: [
    {
      q: '和直接用 OpenAI SDK 有什么区别？',
      a: 'LiteLLM 是 OpenAI 兼容的超集：同样的 messages 格式与返回结构，但 model 参数支持 provider/model 写法指向 100+ 厂商，异常也统一映射为 OpenAI 类型，迁移成本几乎为零。',
    },
    {
      q: 'SDK 和 Proxy 网关两种模式怎么选？',
      a: 'SDK（pip 包）适合嵌入单个应用代码；Proxy 适合平台团队统一收口模型访问——虚拟 Key、预算限流、Guardrails 与审计日志集中在网关侧，客户端只需把 base_url 指向网关。',
    },
    {
      q: '厂商不支持的参数怎么办？',
      a: 'LiteLLM 会对各厂商参数做翻译与归一化，个别不支持的参数可设置 drop_params=True 自动丢弃，保证调用不因参数差异而报错。',
    },
  ],
}
