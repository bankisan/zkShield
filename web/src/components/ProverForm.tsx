import FormWrapper from "./FormWrapper";
import { Button } from "./ui/button";
import { FormItems, initialValues } from "@/app/page";
import { message } from "@/app/page";

type StepProps = FormItems;

const ProverForm = (props: StepProps) => {
  return (
    <FormWrapper
      title="Prover"
      description="Generate a proof of the transaction."
    >
      <div className="">
        <div className="bg-neutral-900 p-4 mt-2 rounded-md border border-neutral-700 mb-4">
          <div className="flex justify-between items-center">
            <div className="overflow-y-auto h-64">
              <h4 className="font-semibold text-neutral-400 md:text-lg break-all">
                {JSON.stringify(props, (key, value) => {
                  return typeof value === 'bigint' ? value.toString() : value;
                })}
              </h4>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-between items-center my-4 px-4">
          <p className="text-neutral-400 break-all">
            {signature}
          </p>
        </div> */}
      </div>
    </FormWrapper>
  );
};

export default ProverForm;
