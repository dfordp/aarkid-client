import { Input } from "@/components/ui/input"

type InputDisabledProps = {
  value: string | null;
  className: string;
};

export const InputDisabled: React.FC<InputDisabledProps> = ({ value, className }) => {
  return <Input disabled type="email" placeholder="Email" value={value || ''} className={className} />
}