import { UserSummonerRanking } from '../userSummonerRanking/userSummonerRanking'

export interface ObservePayload {
  onChatMessage: (chatMessageElement: Element) => void
  chatElement: Element
}

interface ChatConfig {
  chatElementSelector: string
}

export abstract class Chat {
  abstract appendBadgeElement(chatMessageElement: Element, badgeElement: Element): Element | null
  abstract getTwitchUsername(chatMessageElement: Element): string | null
  abstract createUserSummonerRankingBadgeElement(userSummonerRanking: UserSummonerRanking): Element
  abstract createTooltipElement(): Element

  private chatObserver: MutationObserver | null = null
  private readonly config: ChatConfig

  constructor(config: ChatConfig) {
    this.config = config
  }

  public isAboveMasterTier(user: UserSummonerRanking): boolean {
    return user.tier === 'MASTER' || user.tier === 'GRANDMASTER' || user.tier === 'CHALLENGER'
  }

  public isUnranked(user: UserSummonerRanking): boolean {
    return user.tier === 'UNRANKED'
  }

  public getLolRegionDisplayName(user: UserSummonerRanking): string {
    if (user.region === 'euw') return 'EUW'
    if (user.region === 'eun') return 'EUNE'

    return 'N/A'
  }

  public getTooltipText(user: UserSummonerRanking): string {
    const regionDisplayName = this.getLolRegionDisplayName(user)
    const tierDisplayName = user.tier?.toLowerCase()

    if (this.isAboveMasterTier(user)) {
      return `${tierDisplayName} - ${user.leaguePoints}LP (${regionDisplayName})`
    }

    if (this.isUnranked(user)) {
      return `${tierDisplayName} (${regionDisplayName})`
    }

    return `${tierDisplayName} ${user.rank} (${regionDisplayName})`
  }

  public findChatElement(): Element | null {
    return document.querySelector(this.config.chatElementSelector)
  }

  public async observe(payload: ObservePayload) {
    const { onChatMessage, chatElement } = payload

    if (!chatElement) {
      throw new Error('No chat element found.')
    }

    const observedAt = Date.now()

    const observer = new MutationObserver(async (mutationList) => {
      // wait for 1s to not fetch UserSummonerRanking for preloaded messages
      if (Date.now() - observedAt < 1000) {
        return
      }

      for (const mutation of mutationList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          const chatMessageElement = mutation.addedNodes[0] as Element

          if (chatMessageElement && chatMessageElement.tagName === 'DIV') {
            onChatMessage(chatMessageElement)
          }
        }
      }
    })

    observer.observe(chatElement, { childList: true, subtree: true })

    this.chatObserver = observer
  }

  public async stopObserving(): Promise<void> {
    if (!this.chatObserver) {
      return
    }

    this.chatObserver.disconnect()

    this.chatObserver = null
  }
}
