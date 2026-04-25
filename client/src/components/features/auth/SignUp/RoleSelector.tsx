import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Choose Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Roles</SelectLabel>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="User">User</SelectItem>
          <SelectItem value="Manager">Manager</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
