import { useDisclosure } from "@chakra-ui/react"
import { useSteps } from "chakra-ui-steps"
import DiscardAlert from "components/common/DiscardAlert"
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react"
import { CreatedPoapData, CreatePoapForm } from "types"

// Using CreatePoapForm & CreatedPoapData as a type, because we'll merge the form data and the API response when the POAP is created.

const CreatePoapContext = createContext<{
  nextStep: () => void
  activeStep: number
  setStep: (step: number) => void
  shouldCreatePoap: boolean
  setShouldCreatePoap: Dispatch<SetStateAction<boolean>>
  poapData: CreatePoapForm & CreatedPoapData
  setPoapData: Dispatch<SetStateAction<CreatePoapForm & CreatedPoapData>>
  onCloseHandler: () => void
  poapDropSupportedChains: number[]
  discordServerId: string
  isFormDirty: boolean
  setIsFormDirty: Dispatch<boolean>
}>({
  nextStep: () => {},
  activeStep: 0,
  setStep: () => {},
  shouldCreatePoap: false,
  setShouldCreatePoap: () => {},
  poapData: null,
  setPoapData: () => {},
  onCloseHandler: () => {},
  poapDropSupportedChains: [],
  discordServerId: null,
  isFormDirty: false,
  setIsFormDirty: () => {},
})

type Props = {
  onClose: () => void
  discordServerId: string
}

const CreatePoapProvider = ({
  onClose,
  discordServerId,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const poapDropSupportedChains = [1, 137, 56, 100, 5]
  const { nextStep, activeStep, setStep } = useSteps({ initialStep: 0 })
  const [shouldCreatePoap, setShouldCreatePoap] = useState(false)
  const [poapData, setPoapData] = useState(null)
  const [isFormDirty, setIsFormDirty] = useState(false)

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure()

  const closeWithTimeout = () => {
    onClose()
    setTimeout(() => {
      setShouldCreatePoap(false)
      setStep(0)
      setPoapData(null)
    }, 500)
  }

  const onCloseHandler = () => {
    if (activeStep === 0 && shouldCreatePoap && isFormDirty) {
      onAlertOpen()
      return
    }

    closeWithTimeout()
  }

  const onDiscard = () => {
    onAlertClose()
    closeWithTimeout()
  }

  return (
    <CreatePoapContext.Provider
      value={{
        nextStep,
        activeStep,
        setStep,
        shouldCreatePoap,
        setShouldCreatePoap,
        poapData,
        setPoapData,
        onCloseHandler,
        poapDropSupportedChains,
        discordServerId,
        isFormDirty,
        setIsFormDirty,
      }}
    >
      {children}

      <DiscardAlert
        {...{
          isOpen: isAlertOpen,
          onClose: onAlertClose,
          onDiscard,
        }}
      />
    </CreatePoapContext.Provider>
  )
}

const useCreatePoapContext = () => useContext(CreatePoapContext)

export { CreatePoapProvider, useCreatePoapContext }
