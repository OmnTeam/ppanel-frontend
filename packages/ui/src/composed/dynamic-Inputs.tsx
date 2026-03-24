import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { Combobox } from "@workspace/ui/composed/combobox";
import {
  EnhancedInput,
  type EnhancedInputProps,
} from "@workspace/ui/composed/enhanced-input";
import { cn } from "@workspace/ui/lib/utils";
import { CircleMinusIcon, CirclePlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FieldConfig extends Omit<EnhancedInputProps<string | number>, "type"> {
  name: string;
  type: "text" | "number" | "select" | "time" | "boolean" | "textarea";
  options?: { label: string; value: string }[];
  // optional per-item visibility function: returns true to show the field for the given item
  visible?: (item: Record<string, any>) => boolean;
}

interface ObjectInputProps<T> {
  value: T;
  onChange: (value: T) => void;
  fields: FieldConfig[];
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ObjectInput<T extends Record<string, any>>({
  value,
  onChange,
  fields,
  className,
}: ObjectInputProps<T>) {
  const [internalState, setInternalState] = useState<T>(value);

  useEffect(() => {
    setInternalState(value);
  }, [value]);

  const updateField = (key: keyof T, fieldValue: string | number | boolean) => {
    const updatedInternalState = { ...internalState, [key]: fieldValue };
    setInternalState(updatedInternalState);
    onChange(updatedInternalState);
  };
  const renderField = (field: FieldConfig) => {
    // if visible callback exists and returns false for current item, don't render
    if (field.visible && !field.visible(internalState)) return null;
    switch (field.type) {
      case "select":
        return (
          field.options && (
            <Combobox<string, false>
              onChange={(fieldValue) => updateField(field.name, fieldValue)}
              options={field.options}
              placeholder={field.placeholder}
              value={internalState[field.name]}
            />
          )
        );
      case "boolean":
        return (
          <div className="flex h-full items-center space-x-2">
            <Switch
              checked={internalState[field.name] as boolean}
              onCheckedChange={(fieldValue) =>
                updateField(field.name, fieldValue)
              }
            />
            {field.placeholder && <Label>{field.placeholder}</Label>}
          </div>
        );
      case "textarea":
        return (
          <div className="w-full space-y-2">
            {field.prefix && (
              <Label className="font-medium text-sm">{field.prefix}</Label>
            )}
            <Textarea
              className="min-h-32"
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={field.placeholder}
              value={internalState[field.name] || ""}
            />
          </div>
        );
      default:
        return (
          <EnhancedInput
            onValueChange={(fieldValue) => updateField(field.name, fieldValue)}
            value={internalState[field.name]}
            {...field}
          />
        );
    }
  };
  return (
    <div className={cn("flex flex-1 flex-wrap gap-4", className)}>
      {fields.map((field) => {
        const node = renderField(field);
        if (node === null) return null; // don't render wrapper if field hidden
        return (
          <div className={cn("flex-1", field.className)} key={field.name}>
            {node}
          </div>
        );
      })}
    </div>
  );
}
interface ArrayInputProps<T> {
  value?: T[];
  onChange: (value: T[]) => void;
  fields: FieldConfig[];
  isReverse?: boolean;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ArrayInput<T extends Record<string, any>>({
  value = [],
  onChange,
  fields,
  isReverse = false,
  className,
}: ArrayInputProps<T>) {
  const initializeDefaultItem = (): T =>
    fields.reduce((acc, field) => {
      acc[field.name as keyof T] = undefined as T[keyof T];
      return acc;
    }, {} as T);

  const [displayItems, setDisplayItems] = useState<T[]>(() =>
    value.length > 0 ? value : [initializeDefaultItem()]
  );

  const isItemModified = (item: T): boolean =>
    fields.some((field) => {
      const val = item[field.name];
      return val !== undefined && val !== null && val !== "";
    });

  const handleItemChange = (index: number, updatedItem: T) => {
    const newDisplayItems = [...displayItems];
    newDisplayItems[index] = updatedItem;
    setDisplayItems(newDisplayItems);

    const modifiedItems = newDisplayItems.filter(isItemModified);
    onChange(modifiedItems);
  };

  const createField = () => {
    if (isReverse) {
      setDisplayItems([initializeDefaultItem(), ...displayItems]);
    } else {
      setDisplayItems([...displayItems, initializeDefaultItem()]);
    }
  };

  const deleteField = (index: number) => {
    const newDisplayItems = displayItems.filter((_, i) => i !== index);
    setDisplayItems(newDisplayItems);

    const modifiedItems = newDisplayItems.filter(isItemModified);
    onChange(modifiedItems);
  };

  useEffect(() => {
    if (value.length > 0) {
      setDisplayItems(value);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-4">
      {displayItems.map((item, index) => (
        <div className="flex items-center gap-4" key={index}>
          <ObjectInput
            className={className}
            fields={fields}
            onChange={(updatedItem) => handleItemChange(index, updatedItem)}
            value={item}
          />
          <div className="flex min-w-20 items-center">
            {displayItems.length > 1 && (
              <Button
                className="p-0 text-destructive text-lg"
                onClick={() => deleteField(index)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <CircleMinusIcon />
              </Button>
            )}
            {(isReverse ? index === 0 : index === displayItems.length - 1) && (
              <Button
                className="p-0 text-lg text-primary"
                onClick={createField}
                size="icon"
                type="button"
                variant="ghost"
              >
                <CirclePlusIcon />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
