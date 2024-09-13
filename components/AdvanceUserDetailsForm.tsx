"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Progress } from "@/components/ui/progress";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import { postCompleteVerification } from '@/lib/api';
import { LoadingSpinner } from '@/components/LoadingSpinner'
import CountrySelect from '@/components/CountrySelect';
import { StepperType } from '../types/StepperType'; 

export function AdvanceUserDetailsForm({ stepper }: { stepper: StepperType }) {

  const [date, setDate] = React.useState<Date | undefined>();
  const [nationality, setNationality] = React.useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState<boolean>(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCloseError = () => setIsErrorVisible(false);
  const handleSuccessError = () => setIsSuccessVisible(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const uaeMobileNumberRegex = /^(?:\+9715\d{8}|\d{10})$/;

  const formSchema = z.object({
    nationality: z.string()
      .min(1, { message: "Nationality is required." }), 
    mobileNumber: z.string()
      .min(1, { message: "Mobile number is required." })
      .regex(uaeMobileNumberRegex, { message: "Invalid UAE mobile number format. Use +9715XXXXXXX or 05XXXXXXXX." }),
    address: z.string().min(1, { message: "Address is required." }),
    company: z.string().min(1, { message: "Company name is required." }),
    joinDate: z.string().min(1, { message: "Join date is required." })
      .refine(value => !isNaN(Date.parse(value)), { message: "Join date must be a valid date." }),
    employmentType: z.string().min(1, { message: "Employment type is required." }),
    annualIncome: z.string()
      .min(1, { message: "Annual income is required." })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Annual income must be a valid number with up to two decimal places." }),
      requestedCreditLimit: z.string()
      .min(1, { message: "Requested credit limit is required." })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "Requested credit limit must be a valid number with up to two decimal places." }),
  });

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationality: "",
      mobileNumber: "",
      address: "",
      company: "",
      joinDate: "",
      employmentType: "",
      annualIncome: "",
      requestedCreditLimit: "",
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = methods;
 
  type FormValues = z.infer<typeof formSchema>;
 
  const handleNext = () => {
     if (Object.keys(errors).length === 0) {
      stepper.next();
    }
  };

  interface ErrorMessage {
    type: string;    
  }
  
  const handleShowError = (message: string) => {
    
    setErrorMessage(message);
    setIsErrorVisible(true);
  };
  
  const handleShowSucess = (message: string) => { 
    setSuccessMessage(message);
    setIsSuccessVisible(true);
  };
   

  async function postCompleteVerificationRequest(
    data: { 
    nationality: string;
    mobile: string;
    address: string;
    company: string;
    joinDate: string;
    employmentType: string;
    annualIncome: number;
    requestedCreditLimit: number}) {
    setLoading(true);
  
    const storedRequestId = localStorage.getItem('requestId') || "";
   await postCompleteVerification(storedRequestId,data)
      .then((response) =>{ 
        if(response.outcome==='REJECTED'){
          handleShowSucess('Unfortunately Your Request is Rejected, Due to verification failure!');
        }else if(response.outcome==='STP'){
          handleShowSucess('Congratulations. Your Credit Card Request Has Been Approved, You will be contacted by Delivery Service soon!');
        }else if(response.outcome==='NEAR_STP'){
          handleShowSucess('Congratulations. Your Credit Card Request Has Been Approved,though we have updated credit limit for you');
        }else if(response.outcome==='MANUAL_REVIEW'){
          handleShowSucess('Hello, Your Request is received, after review our team will be in touch with you.');
        }
       
      })
      .catch(error => {
        const e = error as Error;
        if(e.message.includes('CC-0003')){
          handleShowError('Your Request has been processed Already, Thank You!.');
        }
        else{
          handleShowError('Error fetching identity verification.');
          console.error('Error fetching identity verification:', error);
        }
      })
      .finally(() => {
        setLoading(false);  
      });
  }

 
  const onSubmit = (data: any) => {
    
    postCompleteVerificationRequest(data).then(res =>{
            
    });
  }

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setValue("nationality", value, { shouldValidate: true });
  };

  React.useEffect(() => {
     if (date) {
      setValue("joinDate", format(date, "yyyy-MM-dd"));
    }
  }, [date, setValue]);

  React.useEffect(() => {
    handleShowSucess('Congratulations! Your Identify is verified successfully, lets move onto next step');
  }, []);

  return (
    <FormProvider {...methods}>
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <Progress value={50} />
      <SuccessAlert
          isVisible={isSuccessVisible}
          message={successMessage}
          onClose={handleSuccessError}
          duration={5000}
        />
        <ErrorAlert
          isVisible={isErrorVisible}
          message={errorMessage}
          onClose={handleCloseError}
          duration={5000}
        />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Personal Information</h2>

          <FormItem>
            <FormLabel>Nationality</FormLabel>
              <CountrySelect  
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              /> 
            {errors.nationality && <FormMessage>{errors.nationality.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <Input placeholder="e.g : +971-12345678" {...register('mobileNumber')} />
            {errors.mobileNumber && <FormMessage>{errors.mobileNumber.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Address</FormLabel>
            <Input placeholder="e.g : Al Amal Street, Business Bay" {...register('address')} />
            {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
          </FormItem>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Employment History</h2>

          <FormItem>
            <FormLabel>Company</FormLabel>
            <Input placeholder="e.g : Microsoft" {...register('company')} />
            {errors.company && <FormMessage>{errors.company.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Join Date</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            {errors.joinDate && <FormMessage>{errors.joinDate.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Employment Type</FormLabel>
            <Select {...register("employmentType", { required: true })}
            onValueChange={(value) => setValue("employmentType", value, { shouldValidate: true })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Employment type"  />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem> 
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.employmentType && <FormMessage>{errors.employmentType.message}</FormMessage>}
          </FormItem>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Credit Information</h2>

          <FormItem>
            <FormLabel>Annual Income</FormLabel>
            <Input placeholder="e.g : 50000.50" {...register('annualIncome')} />
            {errors.annualIncome && <FormMessage>{errors.annualIncome.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Requested Credit Limit</FormLabel>
            <Input placeholder="e.g : 2000.50" {...register('requestedCreditLimit')} />
            {errors.requestedCreditLimit && <FormMessage>{errors.requestedCreditLimit.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Bank Statement</FormLabel>
            <Input id="bankStatement" type="file" />
            <FormDescription>Last 6 months bank statement</FormDescription>
          </FormItem>
          
          {!stepper.isLast ? (
            <div className="flex items-center gap-2">
              <Button onClick={stepper.prev} disabled={stepper.isFirst}>
                Previous
              </Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (
              <LoadingSpinner size={24} className="text-white" />
            ) : (
              'Apply'
            )}</Button> 
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button onClick={stepper.reset}>Reset</Button>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

export default AdvanceUserDetailsForm;
