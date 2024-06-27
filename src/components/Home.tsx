import { observer } from 'mobx-react-lite'
import BottomMenu from './BottomMenu'
import { useStore } from '../mobx/Store'
import { useEffect, useState } from 'react'
import { auth } from '../config/FirebaseConfig'
import { format } from 'date-fns';
import { pl } from 'date-fns/locale'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export default observer(function Home() {

  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(undefined)

  const { appStorage } = useStore()

  const [load, setLoad] = useState(true)

  useEffect(() => {
    if (auth!.currentUser!.photoURL !== null && auth!.currentUser!.photoURL !== undefined) setProfilePhoto(auth!.currentUser!.photoURL)
    appStorage.getDays().then(() => {
      setLoad(false)
    })

  }, [])

  return (
    <>
      <div className='flex flex-col items-center justify-start'>

        <img className='w-16 h-16 rounded-full mt-5' src={profilePhoto} alt="" />

        <div className='flex flex-col items-center justify-start mt-5'>
          {load ?
            <p>Wczytywanie</p> :
            <>
              <div className='flex flex-row items-center justify-around w-screen'>
                <div className='text-5xl' onClick={() => appStorage.prevDay()}><IoIosArrowBack /></div>

                <div className='text-center'>
                  <h2 className='text-md'>{format(new Date(appStorage.currentDay!.date.seconds * 1000), 'EEEE', { locale: pl })}</h2>
                  <h2 className='text-6xl'>{format(new Date(appStorage.currentDay!.date.seconds * 1000), 'dd')}</h2>
                  <h2 className='text-lg mt-1 mb-5'>{format(new Date(appStorage.currentDay!.date.seconds * 1000), 'MM.yyyy')}</h2>
                </div>

                <div className='text-5xl' onClick={() => appStorage.nextDay()}><IoIosArrowForward /></div>
              </div>

              {format(new Date(), 'dd.MM.yyy') == format(new Date(appStorage.currentDay!.date.seconds * 1000), 'dd.MM.yyy') ? <h2 className='text-xl'>Za co dziś jesteś wdzięczny?</h2> : <h2 className='text-xl'>Za co byłeś wdzięczny?</h2>}

              <div className='flex flex-col items-center justify-center text-lg mt-5'>
                {appStorage.currentDay?.reasons.map((reason, ki) => (
                  <p key={ki}>{reason}</p>
                ))}
              </div>
            </>
          }

        </div>
        {/* <div className='w-230 flex flex-row flex-nowrap'>
          {appStorage.days.map((val, index) => (
            <div key={index} className='bg-gray-700 flex flex-col items-center justify-center m-1 w-230 h-halfscreen'>
                {val.date}
                {val.reasons.map((reason, ki) => (
                  <p key={ki}>{reason}</p>
                ))}
            </div>
          ))}
        </div> */}

      </div>
      <BottomMenu />
    </>
  )
})
