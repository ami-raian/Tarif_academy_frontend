import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type BaseFieldProps = {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  id?: string;
};

type InputFieldProps = BaseFieldProps & {
  type: "input";
  inputType?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  min?: string | number;
  max?: string | number;
  inputClassName?: string;
};

type TextareaFieldProps = BaseFieldProps & {
  type: "textarea";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
};

type SelectFieldProps = BaseFieldProps & {
  type: "select";
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  options: Array<{ value: string; label: string }>;
  triggerClassName?: string;
};

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export const FormField = (props: FormFieldProps) => {
  const { label, error, required, className = "", id } = props;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      {props.type === "input" && (
        <div className="relative">
          {props.icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {props.icon}
            </div>
          )}
          <Input
            id={id}
            type={props.inputType || "text"}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            disabled={props.disabled}
            min={props.min}
            max={props.max}
            className={cn(props.icon ? "pl-10" : "", props.inputClassName)}
          />
        </div>
      )}

      {props.type === "textarea" && (
        <Textarea
          id={id}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
          rows={props.rows || 4}
        />
      )}

      {props.type === "select" && (
        <Select
          value={props.value || undefined}
          onValueChange={props.onValueChange}
          disabled={props.disabled}
        >
          <SelectTrigger className={props.triggerClassName}>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {props.options.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                কোনো অপশন নেই
              </SelectItem>
            ) : (
              props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
