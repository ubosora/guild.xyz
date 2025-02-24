import useGuild from "components/[guild]/hooks/useGuild"
import useIsSuperAdmin from "hooks/useIsSuperAdmin"

import useUser from "./useUser"

const useGuildPermission = () => {
  const { id } = useUser()
  const guild = useGuild()
  const isSuperAdmin = useIsSuperAdmin()

  if (!Array.isArray(guild.admins) || typeof id !== "number")
    return { isAdmin: false, isOwner: false }

  const admin = guild.admins.find((a) => a?.id === id)

  return {
    isAdmin: !!admin || isSuperAdmin,
    isOwner: !!admin?.isOwner,
  }
}

export default useGuildPermission
