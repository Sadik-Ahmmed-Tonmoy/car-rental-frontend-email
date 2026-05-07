
'use client'
import { cn } from "@/lib/utils";
import { Form, Switch } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const MyFormSwitch = ({
  name,
  label,
  labelClassName,
  switchClassName,
  defaultChecked = false,
  onValueChange,
}: {
  name: string;
  label?: string;
  labelClassName?: string;
  switchClassName?: string;
  defaultChecked?: boolean;
  onValueChange?: (newValue: boolean) => void;
}) => {
  const { setValue, control } = useFormContext();

  // Watch the switch field's value
  const switchValue = useWatch({
    control,
    name,
  });

  useEffect(() => {
    setValue(name, defaultChecked, { shouldValidate: false });
  }, [defaultChecked, name, setValue]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(switchValue);
    }
  }, [switchValue, onValueChange]);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ required: false }}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            {label && (
              <p className={cn("text-[#101828] text-base font-normal leading-6", labelClassName)}>
                {label}
              </p>
            )}
            <Form.Item style={{ marginBottom: "0px" }}>
              <Switch
                {...field}
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
                className={cn(switchClassName)}
              />
            </Form.Item>
          </div>
        )}
      />
    </div>
  );
};

export default MyFormSwitch;
