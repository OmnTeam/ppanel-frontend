import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";

export interface EnhancedInputProps<T = string>
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "prefix" | "value" | "onChange"
  > {
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
  value?: T;
  formatInput?: (value: T) => string | number;
  formatOutput?: (value: string | number) => T;
  onValueChange?: (value: T) => void;
  onValueBlur?: (value: T) => void;
  min?: number;
  max?: number;
}

export function EnhancedInput<T = string>({
  suffix,
  prefix,
  formatInput,
  formatOutput,
  value: initialValue,
  className,
  onValueChange,
  onValueBlur,
  ...props
}: EnhancedInputProps<T>) {
  const getProcessedValue = (inputValue: unknown) => {
    if (inputValue === "" || inputValue === undefined || inputValue === null) return "";
    const newValue = String(inputValue ?? "");
    return formatInput ? formatInput(inputValue as T) : newValue;
  };

  const [value, setValue] = useState<string | number>(() =>
    getProcessedValue(initialValue)
  );
  const [internalValue, setInternalValue] = useState<T | string | number>(
    initialValue ?? ""
  );

  useEffect(() => {
    if (initialValue !== internalValue) {
      const newValue = getProcessedValue(initialValue);
      if (value !== newValue) {
        setValue(newValue);
        setInternalValue(initialValue ?? "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, formatInput]);

  const processValue = (inputValue: string | number): T => {
    let processedValue: number | string = inputValue?.toString().trim();

    if (processedValue === "0" && props.type === "number") {
      return (formatOutput ? formatOutput(0) : 0) as T;
    }

    if (processedValue && props.type === "number")
      processedValue = Number(processedValue);
    return formatOutput ? formatOutput(processedValue) : (processedValue as T);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (props.type === "number") {
      if (inputValue === "0") {
        setValue("0");
        setInternalValue(0);
        onValueChange?.(processValue(0));
        return;
      }

      if (
        /^-?\d*\.?\d*$/.test(inputValue) ||
        inputValue === "-" ||
        inputValue === "."
      ) {
        const numericValue = Number(inputValue);
        if (
          !Number.isNaN(numericValue) &&
          inputValue !== "-" &&
          inputValue !== "."
        ) {
          const min = Number.isFinite(props.min)
            ? props.min
            : Number.NEGATIVE_INFINITY;
          const max = Number.isFinite(props.max)
            ? props.max
            : Number.POSITIVE_INFINITY;
          const constrainedValue = Math.max(min!, Math.min(max!, numericValue));
          inputValue = String(constrainedValue);
          setInternalValue(constrainedValue);
        } else {
          setInternalValue(inputValue);
        }
        setValue(inputValue);
      }
    } else {
      setValue(inputValue);
      setInternalValue(inputValue);
    }

    const outputValue = processValue(inputValue);
    onValueChange?.(outputValue);
  };

  const handleBlur = () => {
    if (props.type === "number" && value) {
      if (value === "-" || value === ".") {
        setValue("");
        setInternalValue("");
        onValueBlur?.("" as T);
        return;
      }

    }

    const outputValue = processValue(value);
    if ((initialValue || "") !== outputValue) {
      onValueBlur?.(outputValue);
    }
  };

  const renderPrefix = () =>
    typeof prefix === "string" ? (
      <div className="relative mr-px flex h-9 items-center text-nowrap bg-muted px-3">
        {prefix}
      </div>
    ) : (
      prefix
    );

  const renderSuffix = () =>
    typeof suffix === "string" ? (
      <div className="relative ml-px flex h-9 items-center text-nowrap bg-muted px-3">
        {suffix}
      </div>
    ) : (
      suffix
    );

  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden rounded-md border border-input",
        className
      )}
      suppressHydrationWarning
    >
      {renderPrefix()}
      <Input
        autoComplete="off"
        step={0.01}
        {...props}
        className="block rounded-none border-none"
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
      {renderSuffix()}
    </div>
  );
}
