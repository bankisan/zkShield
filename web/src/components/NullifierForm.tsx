import FormWrapper from "./FormWrapper";
import { FormItems } from "@/app/page";
import { nullifierMessage } from "common";

type StepProps = FormItems;

const NullifierForm = ({ nullifier }: StepProps) => {
  return (
    <FormWrapper
      title="Nullifier"
      description="Please sign the following in your wallet."
    >
      <div className="">
        <div className="bg-neutral-900 p-4 mt-2 rounded-md border border-neutral-700">
          <div className="flex justify-between items-center">
            <div className="">
              <h4 className="font-semibold text-white md:text-lg whitespace-pre-line">
                {nullifierMessage}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center my-4 px-4">
          <p className="text-neutral-400 break-all">
            {nullifier}
          </p>
        </div>
      </div>
    </FormWrapper>
  );
};

export default NullifierForm;
