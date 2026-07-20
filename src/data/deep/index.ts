import type { ToolDeepDive } from '../deepDive'
import { langgraphDeep } from './langgraph'
import { openaiAgentsDeep } from './openai-agents'
import { autogenDeep } from './autogen'
import { phoenixDeep } from './phoenix'
import { langsmithDeep } from './langsmith'
import { opentelemetryDeep } from './opentelemetry'
import { openvikingDeep } from './openviking'
import { mem0Deep } from './mem0'
import { deepevalDeep } from './deepeval'
import { ragasDeep } from './ragas'
import { litellmDeep } from './litellm'
import { mcpDeep } from './mcp'
import { daytonaDeep } from './daytona'
import { e2bDeep } from './e2b'
import { difyDeep } from './dify'
import { crewaiDeep } from './crewai'

export const DEEP_DIVES: Record<string, ToolDeepDive> = {
  langgraph: langgraphDeep,
  'openai-agents': openaiAgentsDeep,
  autogen: autogenDeep,
  phoenix: phoenixDeep,
  langsmith: langsmithDeep,
  opentelemetry: opentelemetryDeep,
  openviking: openvikingDeep,
  mem0: mem0Deep,
  deepeval: deepevalDeep,
  ragas: ragasDeep,
  litellm: litellmDeep,
  mcp: mcpDeep,
  daytona: daytonaDeep,
  e2b: e2bDeep,
  dify: difyDeep,
  crewai: crewaiDeep,
}

export function deepDiveById(toolId: string): ToolDeepDive | undefined {
  return DEEP_DIVES[toolId]
}
