"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import {Slot} from "@radix-ui/react-slot";
import {Controller, FormProvider, useFormContext} from "react-hook-form";

import {cn} from "@/lib/utils";

const Form = FormProvider;

const FormFieldContext = React.createContext({name: ""});

const FormField = ({name, control, render}) => {
  return (
    <FormFieldContext.Provider value={{name}}>
      <Controller name={name} control={control} render={render} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const {getFieldState, formState} = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const id = itemContext.id;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItemContext = React.createContext({});

const FormItem = React.forwardRef(function FormItem(props, ref) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{id}}>
      <div ref={ref} className={cn("space-y-2", props.className)} {...props} />
    </FormItemContext.Provider>
  );
});

const FormLabel = React.forwardRef(function FormLabel({className, ...props}, ref) {
  const {error, formItemId} = useFormField();
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(error ? "text-destructive" : "", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});

const FormControl = React.forwardRef(function FormControl({className, ...props}, ref) {
  const {formItemId, formDescriptionId, formMessageId} = useFormField();
  return (
    <Slot
      ref={ref}
      className={className}
      id={formItemId}
      aria-describedby={formDescriptionId}
      aria-invalid={!!formMessageId}
      {...props}
    />
  );
});

const FormDescription = React.forwardRef(function FormDescription({className, ...props}, ref) {
  const {formDescriptionId} = useFormField();
  return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
});

const FormMessage = React.forwardRef(function FormMessage({className, children, ...props}, ref) {
  const {formMessageId, error} = useFormField();
  const body = error ? String(error.message || "Invalid value") : children;
  if (!body) return null;
  return (
    <p ref={ref} id={formMessageId} className={cn("text-sm text-destructive", className)} {...props}>
      {body}
    </p>
  );
});

export {Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage};
