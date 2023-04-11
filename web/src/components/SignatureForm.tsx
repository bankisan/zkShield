import { useSignMessage } from "wagmi";
import FormWrapper from "./FormWrapper";
import { Button } from "./ui/button";
import { FormItems, initialValues } from "@/app/page";
import { message } from "@/app/page";

type StepProps = FormItems & {
  updateForm: (fieldToUpdate: Partial<FormItems>) => void;
  errors: Partial<FormItems>;
};

const SignatureForm = ({ signature, updateForm }: StepProps) => {

  return (
    <FormWrapper
      title="Signature"
      description="Please sign the following in your wallet."
    >
      <div className="">
        <div className="bg-neutral-900 p-4 mt-2 rounded-md border border-neutral-700">
          <div className="flex justify-between items-center">
            <div className="">
              <h4 className="font-semibold text-white md:text-lg">
                {message}
              </h4>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center my-4 px-4">
          <p className="text-neutral-400 break-all">
            {signature}
          </p>
        </div>
        {signature === initialValues.signature &&
          <Button size="lg" variant="destructive" className="mt-8">
          Sign
        </Button>}
      </div>
    </FormWrapper>
  );
};

export default SignatureForm;
