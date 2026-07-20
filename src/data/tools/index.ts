import type { ToolDetail } from '../toolDetail'
import { langgraphDetail } from './langgraph'
import { openaiAgentsDetail } from './openai-agents'
import { autogenDetail } from './autogen'
import { phoenixDetail } from './phoenix'
import { langsmithDetail } from './langsmith'
import { opentelemetryDetail } from './opentelemetry'
import { openvikingDetail } from './openviking'
import { mem0Detail } from './mem0'
import { deepevalDetail } from './deepeval'
import { ragasDetail } from './ragas'
import { litellmDetail } from './litellm'
import { mcpDetail } from './mcp'
import { daytonaDetail } from './daytona'
import { e2bDetail } from './e2b'
import { difyDetail } from './dify'
import { crewaiDetail } from './crewai'

/** 全部工具详情，key 为 toolId */
export const TOOL_DETAILS: Record<string, ToolDetail> = {
  langgraph: langgraphDetail,
  'openai-agents': openaiAgentsDetail,
  autogen: autogenDetail,
  phoenix: phoenixDetail,
  langsmith: langsmithDetail,
  opentelemetry: opentelemetryDetail,
  openviking: openvikingDetail,
  mem0: mem0Detail,
  deepeval: deepevalDetail,
  ragas: ragasDetail,
  litellm: litellmDetail,
  mcp: mcpDetail,
  daytona: daytonaDetail,
  e2b: e2bDetail,
  dify: difyDetail,
  crewai: crewaiDetail,
}

export function toolDetailById(toolId: string): ToolDetail | undefined {
  return TOOL_DETAILS[toolId]
}
