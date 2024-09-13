
"use client"
import { defineStepper } from "@stepperize/react"; 
import BasicUserDetails from "@/components/BasicUserDetailsForm"
import AdvanceUserDetails from "@/components/AdvanceUserDetailsForm"


const { useStepper } = defineStepper(
  { id: "first" , title: "first"},
  { id: "second" , title: "second"}, 
  { id: "last" , title: "last"}
);
 
const MyFirstStepper = () => {
  const stepper = useStepper();
 
  return (
    <div className="flex flex-col gap-4 bg-gray-3 p-4 my-4 rounded-md">


      {stepper.when("first", () => <BasicUserDetails stepper={stepper} />)}
 
      {stepper.when("second", () => ( <AdvanceUserDetails stepper={stepper} />))} 
 
      {stepper.when("last", (step) => (
        <p>You have reached the {step.title} step.</p>
      ))}
 
     
    </div>
  );
};

export default MyFirstStepper;