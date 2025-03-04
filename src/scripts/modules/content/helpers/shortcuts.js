import storage from '../../common/storage';

export const defaultShortcuts = {
  pause: 'KeyP',
  mute: 'KeyM',
  actionPseudoFullScreen: 'KeyT',
  actionFullScreen: 'KeyF',
};

export function getUserShortcuts() {
  const userShortcuts = JSON.parse(storage.getLocalItem('userShortcuts'));
  return userShortcuts
    ? { ...defaultShortcuts, ...userShortcuts }
    : defaultShortcuts;
}

export function saveUserShortcuts(shortcuts) {
  storage.setLocalItem('userShortcuts', JSON.stringify(shortcuts));
}
