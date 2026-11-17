import { useTranslation } from 'react-i18next'

import { useAgentStatus } from '@/features/inbox/hooks/useAgentStatus'
import { useAgentStore } from '@/features/inbox/store/agent'
import {
  AGENT_STATUS,
  type AgentRouterStatus,
} from '@/features/inbox/types/inbox'

type PresenceTone = 'success' | 'error' | 'live' | 'neutral'

const PRESENCE_OPTIONS = [
  {
    id: AGENT_STATUS.AVAILABLE,
    labelKey: 'agent.status.available',
    tone: 'success',
  },
  {
    id: AGENT_STATUS.UNAVAILABLE,
    labelKey: 'agent.status.unavailable',
    tone: 'error',
  },
  { id: AGENT_STATUS.BUSY, labelKey: 'agent.status.busy', tone: 'live' },
  {
    id: AGENT_STATUS.OFFLINE,
    labelKey: 'agent.status.offline',
    tone: 'neutral',
  },
] as const satisfies readonly {
  id: AgentRouterStatus
  labelKey: string
  tone: PresenceTone
}[]

type PresenceOption = {
  id: AgentRouterStatus
  label: string
  tone: PresenceTone
  checked: boolean
}

/** Agent status for the rail: current status, the four options and the change handler. */
export function usePresenceMenu(): {
  isAgent: boolean
  updating: boolean
  current: PresenceOption
  options: PresenceOption[]
  select: (status: AgentRouterStatus) => void
} {
  const { t } = useTranslation()
  const { isAgent, agentStatus, handleStatusChange } = useAgentStatus()
  const updating = useAgentStore((state) => state.updating)

  const options = PRESENCE_OPTIONS.map((option) => ({
    id: option.id,
    label: t(option.labelKey),
    tone: option.tone,
    checked: option.id === agentStatus,
  }))
  const current =
    options.find((option) => option.checked) ?? options[options.length - 1]

  return {
    isAgent,
    updating,
    current,
    options,
    select: (status) => void handleStatusChange(status),
  }
}
