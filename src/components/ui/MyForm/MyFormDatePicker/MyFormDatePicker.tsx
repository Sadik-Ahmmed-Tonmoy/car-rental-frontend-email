/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { Form, DatePicker } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

const MyFormDatePicker = ({
  name,
  label,
  labelClassName,
  picker = "date", // Allows selection of "date", "month", "week", "year"
  inputClassName,
  value,
  onValueChange,
  disablePastDate = false, 
}: {
  name: string;
  label?: string;
  labelClassName?: string;
  picker?: "date" | "month" | "week" | "year";
  inputClassName?: string;
  value?: string | Date; // Can accept a string or Date object
  onValueChange?: (newValue: Dayjs | null) => void;
  disablePastDate?: boolean; // Disables the DatePicker component
}) => {
  const { setValue, control } = useFormContext();

  // Watch the DatePicker field's value
  const selectedDate = useWatch({
    control,
    name,
  });


  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };


  useEffect(() => {
    if (value) {
      setValue(name, dayjs(value), { shouldValidate: true });
    }
  }, [value, name, setValue]);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(selectedDate ? dayjs(selectedDate) : null);
    }
  }, [selectedDate, onValueChange]);

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{
          required: "This field is required",
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="flex flex-col justify-center w-full">
            {label && (
              <p
                className={cn(
                  "ps-1 mb-2 text-[#101828] text-base font-normal leading-6",
                  labelClassName
                )}
              >
                {label}
              </p>
            )}
            <Form.Item style={{ marginBottom: "4px" }}>
              <DatePicker
                {...field}
                picker={picker}
                id={name}
                size="large"
                className={cn("w-full", inputClassName)}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => {
                  field.onChange(date ? dayjs(date).toISOString() : null);
                  if (onValueChange) onValueChange(date ? dayjs(date) : null);
                }}
                // disabledDate={disablePastDate ? disabledDate : undefined}

                disabledDate={(current) =>
                  disablePastDate ? current && current < dayjs().startOf('day') : false
                }
              />
            </Form.Item>
            {error && <small style={{ color: "red " }}>{error.message}</small>}
          </div>
        )}
      />
    </div>
  );
};

export default MyFormDatePicker;
