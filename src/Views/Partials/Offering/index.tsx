import { Box, Button } from "@mui/material";
import { useState } from "react";
// import { Web3Button, Web3NetworkSwitch, useWeb3Modal } from '@web3modal/react'
// import dayjs from 'dayjs'
// import { toast } from 'react-toastify'
// import { motion } from "framer-motion";
// import relativeTime from 'dayjs/plugin/relativeTime'

// dayjs.extend(relativeTime)

export default function OfferingPanel() {

    const [OpenTab, setOpenTab] = useState<"Offering" | "Freebie" | "Progress">('Freebie')
    // const { } = useWeb3Modal()

    return (
        <div className="offering-panel">
            <Box className="box-navigation">
                <div className="space-between" style={{ width: '100%', }}>
                    <div className="space-between">
                        <Button variant='contained' disabled={OpenTab === 'Freebie'} onClick={() => setOpenTab("Freebie")} className="box-navigation-btn" >
                            Airdrop
                        </Button>
                        <Button disabled={OpenTab === "Offering"} onClick={() => setOpenTab("Offering")} className="box-navigation-btn" >
                            ICO
                        </Button>
                        <Button disabled={OpenTab === 'Progress'} onClick={() => setOpenTab("Progress")} className="box-navigation-btn"  >
                            COMBO DAO
                        </Button>
                    </div>
                </div>


            </Box>
        </div>
    )
}