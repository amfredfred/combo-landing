
import { motion } from 'framer-motion'
import ComboLogo from '../../../../assets/img/logo-transparent.png'
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
                    Use App
                </Button>
            </div>
        </div>
    )
}