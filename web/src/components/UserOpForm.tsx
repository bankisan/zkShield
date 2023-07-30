import FormWrapper from "./FormWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItems } from "@/app/accounts/[accountAddress]/@legacy/page";

type StepProps = FormItems & {
  updateForm: (fieldToUpdate: Partial<FormItems>) => void;
  errors: Partial<FormItems>;
};

const UserOpForm = ({
  callData,
  callGasLimit,
  maxFeePerGas,
  maxPriorityFeePerGas,
  errors,
  updateForm,
}: StepProps) => {
  return (
    <FormWrapper
      title="User Op"
      description="Please provide your specified user operation."
    >
      <div className="bg-neutral-900 w-full flex flex-col gap-4 overflow-y-scroll h-[20rem] p-4 rounded-md border border-neutral-700">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="callData">callData</Label>
          <Input
            type="text"
            name="callData"
            id="callData"
            placeholder="0x"
            value={callData}
            className="w-full"
            onChange={(e) => updateForm({ callData: e.target.value as `0x${string}` })}
            required
          />
          {errors.callData && (
            <p className="text-red-500 text-sm">{errors.callData}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="callGasLimit">callGasLimit</Label>
          <Input
            autoFocus
            type="number"
            name="callGasLimit"
            id="callGasLimit"
            placeholder="100_000"
            value={callGasLimit.toString()}
            onChange={(e) => updateForm({ callGasLimit: BigInt(e.target.value) })}
            className="w-full"
            required
          />
          {typeof errors.callGasLimit !== "undefined" && <p className="text-red-500 text-sm">{errors.callGasLimit.toString()}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxFeePerGas">maxFeePerGas</Label>
          <Input
            autoFocus
            type="number"
            name="maxFeePerGas"
            id="maxFeePerGas"
            placeholder="21_000"
            value={maxFeePerGas.toString()}
            onChange={(e) => updateForm({ maxFeePerGas: BigInt(e.target.value) })}
            className="w-full"
            required
          />
          {typeof errors.maxFeePerGas !== "undefined" && <p className="text-red-500 text-sm">{errors.maxFeePerGas.toString()}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxPriorityFeePerGas">maxPriorityFeePerGas</Label>
          <Input
            type="number"
            name="maxPriorityFeePerGas"
            id="maxPriorityFeePerGas"
            placeholder="0"
            value={maxPriorityFeePerGas.toString()}
            onChange={(e) => updateForm({ maxPriorityFeePerGas: BigInt(e.target.value) })}
            className="w-full"
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
