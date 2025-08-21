export const statePropsEnum = {
    playerHp: "playerHp",
    isDoubleJumpUnlocked: "isDoubleJumpUnlocked",
    playerIsInBossFight: "playerInBossFight",
    isBossDefeated: "isBossDefeated",
};

// state of game
function initStateManager() {
    const state = {
        playerHp: 3,
        maxPlayerHp: 3,
        isDoubleJumpUnlocked: false,
        playerIsInBossFight: false,
        isBossDefeated: false,
    };

    return {
        current() {
            return { ...state };
        },
        set(property, value) {
            state[property] = value;
        },
    };
}

export const state = initStateManager();
