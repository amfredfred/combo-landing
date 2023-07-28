import { ethers } from 'ethers'

export const isAddress = (val: string) => ethers.isAddress(String(val))

export const cut = (val: string | number | unknown, position: "middle" | "left" | "right" | undefined = "middle") => {
    const valz = String(val)
    switch (position) {
        case "left":
            if (valz.length <= 4) return valz
            return '...' + valz.slice(-4)
        case "middle":
            return valz.slice(0, 3) + '...' + valz.slice(-3)
        case "right":
            if (valz.length <= 4) return valz
            return valz.slice(0, 4) + '...'
    }
}

// precising/to fixed decimals places  
export const precise = (val: string | number = 0, decimals: undefined | number = 4): string => {
    let tofixed = Number(val ?? 0)?.toFixed?.(decimals + 1)
    let splitted0 = String(tofixed)?.split?.('.')[1]
    return tofixed?.split?.('.')?.[0]?.concat?.('.')?.concat?.(splitted0?.slice?.(0, decimals))
}


// from wei
export const fmWei = (val: string | number, decimals: undefined | string | number = 18): string => {
    if (!val) return precise(0)
    return ethers.formatUnits(String(val), decimals)
}

// to wei
export const toWei = (val: string | number, decimals: any = 18): ethers.BigNumberish | number => {
    if (!val || !decimals) return ethers.parseUnits(String(0), 18)
    return ethers.parseUnits(String(val), decimals)
}
