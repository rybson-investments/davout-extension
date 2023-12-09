import pRetry from 'p-retry'
import { SevenTvChat, TwitchChat } from './twitchChat'

export class TwitchChatFactory {
  public async create(): Promise<TwitchChat> {
    const retryCount = 10

    return pRetry<TwitchChat>(
      async (attemptCount) => {
        if (attemptCount === retryCount) {
          return new TwitchChat()
        }

        if (document.querySelector('#seventv-message-container')) {
          return new SevenTvChat()
        }

        throw new Error('7tv chat element not found.')
      },
      {
        retries: retryCount,
        minTimeout: 500,
        maxTimeout: 1000,
      },
    )
  }
}
