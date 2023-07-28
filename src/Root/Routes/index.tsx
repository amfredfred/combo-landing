import { HashRouter, Routes, Route  } from 'react-router-dom'
import GuestLayout from '../../Views/Layouts/Guest/inex'
import useAssets from '../../Hooks/useAssets'
import Welcome from '../../Views/Pages/Welcome'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { useLocalStorage } from 'usehooks-ts'
import { IComboLanding, ComboLanding } from "../../Interfaces";
import { useEffect } from 'react'
import { isAddress } from '../../Helpers/inex'


export const Guest = () => {
    const [, setLanding] = useLocalStorage<IComboLanding>("@ComboLanding", ComboLanding)

    useEffect(() => {
        let params = new URL(window.document.location as any).searchParams;
        let referee = params.get("mst");
        if (referee)
            if (isAddress(referee as any))
                setLanding(s => ({ ...s, airdrop: { ...s?.airdrop, referee: referee as any } }))
    }, [])

    return <GuestLayout>
        <Routes>
            <Route path='' element={<Welcome />} />
        </Routes>
    </GuestLayout>
}


export default function Routings() {
    useAssets()




    return (
        <HashRouter>
            <Guest />
            <ToastContainer
                theme="dark"
                position='bottom-right'
            />
        </HashRouter>
    )
}