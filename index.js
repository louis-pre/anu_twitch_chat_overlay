/* TODO: fix race condition, use listener on body? */
if (document.querySelector('.chat-list__lines') && document.querySelector('.click-handler')) {
  let enabled,
      initialContainer,
      initialCollapsed

  const chatCollapser = document.querySelector('[data-a-target="right-column__toggle-collapse-btn"]')

  const enable = chatContainer => {
    const currentParent = chatContainer.parentNode,
          rightColumnCollapsed = document.querySelector('.right-column--collapsed')
    initialCollapsed = !!rightColumnCollapsed
    if (initialCollapsed)
      chatCollapser.click()
    initialContainer = currentParent
    currentParent.removeChild(chatContainer)
    document.querySelector('.click-handler').prepend(chatContainer)
    window.TwitchChatOverlay.addClass(document.body, 'anu-chat-overlay-active')
    window.TwitchChatOverlay.makeDraggable(chatContainer, chatContainer.closest('.click-handler'))
  }

  const disable = chatContainer => {
    window.TwitchChatOverlay.unmakeDraggable(chatContainer, chatContainer.closest('.click-handler'))
    window.TwitchChatOverlay.removeClass(document.body, 'anu-chat-overlay-active')
    initialContainer.append(chatContainer)
    chatContainer.scrollTop = chatContainer.scrollHeight
    if (initialCollapsed)
      chatCollapser.click()
  }

  const ENABLED_ICON_PATH = 'M 3 6 L 3 26 L 12.585938 26 L 16 29.414063 L 19.414063 26 L 29 26 L 29 6 Z M 5 8 L 27 8 L 27 24 L 18.585938 24 L 16 26.585938 L 13.414063 24 L 5 24 Z M 9 11 L 9 13 L 23 13 L 23 11 Z M 9 15 L 9 17 L 23 17 L 23 15 Z M 9 19 L 9 21 L 19 21 L 19 19 Z',
        DISABLED_ICON_PATH = 'M 3 5 L 3 23 L 8 23 L 8 28.078125 L 14.351563 23 L 29 23 L 29 5 Z M 5 7 L 27 7 L 27 21 L 13.648438 21 L 10 23.917969 L 10 21 L 5 21 Z'
  const toggle = document.createElement('div')
  toggle.onclick = _ => {
    const chatContainer = document.querySelector('.chat-list__lines')
    enabled = !enabled
    if (enabled)
      enable(chatContainer)
    else
      disable(chatContainer)
    toggle.querySelector('svg.tw-icon__svg path').setAttribute('d', enabled ? ENABLED_ICON_PATH : DISABLED_ICON_PATH)
  }

  toggle.id = "anu-chat-overlay-toggle"
  toggle.className = 'tw-inline-flex tw-relative tw-tooltip-wrapper'
  toggle.setAttribute('aria-describedby', 'anu-chat-overlay-toggle-tooltip')
  toggle.innerHTML = `
    <button class="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative" aria-label="Chat overlay">
      <span class="tw-button-icon__icon">
        <div style="width: 2rem; height: 2rem;">
          <div class="tw-align-items-center tw-full-width tw-icon tw-icon--fill tw-inline-flex">
            <div class="tw-aspect tw-aspect--align-top">
              <div class="tw-aspect__spacer" style="padding-bottom: 100%;"></div>
              <svg class="tw-icon__svg" width="100%" height="100%" version="1.1" viewBox="0 0 32 32" x="0px" y="0px"><path d="${ DISABLED_ICON_PATH }"/></svg>
            </div>
          </div>
        </div>
      </span>
    </button>
    <div class="tw-tooltip tw-tooltip--align-right tw-tooltip--up" data-a-target="tw-tooltip-label" role="tooltip" id="anu-chat-overlay-toggle-tooltip">Chat Overlay</div>
  `
  const playerSettingsButtons = document.querySelector('.player-controls__right-control-group .settings-menu-button-component')
  playerSettingsButtons.parentNode.after(toggle)

  console.log('Twitch Chat Overlay initialized')
}