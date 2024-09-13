"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import React, { useEffect, useState } from 'react'
import ErrorAlert from './ErrorAlert'
import { LoadingSpinner } from '@/components/LoadingSpinner' 

import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, FormProvider } from "react-hook-form";
import { StepperType } from '../types/StepperType'; 

import { Input } from "@/components/ui/input";

import { postIdentityVerification } from '@/lib/api';

// Define the form schema using zod
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  emiratesId: z
    .string()
    .regex(/^\d{3}-\d{4}-\d{7}-\d{1}$/, {
      message: "Emirates ID must be in the format 784-1234-1234567-1",
    }),
});
 
type FormValues = z.infer<typeof formSchema>;

const UserDetailsForm = ({ stepper }: { stepper: StepperType }) => {  

  const [loading, setLoading] = useState(false);
  const [isErrorVisible, setIsErrorVisible] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
 
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      emiratesId: ""
    }
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = methods;

  useEffect(() => {
    const savedFullName = localStorage.getItem('fullName');
    const savedEmiratesId = localStorage.getItem('emiratesId');
    if (savedFullName) setValue('fullName', savedFullName);
    if (savedEmiratesId) setValue('emiratesId', savedEmiratesId);
  }, [setValue]);

  // Save form values to localStorage
  useEffect(() => {
    localStorage.setItem('fullName', getValues('fullName'));
    localStorage.setItem('emiratesId', getValues('emiratesId'));
  }, [getValues]);

  const handleNext = () => {
    stepper.next();
  };


  interface ErrorMessage {
    type: string;    
  }
  
  const handleShowError = (message: string) => {
    
    setErrorMessage(message);
    setIsErrorVisible(true);
  };
  
  const handleCloseError = () => setIsErrorVisible(false);

  async function fetchIdentityVerification(data: { fullName: string; emiratesId: string }) {
    setLoading(true);
  
   await postIdentityVerification(data)
      .then((response) =>{ 
        if (response.identityVerified) {
          localStorage.setItem('requestId', response.id);
          handleNext();
        } 
        else {
          handleShowError('We encountered an issue with your verification. There may be a problem with the provided details. Please check and try again.');
        }
      })
      .catch(error => {
        const e = error as Error;
        if(e.message.includes('CC-0003')){
          handleShowError('the Emirates Id has been processed Already, Thank You!.');
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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: any) => { 
    setIsSubmitting(true);
    fetchIdentityVerification(data)
      .finally(() => setIsSubmitting(false));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
        <Progress value={0} />
        {Array.from({ length: 1 }).map((_, index) => (
          <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[250px]" />

            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
        <ErrorAlert
          isVisible={isErrorVisible}
          message={errorMessage}
          onClose={handleCloseError}
          duration={5000}
        />
        <Progress value={0} />
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <Input placeholder="e.g : Mast Ali Khushal" {...register('fullName')} />
          {errors.fullName && <FormMessage>{errors.fullName.message}</FormMessage>}
        </FormItem>
        <FormItem>
          <FormLabel>Emirates ID</FormLabel>
          <Input placeholder="e.g : 784-1234-1234567-1" {...register('emiratesId')} />
          {errors.emiratesId && <FormMessage>{errors.emiratesId.message}</FormMessage>}
        </FormItem>
        

      {!stepper.isLast ? (
        <div className="flex items-center gap-2">
          <Button onClick={stepper.prev} disabled={stepper.isFirst}>
            Previous
          </Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (
          <LoadingSpinner size={24} className="text-white" />
        ) : (
          'Verify'
        )}</Button> 
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button onClick={stepper.reset}>Reset</Button>
        </div>
      )}
      </form>
    </FormProvider>
  );
}


export default UserDetailsForm;