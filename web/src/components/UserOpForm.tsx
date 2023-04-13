import FormWrapper from "./FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItems } from "@/app/page";

type StepProps = FormItems & {
  updateForm: (fieldToUpdate: Partial<FormItems>) => void;
  errors: Partial<FormItems>;
};

const UserOpForm = ({
  callGasLimit,
  signature,
  maxPriorityFeePerGas,
  errors,
  updateForm,
}: StepProps) => {
  return (
    <FormWrapper
      title="User Op"
      description="Please provide your specified user operation."
    >
      <div className="w-full flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">callGasLimit</Label>
          <Input
            autoFocus
            type="text"
            name="name"
            id="name"
            placeholder="e.g. Stephen King"
            value={callGasLimit.toString()}
            onChange={(e) => updateForm({ callGasLimit: BigInt(e.target.value) })}
            className="w-full"
            required
          />
          {typeof errors.callGasLimit !== "undefined" && <p className="text-red-500 text-sm">{errors.callGasLimit.toString()}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">signature</Label>
          <Input
            type="text"
            name="signature"
            id="signature"
            placeholder="e.g. stephenking@lorem.com"
            value={signature}
            className="w-full"
            onChange={(e) => updateForm({ signature: e.target.value as `0x${string}` })}
            required
          />
          {errors.signature && (
            <p className="text-red-500 text-sm">{errors.signature}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">maxPriorityFeePerGas</Label>
          <Input
            type="text"
            name="maxPriorityFeePerGas"
            id="maxPriorityFeePerGas"
            placeholder="0"
            value={maxPriorityFeePerGas.toString()}
            className="w-full"
            onChange={(e) => updateForm({ maxPriorityFeePerGas: BigInt(e.target.value) })}
            required
          />
          {typeof errors.maxPriorityFeePerGas !== "undefined" && (
            <p className="text-red-500 text-sm">{errors.maxPriorityFeePerGas.toString()}</p>
          )}
        </div>
      </div>
    </FormWrapper>
  );
};

export default UserOpForm;
