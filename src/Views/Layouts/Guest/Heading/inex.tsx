
import { motion } from 'framer-motion'
import ComboLogo from '../../../../assets/img/combodex-logo.png'
import { Button } from '@mui/material'

export default function Heading() {


    return (
        <div className="heading-main">
            <div className="space-between" style={{width:'100%'}}>
                <h2 className="h2-headline">
                    <motion.img
                        className='site-logo'
                        src={ComboLogo}
                    />
                </h2>
                <Button   variant='contained' >
                    <a target="_blank" href="http://app.combodex.cc">
                        Use App
                    </a>
                </Button>
            </div>
        </div>
    )
}