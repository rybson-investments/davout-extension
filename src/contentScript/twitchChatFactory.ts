import { TwitchChat } from './twitchChat'

export class TwitchChatFactory {
  public create(): TwitchChat {
    return new TwitchChat()
  }
}
