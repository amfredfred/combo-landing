import {
    Button
} from '@mui/material'
import ArbitrgeScreen from '../../../assets/img/arbitrage-ui.jpg'
import { motion } from "framer-motion"
import {
    SwapVert, Token, Wallet
} from '@mui/icons-material'
import OfferingPanel from '../../Partials/Offering'

export default function Welcome() {


    return (
        <>
            <div className="page-section hero-area">
                <div className="section-split">
                    <div className="hero-inro-area">
                        <h1 className='hero-area-intro-headline'>
                            Combo DEx
                        </h1>
                        <p className="hero-area-intro-description">
                            Combination of multiple Decentralized Exchanges into a unified protocol,
                            <br />
                            Combodex is a decentralized finance (DeFi) platform that leverages automation and blockchain technology to enable users to generate passive income.
                        </p>
                        <div className="space-between left">
                            <Button variant='contained' color="warning" disableElevation className='primary-button'  >
                                <a target="_blank" href="http://app.combodex.cc">
                                    Use App
                                </a>
                            </Button>
                            <Button variant='contained' color="error" disableElevation className='primary-button'  >
                                <a target="_blank" href="http://combodex.gitbook.io/home">
                                    REad DOC
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="section-split">
                    {/* <div className="hero-logo-container">
                        <motion.img
                            initial={{ opacity: 0, x: -1000 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileInView={{
                                rotateY: ['30deg', "60deg", "360deg", "50deg", "0deg"],
                                y: [-30, -10, -5, 0]
                            }}
                            src={ComboDexLogo}
                            loading="lazy"
                            alt=""
                            className="one-go-logo hero-area" />
                    </div> */}
                    <OfferingPanel />
                </div>
            </div>

            <div className="page-section sectioning">
                <div className="section-split">
                    <div className="hero-inro-area">
                        <h2 className='h2-headline'>
                            What is Combodex? 🤔
                        </h2>
                        <p className="hero-area-intro-description">
                            Combodex represents a cutting-edge decentralized finance (DeFi) platform revolutionizing the financial landscape by harnessing the power of automation and blockchain technology.
                            By seamlessly integrating these innovative elements, the platform empowers users to capitalize on passive income opportunities like never before.
                            As a result, Combodex offers an inclusive and accessible platform that not only enhances the potential for financial growth but also fosters a more decentralized and equitable financial ecosystem for all participants.
                        </p>
                        <div className="flexed-col">
                            <div className="flexed-card">
                                <div className="space-between">
                                    <div className="icons-wrap space-between">
                                        <SwapVert style={{ fontSize: 40 }} />
                                        <h3 className="h3-headline">Arbitrage Trading</h3>
                                    </div>
                                </div>
                                <motion.div
                                    whileInView={{ scale: [0, 1] }}
                                    initial={{ scale: 0 }} className='flexed-text-wrap'>
                                    <p className="hero-area-intro-description">
                                        Combodex offers an arbitrage trading interface for exploiting price differences in decentralized markets.
                                        Users can efficiently buy assets at lower prices on one exchange and sell at higher prices on another,
                                        maximizing returns through automated and secure transactions on the blockchain.
                                    </p>
                                </motion.div>
                            </div>
                            <div className="flexed-card">
                                <div className="space-between">
                                    <div className="icons-wrap space-between">
                                        <Token style={{ fontSize: 40 }} />
                                        <h3 className="h3-headline">Token Sniping</h3>
                                    </div>
                                </div>
                                <motion.div
                                    whileInView={{ scale: [0, 1] }}
                                    initial={{ scale: 0 }} className='flexed-text-wrap'>
                                    <p className="hero-area-intro-description">
                                        Combodex is designed to help users participate more effectively in token launches on decentralized exchanges (DEXs).
                                        Token sniping is a strategy where users aim to purchase newly launched tokens as soon as they become available,
                                        often at their initial offering prices.
                                    </p>
                                </motion.div>
                            </div>
                            <div className="flexed-card">
                                <div className="space-between">
                                    <div className="icons-wrap space-between">
                                        <Wallet style={{ fontSize: 40 }} />
                                        <h3 className="h3-headline">Shared Wallet</h3>
                                    </div>
                                </div>
                                <motion.div
                                    whileInView={{ scale: [0, 1] }}
                                    initial={{ scale: 0 }}
                                    className='flexed-text-wrap'>
                                    <p className="hero-area-intro-description">
                                        Combo DEx's Shared Wallet feature enables users to combine their funds for joint investments, fostering financial cooperation.
                                        By pooling resources, users can explore new opportunities for earning passive income through collective investments.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                        <img
                            src={ArbitrgeScreen}
                            loading='lazy'
                            alt=""
                            className='photo-image' />
                    </div>
                </div>
            </div>
        </>
    )
}