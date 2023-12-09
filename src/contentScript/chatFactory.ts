import pRetry from 'p-retry'
import { SevenTvChat, NativeChat } from './chat'

export class TwitchChatFactory {
  public async create(): Promise<NativeChat> {
    const retryCount = 10

    return pRetry<NativeChat>(
      async (attemptCount) => {
        if (attemptCount === retryCount) {
          return new NativeChat()
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
