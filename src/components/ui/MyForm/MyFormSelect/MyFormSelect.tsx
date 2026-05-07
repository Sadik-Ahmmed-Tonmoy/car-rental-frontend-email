/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Form, Select } from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { SelectProps } from "antd";
import "./MyFormSelect.css";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface MyFormSelectProps {
  label?: string;
  labelClassName?: string;
  name: string;
  options?: SelectProps["options"];
  disabled?: boolean;
  mode?: "multiple" | "tags"; 
  placeHolder: string;
  className?: string;
  isSearch?: boolean;
  defaultValue?: string;
  getSelectedValue?: (newValue: any) => void;
  isLoading?: boolean;
}

const MyFormSelect = ({
  label,
  labelClassName,
  name,
  options,
  disabled,
  mode,
  placeHolder,
  className,
  isSearch = false,
  defaultValue,
  getSelectedValue,
  isLoading = false,
}: MyFormSelectProps) => {
  const { setValue, control } = useFormContext();
  const inputValue = useWatch({
    control,
    name,
  });
  useEffect(() => {
    if (getSelectedValue) {
      getSelectedValue(inputValue);
    }
  }, [inputValue, getSelectedValue]);

  useEffect(() => {
    setValue(name, defaultValue, { shouldValidate: false });
  }, [defaultValue, name, setValue]);
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col justify-center gap-1">
          {/* Label */}
          {label && (
            <p
              className={cn(
                "ps-1 mb-1 text-[#101828] text-base font-normal leading-6",
                labelClassName
              )}
            >
              {label}
            </p>
          )}

          {/* Ant Design Select */}
          <Form.Item style={{ marginBottom: "0px" }}>
            <Select
              mode={mode}
              style={{ width: "100%" }}
              className={cn(className, "placeholder:!text-text-secondary")}
              {...field}
              ref={null}
              value={field.value ?? defaultValue}
              onChange={(value) => field.onChange(value)}
              options={options}
              size="large"
              disabled={disabled}
              placeholder={placeHolder}
              showSearch={isSearch} // Enable search functionality based on isSearch prop
              loading={isLoading}
              filterOption={
                isSearch
                  ? (input, option) =>
                      (option?.label ?? "")
                        ?.toString()
                        ?.toLowerCase()
                        ?.includes(input?.toLowerCase())
                  : undefined
              }
              // filterSort={
              //   isSearch
              //     ? (optionA, optionB) =>
              //         (String(optionA?.label ?? "").toLowerCase()).localeCompare(
              //           String(optionB?.label ?? "").toLowerCase()
              //         )
              //     : undefined
              // }
            />

            {/* Error Message */}
            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        </div>
      )}
    />
  );
};

export default MyFormSelect;
