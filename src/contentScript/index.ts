import axios from 'axios'

console.log('twitch rank bot on')

const url = 'https://api.davout.io'

interface LolRanking {
  twitchUsername: string
  lolRank: string
  lolTier: string
  lolRegion: string
}

const appendIcon = (el: Element, lolRanking: LolRanking) => {
  if (!el) {
    return
  }

  const iconContainer = el.querySelector('.chat-line__username-container span')

  console.log(iconContainer)

  if (iconContainer) {
    const div = document.createElement('div')

    // div.style.display = 'inline'
    // div.style.width = '20px'
    // div.style.height = '20px'
    // div.style.backgroundColor = '#2f2f2f2'

    // TODO: take care of styles
    div.classList.add('InjectLayout-sc-1i43xsx-0')
    div.classList.add('jbmPmA')

    const button = document.createElement('button')

    button.dataset.aTarget = 'chat-badge'

    const img = document.createElement('img')

    img.src = `https://static-cdn.jtvnw.net/badges/v1/bbbe0db0-a598-423e-86d0-f9fb98ca1933/1`

    // img.style.marginBottom = '0.15rem'
    // img.style.marginRight = '0.3rem'
    // img.style.width = '18px'
    // img.style.height = '18px'

    img.classList.add('chat-badge')

    if (lolRanking.lolRank && lolRanking.lolTier) {
      img.ariaLabel = `${lolRanking.lolTier} ${lolRanking.lolRank}`
    } else {
      img.ariaLabel = `N/A`
    }

    button.appendChild(img)

    div.appendChild(button)

    iconContainer.appendChild(div)
  }
}

const container = document.querySelector('.chat-scrollable-area__message-container')

console.log(container)

const config = { attributes: true, childList: true, sbutree: true }
const usersRankingsCache = new Map()

const observer = new MutationObserver((mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      const chatLine = mutation.addedNodes[0]

      console.log(chatLine)

      if (chatLine) {
        const twitchUsername = chatLine.getAttribute('data-a-user')

        console.log({ twitchUsername })

        if (!twitchUsername) {
          return
        }

        if (usersRankingsCache.has(twitchUsername)) {
          appendIcon(chatLine, usersRankingsCache.get(twitchUsername))

          continue
        }

        axios
          .post(`${url}/api/users/rankings/search`, {
            twitchUsernames: [twitchUsername],
          })
          .then((res) => {
            console.log({ res })

            const usersRankings = res.data.userRankings

            usersRankings.forEach((userRanking) => {
              usersRankingsCache.set(userRanking.twitchUsername, userRanking)

              if (userRanking) {
                appendIcon(chatLine, userRanking)
              }
            })
          })
          .catch((err) => {
            console.log('something went wrong', err)
          })
      }
    }
  }
})

observer.observe(container, config)

// observer.disconnect();
