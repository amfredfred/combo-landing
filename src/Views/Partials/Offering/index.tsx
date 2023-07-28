import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from 'react'
import { useAccount, useContractReads, useContractWrite, usePrepareContractWrite, useNetwork, useBalance } from "wagmi";
import { useWeb3Modal } from '@web3modal/react'
import { cut, fmWei, precise, toWei } from "../../../Helpers/inex";
import { ArrowBack, ChevronRight, Circle, Logout, SwapHoriz } from "@mui/icons-material";
import { motion } from 'framer-motion'
import { _ABI, _Addresses } from "../../../Ethereum";
import { toast } from "react-toastify";
import { useCopyToClipboard, useLocalStorage } from 'usehooks-ts'
import { IComboLanding, ComboLanding } from "../../../Interfaces";
import { useEffect } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function OfferingPanel() {

    const [OpenTab, setOpenTab] = useState<"Offering" | "Freebie" | "Progress">('Offering')
    const { isConnected, address: account } = useAccount()
    const { chain } = useNetwork()
    const [ShowingReferral, setShowingReferral] = useState(false)
    const [, setRefreash] = useState(true)
    const [, copyToClipboard] = useCopyToClipboard()//clipBoardContent
    const [landing] = useLocalStorage<IComboLanding>("@ComboLanding", ComboLanding)
    const [EthAmount, setEthAmount] = useState<string | number>('0.00')
    const [BuyAmount, setBuyAmount] = useState<string | number>('0.00')
    const web3Modal = useWeb3Modal()

    const _HELPER_BOMBO_CONTACT = {
        address: _Addresses['COMBO_HELPER'],
        abi: _ABI,
    } as any

    const { data: reserved } = useBalance({
        address: _Addresses['COMBO_HELPER'],
        token: _Addresses['COMBO_TOKEN'],
        watch: true
    })

    const { data: EthBalance } = useBalance({
        address: account,
        watch: true
    })


    const AInfo = useContractReads({
        contracts: [
            { ..._HELPER_BOMBO_CONTACT, functionName: '_maxDownlines' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_uplinecommision' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_amountClaimable' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_freebieEndDate' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_freebieStartDate' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_mintkns' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_maxtkns' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_icoEndDate' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_icoStartDate' },
            { ..._HELPER_BOMBO_CONTACT, functionName: '_rate' },
            { ..._HELPER_BOMBO_CONTACT, functionName: 'getLeaderboardSize' },
            { ..._HELPER_BOMBO_CONTACT, functionName: 'getMyPosition' },
            { ..._HELPER_BOMBO_CONTACT, functionName: 'leadboard', args: [account], enabled: Boolean(account) },
            { ..._HELPER_BOMBO_CONTACT, address: _Addresses['COMBO_TOKEN'], functionName: '_insurer' }
        ],
        watch: isConnected,
        enabled: isConnected,
        cacheTime: 0
    })

    const { data: treasuryBalance } = useBalance({
        address: AInfo.data?.[13]?.result as any,
        watch: true,
        enabled: Boolean(AInfo.data?.[13]?.result)
    })

    const claimPrepHook = usePrepareContractWrite({
        ..._HELPER_BOMBO_CONTACT,
        functionName: 'claimCombodexAirdrop',
        args: [landing?.airdrop?.referee],
        enabled: OpenTab === 'Freebie' || isConnected,
        cacheTime: 0,
    })
    const claimHook = useContractWrite(claimPrepHook?.config)

    //
    const buyPrepHook = usePrepareContractWrite({
        ..._HELPER_BOMBO_CONTACT,
        functionName: 'buyComboFlex',
        value: toWei(EthAmount),
        enabled: OpenTab === 'Offering',
        cacheTime: 0
    })
    const buyHook = useContractWrite(buyPrepHook.config)


    const handleCliamTokens = () => {
        setRefreash(s => !s)
        if (claimPrepHook?.isIdle || claimPrepHook?.isFetching)
            return toast.warn("Wait... 🛑", { toastId: "WAITING" })
        if (claimPrepHook.error) {
            if (landing?.airdrop?.claimed)
                setShowingReferral(true)
            return toast.error(String(claimPrepHook?.error?.message?.split?.(':')?.[1]), { toastId: "ERROR_OCCURED" })
        }
        claimHook?.write?.()
    }

    const handleBuyTokens = () => {
        setRefreash(s => !s)
        if (buyPrepHook?.isIdle || buyPrepHook?.isFetching)
            return toast.warn("Wait... 🛑", { toastId: "WAITING" })
        if (buyPrepHook.error)
            return toast.error(String(buyPrepHook?.error?.message?.split?.(':')?.[1]), { toastId: "ERROR_OCCURED" })
        buyHook?.write?.()
    }

    const hanleAmountEthChange = (value: string | number) => {
        const __rate = Number(fmWei(AInfo?.data?.[9]?.result as any))
        const __output = __rate * Number(value)
        setEthAmount(value)
        setBuyAmount(__output)
        console.log(__output)
    }

    const handleAmountTokensChange = (value: string | number) => {
        const __rate = Number(fmWei(AInfo?.data?.[9]?.result as any))
        const __input = Number(value) / __rate
        setEthAmount(__input)
        setBuyAmount(value)
        console.log(__input)
    }

    useEffect(() => {
        // const TOAST_ID = "SESSION"
    }, [])

    console.log(landing?.airdrop?.referee)
    
    const refLink = (copy?: boolean) => {
        const ref = window.location.origin.concat(`?mst=${account}`)
        if (!copy) {
            (async () => {
                const copied = await copyToClipboard(ref)
                if (copied) return toast.success("Ref link copied to clipboard...", { toastId: "ELL" })
            })();
        }
        return ref
    }

    const NotConnectedButton = (
        <div className="not-connected-button-container">
            <p className="hero-area-intro-description">
                PS: Connect Your Wallet
            </p>
            <Button
                variant="contained"
                disableElevation
                color="warning"
                onClick={web3Modal?.open}>
                {web3Modal?.isOpen ? "Connecting..." : "Connect"}
            </Button>
        </div>
    )

    const AirdropPanel = (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            className="panel-waitlist">

            <div className="wait-clock-container">
                <div className="clock-wait">
                    {
                        Date.now() < Number(AInfo?.data?.[4]?.result) * 1000 ? "Starts ".concat(dayjs(Number(AInfo?.data?.[4]?.result) * 1000).fromNow()) :
                            Date.now() < Number(AInfo?.data?.[3]?.result) * 1000 ? "Ends ".concat(dayjs(Number(AInfo?.data?.[3]?.result) * 1000).fromNow())
                                : "🎁 CHECK BACK SOON 🎁"
                    }
                </div>
            </div>


            {!ShowingReferral ? <>
                <div className="panel-dash">
                    <div className="panel-dash-tab">
                        <h2 className="h2-headline">
                            {`${precise(AInfo?.data?.[12]?.result?.[1] as any ?? 0, 2)}`}
                        </h2>
                        <p className="panel-dash-value">
                            REWARDS
                        </p>
                    </div>
                    <div className="panel-dash-tab">
                        <h2 className="h2-headline">
                            {`${precise(reserved?.formatted ?? 0, 2)}`}
                        </h2>
                        <p className="panel-dash-value">
                            RESERVE
                        </p>
                    </div>
                    <div className="panel-dash-tab">
                        <h2 className="h2-headline">
                            {`${AInfo?.data?.[12]?.result?.[2] as any ?? 0}`}
                        </h2>
                        <p className="panel-dash-value">
                            DOWNLINES
                        </p>
                    </div>
                    <div className="panel-dash-tab">
                        <h2 className="h2-headline">
                            {Number(AInfo?.data?.[11]?.result as any ?? 0)} of {Number(AInfo?.data?.[10]?.result as any ?? 0)}
                        </h2>
                        <p className="panel-dash-value">
                            LEAD~BOARD
                        </p>
                    </div>
                </div>
                <div className="space-between">
                    <motion.div
                        style={{ width: '100%' }}
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        exit={{ x: 100 }}>
                        <Button
                            style={{ fontSize: 12, width: '100%' }}
                            disableElevation
                            disabled={claimHook?.isLoading}
                            onClick={handleCliamTokens}
                            variant="contained"
                        >
                            Claim {fmWei(Number(AInfo?.data?.[2].result ?? 0))} COF
                            &nbsp;{!claimHook?.isLoading || <CircularProgress size={15} color="info" />}
                        </Button>
                    </motion.div>

                    <Button
                        style={{ fontSize: 10 }}
                        disableElevation
                        onClick={() => setShowingReferral(true)} className="box-navigation-btn"
                        color="warning" >
                        EARN-$200
                    </Button>
                </div>
            </> : (
                <motion.div
                    className="share-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} >
                    <small style={{ fontSize: 12 }}>
                        You can earn even more rewards up to $200 by telling your friends about Combodex! When they join, you both get rewarded! 🎉
                        It's like having your own secret club where everyone wins! 🤝❤️🎁🚀💫🪴🪴🪴
                    </small>
                    <br />
                    <div className="space-between" style={{ width: '100%' }}>
                        <div className="space-between" style={{ cursor: 'pointer' }}>
                            <ArrowBack onClick={() => setShowingReferral(false)} />&bull;&bull;&bull;&bull;&bull;
                        </div>
                        <Button
                            disableElevation
                            variant="contained"
                            color="success"
                            style={{ fontSize: 12 }}
                            onClick={() => refLink(false)} >
                            {cut(account, 'left')}  Copy Link
                        </Button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )

    const OfferingPanel = (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            className="panel-waitlist">
            <div className="wait-clock-container">
                <div className="clock-wait">
                    {
                        Date.now() < Number(AInfo?.data?.[8]?.result) * 1000 ? "Starts ".concat(dayjs(Number(AInfo?.data?.[8]?.result) * 1000).fromNow()) :
                            Date.now() < Number(AInfo?.data?.[7]?.result) * 1000 ? "Ends ".concat(dayjs(Number(AInfo?.data?.[7]?.result) * 1000).fromNow())
                                : "🎁 CHECK BACK SOON 🎁"
                    }
                </div>
            </div>
            <div className="space-between inpur column wrap left">
                <div className="space-between">
                    <div className="input-control">
                        <Button
                            color="warning">
                            {chain?.nativeCurrency?.symbol}
                        </Button>
                        <input className="input-reading styled-input"
                            type="number"
                            onChange={({ target: { value } }) => hanleAmountEthChange(Math.abs(value as any))}
                            onFocus={() => { }}
                            value={EthAmount}
                            step={Number(fmWei(AInfo?.data?.[5]?.result as any)) / Number(fmWei(AInfo?.data?.[9]?.result as any))}
                            placeholder='Amount to spend' />
                    </div>
                    <SwapHoriz className="swap-icon" />
                    <div className="input-control">
                        <Button
                            color="warning">
                            COF
                        </Button>
                        <input className="input-reading styled-input"
                            type="number"
                            onChange={({ target: { value } }) => handleAmountTokensChange(Math.abs(value as any))}
                            onFocus={() => { }}
                            value={BuyAmount}
                            step={Number(fmWei(AInfo?.data?.[5]?.result as any))}
                            placeholder='Amount to spend' />
                    </div>
                </div>
                <div className="swap-control space-between left" style={{ width: '100%' }}>
                    <span style={{ fontSize: 10, textTransform: 'uppercase' }}>Stage one &bull; 1{chain?.nativeCurrency?.symbol} = {fmWei(AInfo?.data?.[9]?.result as any)}</span>
                    <span></span>
                </div>
            </div>
            <br />
            <div className="space-between">
                <motion.div
                    style={{ width: '100%' }}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    exit={{ x: 100 }}>
                    <Button
                        style={{ fontSize: 12, width: '100%' }}
                        disableElevation
                        disabled={claimHook?.isLoading}
                        onClick={handleBuyTokens}
                        variant="contained"
                    >
                        Buy {BuyAmount} COF
                        &nbsp;{!claimHook?.isLoading || <CircularProgress size={15} color="info" />}
                    </Button>
                </motion.div>

                <Button
                    style={{ fontSize: 12, gap: 0 }}
                    disableElevation
                    onClick={() => setShowingReferral(true)} className="box-navigation-btn space-between"
                    color="warning" >
                    Stage<ChevronRight />
                </Button>
            </div>
        </motion.div>
    )

    const ProgressPanel = (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.3 }}
            className="panel-waitlist">
            <div className="wait-clock-container">
                <div className="clock-wait">
                    🪴🚀 COMBO TREASURY 💫
                </div>
            </div>

            <div className="panel-dash">
                <div className="panel-dash-tab">
                    <h2 className="h2-headline">
                        {precise(treasuryBalance?.formatted, 4)}
                    </h2>
                    <p className="panel-dash-value">
                        TREASURY
                    </p>
                </div>
                <div className="panel-dash-tab">
                    <h2 className="h2-headline">
                        {precise(treasuryBalance?.formatted as any / 3, 4)}
                    </h2>
                    <p className="panel-dash-value">
                        INSURANCE
                    </p>
                </div>
                <div className="panel-dash-tab">
                    <h2 className="h2-headline">
                        {`${precise(reserved?.formatted ?? 0, 2)}`}
                    </h2>
                    <p className="panel-dash-value">
                        RESERVE TO BURN
                    </p>
                </div>
                <div className="panel-dash-tab">
                    <h2 className="h2-headline">
                        {precise((AInfo?.data?.[12]?.result as any)?.[7], 4)}
                    </h2>
                    <p className="panel-dash-value">
                        YOUR CONTRIBUTION
                    </p>
                </div>
            </div>
        </motion.div>
    )


    return (
        <div className="offering-panel">
            <Box className="box-navigation">
                <div className="space-between" style={{ width: '100%', }}>
                    <div className="space-between">
                        <Button variant='contained' disabled={OpenTab === 'Freebie'} onClick={() => setOpenTab('Freebie')} className="box-navigation-btn" >
                            Airdrop
                        </Button>
                        <Button disabled={OpenTab === 'Offering'} onClick={() => setOpenTab('Offering')} className="box-navigation-btn" >
                            ICO
                        </Button>
                        {/* <Button disabled={OpenTab === 'join'} onClick={() => setparams('openTab', "join")} className="box-navigation-btn"  >
                                Join
                            </Button> */}
                        <Button disabled={OpenTab === 'Progress'} onClick={() => setOpenTab('Progress')} className="box-navigation-btn"  >
                            COMBO DAO
                        </Button>
                    </div>

                    {
                        !isConnected ||
                        <Button
                            onClick={() => web3Modal?.open()}
                            color="error"
                            variant='contained'
                            style={{ minWidth: 25, maxWidth: 25, width: 25, borderRadius: 50, aspectRatio: '1/1' }}>
                            {!web3Modal?.isOpen ? <Logout style={{ fontSize: 18 }} /> : <Circle style={{ fontSize: 18 }} />}
                        </Button>

                    }
                </div>
            </Box>

            {
                !account ||
                <div className="space-between left">
                    <Button>
                        {cut(account)}&nbsp;&bull;&nbsp;
                        {`${chain?.nativeCurrency?.symbol}${EthBalance?.formatted}`}
                    </Button>
                </div>
            }

            {
                !isConnected ? NotConnectedButton :
                    <div className="box-swap">
                        {OpenTab === 'Freebie' && AirdropPanel}
                        {OpenTab === 'Offering' && OfferingPanel}
                        {OpenTab === 'Progress' && ProgressPanel}
                    </div>
            }
        </div>
    )
}