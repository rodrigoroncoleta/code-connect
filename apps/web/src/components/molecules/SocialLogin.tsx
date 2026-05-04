import { Divider } from '../atoms/Divider'
import { SocialButton } from '../atoms/SocialButton'

export function SocialLogin() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Divider label="ou entre com outras contas" />
      <div className="flex gap-6">
        <SocialButton src="/github.png" label="Github" />
        <SocialButton src="/gmail.png" label="Gmail" />
      </div>
    </div>
  )
}
