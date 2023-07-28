export interface IComboLanding {
    airdrop: {
        claimed: boolean
        referee: string
    }
}

export const ComboLanding: IComboLanding = {
    airdrop: {
        claimed: false,
        referee: '0x0000000000000000000000000000000000000000'
    }
}