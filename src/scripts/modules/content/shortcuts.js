export const defaultShortcuts = {
    pause: 'KeyP',
    actionT: 'KeyT',
    actionF: 'KeyF'
};

export function getUserShortcuts() {
    const userShortcuts = JSON.parse(localStorage.getItem('userShortcuts'));
    return userShortcuts ? {...defaultShortcuts, ...userShortcuts} : defaultShortcuts;
}

export function saveUserShortcuts(shortcuts) {
    localStorage.setItem('userShortcuts', JSON.stringify(shortcuts));
}
